"""
models/prediction.py

SQLAlchemy ORM model for the 'predictions' table.

IMPORTANT — PLACEHOLDER ONLY:
This table is created now so the database schema is ready for the future
ML integration stage. No prediction values are generated here.

The ML model, freshness thresholds, and shelf-life logic will be implemented
later inside backend/app/ml/. This file must NOT be modified until that stage.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database.connection import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    # Foreign key linking this prediction to a specific food item
    food_id = Column(Integer, ForeignKey("foods.id"), nullable=False, index=True)

    # ML output fields (populated in a future stage — nullable for now)
    freshness_status = Column(String, nullable=True)    # e.g. "Fresh", "Borderline", "Spoiled"
    freshness_score = Column(Float, nullable=True)      # e.g. 0.0 – 1.0
    remaining_shelf_life = Column(Float, nullable=True) # estimated hours or days remaining

    # Timestamp of when the prediction was generated
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Many-to-one: each prediction belongs to one food
    food = relationship("Food", back_populates="predictions")
