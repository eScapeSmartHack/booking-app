from fastapi import APIRouter, HTTPException
from typing import List

router = APIRouter()

@router.get("/")
async def get_users():
    """Get all users"""
    return {"users": []}

@router.get("/{user_id}")
async def get_user(user_id: int):
    """Get a specific user by ID"""
    return {"user_id": user_id}

@router.post("/")
async def create_user():
    """Create a new user"""
    return {"message": "User created"}
