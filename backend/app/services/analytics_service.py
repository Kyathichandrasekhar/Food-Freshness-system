"""
services/analytics_service.py

Read-only database operations for the Analytics API.

Uses SQLAlchemy's built-in func.avg / func.min / func.max aggregates so that
all arithmetic happens inside SQLite — no Python-side loops needed.

The service never writes to the database.
"""

import logging
from typing import Optional
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.sensor import SensorReading
from app.schemas.analytics import AnalyticsMetric, AnalyticsResponse

logger = logging.getLogger("freshguard.analytics_service")


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
        # Fallback: SQLite has no readings for this query. If Firebase has data,
        # compute statistics strictly from Firebase alone (no mixing of data sources)
        # to ensure statistical integrity.
        try:
            from app.database.firebase_client import get_firebase_ref
            readings_ref = get_firebase_ref("sensor_readings")
            if readings_ref is not None:
                data = readings_ref.get()
                if data and isinstance(data, dict):
                    readings = list(data.values())
                    if food_id is not None:
                        readings = [r for r in readings if str(r.get("food_id")) == str(food_id)]
                    
                    if readings:
                        fb_count = len(readings)
                        logger.info(
                            "Analytics computed from Firebase RTDB fallback (%d readings, food_id=%s)",
                            fb_count,
                            food_id,
                        )
                        def get_stats(field: str):
                            vals = [float(r[field]) for r in readings if r.get(field) is not None]
                            if not vals:
                                return None
                            return AnalyticsMetric(
                                average=round(sum(vals) / len(vals), 2),
                                minimum=round(min(vals), 2),
                                maximum=round(max(vals), 2),
                            )
                        return AnalyticsResponse(
                            reading_count=fb_count,
                            gas=get_stats("gas"),
                            ph=get_stats("ph"),
                            temperature=get_stats("temperature"),
                            humidity=get_stats("humidity"),
                        )
        except Exception as e:
            logger.warning("Firebase fallback analytics query failed: %s", e)

        return AnalyticsResponse(
            reading_count=0,
            gas=None,
            ph=None,
            temperature=None,
            humidity=None,
        )

    logger.debug("Analytics computed from SQLite (%d readings, food_id=%s)", count, food_id)

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
