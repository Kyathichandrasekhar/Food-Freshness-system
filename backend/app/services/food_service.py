"""
services/food_service.py

Database operations for Food.

Keeps all DB query logic out of the route layer so routes stay thin.
"""

import logging
from sqlalchemy.orm import Session
from app.models.food import Food
from app.schemas.food import FoodCreate
from app.database.firebase_client import get_firebase_ref

logger = logging.getLogger("freshguard.food_service")


def create_food(db: Session, food: FoodCreate) -> Food:
    """
    Persist a new Food item to SQLite and sync to Firebase Realtime Database.

    Args:
        db:   Active SQLAlchemy session (injected via Depends).
        food: Validated Pydantic FoodCreate schema from the route.

    Returns:
        The newly created Food ORM instance with its generated id and created_at.
    """
    db_food = Food(name=food.name)
    db.add(db_food)
    db.commit()
    db.refresh(db_food)

    # Dual-write to Firebase Realtime Database
    try:
        foods_ref = get_firebase_ref("foods")
        if foods_ref is not None:
            food_payload = {
                "id": db_food.id,
                "name": db_food.name,
                "created_at": db_food.created_at.isoformat() if db_food.created_at else None,
            }
            # Store by id key for direct lookup and also support listing
            foods_ref.child(str(db_food.id)).set(food_payload)
            logger.info("Synced food '%s' (id=%s) to Firebase RTDB", db_food.name, db_food.id)
    except Exception as e:
        logger.error("Failed to sync food to Firebase RTDB: %s", e)

    return db_food


def get_all_foods(db: Session) -> list[Food]:
    """
    Return all Food records ordered by id ascending.
    """
    return db.query(Food).order_by(Food.id.asc()).all()
