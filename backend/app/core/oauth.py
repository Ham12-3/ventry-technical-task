import httpx
from typing import Dict, Any
import uuid
import jwt
from datetime import datetime, timedelta

from app.config import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    APPLE_CLIENT_ID,
    APPLE_TEAM_ID,
    APPLE_KEY_ID,
    APPLE_PRIVATE_KEY,
    APPLE_REDIRECT_URI
)

async def get_google_auth_url() -> str:
    """
    Generate Google OAuth URL
    """
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "email profile",
        "access_type": "offline",
    }
    
    url = "https://accounts.google.com/o/oauth2/v2/auth"
    oauth_url = f"{url}?{'&'.join(f'{k}={v}' for k, v in params.items())}"
    
    return oauth_url

async def exchange_google_code(code: str) -> Dict[str, Any]:
    """
    Exchange Google auth code for tokens and user info
    """
    # Exchange code for token
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": GOOGLE_REDIRECT_URI
    }
    
    async with httpx.AsyncClient() as client:
        # Get tokens
        token_response = await client.post(token_url, data=data)
        token_data = token_response.json()
        
        if token_response.status_code != 200:
            raise ValueError(f"Failed to exchange Google code: {token_data.get('error_description', 'Unknown error')}")
        
        # Get user info with the access token
        access_token = token_data.get("access_token")
        headers = {"Authorization": f"Bearer {access_token}"}
        user_info_response = await client.get("https://www.googleapis.com/oauth2/v1/userinfo", headers=headers)
        user_info = user_info_response.json()
        
        if user_info_response.status_code != 200:
            raise ValueError("Failed to get user info from Google")
        
        return {
            "provider": "google",
            "provider_user_id": user_info.get("id"),
            "email": user_info.get("email"),
            "name": user_info.get("name") or user_info.get("email").split('@')[0],
            "is_verified": True
        }

async def get_apple_auth_url() -> str:
    """
    Generate Apple OAuth URL
    """
    params = {
        "client_id": APPLE_CLIENT_ID,
        "redirect_uri": APPLE_REDIRECT_URI,
        "response_type": "code id_token",
        "scope": "name email",
        "response_mode": "form_post",
    }
    
    url = "https://appleid.apple.com/auth/authorize"
    oauth_url = f"{url}?{'&'.join(f'{k}={v}' for k, v in params.items())}"
    
    return oauth_url

async def parse_apple_id_token(id_token: str) -> Dict[str, Any]:
    """
    Parse Apple ID token to get user info
    """
    # In production, verify the signature
    # For this example, we'll just decode without verification
    try:
        payload = jwt.decode(id_token, options={"verify_signature": False})
        
        # Extract user info
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if not user_id or not email:
            raise ValueError("Could not extract user info from Apple token")
        
        # Use email as name if no name provided
        name = email.split('@')[0]
        
        return {
            "provider": "apple",
            "provider_user_id": user_id,
            "email": email,
            "name": name,
            "is_verified": True
        }
    except Exception as e:
        raise ValueError(f"Error processing Apple ID token: {str(e)}")