from pydantic import BaseModel

class Room(BaseModel):
    id: int
    data: str
    

class Booking(BaseModel):
    id_room: int
    id_user: int
    start: str
    end: str
    
class User(BaseModel):
    name: str
    pasword: str
    avatar: str