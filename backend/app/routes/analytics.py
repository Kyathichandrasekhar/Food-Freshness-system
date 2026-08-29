"""
routes/analytics.py

API routes for sensor analytics.

Endpoints:
  GET /api/analytics/  — Return statistical summaries of stored sensor readings
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.analytics import AnalyticsResponse
from app.services import analytics_service

router = APIRouter()


@router.get("/", response_model=AnalyticsResponse)
def get_analytics(
    food_id: Optional[int] = Query(
        default=None,
        ge=1,
        description="Restrict analytics to readings belonging to this food ID.",
    ),
    db: Session = Depends(get_db),
):
    """
    Calculate and return statistical summaries from stored sensor readings.

    - Uses existing SensorReading records in SQLite (read-only).
    - Optionally filter by food_id.
    - Returns reading_count == 0 with null channel fields when no data exists.
    - Averages are rounded to 2 decimal places.
    """
    return analytics_service.get_analytics(db=db, food_id=food_id)
