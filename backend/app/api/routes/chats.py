from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from typing import List, Dict
from pydantic import BaseModel
from app.services.database_service import db_service
from datetime import datetime
import json

router = APIRouter()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, chat_id: int):
        await websocket.accept()
        if chat_id not in self.active_connections:
            self.active_connections[chat_id] = []
        self.active_connections[chat_id].append(websocket)

    def disconnect(self, websocket: WebSocket, chat_id: int):
        if chat_id in self.active_connections:
            self.active_connections[chat_id].remove(websocket)
            if not self.active_connections[chat_id]:
                del self.active_connections[chat_id]

    async def broadcast(self, message: dict, chat_id: int):
        if chat_id in self.active_connections:
            for connection in self.active_connections[chat_id]:
                try:
                    await connection.send_json(message)
                except:
                    pass

manager = ConnectionManager()


class CreateChatRequest(BaseModel):
    roomId: int
    date: str  # YYYY-MM-DD
    startTime: str  # HH:mm
    endTime: str  # HH:mm


class SendMessageRequest(BaseModel):
    chatId: int
    userId: int
    content: str


@router.post("")
async def create_or_get_chat(request: CreateChatRequest):
    """
    Create or get a chat for a recreational space booking.
    Returns existing chat if one exists for the same room, date, and time.
    """
    try:
        # Check if a chat already exists for this space and time
        existing_chat = await db_service.get_chat_by_room_and_time(
            room_id=request.roomId,
            date=request.date,
            start_time=request.startTime,
            end_time=request.endTime
        )
        
        if existing_chat:
            # Get messages for existing chat
            messages = await db_service.get_chat_messages(existing_chat.id)
            
            # Enrich messages with user data (avatars and names)
            user_ids = list(set(msg.userId for msg in messages))
            users = await db_service.get_users_by_ids(user_ids) if user_ids else []
            users_dict = {user.id: user for user in users}
            
            enriched_messages = []
            for msg in messages:
                user = users_dict.get(msg.userId)
                enriched_messages.append({
                    "id": msg.id,
                    "chatId": msg.chatId,
                    "userId": msg.userId,
                    "content": msg.content,
                    "timestamp": msg.timestamp,
                    "user": {
                        "id": user.id,
                        "name": user.name,
                        "avatar": user.avatar,
                        "mood": getattr(user, 'mood', 'happy')
                    } if user else None
                })
            
            return {
                "chat": {
                    "id": existing_chat.id,
                    "roomId": existing_chat.roomId,
                    "date": existing_chat.date,
                    "startTime": existing_chat.startTime,
                    "endTime": existing_chat.endTime,
                    "createdAt": existing_chat.createdAt
                },
                "messages": enriched_messages
            }
        
        # Create new chat
        chat = await db_service.create_chat({
            "roomId": request.roomId,
            "date": request.date,
            "startTime": request.startTime,
            "endTime": request.endTime,
            "createdAt": datetime.now().isoformat()
        })
        
        return {
            "chat": {
                "id": chat.id,
                "roomId": chat.roomId,
                "date": chat.date,
                "startTime": chat.startTime,
                "endTime": chat.endTime,
                "createdAt": chat.createdAt
            },
            "messages": []
        }
    except Exception as e:
        print(f"Error creating/getting chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{chat_id}")
