from fastapi import APIRouter, HTTPException
from typing import List
from app.services.database_service import db_service
from app.models.models import Booking


router = APIRouter()

@router.post("/booking")
async def create_booking(booking: Booking):
    booking_dict = booking.model_dump()
    
    created_booking = await db_service.create_booking(booking_data=booking_dict)

    return {"message": "Booking created", "booking": created_booking}

@router.get("/booking")
async def get_bookings():
     return {"message": "List of bookings", "bookings": await db_service.get_all_books()}
