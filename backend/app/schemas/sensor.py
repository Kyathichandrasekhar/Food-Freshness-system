"""
schemas/sensor.py

Pydantic schemas for SensorReading API request/response validation.

food_id has been added to associate a reading with a specific Food record.
This is a backward-compatible extension — the existing validation behaviour
(422 on invalid types) is fully preserved.
"""

from datetime import datetime
from pydantic import BaseModel


class SensorReading(BaseModel):
    """
    Schema for receiving a sensor reading from the client.

    food_id links this reading to an existing Food record.
    All sensor values must be valid floats; invalid types return 422.
    """
    food_id: int
    gas: float
    ph: float
    temperature: float
    humidity: float
    timestamp: datetime


class SensorReadingResponse(BaseModel):
    """Schema for returning a stored sensor reading in API responses."""
    id: int
    food_id: int
    gas: float
    ph: float
    temperature: float
    humidity: float
    timestamp: datetime

    model_config = {"from_attributes": True}