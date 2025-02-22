from sqlmodel import create_engine, Session, select
from alembic import command
from alembic.config import Config

from app import crud
from app.core.config import settings
from app.models import User, UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


def create_db_and_tables(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables toggling the comments in the next lines
    # SQLModel.metadata.create_all(engine)
    alembic_cfg = Config("./alembic.ini")
    command.upgrade(alembic_cfg, "head")

    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = crud.create_user(session=session, user_create=user_in)
