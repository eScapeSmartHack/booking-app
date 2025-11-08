import json
from typing import List, Optional, Dict, Any
from prisma import Prisma
from prisma.models import Book, Room, User
from pydantic import BaseModel, Field

# prisma client
prisma = Prisma()

class DatabaseService:
    async def connect(self):
        await prisma.connect()
        
    async def disconnect(self):
        await prisma.disconnect()
        
    # booking
    async def create_booking(self, booking_data: Dict[str, Any]) -> Book:
        mapped_data = {
            # 'id': booking_data.get('id'),
            'id_user': booking_data.get('id_user'),
            'id_room': booking_data.get('id_room'),
            'date': booking_data.get('date'),
            'start': booking_data.get('start'),
            'end': booking_data.get('end')
        }
        
        booking = await prisma.book.create(data= {**mapped_data})

        return booking
    
    async def get_all_books(self) -> List[Book]:
        bookings = await prisma.book.find_many()
    
        return bookings
    
    async def get_booking_by_id(self, booking_id: int) -> Optional[Book]:
        booking = await prisma.book.find_unique(
            where={'id': booking_id}
        )

        return booking

    async def update_booking(self, booking_id: int, update_data: Dict[str, Any]) -> Optional[Book]:
        mapped_data = {}
        for key, value in update_data.items():
            if key == 'start':
                mapped_data['start'] = value
            elif key == 'end':
                mapped_data['end'] = value
            elif key == 'date':
                mapped_data['date'] = value
            else:
                mapped_data[key] = value
            
        booking = await prisma.book.update(
            data=mapped_data,
            where={'id': booking_id}
        )
        
        return booking
    
    async def delete_booking(self, booking_id: int) -> Optional[Book]:
        booking = await self.get_booking_by_id(booking_id=booking_id)
        if booking:
            await prisma.book.delete(where={'id': booking_id})
        return booking

    async def get_all_rooms(self) -> List[Room]:
        room = await prisma.room.find_many()
        
        return room
    
    async def get_all_users(self) -> List[User]:
        user = await prisma.user.find_many()
        
        return user
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        users = await prisma.user.find_unique(
            where={'id': user_id}
        )
        return users
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        user = await prisma.user.find_unique(
            where={'id': user_id}
        )
        return user
    
    async def update_user_avatar(self, user_id: int, avatar: str) -> Optional[User]:
        user = await prisma.user.update(
            data={'avatar': avatar},
            where={'id': user_id}
        )
        return user

db_service = DatabaseService()
