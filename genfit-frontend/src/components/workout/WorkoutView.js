import React from 'react';
import {
  Typography,
  Paper,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { calculateDaySummary, formatSetDetails } from '../../utils/workoutUtils';

/**
 * Component to display a single workout with summary and expandable details
 * @param {Object} props - Component props
 * @param {Object} props.workout - Workout object
 * @returns {JSX.Element} Workout component
 */
const WorkoutCard = ({ workout }) => {
  const setCount = workout.set_details?.length || 0;
  const muscleGroups = workout.muscles_targeted || [];
  
  return (
    <Accordion sx={{ mb: 1, '&:before': { display: 'none' } }}>
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}
        sx={{ 
          '& .MuiAccordionSummary-content': { 
            alignItems: 'center',
            justifyContent: 'space-between'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Box>
            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
              {workout.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {setCount} set{setCount !== 1 ? 's' : ''} • {muscleGroups.slice(0, 2).join(', ')}
              {muscleGroups.length > 2 && ` +${muscleGroups.length - 2} more`}
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Target Muscles:</strong> {muscleGroups.join(', ') || 'None specified'}
          </Typography>
        </Box>
        <Typography variant="subtitle2" gutterBottom>
          Set Details:
        </Typography>
        <List dense disablePadding>
          {workout.set_details?.map((set, index) => (
            <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
              <ListItemText 
                primary={`Set ${set.set_number}: ${formatSetDetails(set)}`}
                secondary={`Rest: ${set.rest_duration}s`}
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

/**
 * Component to display workout summary for a day
 * @param {Object} props - Component props
 * @param {Object} props.summary - Day summary object
 * @returns {JSX.Element} Day summary component
 */
const DaySummary = ({ summary }) => {
  if (summary.isEmpty) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Rest Day - No exercises planned
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={1}>
        <Grid item>
          <Chip 
            label={`${summary.exerciseCount} Exercise${summary.exerciseCount !== 1 ? 's' : ''}`}
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <Chip 
            label={`${summary.totalSets} Total Sets`}
            size="small" 
            color="secondary" 
            variant="outlined"
          />
        </Grid>
        {summary.muscleGroups.length > 0 && (
          <Grid item>
            <Chip 
              label={`${summary.muscleGroups.slice(0, 2).join(', ')}${summary.muscleGroups.length > 2 ? ` +${summary.muscleGroups.length - 2}` : ''}`}
              size="small" 
              variant="outlined"
              sx={{ maxWidth: '200px', '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

/**
 * Component to display workouts for a single day
 * @param {Object} props - Component props
 * @param {number} props.day - Day number
 * @param {Array} props.workouts - Array of workouts for the day
 * @returns {JSX.Element} Day workouts component
 */
const DayWorkouts = ({ day, workouts }) => {
  const summary = calculateDaySummary(workouts);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        Day {day}
        <Chip 
          label={summary.isEmpty ? 'Rest Day' : `${summary.exerciseCount} Exercise${summary.exerciseCount !== 1 ? 's' : ''}`}
          size="small" 
          sx={{ ml: 2 }}
          color={summary.isEmpty ? 'default' : 'primary'}
        />
      </Typography>
      
      <DaySummary summary={summary} />
      
      {!summary.isEmpty && (
        <Box>
          {workouts.map((workout, index) => (
            <WorkoutCard key={`${workout.exercise_id}-${index}`} workout={workout} />
          ))}
        </Box>
      )}
    </Box>
  );
};

/**
 * Main component to display the complete workout plan in view mode
 * @param {Object} props - Component props
 * @param {Object} props.plan - Workout plan object
 * @param {Object} props.groupedWorkouts - Workouts grouped by day
 * @returns {JSX.Element} Workout view component
 */
const WorkoutView = ({ plan, groupedWorkouts }) => {
  if (!plan || !plan.workouts || plan.workouts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          This plan currently has no workouts.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Click "Edit Plan" to add exercises to your workout plan.
        </Typography>
      </Box>
    );
  }

  // Get all days that have workouts, sorted
  const daysWithWorkouts = Object.keys(groupedWorkouts)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {plan.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {plan.description}
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      {daysWithWorkouts.map(day => (
        <DayWorkouts 
          key={day} 
          day={day} 
          workouts={groupedWorkouts[day] || []} 
        />
      ))}
    </Box>
  );
};

export default WorkoutView; 