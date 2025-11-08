from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import api_router
from pydantic import BaseModel
from app.services.database_service import db_service
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db_service.connect()
    yield
    await db_service.disconnect()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
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
    id: int
    data: str
    

class Booking(BaseModel):
    id_room: int
    start: str
    end: str

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
    
@app.get("/rooms")
async def get_rooms():
    # This is a placeholder for actual room retrieval logic
    return {"message": "List of rooms", "rooms": await db_service.get_all_rooms()}
    

@app.post("/bookings")
async def create_booking(booking: Booking):
    booking_dict = booking.model_dump()
    
    created_booking = await db_service.create_booking(booking_data=booking_dict)

    return {"message": "Booking created", "booking": created_booking}

@app.get("/bookings")
async def get_bookings():
     return {"message": "List of bookings", "bookings": await db_service.get_all_books()}
