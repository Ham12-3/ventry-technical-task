


# Ventry Authentication System

A modern authentication system with Google OAuth integration, built using Next.js for the frontend and FastAPI for the backend.

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Running the Backend](#running-the-backend)
  - [Running the Frontend](#running-the-frontend)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Authentication Flow](#authentication-flow)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Project Overview

Ventry is a complete authentication solution featuring:
- Email/password registration and login
- Google OAuth integration
- Exclusive access code system
- JWT-based token authentication
- Secure user management
- Modern UI with responsive design

## Architecture

The project uses a modern client-server architecture:

### Frontend
- Next.js 14 with App Router
- React with TypeScript
- JWT-based authentication
- Shadcn UI components
- TailwindCSS for styling
- Form handling with React Hook Form and Zod validation

### Backend
- FastAPI Python framework
- SQLAlchemy ORM with SQLite database
- JWT token authentication with jose
- Alembic for database migrations
- OAuth integrations with Google (and Apple placeholders)
- Email service integration

### Authentication Flow
1. User registers or signs in (via credentials or OAuth)
2. Backend validates credentials and issues a JWT token
3. Frontend stores the token in cookies and localStorage
4. Token is used to authenticate subsequent API requests
5. Optional exclusive codes can be requested and used

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Git

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ventry-technical-task.git
cd ventry-technical-task
```

2. Set up backend environment variables:
```bash
cd backend
cp .env.example .env
```

Edit `.env` and configure:
```
DATABASE_URL=sqlite:///./users.db
SECRET_KEY=your-secret-key-here  # Generate a secure string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

3. Set up frontend environment variables:
```bash
cd ../frontend
cp .env.example .env.local
```

Edit `.env.local` and configure:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Running the Backend

1. Create and activate a Python virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run database migrations:
```bash
alembic upgrade head
```

4. Start the FastAPI server:
```bash
uvicorn main:app --reload
```

The backend API will be running at http://localhost:8000. The API documentation is available at http://localhost:8000/docs

### Running the Frontend

1. Install dependencies:
```bash
cd ../frontend
npm install
```

2. Start the Next.js development server:
```bash
npm run dev
```

The frontend will be running at http://localhost:3000

## Features

- **User Authentication**: Email/password login, registration with validation
- **OAuth Integration**: Sign in with Google
- **Exclusive Access**: Request and use exclusive access codes
- **Responsive Design**: Mobile-friendly UI
- **Toast Notifications**: User-friendly feedback system
- **Form Validation**: Client and server-side validation
- **Protected Routes**: Authentication-based access control
- **Custom Middleware**: Token validation for protected routes

## API Documentation

The backend provides the following main endpoints:

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/request-code` - Request an exclusive access code
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Handle Google OAuth callback

### User Management
- `GET /api/users/me` - Get current user information
- `PUT /api/users/me` - Update current user information

For full API documentation, visit the Swagger UI at http://localhost:8000/docs when the backend is running.

## Authentication Flow

### Standard Authentication
1. User submits login credentials
2. Backend validates credentials and returns a JWT token
3. Frontend stores the token in cookies for authentication
4. Protected routes check token validity via middleware

### OAuth Authentication
1. User clicks "Sign in with Google"
2. Frontend redirects to `/api/auth/google`
3. Backend redirects to Google's authentication page
4. User authenticates with Google
5. Google redirects back to the callback URL
6. Backend processes the OAuth code, creates/updates user, and issues a JWT token
7. Frontend redirects to dashboard with the token

## Project Structure

### Backend Structure
```
backend/
├── alembic/             # Database migration scripts
├── app/                 # Main application code
│   ├── api/             # API endpoints
│   │   ├── deps.py      # Dependencies (auth, DB)
│   │   ├── endpoints/   # API route handlers
│   │       ├── auth.py  # Authentication endpoints
│   │       └── users.py # User management endpoints
│   ├── core/            # Core functionality
│   │   ├── config.py    # App configuration
│   │   ├── oauth.py     # OAuth integrations
│   │   └── security.py  # Password hashing, token handling
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas/DTOs
│   └── services/        # Business logic services
├── main.py              # FastAPI application entry
└── requirements.txt     # Python dependencies
```

### Frontend Structure
```
frontend/
├── app/                 # Next.js App Router
│   ├── auth/            # Auth-related pages
│   │   └── google/      # Google OAuth callback handling
│   ├── dashboard/       # Dashboard (protected)
│   ├── sign-in/         # Sign-in page
│   ├── sign-up/         # Sign-up page
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── ui/              # UI components (shadcn)
│   └── auth/            # Auth-specific components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
│   └── auth.ts          # Auth utility functions
├── middleware.ts        # Next.js middleware for auth
├── public/              # Static assets
└── package.json         # Node dependencies
```

## Deployment

### Backend Deployment
The FastAPI backend can be deployed to platforms like:
- Heroku
- AWS Elastic Beanstalk
- DigitalOcean App Platform
- Render

Example deployment command for production:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend Deployment
The Next.js frontend can be easily deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify

For deployment to Vercel:
1. Push the repository to GitHub
2. Connect to Vercel
3. Configure environment variables
4. Deploy

## Troubleshooting

### Common Issues

**OAuth callback error:**
- Ensure OAuth callback URLs are correctly configured in Google Developer Console
- Check that environment variables are correctly set

**Authentication token issues:**
- Clear browser cookies and localStorage
- Verify that backend SECRET_KEY is properly configured

**CORS errors:**
- Ensure FRONTEND_URL environment variable is correctly set
- Check that CORS middleware is enabled in FastAPI

**Database migration errors:**
- Run `alembic revision --autogenerate` to create a new migration
- Then `alembic upgrade head`






## Video Demo

Check out our authentication system in action:

<div align="center">
  <a href="https://www.youtube.com/watch?v=aVdDYuHxjN8">
    <img src="https://img.youtube.com/vi/aVdDYuHxjN8/maxresdefault.jpg" alt="Ventry Authentication System Demo" style="width:80%;">
  </a>
</div>



*Click the image above to watch the demo video on YouTube*

The video demonstrates:
- Complete user registration flow
- Email and password authentication
- Google OAuth integration
- Exclusive access code functionality
- Protected route navigation
- Responsive UI design
