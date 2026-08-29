"""
models/food.py

SQLAlchemy ORM model for the 'foods' table.

A Food represents a physical food item or sample being monitored.
One Food can be associated with many SensorReadings and Predictions.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

from app.database.connection import Base


class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # One-to-many: a food has many sensor readings
    sensor_readings = relationship("SensorReading", back_populates="food")

    # One-to-many: a food has many predictions (future ML stage)
    predictions = relationship("Prediction", back_populates="food")
