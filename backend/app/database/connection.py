"""
database/connection.py

Responsible for:
- SQLite database URL construction
- SQLAlchemy engine creation
- Session factory (SessionLocal)
- Declarative Base for all ORM models
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ---------------------------------------------------------------------------
# Database file location: backend/data/freshguard.db
# The data/ directory is created automatically if it does not exist.
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

DATABASE_URL = f"sqlite:///{os.path.join(DATA_DIR, 'freshguard.db')}"

# ---------------------------------------------------------------------------
# SQLAlchemy engine
# connect_args={"check_same_thread": False} is required for SQLite when used
# with FastAPI because multiple threads may use the same connection.
# ---------------------------------------------------------------------------
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# ---------------------------------------------------------------------------
# Session factory — each request gets its own session via dependency injection
# ---------------------------------------------------------------------------
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ---------------------------------------------------------------------------
# Declarative base — all ORM models inherit from this
# ---------------------------------------------------------------------------
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that provides a SQLAlchemy database session.
    Ensures the session is always closed after the request completes.

    Usage in a route:
        db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
