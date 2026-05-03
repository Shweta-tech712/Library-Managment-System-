import os
from datetime import timedelta

class Config:
    # Basic Security
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-12345")
    
    # Database
    # Using SQLite for ease of setup, can be swapped for PostgreSQL via env var
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///library_prod.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-prod-secret-98765")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Business Rules
    DAILY_FINE_RATE = 10  # ₹10 per day late
    MAX_ISSUED_BOOKS = 5
