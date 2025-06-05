import React from 'react';
import { Grid, Box, Button, CircularProgress } from '@mui/material';
import BasicInfoSection from './sections/BasicInfoSection';
import CurrentFitnessSection from './sections/CurrentFitnessSection';
import PersonalRecordsSection from './sections/PersonalRecordsSection';
import GoalsSection from './sections/GoalsSection';
import TargetRecordsSection from './sections/TargetRecordsSection';

/**
 * ProfileForm component that combines all form sections
 * @param {Object} formData - Form data object
 * @param {Function} onChange - Change handler for form fields
 * @param {Function} onGoalTypesChange - Handler for goal types multi-select
 * @param {Function} onSubmit - Form submission handler
 * @param {Function} onCancel - Cancel editing handler
 * @param {boolean} loading - Loading state
 */
const ProfileForm = ({ 
  formData, 
  onChange, 
  onGoalTypesChange, 
  onSubmit, 
  onCancel, 
  loading 
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Basic Information Section */}
        <BasicInfoSection 
          formData={formData} 
          onChange={onChange} 
        />

        {/* Current Fitness Section */}
        <CurrentFitnessSection 
          formData={formData} 
          onChange={onChange} 
        />

        {/* Personal Records Section */}
        <PersonalRecordsSection 
          formData={formData} 
          onChange={onChange} 
        />

        {/* Goals Section */}
        <GoalsSection 
          formData={formData} 
          onChange={onChange} 
          onGoalTypesChange={onGoalTypesChange}
        />

        {/* Target Personal Records Section */}
        <TargetRecordsSection 
          formData={formData} 
          onChange={onChange} 
        />
      </Grid>
      
      {/* Form Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
        <Button 
          variant="outlined" 
          onClick={onCancel} 
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default ProfileForm; 