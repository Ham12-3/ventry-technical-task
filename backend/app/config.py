import os
from pathlib import Path
from dotenv import load_dotenv

# Get the path to the .env file in the parent directory (backend folder)
env_path = Path(__file__).parent.parent / '.env'
print(f"Looking for .env at: {env_path.absolute()}")

# Load environment variables from specific path
load_dotenv(dotenv_path=env_path)

# API Settings
API_V1_STR = "/api"

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# OAuth - Google
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/api/auth/google/callback")

# Debug - print what was loaded
print(f"Loaded GOOGLE_CLIENT_ID: {GOOGLE_CLIENT_ID}")
print(f"Loaded GOOGLE_REDIRECT_URI: {GOOGLE_REDIRECT_URI}")

# OAuth - Apple
APPLE_CLIENT_ID = os.getenv("APPLE_CLIENT_ID")
APPLE_TEAM_ID = os.getenv("APPLE_TEAM_ID")
APPLE_KEY_ID = os.getenv("APPLE_KEY_ID")
APPLE_PRIVATE_KEY = os.getenv("APPLE_PRIVATE_KEY")
APPLE_REDIRECT_URI = os.getenv("APPLE_REDIRECT_URI", "http://localhost:3000/api/auth/apple/callback")

# Database - Update this to your PostgreSQL URL
# Example: postgresql://username:password@localhost/dbname
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:password@localhost:5432/ventry"
)

# CORS
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:3000,http://localhost:8080,https://literate-chainsaw-94rgv5v5jvx2xqwj-3000.app.github.dev"
).split(",") + ["https://*.app.github.dev"]  # Add wildcard for GitHub Codespaces

# Email
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM")
EMAIL_FROM_NAME = os.getenv("EMAIL_FROM_NAME", "Ventry App")