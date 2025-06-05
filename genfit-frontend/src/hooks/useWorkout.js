import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getMyWorkoutPlan, 
  updateMyWorkoutPlan, 
  deleteMyWorkoutPlan, 
  searchExercises, 
  createWorkoutPlan 
} from '../api';
import { 
  createEmptyPlan, 
  createEmptyWorkout, 
  createEmptySetDetail, 
  groupWorkoutsByDay,
  getAllDaysWithWorkouts,
  cleanPlanForSaving,
  validateWorkoutPlan,
  getExerciseMuscleGroups
} from '../utils/workoutUtils';

/**
 * Custom hook for managing workout plan data and operations
 * @returns {Object} Workout state and handlers
 */
export const useWorkout = () => {
  // Core state
  const [plan, setPlan] = useState(null);
  const [editablePlan, setEditablePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Exercise search state
  const [exerciseSearchResults, setExerciseSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // UI state
  const [currentDayTab, setCurrentDayTab] = useState(0);

  const navigate = useNavigate();

  /**
   * Fetch workout plan from API
   */
  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { data } = await getMyWorkoutPlan();
      setPlan(data);
      setEditablePlan(JSON.parse(JSON.stringify(data))); // Deep copy for editing
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setPlan(null);
        setEditablePlan(null);
        setError('No workout plan found. You can create one.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch workout plan.');
        
        // Handle authentication errors
        if (err.response?.status === 401) {
          localStorage.removeItem('genfitAuth');
          navigate('/login', { state: { from: { pathname: '/workout' } } });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Search for exercises
   */
  const searchForExercises = useCallback(async (query) => {
    if (query && query.length >= 2) {
      setSearchLoading(true);
      try {
        const { data } = await searchExercises(query);
        setExerciseSearchResults(data.exercises || []);
      } catch (searchErr) {
        console.error('Exercise search failed:', searchErr);
        setExerciseSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    } else {
      setExerciseSearchResults([]);
    }
  }, []);

  /**
   * Handle plan basic info changes (name, description)
   */
  const handlePlanInfoChange = useCallback((field, value) => {
    setEditablePlan(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Handle workout field changes
   */
  const handleWorkoutChange = useCallback((workoutIndex, field, value) => {
    setEditablePlan(prev => {
      const updatedWorkouts = [...prev.workouts];
      updatedWorkouts[workoutIndex] = { 
        ...updatedWorkouts[workoutIndex], 
        [field]: value 
      };
      return { ...prev, workouts: updatedWorkouts };
    });
  }, []);

  /**
   * Handle set detail changes
   */
  const handleSetDetailChange = useCallback((workoutIndex, setIndex, field, value) => {
    setEditablePlan(prev => {
      const updatedWorkouts = [...prev.workouts];
      const updatedSetDetails = [...updatedWorkouts[workoutIndex].set_details];
      updatedSetDetails[setIndex] = { 
        ...updatedSetDetails[setIndex], 
        [field]: value 
      };
      updatedWorkouts[workoutIndex] = { 
        ...updatedWorkouts[workoutIndex], 
        set_details: updatedSetDetails 
      };
      return { ...prev, workouts: updatedWorkouts };
    });
  }, []);

  /**
   * Add a new workout to a specific day
   */
  const addWorkoutToDay = useCallback((day) => {
    setEditablePlan(prev => ({
      ...prev,
      workouts: [...prev.workouts, createEmptyWorkout(day)]
    }));
  }, []);

  /**
   * Remove a workout
   */
  const removeWorkout = useCallback((workoutIndex) => {
    setEditablePlan(prev => ({
      ...prev,
      workouts: prev.workouts.filter((_, index) => index !== workoutIndex)
    }));
  }, []);

  /**
   * Add a set to a workout
   */
  const addSetToWorkout = useCallback((workoutIndex) => {
    setEditablePlan(prev => {
      const updatedWorkouts = [...prev.workouts];
      const newSetNumber = updatedWorkouts[workoutIndex].set_details.length + 1;
      updatedWorkouts[workoutIndex].set_details = [
        ...updatedWorkouts[workoutIndex].set_details, 
        createEmptySetDetail(newSetNumber)
      ];
      return { ...prev, workouts: updatedWorkouts };
    });
  }, []);

  /**
   * Remove a set from a workout
   */
  const removeSetFromWorkout = useCallback((workoutIndex, setIndex) => {
    setEditablePlan(prev => {
      const updatedWorkouts = [...prev.workouts];
      updatedWorkouts[workoutIndex].set_details = updatedWorkouts[workoutIndex].set_details
        .filter((_, sIdx) => sIdx !== setIndex)
        .map((set, idx) => ({ ...set, set_number: idx + 1 })); // Renumber sets
      
      return { ...prev, workouts: updatedWorkouts };
    });
  }, []);

  /**
   * Select an exercise from search results
   */
  const selectExercise = useCallback((workoutIndex, exercise) => {
    if (exercise) {
      // Use the utility function to get muscles with fallback
      const musclesTargeted = getExerciseMuscleGroups(exercise);
      
      setEditablePlan(prev => {
        const updatedWorkouts = [...prev.workouts];
        updatedWorkouts[workoutIndex] = {
          ...updatedWorkouts[workoutIndex],
          name: exercise.name,
          exercise_id: exercise.id,
          muscles_targeted: musclesTargeted
        };
        
        return { ...prev, workouts: updatedWorkouts };
      });
    }
  }, []);

  /**
   * Save workout plan changes
   */
  const savePlan = useCallback(async () => {
    if (!editablePlan) return;

    // Validate plan
    const validation = validateWorkoutPlan(editablePlan);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const planToSave = cleanPlanForSaving(editablePlan);

      if (plan && plan.id) {
        // Update existing plan
        await updateMyWorkoutPlan(planToSave);
        setSuccess('Workout plan updated successfully!');
      } else {
        // Create new plan
        await createWorkoutPlan(planToSave);
        setSuccess('Workout plan created successfully!');
      }
      
      await fetchPlan(); // Refetch to get latest version
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save workout plan.');
    } finally {
      setLoading(false);
    }
  }, [editablePlan, plan, fetchPlan]);

  /**
   * Delete workout plan
   */
  const deletePlan = useCallback(async () => {
    setDeleteConfirmOpen(false);
    if (!plan || !plan.id) return;

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await deleteMyWorkoutPlan();
      setSuccess('Workout plan deleted successfully!');
      setPlan(null);
      setEditablePlan(null);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete workout plan.');
    } finally {
      setLoading(false);
    }
  }, [plan]);

  /**
   * Start creating a new plan
   */
  const createNewPlan = useCallback(() => {
    const newPlan = createEmptyPlan();
    setPlan({ id: null, ...newPlan }); // Temporarily set plan to enable editing UI
    setEditablePlan(JSON.parse(JSON.stringify(newPlan)));
    setIsEditing(true);
    setError(''); // Clear previous "No plan found" error
  }, []);

  /**
   * Start editing existing plan
   */
  const startEditing = useCallback(() => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  }, []);

  /**
   * Cancel editing
   */
  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    if (plan && plan.id) {
      setEditablePlan(JSON.parse(JSON.stringify(plan))); // Reset to original plan
    } else {
      setEditablePlan(null); // No existing plan, clear editable form
      setError('No workout plan found. You can create one.'); // Reshow error
    }
    setError('');
    setSuccess('');
  }, [plan]);

  /**
   * Open delete confirmation dialog
   */
  const openDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(true);
  }, []);

  /**
   * Close delete confirmation dialog
   */
  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(false);
  }, []);

  // Derived state
  const displayedPlan = isEditing ? editablePlan : plan;
  const groupedWorkouts = displayedPlan ? groupWorkoutsByDay(displayedPlan.workouts) : {};
  const allDaysWorkouts = getAllDaysWithWorkouts(groupedWorkouts);

  // Fetch plan on mount
  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return {
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
    currentDayTab,
    
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
    closeDeleteConfirm,
    setCurrentDayTab,
    
    // Utilities
    refetchPlan: fetchPlan
  };
}; 