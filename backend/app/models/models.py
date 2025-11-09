from pydantic import BaseModel
from typing import Optional

class Room(BaseModel):
    id: int
    data: str
    

class Booking(BaseModel):
    id_room: int
    id_user: int
    date: str  # Format: YYYY-MM-DD
    start: str  # Ora de început (ex: "09:00")
    end: str    # Ora de sfârșit (ex: "17:00")
    status: Optional[str] = "active"  # "pending", "approved", "rejected", or "active"

class UpdateBooking(BaseModel):
    date: str  # Format: YYYY-MM-DD
    start: str  # Ora de început (ex: "09:00")
    end: str    # Ora de sfârșit (ex: "17:00")
    
class User(BaseModel):
    name: str
    pasword: str
    avatar: str