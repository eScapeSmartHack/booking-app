from fastapi import APIRouter, HTTPException
from typing import List
from app.services.database_service import db_service
from app.models.models import Booking, UpdateBooking, User
from datetime import datetime, timedelta


router = APIRouter()

@router.post("/booking")
async def create_booking(booking: Booking):
    try:
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
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating booking: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/booking")
async def get_bookings():
    """
    Get all bookings with user information including avatars.
    Uses Prisma to fetch users by ID efficiently.
    """
    bookings = await db_service.get_all_books()
    
    # Collect all unique user IDs from bookings
    user_ids = list(set(booking.id_user for booking in bookings))
    
    # Fetch only the users we need using Prisma (more efficient)
    # Uses Prisma's find_many with 'in' filter to get users by their IDs
    users = await db_service.get_users_by_ids(user_ids) if user_ids else []
    users_dict = {user.id: user for user in users}
    
    # Enrich bookings with user data (including avatar)
    enriched_bookings = []
    for booking in bookings:
        # Get user from dictionary using booking.id_user (from Prisma schema)
        user = users_dict.get(booking.id_user)
        booking_dict = {
            "id": booking.id,
            "id_room": booking.id_room,
            "id_user": booking.id_user,
            "date": booking.date,
            "start": booking.start,
            "end": booking.end,
            "user": {
                "id": user.id,
                "name": user.name,
                "avatar": user.avatar
            } if user else None
        }
        enriched_bookings.append(booking_dict)
    
    return {"message": "List of bookings", "bookings": enriched_bookings}

@router.put("/booking/{booking_id}")
async def update_booking(booking_id: int, booking: UpdateBooking):
    """
    Update a booking by ID.
    """
    try:
        # Check if booking exists
        existing_booking = await db_service.get_booking_by_id(booking_id=booking_id)
        if not existing_booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Validate date format and range
        try:
            booking_date = datetime.strptime(booking.date, '%Y-%m-%d').date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        
        # Calculate 2 weeks period
        today = datetime.now().date()
        two_weeks_later = today + timedelta(days=14)
        
        # Check if date exceeds 2 weeks
        if booking_date > two_weeks_later:
            raise HTTPException(
                status_code=400, 
                detail=f"Date cannot exceed 2 weeks from today. Maximum allowed date: {two_weeks_later.isoformat()}"
            )
        
        # Check if date is in the past
        if booking_date < today:
            raise HTTPException(
                status_code=400, 
                detail=f"Date cannot be in the past. Minimum allowed date: {today.isoformat()}"
            )
        
        # Update the booking
        update_data = {
            'date': booking.date,
            'start': booking.start,
            'end': booking.end,
        }
        updated_booking = await db_service.update_booking(booking_id=booking_id, update_data=update_data)
        
        return {"message": "Booking updated successfully", "booking": updated_booking}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating booking: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.delete("/booking/{booking_id}")
async def delete_booking(booking_id: int):
    """
    Delete a booking by ID.
    """
    try:
        # Check if booking exists
        booking = await db_service.get_booking_by_id(booking_id=booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Delete the booking
        deleted_booking = await db_service.delete_booking(booking_id=booking_id)
        
        return {"message": "Booking deleted successfully", "booking": deleted_booking}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting booking: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

