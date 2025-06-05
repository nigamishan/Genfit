import React from 'react';
import { 
  Grid, 
  Typography, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  OutlinedInput,
  Chip,
  Box
} from '@mui/material';
import InfoTooltip from '../../common/InfoTooltip';
import { GOAL_TYPES, VALIDATION_RULES, FIELD_NAMES } from '../../../constants/profileConstants';

/**
 * GoalsSection component for goals form fields
 * @param {Object} formData - Form data object
 * @param {Function} onChange - Change handler for form fields
 * @param {Function} onGoalTypesChange - Special handler for goal types multi-select
 */
const GoalsSection = ({ formData, onChange, onGoalTypesChange }) => {
  return (
    <>
      {/* Section Header */}
      <Grid item xs={12}>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Goals</Typography>
      </Grid>
      
      {/* Goal Types Multi-Select */}
      <Grid item xs={12}>
        <InfoTooltip title="Select one or more fitness goals">
          <FormControl fullWidth required>
            <InputLabel>Goal Types</InputLabel>
            <Select
              multiple
              name="goal_types"
              value={formData.goals.goal_types}
              onChange={onGoalTypesChange}
              input={<OutlinedInput label="Goal Types" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {GOAL_TYPES.map((goal) => (
                <MenuItem key={goal} value={goal}>
                  {goal.charAt(0).toUpperCase() + goal.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </InfoTooltip>
      </Grid>
      
      {/* Target Weight Field */}
      <Grid item xs={12} sm={6}>
        <InfoTooltip title="Target weight in kilograms (optional)">
          <TextField 
            label="Target Weight (kg)" 
            name={FIELD_NAMES.TARGET_WEIGHT}
            type="number" 
            value={formData.goals.target_weight} 
            onChange={onChange} 
            fullWidth 
            InputProps={{ 
              inputProps: { 
                step: VALIDATION_RULES.WEIGHT_STEP, 
                min: 0 
              } 
            }}
          />
        </InfoTooltip>
      </Grid>
      
      {/* Target Body Fat Field */}
      <Grid item xs={12} sm={6}>
        <InfoTooltip title="Target body fat percentage (optional)">
          <TextField 
            label="Target Body Fat (%)" 
            name={FIELD_NAMES.TARGET_BODY_FAT}
            type="number" 
            value={formData.goals.target_body_fat} 
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

export default GoalsSection; 