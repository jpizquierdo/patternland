import uuid
from typing import Literal

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel, String


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = False
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    patterns: list["Pattern"] = Relationship(
        back_populates="owner", cascade_delete=True
    )


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Patterns
# Shared properties
class PatternBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    brand: Literal["Fibre Mood", "Other", "Seamwork"] = Field(
        sa_type=String, max_length=255
    )
    version: Literal["Paper", "Digital"] = Field(sa_type=String, max_length=255)
    pattern_url: str | None = Field(default=None, max_length=255)
    for_who: Literal["Baby", "Kids", "Men", "Women", "Pets"] = Field(
        max_length=255,
        sa_type=String,
    )
    category: (
        Literal[
            "Accessories",
            "Bags",
            "Blazers",
            "Bodywarmer",
            "Cardigans",
            "Coats",
            "DIY",
            "Dresses",
            "Hoodie",
            "Jackets",
            "Jumpers",
            "Jumpsuits",
            "Overalls",
            "Overshirt",
            "Pullovers",
            "Shirts",
            "Shorts",
            "Skirts",
            "Sweaters",
            "Swimwear",
            "T-shirts",
            "Tops",
            "Trousers",
        ]
        | None
    ) = Field(default=None, sa_type=String, max_length=255)
    difficulty: int = Field(ge=1, le=5)
    fabric: str | None = Field(default=None, max_length=255)
    fabric_amount: float | None = Field(default=None)


# Properties to receive on item creation
class PatternCreate(PatternBase):
    pass


# Properties to receive on item update
class PatternUpdate(PatternBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore
    description: str | None = Field(default=None, max_length=255)
    brand: Literal["Fibre Mood", "Other", "Seamwork"] | None = Field(
        default=None, max_length=255
    )
    version: Literal["Paper", "Digital"] | None = Field(default=None, max_length=255)
    pattern_url: str | None = Field(default=None, max_length=255)
    for_who: Literal["Baby", "Kids", "Men", "Women", "Pets"] | None = Field(
        default=None, max_length=255
    )
    category: (
        Literal[
            "Accessories",
            "Bags",
            "Blazers",
            "Bodywarmer",
            "Cardigans",
            "Coats",
            "DIY",
            "Dresses",
            "Hoodie",
            "Jackets",
            "Jumpers",
            "Jumpsuits",
            "Overalls",
            "Overshirt",
            "Pullovers",
            "Shirts",
            "Shorts",
            "Skirts",
            "Sweaters",
            "Swimwear",
            "T-shirts",
            "Tops",
            "Trousers",
        ]
        | None
    ) = Field(default=None, sa_type=String, max_length=255)
    difficulty: int | None = Field(default=None, ge=1, le=5)
    fabric: str | None = Field(default=None, max_length=255)
    fabric_amount: float | None = Field(default=None)


# Database model, database table inferred from class name
class Pattern(PatternBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="patterns")
    pattern_a0_file_id: str | None = Field(default=None)
    pattern_a0_sa_file_id: str | None = Field(default=None)
    pattern_a0_sa_projector_file_id: str | None = Field(default=None)
    pattern_a0_projector_file_id: str | None = Field(default=None)
    pattern_a4_file_id: str | None = Field(default=None)
    pattern_a4_sa_file_id: str | None = Field(default=None)
    pattern_instructables_file_id: str | None = Field(default=None)


# Properties to return via API, id is always required
class PatternPublic(PatternBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    pattern_a0_file_id: str | None
    pattern_a0_sa_file_id: str | None
    pattern_a0_sa_projector_file_id: str | None
    pattern_a0_projector_file_id: str | None
    pattern_a4_file_id: str | None
    pattern_a4_sa_file_id: str | None
    pattern_instructables_file_id: str | None


class PatternsPublic(SQLModel):
    data: list[PatternPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)
