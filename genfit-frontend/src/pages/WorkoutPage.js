import React from 'react';
import {
  Typography,
  Container,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useWorkout } from '../hooks/useWorkout';
import {
  WorkoutView,
  WorkoutEditForm,
  DeleteConfirmDialog
} from '../components/workout';

/**
 * Main WorkoutPage component - displays and manages workout plans
 * @returns {JSX.Element} WorkoutPage component
 */
const WorkoutPage = () => {
  const {
    // State
    plan,
    editablePlan,
    loading,
    error,
    success,
    isEditing,
    deleteConfirmOpen,
    exerciseSearchResults,
    searchLoading,
    
    // Derived state
    displayedPlan,
    groupedWorkouts,
    allDaysWorkouts,
    
    // Handlers
    handlePlanInfoChange,
    handleWorkoutChange,
    handleSetDetailChange,
    addWorkoutToDay,
    removeWorkout,
    addSetToWorkout,
    removeSetFromWorkout,
    selectExercise,
    searchForExercises,
    savePlan,
    deletePlan,
    createNewPlan,
    startEditing,
    cancelEditing,
    openDeleteConfirm,
    closeDeleteConfirm
  } = useWorkout();

  // Loading state for initial fetch
  if (loading && !plan && !isEditing) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: { xs: 2, md: 3 }, mt: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            {isEditing 
              ? (editablePlan?.id ? 'Edit Workout Plan' : 'Create Workout Plan')
              : 'Workout Plan'
            }
          </Typography>
          
          {/* Action Buttons - only show when not editing */}
          {!isEditing && plan && plan.id && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                startIcon={<EditIcon />} 
                variant="outlined" 
                onClick={startEditing}
                size="small"
              >
                Edit Plan
              </Button>
              <Button 
                startIcon={<DeleteIcon />} 
                variant="outlined" 
                color="error" 
                onClick={openDeleteConfirm}
                size="small"
              >
                Delete Plan
              </Button>
            </Box>
          )}
        </Box>

        {/* Error & Success Messages */}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        {/* Loading indicator for save operations */}
        {loading && (isEditing || plan) && (
          <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {/* No Plan State */}
        {!loading && !isEditing && !plan && (
          <Box textAlign="center" sx={{ py: 6 }}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              No workout plan found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first workout plan to get started with your fitness journey.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<PlaylistAddIcon />} 
              onClick={createNewPlan}
              size="large"
            >
              Create New Workout Plan
            </Button>
          </Box>
        )}

        {/* Workout Plan View Mode */}
        {!isEditing && plan && plan.id && (
          <WorkoutView 
            plan={plan} 
            groupedWorkouts={groupedWorkouts} 
          />
        )}

        {/* Workout Plan Edit Mode */}
        {isEditing && editablePlan && (
          <WorkoutEditForm
            editablePlan={editablePlan}
            allDaysWorkouts={allDaysWorkouts}
            exerciseSearchResults={exerciseSearchResults}
            searchLoading={searchLoading}
            loading={loading}
            onPlanInfoChange={handlePlanInfoChange}
            onWorkoutChange={handleWorkoutChange}
            onSetChange={handleSetDetailChange}
            onAddWorkout={addWorkoutToDay}
            onRemoveWorkout={removeWorkout}
            onAddSet={addSetToWorkout}
            onRemoveSet={removeSetFromWorkout}
            onSearchExercises={searchForExercises}
            onSelectExercise={selectExercise}
            onSave={savePlan}
            onCancel={cancelEditing}
          />
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
        onConfirm={deletePlan}
        loading={loading}
        planName={plan?.name}
      />
    </Container>
  );
};

export default WorkoutPage; 