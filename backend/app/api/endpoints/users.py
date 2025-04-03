from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any

from app.models.user import User
from app.schemas.auth import UserResponse
from app.api.deps import get_current_user
from app.database import get_db

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_current_user(current_user: User = Depends(get_current_user)) -> Any:
    """
    Get current user information
    """
    return current_user

@router.get("/{user_id}", response_model=UserResponse)
async def read_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get a specific user by id
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/me/update-exclusive", response_model=UserResponse)
async def update_exclusive_status(
    exclusive_code: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Update user's exclusive access status using a code
    """
    if not exclusive_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Exclusive code is required"
        )
    
    if current_user.exclusive_code != exclusive_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid exclusive code"
        )
    
    current_user.exclusive_access = True
    db.commit()
    db.refresh(current_user)
    
    return current_user