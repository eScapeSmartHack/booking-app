'use client';

import { useState, useEffect } from 'react';
import { Desk, DeskStatus } from '@/types/desk';
import FloorPlanMap from '@/components/FloorPlanMap';
import BookingModal from '@/components/BookingModal';
import AdminPanel from '@/components/AdminPanel';
import {
  Box,
  Typography,
  TextField,
  Alert,
  Chip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import FilterListIcon from '@mui/icons-material/FilterList';
import { apiService } from '@/services/api';


export default function BookingPage() {
  const [desks, setDesks] = useState<Desk[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [selectedDeskForModal, setSelectedDeskForModal] = useState<Desk | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [pendingDeskToAdd, setPendingDeskToAdd] = useState<Omit<Desk, 'id' | 'position'> | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [filters, setFilters] = useState({
    monitor: false,
    standing: false,
    window: false,
  });

  // Keyboard shortcut for admin mode (Ctrl+Shift+M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        setIsAdminMode(prev => !prev);
        setSelectedDesk(null);
        setPendingDeskToAdd(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load desks and bookings from backend API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch rooms and bookings from backend API
        const [roomsResponse, bookingsResponse] = await Promise.all([
          apiService.getRooms(),
          apiService.getBookings(),
        ]);

        // Transform backend data to frontend Desk format, filtering by selected date
        const desks = await apiService.transformRoomsToDesks(
          roomsResponse.rooms,
          bookingsResponse.bookings,
          selectedDate // Filter bookings by selected date
        );

        setDesks(desks);
      } catch (error) {
        console.error('Failed to load desks from API:', error);
        // Fallback: try localStorage for migration
        const savedDesks = localStorage.getItem('desk-layout');
        if (savedDesks) {
          try {
            const parsed: Desk[] = JSON.parse(savedDesks);
            setDesks(parsed);
          } catch (e) {
            console.error('Failed to load from localStorage:', e);
          }
        }
      }
    };

    loadData();
  }, [selectedDate]); // Reload when selectedDate changes

  const handleDeskClick = (desk: Desk) => {
    if (isAdminMode) {
      setSelectedDesk(desk);
    } else {
      setSelectedDeskForModal(desk);
    }
  };

  const handleMapClick = (x: number, y: number) => {
    if (!isAdminMode || !pendingDeskToAdd) return;

    const newDesk: Desk = {
      ...pendingDeskToAdd,
      id: Date.now(),
      position: { x, y },
    };

    setDesks(prev => [...prev, newDesk]);
    setPendingDeskToAdd(null);
  };

  const handleAddDesk = (deskData: Omit<Desk, 'id'>) => {
    setPendingDeskToAdd(deskData);
  };

  const handleDeleteDesk = (deskId: number) => {
    setDesks(prev => prev.filter(d => d.id !== deskId));
    setSelectedDesk(null);
  };

  const handleDeskMove = (deskId: number, x: number, y: number) => {
    setDesks(prev =>
      prev.map(desk =>
        desk.id === deskId
          ? { ...desk, position: { x, y } }
          : desk
      )
    );
  };

  const handleBookDesk = async (deskId: number, date: string, startTime?: string, endTime?: string, duration?: number, userName?: string, participants?: string[]) => {
    try {
      const finalStartTime = startTime || '09:00';
      const finalEndTime = endTime || '18:00';
      const finalUserName = userName || 'You';

      // Transform and create booking via backend API
      const bookingData = await apiService.transformBookingToBackend(
        deskId,
        date,
        finalStartTime,
        finalEndTime,
        finalUserName
      );

      await apiService.createBooking(bookingData);

      // Reload data from backend to get updated bookings
      const [roomsResponse, bookingsResponse] = await Promise.all([
        apiService.getRooms(),
        apiService.getBookings(),
      ]);

      const updatedDesks = await apiService.transformRoomsToDesks(
        roomsResponse.rooms,
        bookingsResponse.bookings,
        selectedDate // Filter bookings by selected date
      );

      setDesks(updatedDesks);
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      // Show error to user with more details
      let errorMessage = 'Failed to create booking. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
      }
      alert(errorMessage);
      throw error; // Re-throw to prevent modal from closing on error
    }
  };

  const handleExportDesks = () => {
    const dataStr = JSON.stringify(desks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'desk-layout.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDesks = (importedDesks: Desk[]) => {
    setDesks(importedDesks);
  };

  const handleToggleAdminMode = () => {
    setIsAdminMode(prev => !prev);
    setSelectedDesk(null);
    setPendingDeskToAdd(null);
  };

  const availableDesks = desks.filter(d => d.status === 'available').length;
  const myBookings = desks.filter(d => d.status === 'booked' && d.bookedBy === 'You').length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#fafafa' }}>
      {/* Horizontal Top Bar - Book a Desk */}
      <Box sx={{ 
        width: '100%', 
        bgcolor: 'white', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 2.5, md: 3 },
      }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h4" 
            fontWeight="700" 
            sx={{ 
              letterSpacing: '-0.03em',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              color: '#1a1a1a'
            }}
          >
            Floorplan
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#6b7280',
              fontSize: '0.875rem',
              mt: 0.5
            }}
          >
            Choose your personal workspace for the day
          </Typography>
        </Box>

        {/* Main Controls - Cleaner Grid Layout */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr',
            sm: 'auto 1fr auto',
            md: 'auto 1fr auto auto'
          },
          gap: 2,
          alignItems: 'center',
          mb: 2.5
        }}>
          {/* Date Selector */}
          <TextField
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            inputProps={{ min: new Date().toISOString().split('T')[0] }}
            size="small"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <EventIcon sx={{ mr: 0.5, color: '#9ca3af', fontSize: 18 }} />,
            }}
            sx={{ 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3b82f6',
                  }
                }
              }
            }}
          />

          {/* Location Info - Compact */}
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              bgcolor: '#eff6ff',
              borderRadius: 2,
              border: '1px solid #bfdbfe',
            }}
          >
            <LocationOnIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
            <Box>
              <Typography variant="body2" fontWeight="600" sx={{ color: '#1e40af', fontSize: '0.813rem' }}>
                6L Iuliu Maniu Blvd, Floor 4
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                Drop-Ins, Bucharest
              </Typography>
            </Box>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2.5,
              py: 1.5,
              bgcolor: '#eff6ff',
              borderRadius: 2,
              border: '1px solid #bfdbfe',
            }}
          >
            <Typography variant="h5" fontWeight="700" sx={{ color: '#1e40af', fontSize: '1.875rem' }}>
              {myBookings}
            </Typography>
            <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.688rem' }}>
              Your<br/>Bookings
            </Typography>
          </Box>
        </Box>

        {/* Filters Row - Clean Design */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#6b7280' }}>
            <FilterListIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.688rem' }}>
              Filters
            </Typography>
          </Box>
          <Chip
            label="Monitor"
            size="small"
            onClick={() => setFilters(prev => ({ ...prev, monitor: !prev.monitor }))}
            sx={{ 
              fontWeight: 600,
              fontSize: '0.75rem',
              bgcolor: filters.monitor ? '#3b82f6' : 'white',
              color: filters.monitor ? 'white' : '#4b5563',
              border: '1px solid',
              borderColor: filters.monitor ? '#3b82f6' : '#e5e7eb',
              '&:hover': {
                bgcolor: filters.monitor ? '#2563eb' : '#f9fafb',
              }
            }}
          />
          <Chip
            label="Standing Desk"
            size="small"
            onClick={() => setFilters(prev => ({ ...prev, standing: !prev.standing }))}
            sx={{ 
              fontWeight: 600,
              fontSize: '0.75rem',
              bgcolor: filters.standing ? '#3b82f6' : 'white',
              color: filters.standing ? 'white' : '#4b5563',
              border: '1px solid',
              borderColor: filters.standing ? '#3b82f6' : '#e5e7eb',
              '&:hover': {
                bgcolor: filters.standing ? '#2563eb' : '#f9fafb',
              }
            }}
          />
          <Chip
            label="Near Window"
            size="small"
            onClick={() => setFilters(prev => ({ ...prev, window: !prev.window }))}
            sx={{ 
              fontWeight: 600,
              fontSize: '0.75rem',
              bgcolor: filters.window ? '#3b82f6' : 'white',
              color: filters.window ? 'white' : '#4b5563',
              border: '1px solid',
              borderColor: filters.window ? '#3b82f6' : '#e5e7eb',
              '&:hover': {
                bgcolor: filters.window ? '#2563eb' : '#f9fafb',
              }
            }}
          />
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Floor Plan */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <FloorPlanMap
            desks={desks}
            onDeskClick={handleDeskClick}
            onMapClick={handleMapClick}
            isAdminMode={isAdminMode}
            onDeskMove={handleDeskMove}
            floorPlanImage="/MC_Etaj 4_Plan Compartimentare_11.09.2025-1.png"
          />
        </Box>

        {/* Right Sidebar - Admin Panel (only visible in admin mode) */}
        {isAdminMode && (
          <Box sx={{ 
            width: { xs: '100%', md: 320 },
            borderLeft: 1,
            borderColor: 'divider',
            overflowY: 'auto'
          }}>
            <AdminPanel
              isAdminMode={isAdminMode}
              onToggleAdminMode={handleToggleAdminMode}
              onAddDesk={handleAddDesk}
              onDeleteDesk={handleDeleteDesk}
              onExportDesks={handleExportDesks}
              onImportDesks={handleImportDesks}
              selectedDesk={selectedDesk}
              hideToggleButton={true}
            />
          </Box>
        )}
      </Box>

      {/* Booking Modal */}
      {selectedDeskForModal && (
        <BookingModal
          desk={selectedDeskForModal}
          onClose={() => setSelectedDeskForModal(null)}
          onBook={handleBookDesk}
        />
      )}

      {/* Pending Desk Indicator */}
      {pendingDeskToAdd && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
          }}
        >
          <Alert severity="warning" icon={<LocationOnIcon />} sx={{ fontWeight: 600 }}>
            📍 Click on the map to place: {pendingDeskToAdd.name}
          </Alert>
        </Box>
      )}
    </Box>
  );
}
