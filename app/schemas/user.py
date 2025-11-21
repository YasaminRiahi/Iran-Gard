from pydantic import BaseModel, EmailStr, Field
    user_id: Optional[int] = None
class TokenData(BaseModel):


    token_type: str = "bearer"
    access_token: str
class Token(BaseModel):
# Token


        from_attributes = True
    class Config:

    favorite_categories: list[int] = []
class UserWithCategories(UserResponse):
# User with Categories


        from_attributes = True
    class Config:

    email: str
    username: str
    user_id: int
class UserResponse(BaseModel):
# User Response


    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
class UserUpdate(BaseModel):
# User Update


    password: str
    email: EmailStr
class UserLogin(BaseModel):
# User Login


    password: str = Field(..., min_length=6, max_length=100)
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
class UserCreate(BaseModel):
# User Registration


from typing import Optional

