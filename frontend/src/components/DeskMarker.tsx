'use client';

import { Desk } from '@/types/desk';
import { useState } from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

interface DeskMarkerProps {
  desk: Desk;
  onClick: (desk: Desk) => void;
  isAdminMode?: boolean;
  mapScale?: number;
}

const MarkerCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status' && prop !== 'isHovered',
})<{ status: string; isHovered: boolean }>(({ theme, status, isHovered }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return theme.palette.success.main;
      case 'booked':
        return theme.palette.primary.main;
      case 'colleague':
        return theme.palette.grey[400];
      case 'team-member':
        return theme.palette.warning.main;
      case 'closed':
        return theme.palette.grey[600];
      case 'awaiting-cleaning':
        return theme.palette.secondary.main;
      case 'hidden':
        return theme.palette.grey[300];
      case 'fixed-space':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: getStatusColor(),
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.2rem',
    lineHeight: 1,
    padding: 0,
    margin: 0,
    boxShadow: theme.shadows[2],
    border: `0.5px solid white`,
    transition: 'all 0.2s ease',
    transform: isHovered ? 'scale(1.3)' : 'scale(1)',
    cursor: 'pointer',
    '& > *': {
      lineHeight: 1,
      margin: 0,
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
});

const PopupCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'mapScale',
})<{ mapScale?: number }>(({ theme, mapScale = 1 }) => ({
  position: 'absolute',
  left: '50%',
  transform: `translateX(-50%) translateY(calc(-2% - 0px)) scale(${1 / mapScale})`,
  transformOrigin: 'center bottom',
  bottom: '100%',
  width: 140,
  zIndex: 1001,
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: -3,
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: `6px solid ${theme.palette.background.paper}`,
  },
}));

export default function DeskMarker({ desk, onClick, isAdminMode = false, mapScale = 1 }: DeskMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusIcon = () => {
    switch (desk.status) {
      case 'available':
        return '●';
      case 'booked':
        return '●';
      case 'colleague':
        return '😊';
      case 'team-member':
        return '👥';
      case 'closed':
        return '⊘';
      case 'awaiting-cleaning':
        return '🧹';
      case 'fixed-space':
        return '📌';
      default:
        return '●';
    }
  };

  return (
    <Box
      data-desk-marker
      sx={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        zIndex: isHovered ? 1000 : 10,
        left: `${desk.position.x}%`,
        top: `${desk.position.y}%`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(desk);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MarkerCircle status={desk.status} isHovered={isHovered}>
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {getStatusIcon()}
        </Box>
      </MarkerCircle>

      {isHovered && (
        <PopupCard elevation={3} mapScale={mapScale} data-desk-popup>
          <Box sx={{ p: 1 }}>
            <Typography variant="caption" fontWeight="bold" gutterBottom sx={{ fontSize: '0.7rem' }}>
              {desk.name}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                Floor: {desk.floor}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize', fontSize: '0.6rem' }}>
                Status: {desk.status.replace('-', ' ')}
              </Typography>
              {desk.bookedBy && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                  Booked by: {desk.bookedBy}
                </Typography>
              )}
              {desk.attributes && desk.attributes.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, mt: 0.5 }}>
                  {desk.attributes.map((attr, idx) => (
                    <Chip
                      key={idx}
                      label={attr}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ height: 16, fontSize: '0.55rem', '& .MuiChip-label': { px: 0.75 } }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </PopupCard>
      )}
    </Box>
  );
}
