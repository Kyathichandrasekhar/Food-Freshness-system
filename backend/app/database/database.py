"""
database/database.py

Responsible for:
- Importing all ORM models so SQLAlchemy registers their table metadata
- Exposing init_db() which creates tables that do not yet exist

SAFETY:
- Uses create_all() with checkfirst=True (the default), which never drops
  or truncates existing tables. Existing data is always preserved.
- This function is called once at application startup.
"""

from app.database.connection import engine, Base

# Import all models here so that Base.metadata knows about every table.
# Order matters only if you have cross-model FK imports, but SQLAlchemy
# handles deferred FK resolution so alphabetical order is fine.
import app.models.food        # noqa: F401  registers Food table
import app.models.sensor      # noqa: F401  registers SensorReading table
import app.models.prediction  # noqa: F401  registers Prediction table


def init_db() -> None:
    """
    Create all database tables that do not already exist.

    Safe to call on every startup:
    - New database  → creates all three tables (foods, sensor_readings, predictions)
    - Existing DB   → no-op; existing tables and data are untouched
    """
    Base.metadata.create_all(bind=engine)
