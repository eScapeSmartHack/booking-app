# Recreational Space Chat Feature Guide

## 🎯 Overview

The booking application now includes a real-time chat feature for users who book recreational spaces! This allows colleagues to communicate and coordinate when using recreational areas like the Pool, Wellbeing room, or Special Events Area.

## ✨ Features

### 1. **Real-time Messaging**
- Instant message delivery using WebSocket connections
- Live updates when other users send messages
- No page refresh needed

### 2. **Automatic Chat Rooms**
- Chat rooms are automatically created for each recreational space booking
- Users who book the same space at the same time share a chat room
- Chat persists throughout the booking period

### 3. **User Identification**
- Messages display the sender's name and avatar
- Current user's messages appear on the right (blue)
- Other users' messages appear on the left (gray)

### 4. **Notifications**
- Badge indicator showing number of active chats
- "NEW" label for chats with unread messages
- Easy access from main navigation

## 🚀 How to Use

### For End Users

#### **Step 1: Book a Recreational Space**
1. Navigate to the booking page
2. Filter to show only recreational spaces (Pool, Wellbeing, Special Events)
3. Click on a recreational space marker
4. Select date, time slot, and duration
5. Add participants (optional, comma-separated names)
6. Click "Book Space"

#### **Step 2: Access the Chat**
There are two ways to access your recreational chat:

**Option A: From the Booking Modal**
1. Click on a recreational space you've already booked
2. You'll see an "Open Chat" button at the bottom
3. Click to open the chat window

**Option B: From the Notifications Icon** (if integrated)
1. Look for the chat/bell icon in your navigation
2. Click to see all your active chats
3. Select the chat you want to join
4. Badge shows number of chats with new messages

#### **Step 3: Send Messages**
1. Type your message in the text field at the bottom
2. Press Enter or click the Send button
3. Your message appears instantly for all users in that booking

#### **Step 4: Real-time Communication**
- Messages from other users appear automatically
- Scroll to view message history
- See timestamps for each message
- User avatars help identify who sent what

## 🏗️ Technical Implementation

### Backend Components

#### **1. Database Schema** (`backend/prisma/schema.prisma`)
```prisma
model RecreationalChat {
  id          Int       @id @default(autoincrement())
  roomId      Int       // The recreational space ID
  date        String    // Date of the booking (YYYY-MM-DD)
  startTime   String    // Start time
  endTime     String    // End time
  createdAt   String    // ISO timestamp
  messages    Message[]
}

model Message {
  id        Int              @id @default(autoincrement())
  chatId    Int
  userId    Int
  content   String
  timestamp String           // ISO timestamp
  chat      RecreationalChat @relation(fields: [chatId], references: [id], onDelete: Cascade)
}
```

#### **2. API Endpoints** (`backend/app/api/routes/chats.py`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/chats` | POST | Create or get a chat for a booking |
| `/api/v1/chats/{chat_id}` | GET | Get chat details and messages |
| `/api/v1/chats/messages` | POST | Send a message to a chat |
| `/api/v1/chats/room/{room_id}` | GET | Get all chats for a room |
| `/api/v1/chats/users/{user_id}/chats` | GET | Get all user's chats |
| `/api/v1/chats/ws/chat/{chat_id}` | WS | WebSocket connection for real-time updates |

#### **3. Database Service** (`backend/app/services/database_service.py`)
New methods added:
- `create_chat()` - Create a new chat
- `get_chat_by_id()` - Get chat by ID
- `get_chat_by_room_and_time()` - Find chat for specific booking
- `get_chats_by_room()` - Get all chats for a room
- `create_message()` - Create a new message
- `get_chat_messages()` - Get all messages for a chat

### Frontend Components

#### **1. RecreationalChat Component** (`frontend/src/components/RecreationalChat.tsx`)
Main chat interface with:
- Message list with scrolling
- Real-time WebSocket updates
- Message input field
- User avatars and timestamps
- Auto-scroll to latest message

#### **2. ChatNotifications Component** (`frontend/src/components/ChatNotifications.tsx`)
Notification system featuring:
- Badge with unread count
- Dropdown menu with all active chats
- "NEW" indicator for recent chats
- Direct navigation to specific chats

