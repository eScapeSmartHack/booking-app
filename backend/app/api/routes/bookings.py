from fastapi import APIRouter, HTTPException
from typing import List
from app.services.database_service import db_service
from app.models.models import Booking, User
from datetime import datetime, timedelta


router = APIRouter()

@router.post("/booking")
async def create_booking(booking: Booking):
    # Validăm că data este în format corect și în perioada permisă
    try:
        booking_date = datetime.strptime(booking.date, '%Y-%m-%d').date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Calculăm perioada de 2 săptămâni
    today = datetime.now().date()
    two_weeks_later = today + timedelta(days=14)
    
    # Verificăm dacă data depășește 2 săptămâni
    if booking_date > two_weeks_later:
        raise HTTPException(
            status_code=400, 
            detail=f"Date cannot exceed 2 weeks from today. Maximum allowed date: {two_weeks_later.isoformat()}"
        )
    
    # Verificăm dacă data este în trecut
    if booking_date < today:
        raise HTTPException(
            status_code=400, 
            detail=f"Date cannot be in the past. Minimum allowed date: {today.isoformat()}"
        )
    
    booking_dict = booking.model_dump()
    created_booking = await db_service.create_booking(booking_data=booking_dict)
    
    return {"message": "Booking created", "booking": created_booking}

@router.get("/booking")
async def get_bookings():
    return {"message": "List of bookings", "bookings": await db_service.get_all_books()}

