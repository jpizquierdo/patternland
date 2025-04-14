from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlmodel import Session

from app.core.database import create_db_and_tables, engine
from app.core.s3_storage import create_bucket


@asynccontextmanager
async def lifespan(app: FastAPI):  # pragma: no cover # noqa: ARG001
    # Startup events
    with Session(engine) as session:
        create_db_and_tables(session)
    create_bucket()
    yield
    # Shutdown events
