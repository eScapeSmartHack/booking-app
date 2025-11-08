'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';

const DRAWER_WIDTH = 290;

interface SideNavbarProps {
  children: React.ReactNode;
}

export default function SideNavbar({ children }: SideNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [personalSpacesOpen, setPersonalSpacesOpen] = useState(
    pathname?.includes('/home/bookings') || 
    pathname === '/home' || 
    pathname === '/booking' ||
    pathname?.includes('/home/booking-grid')
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Update personal spaces open state based on pathname
    setPersonalSpacesOpen(
      pathname?.includes('/home/bookings') || 
      pathname === '/home' || 
      pathname === '/booking' ||
      pathname?.includes('/home/booking-grid')
    );
  }, [pathname]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const personalSpacesSubmenu = [
    { id: 'Your bookings', label: 'Your bookings', path: '/home/bookings', icon: <ViewListIcon /> },
    { id: 'Upcoming Bookings', label: 'Upcoming Bookings', path: '/home', icon: <CalendarTodayIcon /> },
    { id: 'Floorplan', label: 'Floorplan', path: '/booking', icon: <MapIcon /> },
    { id: 'Booking grid', label: 'Booking grid', path: '/home/booking-grid', icon: <ViewListIcon /> },
  ];

  const isSubItemSelected = (subItemPath: string) => {
    return pathname === subItemPath;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FFFFFF' }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#FFFFFF',
          color: '#1e40af',
          boxShadow: '0 1px 3px rgba(30, 64, 175, 0.08)',
          borderBottom: '1px solid rgba(30, 64, 175, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ 
                color: '#1e40af',
                '&:hover': {
                  bgcolor: 'rgba(191, 219, 254, 0.08)',
                  color: '#bfdbfe',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: '#1e40af',
                letterSpacing: '-0.01em',
                fontSize: '1.5rem',
              }}
            >
              place.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              size="small" 
              sx={{ 
                color: '#1e40af',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(191, 219, 254, 0.08)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#1e40af', border: '2px solid #bfdbfe' }}>
                <PersonIcon fontSize="small" sx={{ color: '#FFFFFF' }} />
              </Avatar>
            </IconButton>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontSize: '13px', color: '#1e40af', fontWeight: 500 }}>
                {mounted ? formatTime(currentTime) : '--:--'}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '11px', color: 'rgba(30, 64, 175, 0.6)' }}>
                {mounted ? formatDate(currentTime) : 'Loading...'}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#FFFFFF',
            borderRight: '1px solid rgba(30, 64, 175, 0.1)',
            mt: '64px',
            boxShadow: '2px 0 8px rgba(30, 64, 175, 0.04)',
          },
        }}
      >
        <List sx={{ pt: 3 }}>
          {/* Personal Spaces Main Item */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setPersonalSpacesOpen(!personalSpacesOpen)}
              sx={{
                py: 1.5,
                px: 3,
                mb: 1,
                mx: 2,
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(191, 219, 254, 0.06)',
                  '& .MuiListItemIcon-root': {
                    color: '#1e40af',
                  },
                  '& .MuiTypography-root': {
                    color: '#1e40af',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: personalSpacesOpen ? '#1e40af' : 'rgba(0, 0, 0, 0.6)',
                  transition: 'color 0.2s ease',
                }}
              >
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="Personal spaces"
                primaryTypographyProps={{
                  fontSize: '15px',
                  fontWeight: personalSpacesOpen ? 600 : 500,
                  color: personalSpacesOpen ? '#1e40af' : '#000000',
                }}
              />
              <ExpandMoreIcon
                sx={{
                  fontSize: '20px',
                  color: personalSpacesOpen ? '#1e40af' : 'rgba(0, 0, 0, 0.6)',
                  transform: personalSpacesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'all 0.2s ease',
                }}
              />
            </ListItemButton>
          </ListItem>

          {/* Personal Spaces Submenu */}
          {personalSpacesOpen && (
            <List sx={{ pl: 1, pr: 2 }}>
              {personalSpacesSubmenu.map((subItem) => (
                <ListItem key={subItem.id} disablePadding>
                  <ListItemButton
                    selected={isSubItemSelected(subItem.path)}
                    onClick={() => {
                      router.push(subItem.path);
                    }}
                    sx={{
                      py: 1.25,
                      px: 3,
                      ml: 3,
                      mr: 2,
                      borderRadius: '8px',
                      mb: 0.5,
                      transition: 'all 0.2s ease',
                      '&.Mui-selected': {
                        bgcolor: '#eff6ff',
                        borderLeft: '3px solid #1e40af',
                        '&:hover': {
                          bgcolor: '#eff6ff',
                          transform: 'translateX(2px)',
                        },
                        '& .MuiListItemIcon-root': {
                          color: '#1e40af',
                        },
                        '& .MuiTypography-root': {
                          color: '#1e40af',
                          fontWeight: 600,
                        },
                      },
                      '&:hover': {
                        bgcolor: 'rgba(191, 219, 254, 0.08)',
                        transform: 'translateX(4px)',
                        '& .MuiListItemIcon-root': {
                          color: '#1e40af',
                        },
                        '& .MuiTypography-root': {
                          color: '#1e40af',
                          fontWeight: 500,
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: isSubItemSelected(subItem.path) ? '#1e40af' : 'rgba(0, 0, 0, 0.6)',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={subItem.label}
                      primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: isSubItemSelected(subItem.path) ? 600 : 400,
                        color: isSubItemSelected(subItem.path) ? '#1e40af' : '#000000',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '64px',
          transition: 'margin-left 0.3s ease',
          bgcolor: '#FFFFFF',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

