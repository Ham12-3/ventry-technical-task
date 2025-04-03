from fastapi import APIRouter, Depends, HTTPException, status, Request, Form
from sqlalchemy.orm import Session
from typing import Any, Dict
from jose import jwt, JWTError
from datetime import datetime

from app.api.deps import get_current_user
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.oauth import (
    get_google_auth_url, 
    exchange_google_code, 
    get_apple_auth_url,
    parse_apple_id_token
)
from app.services.email import generate_exclusive_code, send_exclusive_code
from app.models.user import User
from app.schemas.auth import (
    UserCreate, 
    UserLogin, 
    Token, 
    ExclusiveCodeRequest, 
    ExclusiveCodeResponse,
    UserResponse
)
from app.database import get_db

router = APIRouter()

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user_create: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_create.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_create.password)
    
    # Create user object but don't save confirmPassword
    new_user = User(
        email=user_create.email,
        name=user_create.name,
        hashed_password=hashed_password,
        is_active=True,
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": new_user.id})
    
    # Return token with user data
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=Token)
async def login(form_data: UserLogin, db: Session = Depends(get_db)) -> Any:
    """
    Login for existing users
    """
    # Find user by email
    user = db.query(User).filter(User.email == form_data.email).first()
    
    # Check if user exists and password is correct
    if not user or not verify_password(form_data.password, user.hashed_password or ""):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check exclusive code if provided
    if form_data.exclusive_code and user.exclusive_code == form_data.exclusive_code:
        user.exclusive_access = True
        db.commit()
    
    # Generate access token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/request-code", response_model=ExclusiveCodeResponse)
async def request_exclusive_code(request: ExclusiveCodeRequest, db: Session = Depends(get_db)) -> Any:
    """
    Request an exclusive access code
    """
    # Find user by email
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Generate and store a new exclusive code
    exclusive_code = generate_exclusive_code()
    user.exclusive_code = exclusive_code
    db.commit()
    
    # Send the code via email
    email_sent = await send_exclusive_code(user.email, exclusive_code)
    
    return {
        "message": f"Exclusive code {'sent' if email_sent else 'generated'} for {request.email}",
        "code_sent": email_sent
    }

@router.get("/google")
async def google_login() -> Any:
    """
    Get Google OAuth URL
    """
    oauth_url = await get_google_auth_url()
    return {"authorization_url": oauth_url}

@router.get("/google/callback")
async def google_callback(
    code: str,
    db: Session = Depends(get_db)
):
    """
    Handle Google OAuth callback
    """
    try:
        # Exchange code for user info
        user_data = await exchange_google_code(code)
        
        # Check if user exists in database
        user = db.query(User).filter(User.email == user_data["email"]).first()
        
        if user:
            # Update existing user
            user.provider = user_data["provider"]
            user.provider_user_id = user_data["provider_user_id"]
            user.is_verified = True
            db.commit()
        else:
            # Create new user
            new_user = User(
                email=user_data["email"],
                name=user_data["name"],
                provider=user_data["provider"],
                provider_user_id=user_data["provider_user_id"],
                is_verified=True,
                is_active=True,
                hashed_password=""  # No password for OAuth users
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            user = new_user
        
        # Create access token with user.id instead of user.email
        access_token = create_access_token(data={"sub": user.id})
        
        # For testing: Return the token directly
        return {"access_token": access_token, "token_type": "bearer", "user": user}
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to process Google callback: {str(e)}"
        )

@router.post("/apple/callback")
async def apple_callback(request: Request, db: Session = Depends(get_db)) -> Any:
    """
    Handle Apple OAuth callback
    """
    try:
        form_data = await request.form()
        code = form_data.get("code")
        id_token = form_data.get("id_token")
        
        if not id_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing ID token from Apple"
            )
        
        # Parse the ID token to get user info
        user_info = await parse_apple_id_token(id_token)
        
        # Check if user exists
        user = db.query(User).filter(User.email == user_info["email"]).first()
        
        if not user:
            # Create new user
            user = User(
                email=user_info["email"],
                name=user_info["name"],
                provider=user_info["provider"],
                provider_user_id=user_info["provider_user_id"],
                is_verified=user_info["is_verified"]
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update existing user with Apple info
            user.provider = "apple"
            user.provider_user_id = user_info["provider_user_id"]
            user.is_verified = True
            db.commit()
        
        # Generate access token
        access_token = create_access_token(data={"sub": user.id})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not validate Apple credentials: {str(e)}"
        )

@router.get("/apple")
async def apple_login() -> Any:
    """
    Get Apple OAuth URL
    """
    oauth_url = await get_apple_auth_url()
    return {"authorization_url": oauth_url}

def verify_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        
        # If token contains expiration claim, check it
        if "exp" in payload and datetime.utcnow() >= datetime.fromtimestamp(payload["exp"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )