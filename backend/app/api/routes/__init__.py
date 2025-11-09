from fastapi import APIRouter
from app.api.routes import bookings, rooms, users, teams, chats

api_router = APIRouter()
api_router.include_router(rooms.router, prefix="/rooms", tags=["rooms"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(teams.router, prefix="/teams", tags=["teams"])
api_router.include_router(chats.router, prefix="/chats", tags=["chats"])
