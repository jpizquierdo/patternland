import uuid
from typing import Any

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.core.config import settings
from app.core.s3_storage import s3_client
from app.models import (
    Message,
    Pattern,
    PatternCreate,
    PatternPublic,
    PatternsPublic,
    PatternUpdate,
)

router = APIRouter(prefix="/patterns", tags=["patterns"])


# Helper function to upload a file to MinIO and return its ID
async def upload_to_minio(file: UploadFile | None) -> uuid.UUID | None:
    if file:
        file_content = await file.read()
        file_id = (
            str(uuid.uuid4()) + "." + file.filename.split(".")[-1]
        )  # Generate a unique ID for the file
        s3_client.put_object(Bucket=settings.S3_BUCKET, Key=file_id, Body=file_content)
        return file_id
    return None


# Helper function to delete old MinIO items
async def delete_minio_item(file_id: str):
    try:
        s3_client.delete_object(Bucket=settings.S3_BUCKET, Key=file_id)
    except s3_client.exceptions.NoSuchKey:
        print(f"File {file_id} not found in MinIO, skipping deletion.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting file: {e}")


@router.post("/upload/")
async def upload_files(
    *,
    session: SessionDep,
    current_user: CurrentUser,  # noqa: ARG001
    id: uuid.UUID = Form(...),
    pattern_a0_file: UploadFile | None = File(None),
    pattern_a0_sa_file: UploadFile | None = File(None),
    pattern_a0_sa_projector_file: UploadFile | None = File(None),
    pattern_a0_projector_file: UploadFile | None = File(None),
    pattern_a4_file: UploadFile | None = File(None),
    pattern_a4_sa_file: UploadFile | None = File(None),
    pattern_instructables_file: UploadFile | None = File(None),
    icon: UploadFile | None = File(None),
):
    """
    Upload files to a pattern.
    """
    pattern = session.get(Pattern, id)
    if not pattern:
        raise HTTPException(status_code=404, detail="Pattern not found")

    # Upload files to MinIO and store their IDs, excluding None values
    # Upload files to MinIO and store their IDs, excluding None values
    file_ids = {}
    new_files = {
        "pattern_a0_file_id": pattern_a0_file,
        "pattern_a0_sa_file_id": pattern_a0_sa_file,
        "pattern_a0_sa_projector_file_id": pattern_a0_sa_projector_file,
        "pattern_a0_projector_file_id": pattern_a0_projector_file,
        "pattern_a4_file_id": pattern_a4_file,
        "pattern_a4_sa_file_id": pattern_a4_sa_file,
        "pattern_instructables_file_id": pattern_instructables_file,
        "icon": icon,
    }

    for key, new_file in new_files.items():
        if new_file:
            # Check if the pattern already has a value for this key
            old_file_id = getattr(pattern, key, None)
            if old_file_id:
                # Call delete_minio_item with the old value
                await delete_minio_item(old_file_id)

            # Upload the new file and store its ID
            file_ids[key] = await upload_to_minio(new_file)
    pattern.sqlmodel_update(file_ids)
    session.add(pattern)
    session.commit()
    session.refresh(pattern)

    return pattern


@router.get("/download/{filename}")
async def download_file(
    current_user: CurrentUser,  # noqa: ARG001
    filename: str,
) -> StreamingResponse:
    """
    Download a file from MinIO.
    """
    try:
        s3_object = s3_client.get_object(Bucket=settings.S3_BUCKET, Key=filename)
    except s3_client.exceptions.NoSuchKey:
        raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    # The file is returned as a stream, no disk storage needed
    return StreamingResponse(
        s3_object["Body"],
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/", response_model=PatternsPublic)
async def read_patterns(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
    self_patterns: bool = False,
) -> Any:
    """
    Retrieve patterns.
    """

    if not self_patterns:
        count_statement = select(func.count()).select_from(Pattern)
        count = session.exec(count_statement).one()
        statement = select(Pattern).offset(skip).limit(limit)
        patterns = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Pattern)
            .where(Pattern.owner_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Pattern)
            .where(Pattern.owner_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        patterns = session.exec(statement).all()

    return PatternsPublic(data=patterns, count=count)


@router.get("/{id}", response_model=PatternPublic)
async def read_pattern(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Any:
    """
    Get pattern by ID.
    """
    pattern = session.get(Pattern, id)
    if not pattern:
        raise HTTPException(status_code=404, detail="Pattern not found")
    if not current_user.is_superuser and (pattern.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return pattern


@router.post("/", response_model=PatternPublic)
async def create_pattern(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    pattern_in: PatternCreate,
) -> Any:
    """
    Create new pattern.
    """
    pattern = Pattern.model_validate(
        pattern_in,
        update={"owner_id": current_user.id},
    )
    session.add(pattern)
    session.commit()
    session.refresh(pattern)
    return pattern


@router.put("/{id}", response_model=PatternPublic)
async def update_pattern(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    pattern_in: PatternUpdate,
) -> Any:
    """
    Update an pattern.
    """
    pattern = session.get(Pattern, id)
    if not pattern:
        raise HTTPException(status_code=404, detail="Pattern not found")
    if not current_user.is_superuser and (pattern.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    update_dict = pattern_in.model_dump(exclude_unset=True)
    pattern.sqlmodel_update(update_dict)
    session.add(pattern)
    session.commit()
    session.refresh(pattern)
    return pattern


@router.delete("/{id}")
async def delete_pattern(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete a pattern and its associated files in MinIO.
    """
    pattern = session.get(Pattern, id)
    if not pattern:
        raise HTTPException(status_code=404, detail="Pattern not found")
    if not current_user.is_superuser and (pattern.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # List of file IDs to delete from MinIO
    file_ids = [
        pattern.pattern_a0_file_id,
        pattern.pattern_a0_sa_file_id,
        pattern.pattern_a0_sa_projector_file_id,
        pattern.pattern_a0_projector_file_id,
        pattern.pattern_a4_file_id,
        pattern.pattern_a4_sa_file_id,
        pattern.pattern_instructables_file_id,
        pattern.icon,
    ]

    # Delete files from MinIO if they exist
    for file_id in file_ids:
        if file_id:
            try:
                print(f"Deleting file: {file_id}")
                s3_client.delete_object(Bucket=settings.S3_BUCKET, Key=str(file_id))
            except s3_client.exceptions.NoSuchKey:
                # File does not exist in MinIO, continue
                print(f"File {file_id} not found in MinIO, skipping deletion.")
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error deleting file: {e}")

    # Delete the pattern from the database
    session.delete(pattern)
    session.commit()
    return Message(message="Pattern deleted successfully")
