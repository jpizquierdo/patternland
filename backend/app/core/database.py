from sqlmodel import create_engine, Session, select
from alembic import command
from alembic.config import Config

from app import crud
from app.core.config import settings
from app.models import User, UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
# if settings.ENVIRONMENT == "local":  # pragma: no cover
#     connect_args = {
#         "check_same_thread": False
#     }  # ensuring you don't share the same session with more than one request, the code is already safe. because in FastAPI each request could be handled by multiple interacting threads.
#     engine = create_engine(
#         "sqlite:///database.db", echo=False, connect_args=connect_args
#     )
# elif settings.ENVIRONMENT == "staging":  # pragma: no cover
#     engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
# elif settings.ENVIRONMENT == "production":  # pragma: no cover
#     engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


def create_db_and_tables(session: Session):  # pragma: no cover
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


def get_session():  # pragma: no cover
    # https://sqlmodel.tiangolo.com/tutorial/fastapi/session-with-dependency/
    with Session(engine) as session:
        yield session
