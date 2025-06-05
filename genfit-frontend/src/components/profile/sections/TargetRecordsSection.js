import React from 'react';
import { Grid, Typography, TextField } from '@mui/material';
import InfoTooltip from '../../common/InfoTooltip';
import { VALIDATION_RULES, FIELD_NAMES } from '../../../constants/profileConstants';

/**
 * TargetRecordsSection component for target personal records form fields
 * @param {Object} formData - Form data object
 * @param {Function} onChange - Change handler for form fields
 */
const TargetRecordsSection = ({ formData, onChange }) => {
  return (
    <>
      {/* Section Header */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>Target Personal Records (Optional)</Typography>
      </Grid>
      
      {/* Target Deadlift Field */}
      <Grid item xs={12} sm={4}>
        <InfoTooltip title="Target deadlift in kilograms">
          <TextField 
            label="Target Deadlift (kg)" 
            name={FIELD_NAMES.TARGET_DEADLIFT}
            type="number" 
            value={formData.goals.target_personal_records.deadlift} 
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
      
      {/* Target Squat Field */}
      <Grid item xs={12} sm={4}>
        <InfoTooltip title="Target squat in kilograms">
          <TextField 
            label="Target Squat (kg)" 
            name={FIELD_NAMES.TARGET_SQUAT}
            type="number" 
            value={formData.goals.target_personal_records.squat} 
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
      
      {/* Target Bench Press Field */}
      <Grid item xs={12} sm={4}>
        <InfoTooltip title="Target bench press in kilograms">
          <TextField 
            label="Target Bench Press (kg)" 
            name={FIELD_NAMES.TARGET_BENCH}
            type="number" 
            value={formData.goals.target_personal_records.bench} 
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

export default TargetRecordsSection; 