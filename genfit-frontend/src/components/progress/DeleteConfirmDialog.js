import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

/**
 * Delete Confirmation Dialog Component
 */
const DeleteConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  loading 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'error.main', mr: 2, width: 40, height: 40 }}>
            <WarningIcon />
          </Avatar>
          Confirm Delete
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this progress entry? This action cannot be undone and will permanently remove the entry from your progress history.
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
          size="large"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          autoFocus 
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
          size="large"
        >
          {loading ? 'Deleting...' : 'Delete Entry'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog; 