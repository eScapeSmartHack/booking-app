'use client';

import Link from 'next/link';
import { Box, Container, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ApiIcon from '@mui/icons-material/Api';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import FaceIcon from '@mui/icons-material/Face';
import HomeIcon from '@mui/icons-material/Home';

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Welcome to Booking App
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your desk booking application is ready to go!
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ApiIcon color="primary" fontSize="large" />
                <Typography variant="h5" fontWeight="semibold">
                  Backend (FastAPI)
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                API running on http://localhost:8000
              </Typography>
              <Button
                variant="outlined"
                href="http://localhost:8000/docs"
                target="_blank"
                endIcon={<ArrowForwardIcon />}
              >
                View API Documentation
              </Button>
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EventSeatIcon color="primary" fontSize="large" />
                <Typography variant="h5" fontWeight="semibold">
                  Desk Booking
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                Book your workspace for the day
              </Typography>
              <Button
                variant="contained"
                component={Link}
                href="/booking"
                endIcon={<ArrowForwardIcon />}
                size="large"
              >
                Go to Booking
              </Button>
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ height: '100%', bgcolor: 'primary.lighter', border: 1, borderColor: 'primary.light' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FaceIcon color="primary" fontSize="large" />
                <Typography variant="h5" fontWeight="semibold">
                  Avatar Builder
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                Create your custom avatar
              </Typography>
              <Button
                variant="contained"
                component={Link}
                href="/avatar-builder"
                endIcon={<ArrowForwardIcon />}
                size="large"
              >
                Create Avatar
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Card elevation={3} sx={{ maxWidth: 400, mx: 'auto' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, justifyContent: 'center' }}>
                <HomeIcon color="primary" fontSize="large" />
                <Typography variant="h5" fontWeight="semibold">
                  User Home
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                Access your personalized dashboard
              </Typography>
              <Button
                variant="contained"
                component={Link}
                href="/home"
                endIcon={<ArrowForwardIcon />}
                size="large"
                fullWidth
              >
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
