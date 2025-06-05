import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Paper,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { WORKOUT_DAYS } from '../../constants/workoutConstants';
import WorkoutForm from './WorkoutForm';

/**
 * Custom tab component with workout count badge
 * @param {Object} props - Component props
 * @param {number} props.day - Day number
 * @param {number} props.workoutCount - Number of workouts for this day
 * @param {boolean} props.isSelected - Whether this tab is selected
 * @returns {JSX.Element} Custom tab component
 */
const WorkoutTab = ({ day, workoutCount, isSelected }) => {
  const dayInfo = WORKOUT_DAYS.find(d => d.number === day);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="body2" sx={{ fontWeight: isSelected ? 600 : 400 }}>
        {dayInfo?.name || `Day ${day}`}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {dayInfo?.label || ''}
      </Typography>
      {workoutCount > 0 && (
        <Chip 
          label={workoutCount} 
          size="small" 
          color="primary" 
          sx={{ mt: 0.5, minWidth: 20, height: 20, fontSize: '0.7rem' }}
        />
      )}
    </Box>
  );
};

/**
 * Day tabs component for workout plan editing
 * @param {Object} props - Component props
 * @param {Object} props.allDaysWorkouts - All 7 days with their workouts
 * @param {number} props.currentDay - Currently selected day
 * @param {Function} props.onDayChange - Handler for day selection change
 * @param {Function} props.onAddWorkout - Handler for adding workout to a day
 * @param {Object} props.workoutFormProps - Props to pass to WorkoutForm components
 * @returns {JSX.Element} Day tabs component
 */
const DayTabs = ({
  allDaysWorkouts,
  currentDay,
  onDayChange,
  onAddWorkout,
  workoutFormProps
}) => {
  const currentDayWorkouts = allDaysWorkouts[currentDay] || [];
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Day Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={currentDay - 1} // Tabs are 0-indexed
          onChange={(event, newValue) => onDayChange(newValue + 1)} // Convert back to 1-indexed
          variant="fullWidth"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ minHeight: 80 }}
        >
          {WORKOUT_DAYS.map((dayInfo) => {
            const workoutCount = (allDaysWorkouts[dayInfo.number] || []).length;
            return (
              <Tab
                key={dayInfo.number}
                label={
                  <WorkoutTab 
                    day={dayInfo.number} 
                    workoutCount={workoutCount}
                    isSelected={currentDay === dayInfo.number}
                  />
                }
                sx={{ 
                  minHeight: 80,
                  textTransform: 'none'
                }}
              />
            );
          })}
        </Tabs>
      </Paper>

      {/* Current Day Content */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {WORKOUT_DAYS.find(d => d.number === currentDay)?.name} - {WORKOUT_DAYS.find(d => d.number === currentDay)?.label}
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => onAddWorkout(currentDay)}
            size="small"
          >
            Add Exercise
          </Button>
        </Box>

        {/* Workouts for Current Day */}
        {currentDayWorkouts.length > 0 ? (
          <Box>
            {currentDayWorkouts.map((workout, index) => {
              // Find the global index of this workout in the full workout list
              const globalIndex = workoutFormProps.editablePlan.workouts.findIndex(w => 
                w.temp_id === workout.temp_id || 
                (w.exercise_id === workout.exercise_id && w.day === workout.day && w.name === workout.name)
              );
              
              if (globalIndex === -1) {
                console.warn("Could not find workout index for", workout);
                return null;
              }

              // Get the workout directly from editablePlan to ensure it has the latest data
              const actualWorkout = workoutFormProps.editablePlan.workouts[globalIndex];

              return (
                <WorkoutForm
                  key={workout.temp_id || `${currentDay}-${index}`}
                  workout={actualWorkout}
                  workoutIndex={globalIndex}
                  {...workoutFormProps}
                />
              );
            })}
          </Box>
        ) : (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              bgcolor: 'grey.50', 
              border: '2px dashed', 
              borderColor: 'grey.300',
              borderRadius: 2 
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Rest Day
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No exercises planned for this day
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={() => onAddWorkout(currentDay)}
              size="small"
            >
              Add First Exercise
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default DayTabs; 