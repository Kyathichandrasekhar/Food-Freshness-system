"""
routes/sensors.py

API routes for sensor readings.

Endpoints:
  POST /api/sensors/         — Validate and save a sensor reading to SQLite
  GET  /api/sensors/latest/  — Return the most recently stored sensor reading
  GET  /api/sensors/         — Return stored sensor readings (history)
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.sensor import SensorReading, SensorReadingResponse
from app.services import sensor_service

router = APIRouter()


@router.post("/", response_model=SensorReadingResponse, status_code=201)
def receive_sensor_data(reading: SensorReading, db: Session = Depends(get_db)):
    """
    Accept a validated sensor reading and store it in SQLite.

    - Pydantic validates all field types before this handler runs.
    - Invalid types automatically return 422 (no DB write occurs).
    - The food_id must reference an existing Food record.
    """
    saved = sensor_service.save_sensor_reading(db=db, reading=reading)
    return saved


@router.get("/latest/", response_model=SensorReadingResponse)
def get_latest_reading(db: Session = Depends(get_db)):
    """
    Return the most recently stored sensor reading.

    Returns 404 if no sensor readings have been stored yet.
    """
    reading = sensor_service.get_latest_sensor_reading(db=db)
    if reading is None:
        raise HTTPException(status_code=404, detail="No sensor readings found.")
    return reading


@router.get("/", response_model=list[SensorReadingResponse])
def get_sensor_history(
    food_id: Optional[int] = Query(
        default=None,
        ge=1,
        description="Filter results to readings belonging to this food ID.",
    ),
    limit: int = Query(
        default=50,
        ge=1,
        le=100,
        description="Maximum number of readings to return (1–100, default 50).",
    ),
    db: Session = Depends(get_db),
):
    """
    Retrieve stored sensor readings from SQLite (read-only).

    - Returns readings ordered newest-first by timestamp.
    - Optionally filter by food_id.
    - Limit defaults to 50, maximum is 100.
    - Returns an empty list [] when no matching readings exist.
    """
    readings = sensor_service.get_sensor_history(db=db, food_id=food_id, limit=limit)
    return readings

