import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Confirmation dialog for deleting workout plans
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Handler for closing the dialog
 * @param {Function} props.onConfirm - Handler for confirming deletion
 * @param {boolean} props.loading - Whether deletion is in progress
 * @param {string} props.planName - Name of the plan being deleted
 * @returns {JSX.Element} Delete confirmation dialog
 */
const DeleteConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  loading = false,
  planName = 'workout plan'
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <DeleteIcon sx={{ mr: 1, color: 'error.main' }} />
        Confirm Delete Plan
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete <strong>"{planName}"</strong>? 
          This will permanently remove the entire workout plan including all exercises and sets.
        </DialogContentText>
        <DialogContentText sx={{ mt: 2, color: 'error.main', fontWeight: 500 }}>
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          autoFocus 
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
        >
          {loading ? 'Deleting...' : 'Delete Plan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog; 