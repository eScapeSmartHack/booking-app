from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.services.database_service import db_service
from app.models.models import Booking


router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    user: dict = None

class UpdateAvatarRequest(BaseModel):
    user_id: int
    avatar: str

class UpdateAvatarResponse(BaseModel):
    success: bool
    message: str
    user: dict = None

@router.get("/")
async def get_users():
    return {"message": "List of users", "users": await db_service.get_all_users()}

@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """
    Authenticate user with username and password
    """
    users = await db_service.get_all_users()
    
    # Find user by username (name field)
    user = None
    for u in users:
        if u.name == login_data.username:
            user = u
            break
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Check password (in production, this should compare hashed passwords)
    if user.password != login_data.password:
        raise HTTPException(status_code=401, detail="Wrong password")
    
    # Return user data without password
    user_data = {
        "id": user.id,
        "name": user.name,
        "avatar": user.avatar
    }
    
    return {
        "success": True,
        "message": "Login successful",
        "user": user_data
    }

@router.put("/avatar", response_model=UpdateAvatarResponse)
async def update_avatar(avatar_data: UpdateAvatarRequest):
    """
    Update user avatar
    """
    user = await db_service.get_user_by_id(avatar_data.user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update avatar
    updated_user = await db_service.update_user_avatar(avatar_data.user_id, avatar_data.avatar)
    
    if not updated_user:
        raise HTTPException(status_code=500, detail="Failed to update avatar")
    
    # Return updated user data without password
    user_data = {
        "id": updated_user.id,
        "name": updated_user.name,
        "avatar": updated_user.avatar
    }
    
    return {
        "success": True,
        "message": "Avatar updated successfully",
        "user": user_data
    }

@router.get("/bookings/next-two-weeks")
async def get_all_users_bookings_next_two_weeks():
    """
    Returnează bookingurile fiecărui utilizator pentru următoarele 2 săptămâni
    """
    # Obținem data curentă și data peste 2 săptămâni
    today = datetime.now().date()
    two_weeks_later = today + timedelta(days=14)
    
    # Obținem toate bookingurile
    all_bookings = await db_service.get_all_books()
    
    # Obținem toți utilizatorii
    all_users = await db_service.get_all_users()
    
    # Creăm un dicționar pentru a organiza bookingurile pe utilizatori
    users_bookings: Dict[int, List[Dict[str, Any]]] = {}
    
    # Inițializăm dicționarul cu toți utilizatorii
    for user in all_users:
        users_bookings[user.id] = []
    
    # Filtrăm și grupăm bookingurile
    for booking in all_bookings:
        try:
            # Parsăm data din câmpul date
            booking_date = datetime.strptime(booking.date, '%Y-%m-%d').date()
            
            # Verificăm dacă bookingul este în următoarele 2 săptămâni
            if today <= booking_date <= two_weeks_later:
                # Adăugăm bookingul la utilizatorul corespunzător
                if booking.id_user in users_bookings:
                    users_bookings[booking.id_user].append({
                        "id": booking.id,
                        "id_room": booking.id_room,
                        "date": booking.date,
                        "start": booking.start,
                        "end": booking.end
                    })
        except Exception as e:
            # Dacă există eroare la parsarea datei, continuăm
            continue
    
    # Creăm răspunsul final cu informații despre utilizatori
    result = []
    for user in all_users:
        result.append({
            "user_id": user.id,
            "user_name": user.name,
            "bookings_count": len(users_bookings[user.id]),
            "bookings": users_bookings[user.id]
        })
    
    return {
        "period": {
            "start_date": today.isoformat(),
            "end_date": two_weeks_later.isoformat()
        },
        "users": result
    }

@router.get("/bookings/user/{id_user}/next-two-weeks")
async def get_user_bookings_next_two_weeks(id_user: int):
    """
    Returnează bookingurile unui utilizator specific pentru următoarele 2 săptămâni
    """
    # Verificăm dacă utilizatorul există
    user = await db_service.get_user_by_id(id_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Obținem data curentă și data peste 2 săptămâni
    today = datetime.now().date()
    two_weeks_later = today + timedelta(days=14)
    
    # Obținem toate bookingurile
    all_bookings = await db_service.get_all_books()
    
    # Filtrăm bookingurile pentru utilizatorul specific
    user_bookings = []
    for booking in all_bookings:
        if booking.id_user == id_user:
            try:
                # Parsăm data din câmpul date
                booking_date = datetime.strptime(booking.date, '%Y-%m-%d').date()
                
                # Verificăm dacă bookingul este în următoarele 2 săptămâni
                if today <= booking_date <= two_weeks_later:
                    user_bookings.append({
                        "id": booking.id,
                        "id_room": booking.id_room,
                        "date": booking.date,
                        "start": booking.start,
                        "end": booking.end
                    })
            except Exception:
                continue
    
    return {
        "user_id": user.id,
        "user_name": user.name,
        "period": {
            "start_date": today.isoformat(),
            "end_date": two_weeks_later.isoformat()
        },
        "bookings_count": len(user_bookings),
        "bookings": user_bookings
    }

@router.get("/bookings/date/{date}")
async def get_all_users_bookings_by_date(date: str):
    """
    Returnează bookingurile tuturor utilizatorilor pentru o dată specifică
    Format dată: YYYY-MM-DD (ex: 2025-11-15)
    Data nu poate depăși 2 săptămâni de la data curentă
    """
    try:
        # Validăm și parsăm data
        target_date = datetime.strptime(date, '%Y-%m-%d').date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Calculăm perioada de 2 săptămâni
    today = datetime.now().date()
    two_weeks_later = today + timedelta(days=14)
    
    # Verificăm dacă data depășește 2 săptămâni
    if target_date > two_weeks_later:
        raise HTTPException(
            status_code=400, 
            detail=f"Date cannot exceed 2 weeks from today. Maximum allowed date: {two_weeks_later.isoformat()}"
        )
    
    # Verificăm dacă data este în trecut
    if target_date < today:
        raise HTTPException(
            status_code=400, 
            detail=f"Date cannot be in the past. Minimum allowed date: {today.isoformat()}"
        )
    
    # Obținem toate bookingurile
    all_bookings = await db_service.get_all_books()
    
    # Obținem toți utilizatorii
    all_users = await db_service.get_all_users()
    
    # Creăm dicționare pentru bookingurile din ziua specificată și din următoarele 2 săptămâni
    users_bookings_today: Dict[int, List[Dict[str, Any]]] = {}
    users_bookings_two_weeks: Dict[int, int] = {}
    
    # Inițializăm dicționarele cu toți utilizatorii
    for user in all_users:
        users_bookings_today[user.id] = []
        users_bookings_two_weeks[user.id] = 0
    
    # Filtrăm și grupăm bookingurile
    for booking in all_bookings:
        try:
            # Parsăm data din câmpul date
            booking_date = datetime.strptime(booking.date, '%Y-%m-%d').date()
            
            # Verificăm dacă bookingul este în data specificată
            if booking_date == target_date:
                if booking.id_user in users_bookings_today:
                    users_bookings_today[booking.id_user].append({
                        "id": booking.id,
                        "id_room": booking.id_room,
                        "date": booking.date,
                        "start": booking.start,
                        "end": booking.end
                    })
            
            # Numărăm toate bookingurile din următoarele 2 săptămâni
            if today <= booking_date <= two_weeks_later:
                if booking.id_user in users_bookings_two_weeks:
                    users_bookings_two_weeks[booking.id_user] += 1
                    
        except Exception:
            continue
    
    # Creăm răspunsul final cu informații despre utilizatori
    result = []
    for user in all_users:
        user_data = {
            "user_id": user.id,
            "user_name": user.name,
            "bookings_count": len(users_bookings_today[user.id]),
            "total_bookings_next_two_weeks": users_bookings_two_weeks[user.id],
            "bookings": users_bookings_today[user.id]
        }
        
        result.append(user_data)
    
    return {
        "date": target_date.isoformat(),
        "total_bookings": sum(len(bookings) for bookings in users_bookings_today.values()),
        "period": {
            "start_date": today.isoformat(),
            "end_date": two_weeks_later.isoformat()
        },
        "users": result
    }

@router.get("/bookings/user/{id_user}/date/{date}")
async def get_user_bookings_by_date(id_user: int, date: str):
    """
    Returnează bookingurile unui utilizator specific pentru o dată specifică
    Format dată: YYYY-MM-DD (ex: 2025-11-15)
    Data nu poate depăși 2 săptămâni de la data curentă
    """
    # Verificăm dacă utilizatorul există
    user = await db_service.get_user_by_id(id_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Validăm și parsăm data
        target_date = datetime.strptime(date, '%Y-%m-%d').date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Calculăm perioada de 2 săptămâni
    today = datetime.now().date()
    two_weeks_later = today + timedelta(days=14)
    
    # Verificăm dacă data depășește 2 săptămâni
    if target_date > two_weeks_later:
        raise HTTPException(
            status_code=400, 
            detail=f"Date cannot exceed 2 weeks from today. Maximum allowed date: {two_weeks_later.isoformat()}"
        )
    
    # Verificăm dacă data este în trecut
    if target_date < today:
        raise HTTPException(
            status_code=400, 
            detail=f"Date cannot be in the past. Minimum allowed date: {today.isoformat()}"
        )
    
    # Obținem toate bookingurile
    all_bookings = await db_service.get_all_books()
    
    # Filtrăm bookingurile pentru utilizatorul specific
    user_bookings_today = []
    user_bookings_two_weeks_count = 0
    
    for booking in all_bookings:
        if booking.id_user == id_user:
            try:
                # Parsăm data din câmpul date
                booking_date = datetime.strptime(booking.date, '%Y-%m-%d').date()
                
                # Verificăm dacă bookingul este în data specificată
                if booking_date == target_date:
                    user_bookings_today.append({
                        "id": booking.id,
                        "id_room": booking.id_room,
                        "date": booking.date,
                        "start": booking.start,
                        "end": booking.end
                    })
                
                # Numărăm toate bookingurile din următoarele 2 săptămâni
                if today <= booking_date <= two_weeks_later:
                    user_bookings_two_weeks_count += 1
                    
            except Exception:
                continue
    
    return {
        "user_id": user.id,
        "user_name": user.name,
        "date": target_date.isoformat(),
        "bookings_count": len(user_bookings_today),
        "total_bookings_next_two_weeks": user_bookings_two_weeks_count,
        "period": {
            "start_date": today.isoformat(),
            "end_date": two_weeks_later.isoformat()
        },
        "bookings": user_bookings_today
    }
    