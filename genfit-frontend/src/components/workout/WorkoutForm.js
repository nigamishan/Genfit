import React from 'react';
import {
  Paper,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ExerciseSearch from './ExerciseSearch';
import SetForm from './SetForm';

/**
 * Component for editing a single workout (exercise) within a workout plan
 * @param {Object} props - Component props
 * @param {Object} props.workout - Workout object
 * @param {number} props.workoutIndex - Index of the workout in the plan
 * @param {Array} props.exerciseSearchResults - Exercise search results
 * @param {boolean} props.searchLoading - Whether exercise search is loading
 * @param {Function} props.onWorkoutChange - Handler for workout field changes
 * @param {Function} props.onSetChange - Handler for set detail changes
 * @param {Function} props.onRemoveWorkout - Handler for removing the workout
 * @param {Function} props.onAddSet - Handler for adding a new set
 * @param {Function} props.onRemoveSet - Handler for removing a set
 * @param {Function} props.onSearchExercises - Handler for exercise search
 * @param {Function} props.onSelectExercise - Handler for exercise selection
 * @returns {JSX.Element} Workout form component
 */
const WorkoutForm = ({
  workout,
  workoutIndex,
  exerciseSearchResults,
  searchLoading,
  onWorkoutChange,
  onSetChange,
  onRemoveWorkout,
  onAddSet,
  onRemoveSet,
  onSearchExercises,
  onSelectExercise
}) => {
  const hasExercise = workout.exercise_id && workout.name;
  const setCount = workout.set_details?.length || 0;
  const muscleGroups = workout.muscles_targeted || [];

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {hasExercise ? workout.name : 'New Exercise'}
            </Typography>
            {hasExercise && (
              <Typography variant="body2" color="text.secondary">
                {setCount} set{setCount !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton 
          onClick={() => onRemoveWorkout(workoutIndex)} 
          color="error" 
          aria-label="Remove Exercise"
          sx={{ ml: 2 }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Exercise Selection */}
      <Box sx={{ mb: 3 }}>
        <ExerciseSearch
          exercises={exerciseSearchResults}
          loading={searchLoading}
          selectedExerciseId={workout.exercise_id}
          onSearch={onSearchExercises}
          onSelect={(exercise) => onSelectExercise(workoutIndex, exercise)}
          label="Search and Select Exercise"
          placeholder="Type to search for exercises..."
        />
      </Box>

      {/* Target Muscles Section - More Prominent Display */}
      {hasExercise && (
        <Box sx={{ mb: 3 }}>
          {muscleGroups.length > 0 ? (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: 'primary.main' }}>
                🎯 Target Muscles
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                p: 2,
                bgcolor: 'primary.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.200'
              }}>
                {muscleGroups.map((muscle, index) => (
                  <Chip 
                    key={index} 
                    label={muscle} 
                    size="medium" 
                    variant="filled"
                    color="primary"
                    sx={{ 
                      fontWeight: 500,
                      '& .MuiChip-label': {
                        px: 1.5
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              Select an exercise above to see target muscles
            </Alert>
          )}
        </Box>
      )}

      {/* Sets Section */}
      {hasExercise && (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Sets:
          </Typography>
          
          {workout.set_details?.map((set, setIndex) => (
            <SetForm
              key={`${workoutIndex}-${setIndex}`}
              set={set}
              setIndex={setIndex}
              workoutIndex={workoutIndex}
              onSetChange={onSetChange}
              onRemoveSet={onRemoveSet}
              canRemove={workout.set_details.length > 1}
            />
          ))}
          
          <Button 
            startIcon={<AddIcon />} 
            onClick={() => onAddSet(workoutIndex)} 
            size="small" 
            variant="outlined"
            sx={{ mt: 1 }}
          >
            Add Set
          </Button>
        </Box>
      )}

      {/* Placeholder when no exercise selected */}
      {!hasExercise && (
        <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Select an exercise from the search above to start adding sets
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default WorkoutForm; 