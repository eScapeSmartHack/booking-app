'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import { apiService } from '@/services/api';

interface UserBooking {
  user_id: number;
  user_name: string;
  avatar?: string;
  bookings: Array<{
    id: number;
    id_room: number;
    date: string;
    start: string;
    end: string;
  }>;
}

interface DayData {
  date: string;
  dateObj: Date;
  users: UserBooking[];
}

export default function BookingGridPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [daysData, setDaysData] = useState<DayData[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get all users
      const usersResponse = await apiService.getUsers();
      setAllUsers(usersResponse.users);

      // Get all rooms to map room IDs to names
      const roomsResponse = await apiService.getRooms();
      setRooms(roomsResponse.rooms);

      // Get next 7 days starting from today
      // Calculate today's date in YYYY-MM-DD format to match backend expectations
      const now = new Date();
      // Get date string in local timezone (YYYY-MM-DD)
      const todayStr = now.toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD format
      const todayDate = new Date(todayStr + 'T12:00:00'); // Use noon to avoid timezone issues
      const next7Days: DayData[] = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(todayDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        try {
          // Get bookings for this date (only for today and future dates)
          // The backend will reject past dates, so we handle that in the catch block
          const bookingsResponse = await apiService.getBookingsByDate(dateStr);
          
          // Ensure all users are included, even if they don't have bookings
          const usersMap = new Map();
          usersResponse.users.forEach((user: any) => {
            usersMap.set(user.id, {
              user_id: user.id,
              user_name: user.name,
              avatar: user.avatar,
              bookings: [],
            });
          });
          
          // Update with bookings data
          bookingsResponse.users.forEach((userBooking: UserBooking) => {
            if (usersMap.has(userBooking.user_id)) {
              const existingUser = usersMap.get(userBooking.user_id) as UserBooking;
              // Merge bookings into existing user data
              usersMap.set(userBooking.user_id, {
                ...existingUser,
                bookings: userBooking.bookings || [],
              });
            } else {
              usersMap.set(userBooking.user_id, userBooking);
            }
          });

          next7Days.push({
            date: dateStr,
            dateObj: date,
            users: Array.from(usersMap.values()),
          });
        } catch (error: any) {
          // If date is in the past or error, add all users with no bookings
          console.warn(`Failed to get bookings for ${dateStr}:`, error.message);
          next7Days.push({
            date: dateStr,
            dateObj: date,
            users: usersResponse.users.map((user: any) => ({
              user_id: user.id,
              user_name: user.name,
              avatar: user.avatar,
              bookings: [],
            })),
          });
        }
      }

      setDaysData(next7Days);
    } catch (error) {
      console.error('Failed to load booking grid data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoomName = (roomId: number): string => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return `Room ${roomId}`;
    
    try {
      const roomData = JSON.parse(room.data);
      return roomData.name || `Room ${roomId}`;
    } catch {
      return `Room ${roomId}`;
    }
  };

  const getUserLocationForDay = (user: UserBooking, dayDate: string): string | null => {
    // Find booking for this user on this day
    const booking = user.bookings.find(b => b.date === dayDate);
    if (booking) {
      // Check if the room is a desk (not meeting room or recreational)
      const room = rooms.find(r => r.id === booking.id_room);
      if (room) {
        try {
            const roomData = JSON.parse(room.data);
            // Only show desks, filter out meeting rooms and recreational spaces
            // Check for desk type explicitly, or if type is missing/undefined, assume it's a desk
            if (roomData.type === 'desk' || roomData.type === undefined || roomData.type === null || roomData.type === '') {
              return getRoomName(booking.id_room);
            }
          } catch (error) {
            // If parsing fails, assume it's a desk and show it
            console.warn(`Failed to parse room data for room ${booking.id_room}:`, error);
            return getRoomName(booking.id_room);
          }
      } else {
        // Room not found - this might indicate a data mismatch
        console.warn(`Room with id ${booking.id_room} not found in rooms array. Total rooms: ${rooms.length}`);
      }
    }
    return null;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = () => {
    if (!mounted) return 'Loading...';
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDateHeader = () => {
    if (!mounted) return 'Loading...';
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Filter users based on search query
  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get unique users from all days (users who have at least one booking in the next 7 days)
  const usersWithBookings = new Set<number>();
  daysData.forEach(day => {
    day.users.forEach(user => {
      if (user.bookings.length > 0) {
        usersWithBookings.add(user.user_id);
      }
    });
  });

  // Combine all users (those with bookings + all users from database)
  const allUsersToShow = Array.from(
    new Map([
      ...allUsers.map(u => [u.id, { id: u.id, name: u.name, avatar: u.avatar }]),
      ...daysData.flatMap(day => 
        day.users.map(u => [u.user_id, { id: u.user_id, name: u.user_name, avatar: u.avatar }])
      )
    ]).values()
  );

  const filteredUsersToShow = allUsersToShow.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, bgcolor: '#ffffff', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Team Bookings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Type to find a colleague"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f5f5f5',
              },
            }}
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Next 7 Days
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', position: 'sticky', left: 0, zIndex: 3, bgcolor: '#f5f5f5', minWidth: 140 }}>
                    User
                  </TableCell>
                  {daysData.map((day, index) => {
                    const isToday = day.dateObj.toDateString() === new Date().toDateString();
                    return (
                      <TableCell
                        key={day.date}
                        align="center"
                        sx={{
                          fontWeight: 'bold',
                          borderLeft: '1px solid #e0e0e0',
                          borderBottom: isToday ? '2px solid #2563eb' : '1px solid #e0e0e0',
                          minWidth: 120,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {formatDate(day.dateObj)}
                          </Typography>
                        </Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsersToShow.map((user) => {
                  // Get current user from localStorage to highlight them
                  const currentUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
                  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
                  const isCurrentUser = currentUser && user.id === currentUser.id;

                  return (
                    <TableRow 
                      key={user.id} 
                      sx={{ 
                        '&:hover': { bgcolor: '#f9fafb' },
                        bgcolor: isCurrentUser ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                      }}
                    >
                      <TableCell
                        sx={{
                          position: 'sticky',
                          left: 0,
                          zIndex: 2,
                          bgcolor: isCurrentUser ? 'rgba(37, 99, 235, 0.05)' : '#ffffff',
                          borderRight: '1px solid #e0e0e0',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: user.avatar ? 'transparent' : '#1e40af',
                              border: '2px solid #bfdbfe',
                              '& svg': {
                                width: '100%',
                                height: '100%',
                              },
                            }}
                          >
                            {user.avatar ? (
                              <Box
                                dangerouslySetInnerHTML={{ __html: user.avatar }}
                                sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              />
                            ) : (
                              <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                                {user.name
                                  .split(' ')
                                  .map(n => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </Typography>
                            )}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: isCurrentUser ? 600 : 500, color: isCurrentUser ? '#1e40af' : 'inherit' }}>
                            {isCurrentUser ? 'You' : user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      {daysData.map((day) => {
                        // Find user data for this day
                        const userDayData = day.users.find(u => u.user_id === user.id);
                        const location = userDayData ? getUserLocationForDay(userDayData, day.date) : null;

                        return (
                          <TableCell
                            key={`${user.id}-${day.date}`}
                            align="center"
                            sx={{ borderLeft: '1px solid #e0e0e0' }}
                          >
                            {location ? (
                              <Chip
                                icon={<BusinessIcon sx={{ color: '#fff !important' }} />}
                                label={location}
                                size="small"
                                sx={{
                                  bgcolor: '#2563eb',
                                  color: '#fff',
                                  '& .MuiChip-icon': { color: '#fff' },
                                }}
                              />
                            ) : (
                              <Chip
                                icon={<HomeIcon sx={{ color: '#666 !important' }} />}
                                label="Remote"
                                size="small"
                                sx={{
                                  bgcolor: '#e5e7eb',
                                  color: '#666',
                                  '& .MuiChip-icon': { color: '#666' },
                                }}
                              />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
