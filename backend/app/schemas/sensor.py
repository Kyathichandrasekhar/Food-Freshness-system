
from datetime import datetime
from pydantic import BaseModel


class SensorReading(BaseModel):
    food_id: int
    gas: float | None = None
    ph: float | None = None
    temperature: float
    humidity: float
    timestamp: datetime | None = None


class SensorReadingResponse(BaseModel):
    id: int
    food_id: int
    gas: float | None = None
    ph: float | None = None
    temperature: float
    humidity: float
    timestamp: datetime | None = None

    model_config = {"from_attributes": True}
