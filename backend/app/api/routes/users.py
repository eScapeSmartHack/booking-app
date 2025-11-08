from fastapi import APIRouter, HTTPException
from typing import List
from app.services.database_service import db_service
from app.models.models import Booking


router = APIRouter()

@router.get("/")
async def get_users():
    return {"message": "List of users", "users": await db_service.get_all_users()}