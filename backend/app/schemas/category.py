from pydantic import BaseModel
from typing import Optional


class CategoryBase(BaseModel):
    category_name: str


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    category_id: int

    class Config:
        from_attributes = True


class FavoriteCategoryCreate(BaseModel):
    category_id: int


class FavoriteCategoryResponse(BaseModel):
    category_id: int
    user_id: int

    class Config:
        from_attributes = True

