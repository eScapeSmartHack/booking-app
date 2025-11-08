'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Link,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

interface Booking {
  id: string;
  workspace: string;
  type: string;
  from: string;
  to: string;
  location: string;
  group: string;
  bookedFor?: string;
}

export default function YourBookingsPage() {
  const router = useRouter();
  const [workspaceType, setWorkspaceType] = useState('Desk');

  // Sample data - in a real app, this would come from an API
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      workspace: '317-04',
      type: 'Desk',
      from: '10/11/2023 PM',
      to: '10/11/2023 PM',
      location: 'Woodward (IRC), Floor 3',
      group: 'Faculty of Medicine',
      bookedFor: '',
    },
  ]);

  const handleViewOnFloorPlan = (bookingId: string) => {
    router.push('/booking');
  };

  const handleEdit = (bookingId: string) => {
    // Handle edit action
    console.log('Edit booking:', bookingId);
  };

  const handleDelete = (bookingId: string) => {
    // Handle delete action
    console.log('Delete booking:', bookingId);
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#ffffff', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Your bookings
      </Typography>

      {/* Booked spaces section */}
      <Paper elevation={0} sx={{ mb: 4, p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Booked spaces
        </Typography>

        {/* Filter section */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Workspace type</InputLabel>
            <Select
              value={workspaceType}
              label="Workspace type"
              onChange={(e) => setWorkspaceType(e.target.value)}
            >
              <MenuItem value="Desk">Desk</MenuItem>
              <MenuItem value="Meeting Room">Meeting Room</MenuItem>
              <MenuItem value="Office">Office</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#2563eb',
              color: '#fff',
              px: 3,
              '&:hover': {
                bgcolor: '#1e40af',
              },
            }}
          >
            Apply
          </Button>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Workspace</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>From</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>To</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Group</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Booked For</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <TableRow key={booking.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                    <TableCell>{booking.workspace}</TableCell>
                    <TableCell>{booking.type}</TableCell>
                    <TableCell>{booking.from}</TableCell>
                    <TableCell>{booking.to}</TableCell>
                    <TableCell>{booking.location}</TableCell>
                    <TableCell>{booking.group}</TableCell>
                    <TableCell>{booking.bookedFor || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Link
                          component="button"
                          onClick={() => handleViewOnFloorPlan(booking.id)}
                          sx={{
                            color: '#2563eb',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          View on floor plan
                        </Link>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(booking.id)}
                          sx={{ color: '#666' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(booking.id)}
                          sx={{ color: '#ef4444' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#666' }}>
                    No bookings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Team days section */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Team days
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          You don't have any team days yet! Create one with Condeco mobile.
        </Typography>
      </Paper>
    </Box>
  );
}

