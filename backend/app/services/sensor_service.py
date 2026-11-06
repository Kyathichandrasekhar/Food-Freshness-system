"""
services/sensor_service.py

Database operations for SensorReading.

Keeps all DB query logic out of the route layer so routes stay thin.
"""

import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.models.sensor import SensorReading
from app.schemas.sensor import SensorReading as SensorReadingSchema
from app.database.firebase_client import get_firebase_ref
from datetime import datetime

logger = logging.getLogger("freshguard.sensor_service")


def save_sensor_reading(db: Session, reading: SensorReadingSchema) -> SensorReading:
    """
    Persist a validated sensor reading to SQLite and sync to Firebase Realtime Database.

    Args:
        db:      Active SQLAlchemy session (injected via Depends).
        reading: Validated Pydantic SensorReading from the route.

    Returns:
        The newly created SensorReading ORM instance with its generated id.
    """
    db_reading = SensorReading(
        food_id=reading.food_id,
        gas=reading.gas,
        ph=reading.ph,
        temperature=reading.temperature,
        humidity=reading.humidity,
        timestamp=reading.timestamp or datetime.utcnow(),
    )
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)

    # Dual-write to Firebase Realtime Database
    try:
        ts_val = (
            db_reading.timestamp.isoformat()
            if hasattr(db_reading.timestamp, "isoformat")
            else str(db_reading.timestamp)
        )
        
        reading_payload = {
            "id": db_reading.id,
            "food_id": db_reading.food_id,
            "temperature": float(db_reading.temperature),
            "humidity": float(db_reading.humidity),
            "timestamp": ts_val,
        }

        if db_reading.gas is not None:
            reading_payload["gas"] = float(db_reading.gas)

        if db_reading.ph is not None:
            reading_payload["ph"] = float(db_reading.ph)


        # 1. Append to sensor_readings collection
        readings_ref = get_firebase_ref("sensor_readings")
        if readings_ref is not None:
            readings_ref.push(reading_payload)

        # 2. Update latest_sensor_reading for instant real-time frontend listener
        latest_ref = get_firebase_ref("latest_sensor_reading")
        if latest_ref is not None:
            latest_ref.set(reading_payload)

        # 3. Update food-specific latest reading
        food_latest_ref = get_firebase_ref(f"foods/{db_reading.food_id}/latest_reading")
        if food_latest_ref is not None:
            food_latest_ref.set(reading_payload)

        logger.info("Synced sensor reading id=%s to Firebase RTDB", db_reading.id)
    except Exception as e:
        logger.error("Failed to sync sensor reading to Firebase RTDB: %s", e)

    return db_reading


def get_latest_sensor_reading(db: Session) -> SensorReading | None:
    """
    Return the most recently stored sensor reading, ordered by database id.

    Returns None if no readings have been stored yet.
    """
    return (
        db.query(SensorReading)
        .order_by(SensorReading.id.desc())
        .first()
    )


def get_sensor_history(
    db: Session,
    food_id: Optional[int] = None,
    limit: int = 50,
) -> list[SensorReading]:
    """
    Retrieve stored sensor readings from SQLite — read-only, no DB writes.

    Args:
        db:      Active SQLAlchemy session (injected via Depends).
        food_id: Optional filter; when provided, only readings for that food
                 are returned.
        limit:   Maximum number of records to return (1–100, default 50).

    Returns:
        A list of SensorReading ORM objects ordered newest-first by timestamp.
        Returns an empty list when no matching readings exist.
    """
    query = db.query(SensorReading)

    if food_id is not None:
        query = query.filter(SensorReading.food_id == food_id)

    return (
        query
        .order_by(SensorReading.timestamp.desc())
        .limit(limit)
        .all()
    )
