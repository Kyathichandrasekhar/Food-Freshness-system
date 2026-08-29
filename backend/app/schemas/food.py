"""
schemas/food.py

Pydantic schemas for Food API request/response validation.

Separate from the SQLAlchemy ORM model (models/food.py).
"""

from datetime import datetime
from pydantic import BaseModel


class FoodCreate(BaseModel):
    """Schema for creating a new Food item. Only name is required."""
    name: str


class FoodResponse(BaseModel):
    """Schema for returning a Food item in API responses."""
    id: int
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}
