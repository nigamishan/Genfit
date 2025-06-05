import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { WORKOUT_DEFAULTS } from '../../constants/workoutConstants';

/**
 * Component for editing a single set within a workout
 * @param {Object} props - Component props
 * @param {Object} props.set - Set detail object
 * @param {number} props.setIndex - Index of the set in the workout
 * @param {number} props.workoutIndex - Index of the workout in the plan
 * @param {Function} props.onSetChange - Handler for set field changes
 * @param {Function} props.onRemoveSet - Handler for removing the set
 * @param {boolean} props.canRemove - Whether the set can be removed
 * @returns {JSX.Element} Set form component
 */
const SetForm = ({ 
  set, 
  setIndex, 
  workoutIndex, 
  onSetChange, 
  onRemoveSet, 
  canRemove = true 
}) => {
  /**
   * Handle input changes for the set
   * @param {string} field - Field name
   * @param {any} value - New value
   */
  const handleChange = (field, value) => {
    // Parse numeric values
    let parsedValue = value;
    if (['reps', 'weight', 'rpe', 'rest_duration'].includes(field)) {
      // For weight, don't allow empty or 0 as it's compulsory
      if (field === 'weight') {
        parsedValue = value === '' ? WORKOUT_DEFAULTS.DEFAULT_WEIGHT : parseFloat(value);
        // Ensure minimum weight is set if it's 0
        if (parsedValue === 0) {
          parsedValue = WORKOUT_DEFAULTS.DEFAULT_WEIGHT || 1;
        }
      } else {
        parsedValue = value === '' ? 0 : parseFloat(value);
      }
    }
    
    onSetChange(workoutIndex, setIndex, field, parsedValue);
  };

  // Ensure weight has a valid value
  const displayWeight = set.weight || WORKOUT_DEFAULTS.DEFAULT_WEIGHT || 1;
  const isWeightInvalid = !set.weight || set.weight <= 0;

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Set {set.set_number} {set.is_warm_up ? '(Warm-up)' : ''}
        </Typography>
        {canRemove && (
          <IconButton 
            size="small" 
            onClick={() => onRemoveSet(workoutIndex, setIndex)} 
            color="error" 
            aria-label="Remove Set"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6} sm={3}>
          <TextField 
            label="Reps" 
            type="number" 
            value={set.reps || ''} 
            onChange={(e) => handleChange('reps', e.target.value)}
            fullWidth 
            size="small"
            inputProps={{ 
              min: WORKOUT_DEFAULTS.MIN_REPS, 
              max: WORKOUT_DEFAULTS.MAX_REPS 
            }}
          />
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <TextField 
            label="Weight (kg)" 
            type="number" 
            value={displayWeight} 
            onChange={(e) => handleChange('weight', e.target.value)}
            fullWidth 
            size="small"
            inputProps={{ 
              min: WORKOUT_DEFAULTS.MIN_WEIGHT, 
              max: WORKOUT_DEFAULTS.MAX_WEIGHT,
              step: WORKOUT_DEFAULTS.WEIGHT_STEP 
            }}
            error={isWeightInvalid}
            helperText={isWeightInvalid ? 'Weight must be greater than 0' : ''}
          />
        </Grid>
        
        <Grid item xs={6} sm={2}>
          <TextField 
            label="RPE" 
            type="number" 
            value={set.rpe || ''} 
            onChange={(e) => handleChange('rpe', e.target.value)}
            fullWidth 
            size="small"
            inputProps={{ 
              min: WORKOUT_DEFAULTS.MIN_RPE, 
              max: WORKOUT_DEFAULTS.MAX_RPE 
            }}
            helperText="1-10"
          />
        </Grid>
        
        <Grid item xs={6} sm={2}>
          <TextField 
            label="Rest (s)" 
            type="number" 
            value={set.rest_duration || ''} 
            onChange={(e) => handleChange('rest_duration', e.target.value)}
            fullWidth 
            size="small"
            inputProps={{ 
              min: WORKOUT_DEFAULTS.MIN_REST, 
              max: WORKOUT_DEFAULTS.MAX_REST 
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={2}>
          <FormControlLabel 
            control={
              <Checkbox 
                checked={set.is_warm_up || false} 
                onChange={(e) => handleChange('is_warm_up', e.target.checked)}
                size="small"
              />
            } 
            label="Warm-up" 
            sx={{ whiteSpace: 'nowrap' }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SetForm; 