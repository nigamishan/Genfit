import React from 'react';
import { Grid, Typography, TextField } from '@mui/material';
import InfoTooltip from '../../common/InfoTooltip';
import { VALIDATION_RULES, FIELD_NAMES } from '../../../constants/profileConstants';

/**
 * PersonalRecordsSection component for personal records form fields
 * @param {Object} formData - Form data object
 * @param {Function} onChange - Change handler for form fields
 */
const PersonalRecordsSection = ({ formData, onChange }) => {
  return (
    <>
      {/* Section Header */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>Personal Records (Optional)</Typography>
      </Grid>
      
      {/* Deadlift Field */}
      <Grid item xs={12} sm={4}>
        <InfoTooltip title="Deadlift personal record in kilograms">
          <TextField 
            label="Deadlift (kg)" 
            name={FIELD_NAMES.DEADLIFT_PR}
            type="number" 
            value={formData.current_fitness.personal_records.deadlift} 
            onChange={onChange} 
            fullWidth 
            InputProps={{ 
              inputProps: { 
                step: VALIDATION_RULES.PERSONAL_RECORD_STEP, 
                min: 0 
              } 
            }}
          />
        </InfoTooltip>
      </Grid>
      
      {/* Squat Field */}
      <Grid item xs={12} sm={4}>
        <InfoTooltip title="Squat personal record in kilograms">
          <TextField 
            label="Squat (kg)" 
            name={FIELD_NAMES.SQUAT_PR}
            type="number" 
            value={formData.current_fitness.personal_records.squat} 
            onChange={onChange} 
            fullWidth 
            InputProps={{ 
              inputProps: { 
                step: VALIDATION_RULES.PERSONAL_RECORD_STEP, 
                min: 0 
              } 
            }}
          />
        </InfoTooltip>
      </Grid>
      
      {/* Bench Press Field */}
      <Grid item xs={12} sm={4}>
        <InfoTooltip title="Bench press personal record in kilograms">
          <TextField 
            label="Bench Press (kg)" 
            name={FIELD_NAMES.BENCH_PR}
            type="number" 
            value={formData.current_fitness.personal_records.bench} 
            onChange={onChange} 
            fullWidth 
            InputProps={{ 
              inputProps: { 
                step: VALIDATION_RULES.PERSONAL_RECORD_STEP, 
                min: 0 
              } 
            }}
          />
        </InfoTooltip>
      </Grid>
    </>
  );
};

export default PersonalRecordsSection; 