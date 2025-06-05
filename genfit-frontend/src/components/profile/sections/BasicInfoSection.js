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
import { SEX_OPTIONS, VALIDATION_RULES, FIELD_NAMES } from '../../../constants/profileConstants';

/**
 * BasicInfoSection component for basic user information form fields
 * @param {Object} formData - Form data object
 * @param {Function} onChange - Change handler for form fields
 */
const BasicInfoSection = ({ formData, onChange }) => {
  return (
    <>
      {/* Section Header */}
      <Grid item xs={12}>
        <Typography variant="h6" color="primary">Basic Information</Typography>
      </Grid>
      
      {/* Name Field */}
      <Grid item xs={12} sm={6}>
        <TextField 
          label="Name" 
          name={FIELD_NAMES.NAME}
          value={formData.name} 
          onChange={onChange} 
          fullWidth 
          required 
        />
      </Grid>
      
      {/* Email Field */}
      <Grid item xs={12} sm={6}>
        <InfoTooltip title="Must be a valid email address">
          <TextField 
            label="Email" 
            name={FIELD_NAMES.EMAIL}
            type="email" 
            value={formData.email} 
            onChange={onChange} 
            fullWidth 
            required 
          />
        </InfoTooltip>
      </Grid>
      
      {/* Age Field */}
      <Grid item xs={12} sm={6}>
        <InfoTooltip title={`Must be at least ${VALIDATION_RULES.MIN_AGE} years old`}>
          <TextField 
            label="Age" 
            name={FIELD_NAMES.AGE}
            type="number" 
            value={formData.age} 
            onChange={onChange} 
            fullWidth 
            required 
            InputProps={{ inputProps: { min: VALIDATION_RULES.MIN_AGE } }}
          />
        </InfoTooltip>
      </Grid>
      
      {/* Sex Field */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel>Sex</InputLabel>
          <Select
            name={FIELD_NAMES.SEX}
            value={formData.sex}
            onChange={onChange}
            label="Sex"
          >
            {SEX_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      {/* Weight Field */}
      <Grid item xs={12} sm={6}>
        <InfoTooltip title="Weight in kilograms (kg)">
          <TextField 
            label="Weight (kg)" 
            name={FIELD_NAMES.WEIGHT}
            type="number" 
            value={formData.weight} 
            onChange={onChange} 
            fullWidth 
            required
            InputProps={{ 
              inputProps: { 
                step: VALIDATION_RULES.WEIGHT_STEP, 
                min: VALIDATION_RULES.MIN_WEIGHT 
              } 
            }}
          />
        </InfoTooltip>
      </Grid>
      
      {/* Height Field */}
      <Grid item xs={12} sm={6}>
        <InfoTooltip title="Height in centimeters (cm)">
          <TextField 
            label="Height (cm)" 
            name={FIELD_NAMES.HEIGHT}
            type="number" 
            value={formData.height} 
            onChange={onChange} 
            fullWidth 
            required
            InputProps={{ 
              inputProps: { 
                step: VALIDATION_RULES.HEIGHT_STEP, 
                min: VALIDATION_RULES.MIN_HEIGHT 
              } 
            }}
          />
        </InfoTooltip>
      </Grid>
    </>
  );
};

export default BasicInfoSection; 