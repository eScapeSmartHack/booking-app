'use client';

import { useState, useEffect } from 'react';
import { Desk, DeskStatus } from '@/types/desk';
import FloorPlanMap from '@/components/FloorPlanMap';
import BookingModal from '@/components/BookingModal';
import AdminPanel from '@/components/AdminPanel';
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { generate216Desks } from '@/utils/generateDesks';

// Generate 216 desks distributed across the floor plan
const INITIAL_DESKS: Desk[] = generate216Desks();
// const INITIAL_DESKS: Desk[] = [];


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
  const [viewMode, setViewMode] = useState<'floor-plan' | 'list'>('floor-plan');

  useEffect(() => {
    const savedDesks = localStorage.getItem('desk-layout');
    if (savedDesks) {
      try {
        setDesks(JSON.parse(savedDesks));
      } catch (error) {
        console.error('Failed to load saved desks:', error);
        setDesks(INITIAL_DESKS);
      }
    } else {
      setDesks(INITIAL_DESKS);
    }
  }, []);

  useEffect(() => {
    if (desks.length > 0) {
      localStorage.setItem('desk-layout', JSON.stringify(desks));
    }
  }, [desks]);

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
      id: `desk-${Date.now()}`,
      position: { x, y },
    };

    setDesks(prev => [...prev, newDesk]);
    setPendingDeskToAdd(null);
  };

  const handleAddDesk = (deskData: Omit<Desk, 'id'>) => {
    setPendingDeskToAdd(deskData);
  };

  const handleDeleteDesk = (deskId: string) => {
    setDesks(prev => prev.filter(d => d.id !== deskId));
    setSelectedDesk(null);
  };

  const handleDeskMove = (deskId: string, x: number, y: number) => {
    setDesks(prev =>
      prev.map(desk =>
        desk.id === deskId
          ? { ...desk, position: { x, y } }
          : desk
      )
    );
  };

  const handleBookDesk = (deskId: string, date: string) => {
    setDesks(prev =>
      prev.map(desk =>
        desk.id === deskId
          ? {
              ...desk,
              status: 'booked' as DeskStatus,
              bookedBy: 'You',
              bookedDate: date,
            }
          : desk
      )
    );
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
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Left Sidebar */}
      <Box sx={{ width: 320, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider', p: 3, overflowY: 'auto' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Book a Desk
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose a personal space
          </Typography>
        </Box>

        {/* Date Selector */}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            inputProps={{ min: new Date().toISOString().split('T')[0] }}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>

        {/* Location Info */}
        <Paper elevation={0} sx={{ mb: 3, p: 2, bgcolor: 'primary.lighter', border: 1, borderColor: 'primary.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <LocationOnIcon color="primary" />
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Location
              </Typography>
              <Typography variant="body2" color="text.secondary">
                6L Iuliu Maniu Blvd
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Floor 4, Drop-Ins (Bucharest)
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Stats */}
        <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Card sx={{ bgcolor: 'success.lighter', border: 1, borderColor: 'success.light' }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="h4" fontWeight="bold" color="success.dark">
                {availableDesks}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Available
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: 'primary.lighter', border: 1, borderColor: 'primary.light' }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="h4" fontWeight="bold" color="primary.dark">
                {myBookings}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Your Bookings
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* View Toggle */}
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newValue) => newValue && setViewMode(newValue)}
            fullWidth
            size="small"
          >
            <ToggleButton value="floor-plan">
              <GridViewIcon sx={{ mr: 1 }} fontSize="small" />
              Floor Plan
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListIcon sx={{ mr: 1 }} fontSize="small" />
              List
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Filters */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Filters
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography variant="body2">Monitor</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography variant="body2">Standing Desk</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography variant="body2">Near Window</Typography>}
            />
          </Box>
        </Box>
      </Box>

      {/* Main Content - Floor Plan */}
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

      {/* Right Sidebar - Admin Panel */}
      <Box sx={{ width: 320 }}>
        <AdminPanel
          isAdminMode={isAdminMode}
          onToggleAdminMode={handleToggleAdminMode}
          onAddDesk={handleAddDesk}
          onDeleteDesk={handleDeleteDesk}
          onExportDesks={handleExportDesks}
          onImportDesks={handleImportDesks}
          selectedDesk={selectedDesk}
        />
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
            bottom: 16,
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
