from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from app.core.config import settings

pwd_context = PasswordHasher()


ALGORITHM = "HS256"


def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    """This method creates the access token that will be used to authenticate the user. The token will expire after the time specified in the expires_delta parameter."""
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """This method verifies the hashed password stored in the database. This way if someone with malicious intentions access the database, they won't be able to see the actual password."""
    try:
        return pwd_context.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False


def get_password_hash(password: str) -> str:
    """This method hashes the password before storing it in the database."""
    return pwd_context.hash(password)
