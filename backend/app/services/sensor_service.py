"""
services/sensor_service.py

Database operations for SensorReading.

Keeps all DB query logic out of the route layer so routes stay thin.
"""

from typing import Optional
from sqlalchemy.orm import Session
from app.models.sensor import SensorReading
from app.schemas.sensor import SensorReading as SensorReadingSchema


def save_sensor_reading(db: Session, reading: SensorReadingSchema) -> SensorReading:
    """
    Persist a validated sensor reading to the database.

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
        timestamp=reading.timestamp,
    )
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
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
