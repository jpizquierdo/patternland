import uuid

import boto3
from fastapi import HTTPException, UploadFile

from app.core.config import settings

s3_client = boto3.client("s3", **settings.S3_CONFIG)


def create_bucket():
    try:
        print(f"Checking S3 bucket {settings.S3_BUCKET} in {settings.S3_ENDPOINT}")
        s3_client.head_bucket(Bucket=settings.S3_BUCKET)
    except s3_client.exceptions.ClientError:
        print("S3 Bucket not found, creating...")
        s3_client.create_bucket(Bucket=settings.S3_BUCKET)


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
