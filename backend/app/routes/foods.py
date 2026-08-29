"""
routes/foods.py

API routes for Food management.

Endpoints:
  POST /api/foods/  — Create a new food/sample record
  GET  /api/foods/  — List all food/sample records
"""

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.food import FoodCreate, FoodResponse
from app.services import food_service

router = APIRouter()


@router.post("/", response_model=FoodResponse, status_code=201)
def create_food(food: FoodCreate, db: Session = Depends(get_db)):
    """
    Create a new Food record and return it with its generated id.

    Example request body:
        {"name": "Tomato"}
    """
    return food_service.create_food(db=db, food=food)


@router.get("/", response_model=List[FoodResponse])
def list_foods(db: Session = Depends(get_db)):
    """
    Return all Food records stored in the database, ordered by id ascending.
    """
    return food_service.get_all_foods(db=db)
