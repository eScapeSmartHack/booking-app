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
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccessibleIcon from '@mui/icons-material/Accessible';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DRAWER_WIDTH = 280;

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [personalSpacesOpen, setPersonalSpacesOpen] = useState(
    pathname?.includes('/home/bookings') || pathname === '/home'
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

  const navItems = [
    { id: 'Today', label: 'Today', icon: <TodayIcon /> },
    { id: 'Meeting spaces', label: 'Meeting spaces', icon: <BusinessIcon /> },
    { id: 'Personal spaces', label: 'Personal spaces', icon: <PersonIcon />, hasSubmenu: true },
    { id: 'Your team', label: 'Your team', icon: <GroupIcon /> },
    { id: 'Visitors', label: 'Visitors', icon: <PersonAddIcon /> },
  ];

  const personalSpacesSubmenu = [
    { id: 'Your bookings', label: 'Your bookings', path: '/home/bookings' },
    { id: 'Book a personal space', label: 'Book a personal space', path: '/home' },
    { id: 'Booking grid', label: 'Booking grid', path: '/home/booking-grid' },
  ];

  const isSelected = (itemId: string, subItemId?: string) => {
    if (subItemId) {
      return pathname === subItemId;
    }
    return pathname === `/${itemId.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const isSubItemSelected = (subItemPath: string) => {
    return pathname === subItemPath;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f9fafb' }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#ffffff',
          color: '#000000',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ color: '#000' }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    opacity: 0.8,
                  },
                }}
              >
                <Typography sx={{ color: 'white', fontSize: '18px', fontWeight: 'bold', zIndex: 1 }}>
                  E
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
                Engage
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ ml: 2, fontWeight: 500 }}>
              Hello Hugo
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" sx={{ color: '#666' }}>
              <SearchIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: '#666' }}>
              <AccessibleIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: '#666' }}>
              <StarIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: '#666' }}>
              <SettingsIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: '#666' }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#2563eb' }}>
                <PersonIcon fontSize="small" />
              </Avatar>
            </IconButton>
            <Box sx={{ ml: 2, textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontSize: '12px', color: '#666' }}>
                {mounted ? `${formatTime(currentTime)} ${formatDate(currentTime)}` : 'Loading...'}
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
            bgcolor: '#f5f5f5',
            borderRight: '1px solid #e0e0e0',
            mt: '64px',
          },
        }}
      >
        <List sx={{ pt: 2 }}>
          {navItems.map((item) => (
            <Box key={item.id}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={!item.hasSubmenu && isSelected(item.id)}
                  onClick={() => {
                    if (item.hasSubmenu) {
                      setPersonalSpacesOpen(!personalSpacesOpen);
                    }
                  }}
                  sx={{
                    py: 1.5,
                    px: 3,
                    '&.Mui-selected': {
                      bgcolor: '#e0e0e0',
                      '&:hover': {
                        bgcolor: '#e0e0e0',
                      },
                    },
                    '&:hover': {
                      bgcolor: '#eeeeee',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: (item.hasSubmenu && personalSpacesOpen) ? '#2563eb' : '#666',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: (item.hasSubmenu && personalSpacesOpen) ? 600 : 400,
                      color: (item.hasSubmenu && personalSpacesOpen) ? '#000' : '#666',
                    }}
                  />
                  {item.hasSubmenu ? (
                    <ExpandMoreIcon
                      sx={{
                        fontSize: '18px',
                        color: '#999',
                        transform: personalSpacesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  ) : (
                    <ChevronRightIcon
                      sx={{
                        fontSize: '18px',
                        color: '#999',
                        transform: 'rotate(-90deg)',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
              {item.hasSubmenu && personalSpacesOpen && (
                <List sx={{ pl: 4, bgcolor: '#fafafa' }}>
                  {personalSpacesSubmenu.map((subItem) => (
                    <ListItem key={subItem.id} disablePadding>
                      <ListItemButton
                        selected={isSubItemSelected(subItem.path)}
                        onClick={() => {
                          router.push(subItem.path);
                        }}
                        sx={{
                          py: 1,
                          px: 3,
                          '&.Mui-selected': {
                            bgcolor: '#e0e0e0',
                            '&:hover': {
                              bgcolor: '#e0e0e0',
                            },
                          },
                          '&:hover': {
                            bgcolor: '#eeeeee',
                          },
                        }}
                      >
                        <ListItemText
                          primary={subItem.label}
                          primaryTypographyProps={{
                            fontSize: '14px',
                            fontWeight: isSubItemSelected(subItem.path) ? 600 : 400,
                            color: isSubItemSelected(subItem.path) ? '#000' : '#666',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '64px',
          ml: drawerOpen ? `${DRAWER_WIDTH}px` : 0,
          transition: 'margin-left 0.3s',
          bgcolor: '#f9fafb',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

