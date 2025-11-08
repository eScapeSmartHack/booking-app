from pydantic import BaseModel

class Room(BaseModel):
    id: int
    data: str
    

class Booking(BaseModel):
    id_room: int
    start: str
    end: str