#### **3. BookingModal Updates** (`frontend/src/components/BookingModal.tsx`)
Enhanced with:
- "Open Chat" button for recreational spaces
- Conditional display based on booking status
- Integration with RecreationalChat component

#### **4. API Service Updates** (`frontend/src/services/api.ts`)
New methods:
- `createOrGetChat()` - Create/retrieve chat
- `getChat()` - Get chat details
- `sendMessage()` - Send a message
- `getUserChats()` - Get user's chats

## 📋 Setup Instructions

### Database Migration

After updating the schema, you need to migrate the database:

```bash
cd backend
source venv/bin/activate
prisma migrate dev --name add_chat_models
```

This will:
1. Create the `RecreationalChat` and `Message` tables
2. Update the Prisma client
3. Apply the changes to your database

### Backend Setup

The backend is already configured with:
- FastAPI routes mounted at `/api/v1/chats`
- WebSocket support for real-time messaging
- CORS enabled for frontend communication

No additional configuration needed!

### Frontend Integration

To add the chat notifications to your navigation:

```tsx
import ChatNotifications from '@/components/ChatNotifications';

// In your navbar or header component:
<ChatNotifications 
  userId={currentUser.id} 
  onChatClick={(chat) => {
    // Navigate to booking page or open chat
  }}
/>
```

## 🎨 UI/UX Features

### Chat Interface
- **Modern Design**: Clean Material-UI components
- **User-Friendly**: Intuitive message layout
- **Responsive**: Works on desktop and mobile
- **Accessible**: Proper ARIA labels and keyboard navigation

### Message Display
- **Color Coding**: Blue for your messages, gray for others
- **Avatars**: Visual identification of participants
- **Timestamps**: Track when messages were sent
- **Auto-scroll**: Always see the latest messages

### Notifications
- **Badge Count**: See at a glance how many active chats
- **NEW Indicator**: Identify chats with recent activity
- **Quick Access**: Jump directly to any chat

## 🔒 Security Considerations

1. **User Authentication**: Messages tied to authenticated user IDs
2. **Access Control**: Only users with bookings can access chats
3. **Data Validation**: All inputs validated on backend
4. **WebSocket Security**: Connection verified before accepting

## 🧪 Testing the Feature

### Test Scenario 1: Basic Chat Flow
1. User A books Pool from 10:00-11:00
2. User B books Pool from 10:00-11:00
3. Both users can access the same chat
4. Messages sent by either user appear for both

### Test Scenario 2: Multiple Chats
1. User A books Pool at 10:00 and Wellbeing at 14:00
2. Notification shows "2 active chats"
3. User can switch between chats
4. Each chat maintains separate messages

### Test Scenario 3: Real-time Updates
1. User A opens chat
2. User B opens same chat
3. User A sends a message
4. User B sees message appear instantly (no refresh needed)

## 🐛 Troubleshooting

### Chat Not Appearing
- Ensure the space type is "recreational"
- Verify booking exists and is approved/active
- Check browser console for errors

### Messages Not Sending
- Verify backend is running
- Check network tab for failed requests
- Ensure WebSocket connection is established

### WebSocket Connection Issues
- Check if port 8000 is accessible
- Verify CORS settings allow WebSocket
- Look for firewall blocking WebSocket connections

## 📚 API Examples

### Create/Get Chat
```typescript
const response = await fetch('http://localhost:8000/api/v1/chats', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    roomId: 229,
    date: '2025-11-15',
    startTime: '10:00',
    endTime: '11:00'
  })
});
const { chat, messages } = await response.json();
```

### Send Message
```typescript
const response = await fetch('http://localhost:8000/api/v1/chats/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chatId: 1,
    userId: 42,
    content: 'See you at the pool!'
  })
});
```

### WebSocket Connection
```typescript
const ws = new WebSocket('ws://localhost:8000/api/v1/chats/ws/chat/1');
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('New message:', message);
};
```

## 🎯 Future Enhancements

Potential improvements:
- [ ] Push notifications for new messages
- [ ] File/image sharing in chat
- [ ] Message reactions (emoji)
- [ ] Read receipts
- [ ] Message search/filtering
- [ ] Chat history export
- [ ] @mentions for specific users
- [ ] Group chat management tools

## 📞 Support

If you encounter issues or have suggestions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Verify all setup steps were completed
4. Check backend logs for server-side errors

---

**Happy Chatting! 💬**

