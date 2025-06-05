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

/**
 * DeleteConfirmDialog component for confirming account deletion
 * @param {boolean} open - Whether the dialog is open
 * @param {Function} onClose - Handler for closing the dialog
 * @param {Function} onConfirm - Handler for confirming deletion
 * @param {boolean} loading - Loading state during deletion
 */
const DeleteConfirmDialog = ({ open, onClose, onConfirm, loading }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Account Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete your account? This action cannot be undone.
          All your data, including progress history and workout plans, will be permanently removed.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" disabled={loading} autoFocus>
          {loading ? <CircularProgress size={24} /> : 'Delete Account'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog; 