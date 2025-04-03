from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import re

# Make sure these modules exist and have the expected content
from app.api.endpoints import auth, users
from app.database import Base, engine
from app.config import ALLOWED_ORIGINS, API_V1_STR

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Ventry Auth API",
    description="API for authentication and user management",
    version="1.0.0"
)

# Log the CORS origins for debugging
logger.info(f"Configuring CORS with allowed origins: {ALLOWED_ORIGINS}")

# CORS configuration
class GitHubCodespacesCORSMiddleware(CORSMiddleware):
    async def process_request(self, request, call_next):
        origin = request.headers.get("origin", "")
        
        # Log the origin for debugging
        logger.info(f"Received request from origin: {origin}")
        
        # If it's a GitHub Codespaces URL, add it to allowed origins temporarily
        if "app.github.dev" in origin and origin not in self.app.state.allowed_origins:
            logger.info(f"Adding GitHub Codespaces origin to allowed: {origin}")
            self.app.state.allowed_origins.append(origin)
            self.allow_origins = self.app.state.allowed_origins
        
        return await super().process_request(request, call_next)

# Store allowed origins in app state so we can modify it dynamically
app.state.allowed_origins = ALLOWED_ORIGINS

# Use custom CORS middleware
app.add_middleware(
    GitHubCodespacesCORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    expose_headers=["Content-Length"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Include routers
app.include_router(auth.router, prefix=f"{API_V1_STR}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{API_V1_STR}/users", tags=["users"])

# Enhanced health check endpoint to aid debugging
@app.get("/", tags=["health"])
async def health_check(request: Request):
    """
    Health check endpoint with request details for debugging
    """
    logger.info(f"Health check called from {request.client.host}")
    logger.info(f"Request headers: {dict(request.headers)}")
    
    # Return useful information
    return {
        "status": "ok",
        "message": "API is running",
        "cors_settings": {
            "allowed_origins": ALLOWED_ORIGINS,
        }
    }