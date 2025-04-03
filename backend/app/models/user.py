from sqlalchemy import Column, String, Boolean, DateTime, func, Text
from sqlalchemy.sql import expression
import uuid

from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String, nullable=True)
    provider = Column(String, default="email")  # email, google, apple
    provider_user_id = Column(String, nullable=True)
    is_active = Column(Boolean, server_default=expression.true())
    is_verified = Column(Boolean, server_default=expression.false())
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    exclusive_access = Column(Boolean, server_default=expression.false())
    exclusive_code = Column(String, nullable=True)