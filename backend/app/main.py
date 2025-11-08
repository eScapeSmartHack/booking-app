from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import api_router
from pydantic import BaseModel

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

class Room(BaseModel):
    room_id: int
    data: str
    

class Booking(BaseModel):
    booking_id: int
    room_id: int
    start: str
    end: str

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


rooms = [
		Room(room_id=1, data="json ceva laalla"),
		Room(room_id=2, data="json ceva lalala"),
	]	

bookings = []

@app.get("/rooms")
async def get_rooms():
    # This is a placeholder for actual room retrieval logic
    # trebuie luate din baza de date camerele
	return rooms

@app.post("/bookings")
async def create_booking(booking: Booking):
    booking_dict = booking.model_dump()
    bookings.append(booking_dict)
    return {"message": "Booking created", "booking": booking_dict}

@app.get("/bookings")
async def get_bookings():
     return {"message": "List of bookings", "bookings": bookings}