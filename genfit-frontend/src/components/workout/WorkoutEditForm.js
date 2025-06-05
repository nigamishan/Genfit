import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Divider,
  Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { WORKOUT_FIELD_NAMES } from '../../constants/workoutConstants';
import DayTabs from './DayTabs';

/**
 * Main workout plan editing form component
 * @param {Object} props - Component props
 * @param {Object} props.editablePlan - Editable workout plan object
 * @param {Object} props.allDaysWorkouts - All 7 days with their workouts
 * @param {Array} props.exerciseSearchResults - Exercise search results
 * @param {boolean} props.searchLoading - Whether exercise search is loading
 * @param {boolean} props.loading - Whether save operation is loading
 * @param {Function} props.onPlanInfoChange - Handler for plan info changes
 * @param {Function} props.onWorkoutChange - Handler for workout field changes
 * @param {Function} props.onSetChange - Handler for set detail changes
 * @param {Function} props.onAddWorkout - Handler for adding workout to a day
 * @param {Function} props.onRemoveWorkout - Handler for removing a workout
 * @param {Function} props.onAddSet - Handler for adding a set
 * @param {Function} props.onRemoveSet - Handler for removing a set
 * @param {Function} props.onSearchExercises - Handler for exercise search
 * @param {Function} props.onSelectExercise - Handler for exercise selection
 * @param {Function} props.onSave - Handler for saving the plan
 * @param {Function} props.onCancel - Handler for canceling edit
 * @returns {JSX.Element} Workout edit form component
 */
const WorkoutEditForm = ({
  editablePlan,
  allDaysWorkouts,
  exerciseSearchResults,
  searchLoading,
  loading,
  onPlanInfoChange,
  onWorkoutChange,
  onSetChange,
  onAddWorkout,
  onRemoveWorkout,
  onAddSet,
  onRemoveSet,
  onSearchExercises,
  onSelectExercise,
  onSave,
  onCancel
}) => {
  const [currentDay, setCurrentDay] = useState(1);
  
  const workoutFormProps = {
    editablePlan,
    exerciseSearchResults,
    searchLoading,
    onWorkoutChange,
    onSetChange,
    onRemoveWorkout,
    onAddSet,
    onRemoveSet,
    onSearchExercises,
    onSelectExercise
  };

  return (
    <Box component="form" onSubmit={(e) => e.preventDefault()}>
      {/* Plan Basic Info */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Plan Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField 
              label="Plan Name" 
              value={editablePlan.name || ''} 
              onChange={(e) => onPlanInfoChange(WORKOUT_FIELD_NAMES.PLAN_NAME, e.target.value)}
              fullWidth 
              required
              placeholder="e.g., Push Pull Legs Routine"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField 
              label="Plan Description" 
              value={editablePlan.description || ''} 
              onChange={(e) => onPlanInfoChange(WORKOUT_FIELD_NAMES.PLAN_DESCRIPTION, e.target.value)}
              fullWidth 
              multiline 
              rows={2}
              placeholder="Describe your workout plan..."
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Day-by-Day Workout Planning */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Weekly Schedule
        </Typography>
        <DayTabs
          allDaysWorkouts={allDaysWorkouts}
          currentDay={currentDay}
          onDayChange={setCurrentDay}
          onAddWorkout={onAddWorkout}
          workoutFormProps={workoutFormProps}
        />
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          onClick={onCancel} 
          disabled={loading}
          size="large"
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={loading ? null : <SaveIcon />} 
          onClick={onSave} 
          disabled={loading}
          size="large"
        >
          {loading ? 'Saving...' : 'Save Plan'}
        </Button>
      </Box>
    </Box>
  );
};

export default WorkoutEditForm; 