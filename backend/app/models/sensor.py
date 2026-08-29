"""
models/sensor.py

SQLAlchemy ORM model for the 'sensor_readings' table.

A SensorReading represents one set of measurements from the IoT sensors
(MQ135 gas sensor, pH sensor, DHT11 temperature/humidity sensor).

Each reading belongs to exactly one Food via the food_id foreign key.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database.connection import Base


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)

    # Foreign key linking this reading to a specific food item
    food_id = Column(Integer, ForeignKey("foods.id"), nullable=False, index=True)

    # Sensor measurement values
    gas = Column(Float, nullable=False)
    ph = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)

    # Timestamp of the reading (supplied by the client / sensor)
    timestamp = Column(DateTime, nullable=False)

    # Many-to-one: each reading belongs to one food
    food = relationship("Food", back_populates="sensor_readings")
