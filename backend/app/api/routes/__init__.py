from fastapi import APIRouter
from app.api.routes import bookings, rooms

api_router = APIRouter()
api_router.include_router(rooms.router, prefix="/rooms", tags=["rooms"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
