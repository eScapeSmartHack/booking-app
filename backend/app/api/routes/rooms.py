from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.services.database_service import db_service

router = APIRouter()

class RoomData(BaseModel):
    id: Optional[int] = None
    data: str

class SaveRoomsRequest(BaseModel):
    rooms: List[RoomData]

@router.get("/")
async def get_rooms():
    # This is a placeholder for actual room retrieval logic
    return {"message": "List of rooms", "rooms": await db_service.get_all_rooms()}

@router.post("/save")
async def save_rooms(request: SaveRoomsRequest):
    """
    Bulk save rooms. This will create new rooms, update existing ones, and delete removed ones.
    """
    try:
        # Convert Pydantic models to dicts
        rooms_data = [
            {
                'id': room.id,
                'data': room.data
            }
            for room in request.rooms
        ]
        
        result = await db_service.save_rooms_bulk(rooms_data)
        
        return {
            "message": "Rooms saved successfully",
            "created": result['created'],
            "updated": result['updated'],
            "deleted": result['deleted'],
        }
    except Exception as e:
        print(f"Error saving rooms: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
