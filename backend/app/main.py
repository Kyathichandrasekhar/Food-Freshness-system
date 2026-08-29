"""
main.py

FreshGuard AI — FastAPI application entry point.

Startup sequence:
1. Create all database tables (if they do not already exist).
2. Register API routers.
3. Expose the root health-check endpoint.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database.database import init_db
from app.routes import sensors, foods, analytics


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.

    On startup: initializes the SQLite database (creates tables if absent).
    On shutdown: nothing extra required — SQLAlchemy sessions are closed
                 per-request via the get_db dependency.
    """
    init_db()
    yield


app = FastAPI(
    title="FreshGuard AI Backend",
    description="IoT + AI Food Freshness Prediction System — Backend API",
    version="0.2.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# API Routers
# ---------------------------------------------------------------------------
app.include_router(foods.router,     prefix="/api/foods",     tags=["Foods"])
app.include_router(sensors.router,   prefix="/api/sensors",   tags=["Sensors"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])


@app.get("/", tags=["Health"])
def read_root():
    return {"message": "FreshGuard AI Backend is running"}
