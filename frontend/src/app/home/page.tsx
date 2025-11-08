'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Stack,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTimeDate = (date: Date) => {
    const time = date.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return `${time}, ${dateStr}`;
  };

  const handleSearch = () => {
    router.push('/booking');
  };

  const handleFloorPlan = () => {
    router.push('/booking');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Left Section - User Status */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 4,
            bgcolor: '#ffffff',
            borderRadius: 2,
            minHeight: 300,
          }}
        >
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            {mounted ? formatTimeDate(currentTime) : 'Loading...'}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Hello Hugo
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', mb: 4, fontWeight: 400 }}>
            You are not working today.
          </Typography>
          <Link
            component="button"
            variant="body2"
            onClick={() => {}}
            sx={{
              color: '#2563eb',
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Change your status
          </Link>
        </Paper>

        {/* Right Section - Book a Personal Space */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 4,
            bgcolor: '#ffffff',
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Book a personal space
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              label="Location"
              defaultValue="6L Iuliu Maniu Blvd"
              fullWidth
              size="small"
              InputProps={{
                endAdornment: <ChevronRightIcon sx={{ fontSize: '18px', color: '#999', transform: 'rotate(90deg)' }} />,
              }}
            />
            <TextField
              label="Floor"
              defaultValue="4"
              fullWidth
              size="small"
              InputProps={{
                endAdornment: <ChevronRightIcon sx={{ fontSize: '18px', color: '#999', transform: 'rotate(90deg)' }} />,
              }}
            />
            <TextField
              label="Date"
              defaultValue={formatShortDate(currentTime)}
              fullWidth
              size="small"
              InputProps={{
                endAdornment: <CalendarTodayIcon sx={{ fontSize: '18px', color: '#999' }} />,
              }}
            />
            <TextField
              label="Group"
              defaultValue="Drop-Ins (Bucharest)"
              fullWidth
              size="small"
              InputProps={{
                endAdornment: <ChevronRightIcon sx={{ fontSize: '18px', color: '#999', transform: 'rotate(90deg)' }} />,
              }}
            />
            <TextField
              label="Workspace type"
              defaultValue="Desk"
              fullWidth
              size="small"
              sx={{ gridColumn: { xs: '1', sm: '2' } }}
              InputProps={{
                endAdornment: <ChevronRightIcon sx={{ fontSize: '18px', color: '#999', transform: 'rotate(90deg)' }} />,
              }}
            />
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                bgcolor: '#2563eb',
                color: '#fff',
                px: 3,
                py: 1,
                '&:hover': {
                  bgcolor: '#1e40af',
                },
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={handleFloorPlan}
              sx={{
                borderColor: '#2563eb',
                color: '#2563eb',
                px: 3,
                py: 1,
                '&:hover': {
                  borderColor: '#1e40af',
                  bgcolor: '#f0f4ff',
                },
              }}
            >
              Floor plan
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Bookings Status Section */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 4,
          bgcolor: '#f9fafb',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
        }}
      >
        <CalendarMonthIcon
          sx={{
            fontSize: 80,
            color: '#d1d5db',
            mb: 2,
          }}
        />
        <Typography variant="body1" sx={{ color: '#666' }}>
          You have no bookings today.
        </Typography>
      </Paper>
    </Box>
  );
}
