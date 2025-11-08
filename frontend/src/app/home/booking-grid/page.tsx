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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  schedule: {
    [key: string]: 'office' | 'remote' | 'not-working';
  };
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function BookingGridPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get the start of the week (Monday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentWeek);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const formatWeekRange = (start: Date, end: Date) => {
    const startDay = start.getDate();
    const startMonth = start.toLocaleDateString('en-GB', { month: 'long' });
    const endDay = end.getDate();
    const endMonth = end.toLocaleDateString('en-GB', { month: 'long' });
    return `${start.toLocaleDateString('en-GB', { weekday: 'long' })} ${startDay} ${startMonth} - ${end.toLocaleDateString('en-GB', { weekday: 'long' })} ${endDay} ${endMonth}`;
  };

  const getDateForDay = (dayIndex: number) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + dayIndex);
    return date;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  // Helper function to get schedule pattern (day of week: 0=Monday, 4=Friday)
  const getSchedulePattern = (memberId: string) => {
    const patterns: { [key: string]: { [day: number]: 'office' | 'remote' } } = {
      '1': { 0: 'office', 1: 'office', 2: 'remote', 3: 'office', 4: 'remote' }, // Andrei Grosoiu
      '2': { 0: 'office', 1: 'remote', 2: 'remote', 3: 'remote', 4: 'remote' }, // Daniel Pana
      '3': { 0: 'office', 1: 'remote', 2: 'remote', 3: 'office', 4: 'remote' }, // Hugo Toth
      '4': { 0: 'office', 1: 'remote', 2: 'remote', 3: 'office', 4: 'remote' }, // Mihai-Victor Alexe
      '5': { 0: 'remote', 1: 'office', 2: 'remote', 3: 'remote', 4: 'remote' }, // Razvan Iacob
      '6': { 0: 'remote', 1: 'office', 2: 'remote', 3: 'remote', 4: 'remote' }, // Stefan Mocanu
    };
    return patterns[memberId] || {};
  };

  // Sample team data
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Andrei Grosoiu',
      initials: 'AG',
      avatarColor: '#3b82f6',
      schedule: {},
    },
    {
      id: '2',
      name: 'Daniel Pana',
      initials: 'DP',
      avatarColor: '#10b981',
      schedule: {},
    },
    {
      id: '3',
      name: 'Hugo Toth',
      initials: 'HT',
      avatarColor: '#f59e0b',
      schedule: {},
    },
    {
      id: '4',
      name: 'Mihai-Victor Alexe',
      initials: 'MA',
      avatarColor: '#8b5cf6',
      schedule: {},
    },
    {
      id: '5',
      name: 'Razvan Iacob',
      initials: 'RI',
      avatarColor: '#ef4444',
      schedule: {},
    },
    {
      id: '6',
      name: 'Stefan Mocanu',
      initials: 'SM',
      avatarColor: '#06b6d4',
      schedule: {},
    },
  ]);

  // User's schedule pattern
  const userSchedulePattern = { 0: 'office', 1: 'office', 2: 'remote', 3: 'office', 4: 'remote' };

  const getStatusForDay = (member: TeamMember | null, dayIndex: number) => {
    const date = getDateForDay(dayIndex);
    const dayOfWeek = date.getDay();
    
    // Weekend (Saturday = 6, Sunday = 0)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'not-working';
    }
    
    // Convert Sunday=0, Monday=1... to Monday=0, Tuesday=1...
    const weekdayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    if (member) {
      const pattern = getSchedulePattern(member.id);
      return pattern[weekdayIndex] || 'not-working';
    } else {
      return userSchedulePattern[weekdayIndex] || 'not-working';
    }
  };

  const getOfficeCountForDay = (dayIndex: number) => {
    const date = getDateForDay(dayIndex);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 0;
    }
    
    // Convert Sunday=0, Monday=1... to Monday=0, Tuesday=1...
    const weekdayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    let count = 0;
    if (userSchedulePattern[weekdayIndex] === 'office') count++;
    teamMembers.forEach(member => {
      const pattern = getSchedulePattern(member.id);
      if (pattern[weekdayIndex] === 'office') count++;
    });
    return count;
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = () => {
    if (!mounted) return 'Loading...';
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = () => {
    if (!mounted) return 'Loading...';
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#ffffff', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Hello Sebastian Daniel
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
          <Button
            variant="contained"
            sx={{
              bgcolor: '#1e40af',
              color: '#fff',
              px: 3,
              '&:hover': {
                bgcolor: '#1e3a8a',
              },
            }}
          >
            Create team day
          </Button>
          <Typography variant="body2" sx={{ color: '#666', whiteSpace: 'nowrap' }}>
            {formatTime()} {formatDate()}
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Find your team
        </Typography>

        {/* Week Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton onClick={() => navigateWeek('prev')} size="small">
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="body1" sx={{ minWidth: 300, textAlign: 'center' }}>
            {formatWeekRange(weekStart, weekEnd)}
          </Typography>
          <IconButton onClick={() => navigateWeek('next')} size="small">
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Grid Table */}
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '200px repeat(7, 1fr)', gap: 1, minWidth: 1000 }}>
            {/* Header Row */}
            <Box sx={{ p: 2, fontWeight: 'bold', color: '#666' }}></Box>
            {DAYS.map((day, index) => {
              const date = getDateForDay(index);
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <Box
                  key={day}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#666',
                    borderBottom: isToday ? '2px solid #2563eb' : 'none',
                  }}
                >
                  {day}
                </Box>
              );
            })}

            {/* User Row */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#2563eb', width: 40, height: 40 }}>
                SS
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                You
              </Typography>
            </Box>
            {DAYS.map((_, index) => {
              const status = getStatusForDay(null, index);
              return (
                <Box key={`user-${index}`} sx={{ p: 1 }}>
                  {status === 'office' && (
                    <Chip
                      icon={<BusinessIcon sx={{ color: '#fff !important' }} />}
                      label="6L Iuliu Maniu Blvd"
                      size="small"
                      sx={{
                        bgcolor: '#2563eb',
                        color: '#fff',
                        width: '100%',
                        '& .MuiChip-icon': { color: '#fff' },
                      }}
                    />
                  )}
                  {status === 'remote' && (
                    <Chip
                      icon={<HomeIcon sx={{ color: '#666 !important' }} />}
                      label="Remote"
                      size="small"
                      sx={{
                        bgcolor: '#e5e7eb',
                        color: '#666',
                        width: '100%',
                        '& .MuiChip-icon': { color: '#666' },
                      }}
                    />
                  )}
                  {status === 'not-working' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Chip
                        icon={<ArrowForwardIcon sx={{ color: '#666 !important' }} />}
                        label="Not working"
                        size="small"
                        sx={{
                          bgcolor: '#e5e7eb',
                          color: '#666',
                          flex: 1,
                          '& .MuiChip-icon': { color: '#666' },
                        }}
                      />
                      <IconButton size="small" sx={{ color: '#666' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              );
            })}

            {/* Team Summary Row */}
            <Box sx={{ p: 2, fontWeight: 500, color: '#666' }}>
              Your team members
            </Box>
            {DAYS.map((_, index) => {
              const count = getOfficeCountForDay(index);
              return (
                <Box key={`summary-${index}`} sx={{ p: 2, textAlign: 'center', color: '#666' }}>
                  {count > 0 ? `${count} at 6L Iuliu Maniu Blvd` : `0 at 6L Iuliu Maniu Blvd`}
                </Box>
              );
            })}

            {/* Team Member Rows */}
            {filteredMembers.map((member) => (
              <Box key={member.id}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: member.avatarColor, width: 40, height: 40 }}>
                    {member.initials}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {member.name}
                  </Typography>
                </Box>
                {DAYS.map((_, index) => {
                  const status = getStatusForDay(member, index);
                  return (
                    <Box key={`${member.id}-${index}`} sx={{ p: 1 }}>
                      {status === 'office' && (
                        <Chip
                          icon={<BusinessIcon sx={{ color: '#fff !important' }} />}
                          label="6L Iuliu Maniu Blvd"
                          size="small"
                          sx={{
                            bgcolor: '#2563eb',
                            color: '#fff',
                            width: '100%',
                            '& .MuiChip-icon': { color: '#fff' },
                          }}
                        />
                      )}
                      {status === 'remote' && (
                        <Chip
                          icon={<HomeIcon sx={{ color: '#666 !important' }} />}
                          label="Remote"
                          size="small"
                          sx={{
                            bgcolor: '#e5e7eb',
                            color: '#666',
                            width: '100%',
                            '& .MuiChip-icon': { color: '#666' },
                          }}
                        />
                      )}
                      {status === 'not-working' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Chip
                            icon={<ArrowForwardIcon sx={{ color: '#666 !important' }} />}
                            label="Not working"
                            size="small"
                            sx={{
                              bgcolor: '#e5e7eb',
                              color: '#666',
                              flex: 1,
                              '& .MuiChip-icon': { color: '#666' },
                            }}
                          />
                          <IconButton size="small" sx={{ color: '#666' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