async def get_chat(chat_id: int):
    """
    Get a specific chat with all its messages and participants.
    """
    try:
        chat = await db_service.get_chat_by_id(chat_id)
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        messages = await db_service.get_chat_messages(chat_id)
        
        # Get all users who have sent messages
        user_ids = list(set(msg.userId for msg in messages))
        users = await db_service.get_users_by_ids(user_ids) if user_ids else []
        users_dict = {user.id: user for user in users}
        
        # Enrich messages with user data
        enriched_messages = []
        for msg in messages:
            user = users_dict.get(msg.userId)
            enriched_messages.append({
                "id": msg.id,
                "chatId": msg.chatId,
                "userId": msg.userId,
                "content": msg.content,
                "timestamp": msg.timestamp,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "avatar": user.avatar,
                    "mood": getattr(user, 'mood', 'happy')
                } if user else None
            })
        
        return {
            "chat": {
                "id": chat.id,
                "roomId": chat.roomId,
                "date": chat.date,
                "startTime": chat.startTime,
                "endTime": chat.endTime,
                "createdAt": chat.createdAt
            },
            "messages": enriched_messages
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/messages")
async def send_message(request: SendMessageRequest):
    """
    Send a message to a chat.
    """
    try:
        # Verify chat exists
        chat = await db_service.get_chat_by_id(request.chatId)
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        # Create message
        message = await db_service.create_message({
            "chatId": request.chatId,
            "userId": request.userId,
            "content": request.content,
            "timestamp": datetime.now().isoformat()
        })
        
        # Get user info for the message
        user = await db_service.get_user_by_id(request.userId)
        
        # Prepare message for broadcast
        message_data = {
            "id": message.id,
            "chatId": message.chatId,
            "userId": message.userId,
            "content": message.content,
            "timestamp": message.timestamp,
            "user": {
                "id": user.id,
                "name": user.name,
                "avatar": user.avatar,
                "mood": getattr(user, 'mood', 'happy')
            } if user else None
        }
        
        # Broadcast to all connected clients in this chat
        await manager.broadcast(message_data, request.chatId)
        
        return {"message": message_data}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/room/{room_id}")
async def get_chats_for_room(room_id: int):
    """
    Get all chats for a specific recreational room.
    """
    try:
        chats = await db_service.get_chats_by_room(room_id)
        return {"chats": chats}
    except Exception as e:
        print(f"Error getting chats for room: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users/{user_id}/chats")
async def get_user_chats(user_id: int):
    """
    Get all chats that a user has access to based on their recreational bookings.
    """
    try:
        # Get user's bookings
        bookings = await db_service.get_all_books()
        user_bookings = [b for b in bookings if b.id_user == user_id]
        
        # Get all rooms to identify recreational ones
        rooms = await db_service.get_all_rooms()
        recreational_room_ids = []
        for room in rooms:
            try:
                room_data = json.loads(room.data)
                if room_data.get('type') == 'recreational':
                    recreational_room_ids.append(room.id)
            except:
                continue
        
        # Filter to only recreational bookings
        recreational_bookings = [
            b for b in user_bookings 
            if b.id_room in recreational_room_ids
        ]
        
        # Get chats for these bookings
        user_chats = []
        for booking in recreational_bookings:
            chat = await db_service.get_chat_by_room_and_time(
                room_id=booking.id_room,
                date=booking.date,
                start_time=booking.start,
                end_time=booking.end
            )
            if chat:
                # Get message count
                messages = await db_service.get_chat_messages(chat.id)
                
                # Get room name
                room = next((r for r in rooms if r.id == booking.id_room), None)
                room_name = "Unknown"
                if room:
                    try:
                        room_data = json.loads(room.data)
                        room_name = room_data.get('name', f'Room {booking.id_room}')
                    except:
                        pass
                
                user_chats.append({
                    "id": chat.id,
                    "roomId": chat.roomId,
                    "roomName": room_name,
                    "date": chat.date,
                    "startTime": chat.startTime,
                    "endTime": chat.endTime,
                    "createdAt": chat.createdAt,
                    "messageCount": len(messages)
                })
        
        return {"chats": user_chats}
    except Exception as e:
        print(f"Error getting user chats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.websocket("/ws/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: int):
    """
    WebSocket endpoint for real-time chat updates.
    """
    await manager.connect(websocket, chat_id)
    try:
        while True:
            # Keep connection alive and wait for messages
            data = await websocket.receive_text()
            # Echo back to confirm receipt
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket, chat_id)
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket, chat_id)

