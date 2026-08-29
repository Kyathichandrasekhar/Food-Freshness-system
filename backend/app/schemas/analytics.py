"""
schemas/analytics.py

Pydantic response schemas for the Analytics API.

AnalyticsMetric  — average / minimum / maximum for one sensor channel.
AnalyticsResponse — top-level envelope returned by GET /api/analytics/.

All numeric fields are Optional so that zero-reading cases can be
represented cleanly as null rather than as misleading zeros.
"""

from typing import Optional
from pydantic import BaseModel


class AnalyticsMetric(BaseModel):
    """Statistical summary (avg / min / max) for a single sensor channel."""
    average: Optional[float]
    minimum: Optional[float]
    maximum: Optional[float]


class AnalyticsResponse(BaseModel):
    """
    Top-level analytics envelope.

    reading_count == 0  →  all channel fields are None.
    reading_count  > 0  →  all channel fields are populated AnalyticsMetric.
    """
    reading_count: int
    gas: Optional[AnalyticsMetric]
    ph: Optional[AnalyticsMetric]
    temperature: Optional[AnalyticsMetric]
    humidity: Optional[AnalyticsMetric]
