from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime

# Request schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str

    @validator("confirm_password")
    def passwords_match(cls, v, values, **kwargs):
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords don't match")
        return v
    
    @validator("password")
    def password_strength(cls, v):
        if not any(char.isupper() for char in v):
            raise ValueError("Password must contain at least one uppercase character")
        if not any(char.islower() for char in v):
            raise ValueError("Password must contain at least one lowercase character")
        if not any(char.isdigit() for char in v):
            raise ValueError("Password must contain at least one number")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    exclusive_code: Optional[str] = None

class ExclusiveCodeRequest(BaseModel):
    email: EmailStr

# Response schemas
class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    provider: str
    exclusive_access: bool
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ExclusiveCodeResponse(BaseModel):
    message: str
    code_sent: bool