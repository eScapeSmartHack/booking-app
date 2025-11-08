from fastapi import APIRouter, HTTPException
from typing import List

router = APIRouter()

@router.get("/")
async def get_items():
    """Get all items"""
    return {"items": []}

@router.get("/{item_id}")
async def get_item(item_id: int):
    """Get a specific item by ID"""
    return {"item_id": item_id}

@router.post("/")
async def create_item():
    """Create a new item"""
    return {"message": "Item created"}

@router.put("/{item_id}")
async def update_item(item_id: int):
    """Update an existing item"""
    return {"message": f"Item {item_id} updated"}

@router.delete("/{item_id}")
async def delete_item(item_id: int):
    """Delete an item"""
    return {"message": f"Item {item_id} deleted"}
