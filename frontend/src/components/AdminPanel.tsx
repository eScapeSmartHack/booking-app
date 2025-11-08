'use client';

import { Desk, DeskStatus, SpaceType } from '@/types/desk';
import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import CircleIcon from '@mui/icons-material/Circle';

interface AdminPanelProps {
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onAddDesk: (desk: Omit<Desk, 'id'>) => void;
  onDeleteDesk: (deskId: string) => void;
  onExportDesks: () => void;
  onImportDesks: (desks: Desk[]) => void;
  selectedDesk: Desk | null;
}

export default function AdminPanel({
  isAdminMode,
  onToggleAdminMode,
  onAddDesk,
  onDeleteDesk,
  onExportDesks,
  onImportDesks,
  selectedDesk,
}: AdminPanelProps) {
  const [newDeskName, setNewDeskName] = useState('');
  const [newDeskStatus, setNewDeskStatus] = useState<DeskStatus>('available');
  const [newDeskFloor, setNewDeskFloor] = useState('4');
  const [newDeskType, setNewDeskType] = useState<SpaceType>('desk');
  const [newDeskAttributes, setNewDeskAttributes] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  const handleAddDesk = () => {
    if (!newDeskName.trim()) return;

    const attributes = newDeskAttributes
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    onAddDesk({
      name: newDeskName,
      position: { x: 50, y: 50 },
      status: newDeskStatus,
      floor: newDeskFloor,
      type: newDeskType,
      attributes: attributes.length > 0 ? attributes : undefined,
    });

    setNewDeskName('');
    setNewDeskAttributes('');
  };

  const handleImport = () => {
    try {
      const desks = JSON.parse(importText);
      onImportDesks(desks);
      setShowImportModal(false);
      setImportText('');
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const statusColors = [
    { value: 'available', label: 'Available', color: 'success.main' },
    { value: 'booked', label: 'Booked', color: 'primary.main' },
    { value: 'colleague', label: 'Colleague', color: 'grey.400' },
    { value: 'team-member', label: 'Team Member', color: 'warning.main' },
    { value: 'closed', label: 'Closed', color: 'grey.600' },
    { value: 'awaiting-cleaning', label: 'Awaiting Cleaning', color: 'secondary.main' },
    { value: 'hidden', label: 'Hidden', color: 'grey.300' },
    { value: 'fixed-space', label: 'Fixed Space', color: 'error.main' },
  ];

  return (
    <Box sx={{ borderLeft: 1, borderColor: 'divider', p: 2, overflowY: 'auto', height: '100%' }}>
      {/* Admin Mode Toggle */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onToggleAdminMode}
          color={isAdminMode ? 'error' : 'success'}
          startIcon={isAdminMode ? <LockIcon /> : <LockOpenIcon />}
          sx={{ py: 1.5 }}
        >
          {isAdminMode ? 'Exit Admin Mode' : 'Enter Admin Mode'}
        </Button>
      </Box>

      {isAdminMode && (
        <>
          {/* Add New Desk Form */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Add New Desk
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Desk Name"
                value={newDeskName}
                onChange={(e) => setNewDeskName(e.target.value)}
                placeholder="e.g., 04.069"
                size="small"
                fullWidth
              />

              <TextField
                label="Floor"
                value={newDeskFloor}
                onChange={(e) => setNewDeskFloor(e.target.value)}
                placeholder="e.g., 4"
                size="small"
                fullWidth
              />

              <FormControl size="small" fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newDeskType}
                  label="Type"
                  onChange={(e) => setNewDeskType(e.target.value as SpaceType)}
                >
                  <MenuItem value="desk">Desk</MenuItem>
                  <MenuItem value="meeting-room">Meeting Room</MenuItem>
                  <MenuItem value="recreational">Recreational</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newDeskStatus}
                  label="Status"
                  onChange={(e) => setNewDeskStatus(e.target.value as DeskStatus)}
                >
                  {statusColors.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircleIcon sx={{ fontSize: 12, color: status.color }} />
                        {status.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Attributes"
                value={newDeskAttributes}
                onChange={(e) => setNewDeskAttributes(e.target.value)}
                placeholder="e.g., Monitor, Standing Desk"
                size="small"
                fullWidth
                helperText="Comma-separated"
              />

              <Button
                variant="contained"
                onClick={handleAddDesk}
                startIcon={<AddIcon />}
                disabled={!newDeskName.trim()}
              >
                Add Desk
              </Button>
            </Box>
          </Paper>

          {/* Selected Desk Info */}
          {selectedDesk && (
            <Card sx={{ mb: 3, bgcolor: 'warning.light', borderColor: 'warning.main', border: 1 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Selected Desk
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Name:</strong> {selectedDesk.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Position:</strong> X: {selectedDesk.position.x.toFixed(1)}%, Y: {selectedDesk.position.y.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    <strong>Status:</strong> {selectedDesk.status}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => onDeleteDesk(selectedDesk.id)}
                  startIcon={<DeleteIcon />}
                >
                  Delete Desk
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Import/Export */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
            <Button
              variant="outlined"
              onClick={onExportDesks}
              startIcon={<DownloadIcon />}
              fullWidth
            >
              Export Desks (JSON)
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowImportModal(true)}
              startIcon={<UploadIcon />}
              fullWidth
            >
              Import Desks (JSON)
            </Button>
          </Box>

          {/* Instructions */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'info.lighter', border: 1, borderColor: 'info.light' }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              📝 Instructions:
            </Typography>
            <List dense>
              <ListItem sx={{ py: 0 }}>
                <ListItemText primary="Click on map to place new desk" primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText primary="Click existing desk to select it" primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText primary="Drag desks to reposition them" primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText primary="Export to save desk layout" primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText primary="Import to restore layout" primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            </List>
          </Paper>
        </>
      )}

      {/* Legend */}
      <Paper elevation={0} sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Legend
        </Typography>
        <List dense>
          {statusColors.map((status) => (
            <ListItem key={status.value} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CircleIcon sx={{ fontSize: 20, color: status.color }} />
              </ListItemIcon>
              <ListItemText primary={status.label} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Import Modal */}
      <Dialog open={showImportModal} onClose={() => setShowImportModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Import Desks</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={12}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste JSON array of desks here..."
            fullWidth
            sx={{ mt: 1, fontFamily: 'monospace' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImportModal(false)}>Cancel</Button>
          <Button onClick={handleImport} variant="contained">
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
