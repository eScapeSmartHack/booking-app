from fastapi import APIRouter, HTTPException
from typing import List
from app.services.database_service import db_service

router = APIRouter()

@router.get("/")
async def get_rooms():
    # This is a placeholder for actual room retrieval logic
    return {"message": "List of rooms", "rooms": await db_service.get_all_rooms()}
