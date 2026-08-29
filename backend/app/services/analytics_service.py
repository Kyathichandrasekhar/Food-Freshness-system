"""
services/analytics_service.py

Read-only database operations for the Analytics API.

Uses SQLAlchemy's built-in func.avg / func.min / func.max aggregates so that
all arithmetic happens inside SQLite — no Python-side loops needed.

The service never writes to the database.
"""

from typing import Optional
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.sensor import SensorReading
from app.schemas.analytics import AnalyticsMetric, AnalyticsResponse


def get_analytics(
    db: Session,
    food_id: Optional[int] = None,
) -> AnalyticsResponse:
    """
    Calculate statistical summaries from stored sensor readings.

    Args:
        db:      Active SQLAlchemy session (injected via Depends).
        food_id: Optional filter. When provided, only readings for that food
                 are included in the calculation.

    Returns:
        AnalyticsResponse with reading_count and per-channel stats.
        If no readings match, reading_count == 0 and all channel fields
        are None.
    """
    # ------------------------------------------------------------------
    # Build the base aggregate query
    # ------------------------------------------------------------------
    query = db.query(
        func.count(SensorReading.id).label("reading_count"),

        func.round(func.avg(SensorReading.gas),         2).label("gas_avg"),
        func.min(SensorReading.gas).label("gas_min"),
        func.max(SensorReading.gas).label("gas_max"),

        func.round(func.avg(SensorReading.ph),          2).label("ph_avg"),
        func.min(SensorReading.ph).label("ph_min"),
        func.max(SensorReading.ph).label("ph_max"),

        func.round(func.avg(SensorReading.temperature), 2).label("temp_avg"),
        func.min(SensorReading.temperature).label("temp_min"),
        func.max(SensorReading.temperature).label("temp_max"),

        func.round(func.avg(SensorReading.humidity),    2).label("hum_avg"),
        func.min(SensorReading.humidity).label("hum_min"),
        func.max(SensorReading.humidity).label("hum_max"),
    )

    if food_id is not None:
        query = query.filter(SensorReading.food_id == food_id)

    row = query.one()

    # ------------------------------------------------------------------
    # Zero-reading guard: SQLite aggregate functions return NULL when the
    # table is empty or no rows match the filter.  func.count() returns 0.
    # ------------------------------------------------------------------
    count: int = row.reading_count or 0

    if count == 0:
        return AnalyticsResponse(
            reading_count=0,
            gas=None,
            ph=None,
            temperature=None,
            humidity=None,
        )

    return AnalyticsResponse(
        reading_count=count,
        gas=AnalyticsMetric(
            average=row.gas_avg,
            minimum=row.gas_min,
            maximum=row.gas_max,
        ),
        ph=AnalyticsMetric(
            average=row.ph_avg,
            minimum=row.ph_min,
            maximum=row.ph_max,
        ),
        temperature=AnalyticsMetric(
            average=row.temp_avg,
            minimum=row.temp_min,
            maximum=row.temp_max,
        ),
        humidity=AnalyticsMetric(
            average=row.hum_avg,
            minimum=row.hum_min,
            maximum=row.hum_max,
        ),
    )
