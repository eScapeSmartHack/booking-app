import json
import asyncio
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
        # Validate required fields
        id_user = booking_data.get('id_user')
        id_room = booking_data.get('id_room')
        date = booking_data.get('date')
        start = booking_data.get('start')
        end = booking_data.get('end')
        
        if id_user is None or id_room is None or date is None or start is None or end is None:
            raise ValueError(f"Missing required fields. Got: id_user={id_user}, id_room={id_room}, date={date}, start={start}, end={end}")
        
        mapped_data = {
            'id_user': id_user,
            'id_room': id_room,
            'date': date,
            'start': start,
            'end': end
        }
        
        booking = await prisma.book.create(data=mapped_data)

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
    
    async def get_room_by_id(self, room_id: int) -> Optional[Room]:
        room = await prisma.room.find_unique(
            where={'id': room_id}
        )
        return room
    
    async def create_room(self, room_data: Dict[str, Any]) -> Room:
        """
        Create a new room.
        room_data should contain: {'data': str} where data is JSON string
        """
        if 'data' not in room_data:
            raise ValueError("Missing required field: data")
        
        room = await prisma.room.create(data={'data': room_data['data']})
        return room
    
    async def update_room(self, room_id: int, room_data: Dict[str, Any]) -> Optional[Room]:
        """
        Update an existing room.
        room_data should contain: {'data': str} where data is JSON string
        """
        if 'data' not in room_data:
            raise ValueError("Missing required field: data")
        
        room = await prisma.room.update(
            data={'data': room_data['data']},
            where={'id': room_id}
        )
        return room
    
    async def delete_room(self, room_id: int) -> Optional[Room]:
        """
        Delete a room by ID.
        """
        room = await self.get_room_by_id(room_id=room_id)
        if room:
            await prisma.room.delete(where={'id': room_id})
        return room
    
    async def save_rooms_bulk(self, rooms_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Bulk save rooms. This will:
        - Create new rooms that don't exist
        - Update existing rooms
        - Delete rooms that are not in the provided list
        
        rooms_data should be a list of dicts with: {'id': int, 'data': str}
        If id is None or doesn't exist in DB, a new room will be created.
        """
        # Get all existing rooms
        existing_rooms = await self.get_all_rooms()
        existing_room_ids = {room.id for room in existing_rooms}
        
        # Process each room
        new_rooms = []
        updated_rooms = []
        rooms_to_keep = set()
        
        for room_data in rooms_data:
            room_id = room_data.get('id')
            room_json_data = room_data.get('data')
            
            if not room_json_data:
                continue  # Skip rooms without data
            
            if room_id and room_id in existing_room_ids:
                # Update existing room
                updated_room = await self.update_room(room_id, {'data': room_json_data})
                if updated_room:
                    updated_rooms.append(updated_room)
                    rooms_to_keep.add(room_id)
            else:
                # Create new room (id doesn't exist or is None)
                new_room = await self.create_room({'data': room_json_data})
                new_rooms.append(new_room)
                if new_room.id:
                    rooms_to_keep.add(new_room.id)
        
        # Delete rooms that are not in the provided list
        rooms_to_delete = existing_room_ids - rooms_to_keep
        deleted_rooms = []
        for room_id in rooms_to_delete:
            deleted_room = await self.delete_room(room_id)
            if deleted_room:
                deleted_rooms.append(deleted_room)
        
        return {
            'created': len(new_rooms),
            'updated': len(updated_rooms),
            'deleted': len(deleted_rooms),
            'new_rooms': new_rooms,
            'updated_rooms': updated_rooms,
            'deleted_rooms': deleted_rooms,
        }
    
    async def get_all_users(self) -> List[User]:
        user = await prisma.user.find_many()
        
        return user
    
    async def get_users_by_ids(self, user_ids: List[int]) -> List[User]:
        """
        Get users by their IDs using Prisma.
        Fetches users from the User table using Prisma's find_unique.
        Uses asyncio.gather to fetch all users in parallel for better performance.
        """
        if not user_ids:
            return []
        
        # Fetch all users in parallel using Prisma's find_unique
        # This uses the User model from schema.prisma with id field
        tasks = [prisma.user.find_unique(where={'id': user_id}) for user_id in user_ids]
        results = await asyncio.gather(*tasks)
        
        # Filter out None values (users that don't exist)
        users = [user for user in results if user is not None]
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
    
    async def update_user_settings(self, user_id: int, update_data: Dict[str, Any]) -> Optional[User]:
        """
        Update user settings (name, password, etc.)
        """
        mapped_data = {}
        if 'name' in update_data:
            mapped_data['name'] = update_data['name']
        if 'password' in update_data:
            mapped_data['password'] = update_data['password']
        
        if not mapped_data:
            return None
        
        user = await prisma.user.update(
            data=mapped_data,
            where={'id': user_id}
        )
        return user

db_service = DatabaseService()
