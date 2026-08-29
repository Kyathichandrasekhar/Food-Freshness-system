"""
services/food_service.py

Database operations for Food.

Keeps all DB query logic out of the route layer so routes stay thin.
"""

from sqlalchemy.orm import Session
from app.models.food import Food
from app.schemas.food import FoodCreate


def create_food(db: Session, food: FoodCreate) -> Food:
    """
    Persist a new Food item to the database.

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
    return db_food


def get_all_foods(db: Session) -> list[Food]:
    """
    Return all Food records ordered by id ascending.
    """
    return db.query(Food).order_by(Food.id.asc()).all()
