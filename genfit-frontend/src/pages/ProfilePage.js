import React from 'react';
import {
  Typography,
  Container,
  Paper,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { useProfile } from '../hooks/useProfile';
import ProfileView from '../components/profile/ProfileView';
import ProfileForm from '../components/profile/ProfileForm';
import DeleteConfirmDialog from '../components/profile/DeleteConfirmDialog';

/**
 * ProfilePage - Main component for user profile management
 * 
 * This component serves as the main container for profile functionality,
 * utilizing a custom hook for state management and modular components
 * for different sections of the profile interface.
 * 
 * Features:
 * - View profile in read-only mode
 * - Edit profile with form validation
 * - Delete account with confirmation
 * - Responsive design and error handling
 */
const ProfilePage = () => {
  // Use custom hook for all profile-related state and operations
  const {
    // State
    profile,
    formData,
    loading,
    error,
    success,
    isEditing,
    deleteConfirmOpen,
    
    // Handlers
    handleChange,
    handleGoalTypesChange,
    handleSubmit,
    handleDeleteAccount,
    startEditing,
    cancelEditing,
    openDeleteConfirm,
    closeDeleteConfirm
  } = useProfile();

  // Loading state - show spinner while fetching initial data
  if (loading && !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 200px)">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: { xs: 2, md: 4 }, mt: 3 }}>
        {/* Page Header */}
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>

        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Profile Content */}
        {profile && !isEditing && (
          <ProfileView
            profile={profile}
            onEdit={startEditing}
            onDelete={openDeleteConfirm}
            loading={loading}
          />
        )}

        {/* Profile Edit Form */}
        {isEditing && (
          <ProfileForm
            formData={formData}
            onChange={handleChange}
            onGoalTypesChange={handleGoalTypesChange}
            onSubmit={handleSubmit}
            onCancel={cancelEditing}
            loading={loading}
          />
        )}

        {/* Error State - No Profile Data */}
        {!profile && !loading && error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Could not load profile data. {error}
          </Alert>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDeleteAccount}
        loading={loading}
      />
    </Container>
  );
};

export default ProfilePage; 