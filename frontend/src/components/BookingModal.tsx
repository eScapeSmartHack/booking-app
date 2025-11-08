'use client';

import { Desk } from '@/types/desk';
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';

interface BookingModalProps {
  desk: Desk | null;
  onClose: () => void;
  onBook: (deskId: string, date: string) => void;
}

export default function BookingModal({ desk, onClose, onBook }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [userName, setUserName] = useState('');

  if (!desk) return null;

  const handleBook = () => {
    if (desk.status === 'available' && userName.trim()) {
      onBook(desk.id, selectedDate);
      onClose();
    }
  };

  return (
    <Dialog open={!!desk} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          {desk.name}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Desk Details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Floor:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {desk.floor}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Status:
              </Typography>
              <Chip
                label={desk.status.replace('-', ' ')}
                size="small"
                color={desk.status === 'available' ? 'success' : 'error'}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>

            {desk.attributes && desk.attributes.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Amenities:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {desk.attributes.map((attr, idx) => (
                    <Chip
                      key={idx}
                      label={attr}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {desk.bookedBy && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Booked by:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {desk.bookedBy}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Booking Form (only if available) */}
          {desk.status === 'available' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                fullWidth
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
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
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {desk.status === 'available' ? (
          <>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleBook}
              variant="contained"
              disabled={!userName.trim()}
            >
              Book Desk
            </Button>
          </>
        ) : (
          <Button onClick={onClose} variant="contained" color="inherit">
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
