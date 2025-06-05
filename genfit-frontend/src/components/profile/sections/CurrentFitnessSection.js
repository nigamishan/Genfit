import React from 'react';
import { 
  Grid, 
  Typography, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import InfoTooltip from '../../common/InfoTooltip';
import { FITNESS_LEVELS, VALIDATION_RULES, FIELD_NAMES } from '../../../constants/profileConstants';

/**
 * CurrentFitnessSection component for current fitness form fields
 * @param {Object} formData - Form data object
 * @param {Function} onChange - Change handler for form fields
 */
const CurrentFitnessSection = ({ formData, onChange }) => {
  return (
    <>
      {/* Section Header */}
      <Grid item xs={12}>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Current Fitness</Typography>
      </Grid>
      
      {/* Fitness Level Field */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel>Fitness Level</InputLabel>
          <Select
            name={FIELD_NAMES.FITNESS_LEVEL}
            value={formData.current_fitness.fitness_level}
            onChange={onChange}
            label="Fitness Level"
          >
            {FITNESS_LEVELS.map((level) => (
              <MenuItem key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      {/* Training Frequency Field */}
      <Grid item xs={12} sm={6}>
        <InfoTooltip title={`Number of training days per week (${VALIDATION_RULES.MIN_TRAINING_FREQUENCY}-${VALIDATION_RULES.MAX_TRAINING_FREQUENCY})`}>
          <TextField 
            label="Training Frequency (days/week)" 
            name={FIELD_NAMES.TRAINING_FREQUENCY}
            type="number" 
            value={formData.current_fitness.training_frequency} 
            onChange={onChange} 
            fullWidth 
            required
            InputProps={{ 
              inputProps: { 
                min: VALIDATION_RULES.MIN_TRAINING_FREQUENCY, 
                max: VALIDATION_RULES.MAX_TRAINING_FREQUENCY 
              } 
            }}
          />
        </InfoTooltip>
      </Grid>
      
      {/* Body Fat Percentage Field */}
      <Grid item xs={12} sm={6}>
        <InfoTooltip title="Body fat percentage (optional)">
          <TextField 
            label="Body Fat Percentage (%)" 
            name={FIELD_NAMES.BODY_FAT}
            type="number" 
            value={formData.current_fitness.body_fat_percentage} 
            onChange={onChange} 
            fullWidth 
            InputProps={{ 
              inputProps: { 
                step: VALIDATION_RULES.BODY_FAT_STEP, 
                min: 0, 
                max: VALIDATION_RULES.MAX_BODY_FAT 
              } 
            }}
          />
        </InfoTooltip>
      </Grid>
    </>
  );
};

export default CurrentFitnessSection; 