import { WORKOUT_DEFAULTS } from '../constants/workoutConstants';

/**
 * Create an empty set detail object with default values
 * @param {number} setNumber - The set number
 * @returns {Object} Empty set detail object
 */
export const createEmptySetDetail = (setNumber = 1) => ({
  set_number: setNumber,
  reps: WORKOUT_DEFAULTS.DEFAULT_REPS,
  weight: WORKOUT_DEFAULTS.DEFAULT_WEIGHT,
  rpe: WORKOUT_DEFAULTS.DEFAULT_RPE,
  rest_duration: WORKOUT_DEFAULTS.DEFAULT_REST,
  is_warm_up: false
});

/**
 * Create an empty workout object
 * @param {number} day - The workout day
 * @returns {Object} Empty workout object
 */
export const createEmptyWorkout = (day = 1) => ({
  name: '',
  exercise_id: '',
  muscles_targeted: [],
  day: day,
  set_details: [createEmptySetDetail()],
  temp_id: Date.now() + Math.random() // For tracking during editing
});

/**
 * Create an empty workout plan
 * @returns {Object} Empty workout plan object
 */
export const createEmptyPlan = () => ({
  name: 'My New Workout Plan',
  description: 'A comprehensive plan for the week.',
  workouts: [createEmptyWorkout(1)]
});

/**
 * Group workouts by day for display
 * @param {Array} workouts - Array of workout objects
 * @returns {Object} Workouts grouped by day number
 */
export const groupWorkoutsByDay = (workouts) => {
  if (!workouts || !Array.isArray(workouts)) return {};
  
  return workouts.reduce((acc, workout) => {
    const day = workout.day || 1; // Default to day 1 if not specified
    if (!acc[day]) acc[day] = [];
    acc[day].push(workout);
    return acc;
  }, {});
};

/**
 * Get sorted array of days that have workouts
 * @param {Object} groupedWorkouts - Workouts grouped by day
 * @returns {Array} Sorted array of day numbers
 */
export const getSortedDays = (groupedWorkouts) => {
  return Object.keys(groupedWorkouts)
    .map(Number)
    .sort((a, b) => a - b);
};

/**
 * Get all 7 days with empty arrays for days without workouts
 * @param {Object} groupedWorkouts - Workouts grouped by day
 * @returns {Object} All 7 days with workout arrays
 */
export const getAllDaysWithWorkouts = (groupedWorkouts) => {
  const allDays = {};
  for (let day = 1; day <= 7; day++) {
    allDays[day] = groupedWorkouts[day] || [];
  }
  return allDays;
};

/**
 * Calculate workout summary for a day
 * @param {Array} workouts - Array of workouts for a day
 * @returns {Object} Summary object with exercise count, total sets, etc.
 */
export const calculateDaySummary = (workouts) => {
  if (!workouts || workouts.length === 0) {
    return {
      exerciseCount: 0,
      totalSets: 0,
      totalExercises: 0,
      muscleGroups: [],
      isEmpty: true
    };
  }

  const totalSets = workouts.reduce((sum, workout) => {
    return sum + (workout.set_details ? workout.set_details.length : 0);
  }, 0);

  const allMuscleGroups = workouts.flatMap(workout => workout.muscles_targeted || []);
  const uniqueMuscleGroups = [...new Set(allMuscleGroups)];

  return {
    exerciseCount: workouts.length,
    totalSets,
    totalExercises: workouts.length,
    muscleGroups: uniqueMuscleGroups,
    isEmpty: false
  };
};

/**
 * Format set details for display
 * @param {Object} setDetail - Set detail object
 * @returns {string} Formatted set string
 */
export const formatSetDetails = (setDetail) => {
  const warmupLabel = setDetail.is_warm_up ? ' (Warm-up)' : '';
  return `${setDetail.reps} reps @ ${setDetail.weight}kg (RPE ${setDetail.rpe})${warmupLabel}`;
};

/**
 * Remove temporary IDs from workout plan before saving
 * @param {Object} plan - Workout plan object
 * @returns {Object} Plan without temporary IDs
 */
export const cleanPlanForSaving = (plan) => {
  if (!plan) return plan;
  
  return {
    ...plan,
    workouts: plan.workouts.map(({ temp_id, ...workout }) => workout)
  };
};

/**
 * Validate workout plan data
 * @param {Object} plan - Workout plan to validate
 * @returns {Object} Validation result with isValid flag and error message
 */
export const validateWorkoutPlan = (plan) => {
  if (!plan) {
    return { isValid: false, error: 'Plan is required' };
  }

  if (!plan.name || plan.name.trim().length === 0) {
    return { isValid: false, error: 'Plan name is required' };
  }

  if (!plan.workouts || plan.workouts.length === 0) {
    return { isValid: false, error: 'At least one workout is required' };
  }

  // Validate each workout
  for (const workout of plan.workouts) {
    if (!workout.name || workout.name.trim().length === 0) {
      return { isValid: false, error: 'All exercises must have a name' };
    }

    if (!workout.exercise_id) {
      return { isValid: false, error: 'All exercises must be selected from the search' };
    }

    if (!workout.set_details || workout.set_details.length === 0) {
      return { isValid: false, error: 'All exercises must have at least one set' };
    }
  }

  return { isValid: true, error: null };
};

/**
 * Fallback muscle group mapping for common exercises
 * This is a temporary solution until the backend provides proper muscle group data
 */
const EXERCISE_MUSCLE_MAPPING = {
  // Chest exercises
  'push-up': ['Chest', 'Triceps', 'Shoulders'],
  'push up': ['Chest', 'Triceps', 'Shoulders'],
  'pushup': ['Chest', 'Triceps', 'Shoulders'],
  'bench press': ['Chest', 'Triceps', 'Shoulders'],
  'incline bench press': ['Upper Chest', 'Triceps', 'Shoulders'],
  'decline bench press': ['Lower Chest', 'Triceps', 'Shoulders'],
  'chest fly': ['Chest', 'Shoulders'],
  'dips': ['Chest', 'Triceps', 'Shoulders'],
  
  // Back exercises
  'pull-up': ['Lats', 'Rhomboids', 'Biceps'],
  'pull up': ['Lats', 'Rhomboids', 'Biceps'],
  'pullup': ['Lats', 'Rhomboids', 'Biceps'],
  'chin-up': ['Lats', 'Rhomboids', 'Biceps'],
  'chin up': ['Lats', 'Rhomboids', 'Biceps'],
  'lat pulldown': ['Lats', 'Rhomboids', 'Biceps'],
  'seated row': ['Lats', 'Rhomboids', 'Rear Delts'],
  'bent over row': ['Lats', 'Rhomboids', 'Rear Delts'],
  'deadlift': ['Lower Back', 'Glutes', 'Hamstrings', 'Traps'],
  
  // Leg exercises
  'squat': ['Quadriceps', 'Glutes', 'Hamstrings'],
  'barbell squat': ['Quadriceps', 'Glutes', 'Hamstrings'],
  'front squat': ['Quadriceps', 'Glutes', 'Core'],
  'goblet squat': ['Quadriceps', 'Glutes', 'Core'],
  'lunge': ['Quadriceps', 'Glutes', 'Hamstrings'],
  'bulgarian split squat': ['Quadriceps', 'Glutes', 'Hamstrings'],
  'leg press': ['Quadriceps', 'Glutes', 'Hamstrings'],
  'leg curl': ['Hamstrings'],
  'leg extension': ['Quadriceps'],
  'calf raise': ['Calves'],
  
  // Shoulder exercises
  'shoulder press': ['Shoulders', 'Triceps'],
  'military press': ['Shoulders', 'Triceps', 'Core'],
  'overhead press': ['Shoulders', 'Triceps', 'Core'],
  'lateral raise': ['Side Delts'],
  'front raise': ['Front Delts'],
  'rear delt fly': ['Rear Delts'],
  'face pull': ['Rear Delts', 'Rhomboids'],
  
  // Arm exercises
  'bicep curl': ['Biceps'],
  'hammer curl': ['Biceps', 'Forearms'],
  'tricep extension': ['Triceps'],
  'tricep dip': ['Triceps', 'Chest'],
  'close grip bench press': ['Triceps', 'Chest'],
  
  // Core exercises
  'plank': ['Core', 'Shoulders'],
  'sit-up': ['Abs', 'Hip Flexors'],
  'crunch': ['Abs'],
  'mountain climber': ['Core', 'Shoulders', 'Legs'],
  'russian twist': ['Obliques', 'Core'],
  'leg raise': ['Lower Abs', 'Hip Flexors']
};

/**
 * Get muscle groups for an exercise, with fallback mapping
 * @param {Object} exercise - Exercise object from API
 * @returns {Array} Array of muscle group names
 */
export const getExerciseMuscleGroups = (exercise) => {
  if (!exercise) return [];
  
  // First try to use API data
  const apiMuscles = [
    ...(exercise.primary_muscle_groups || []),
    ...(exercise.supporting_muscle_groups || [])
  ];
  
  if (apiMuscles.length > 0) {
    return apiMuscles;
  }
  
  // Fallback to our mapping
  const exerciseName = exercise.name?.toLowerCase() || '';
  
  // Direct match
  if (EXERCISE_MUSCLE_MAPPING[exerciseName]) {
    return EXERCISE_MUSCLE_MAPPING[exerciseName];
  }
  
  // Partial match (e.g., "Barbell Squat" matches "squat")
  for (const [key, muscles] of Object.entries(EXERCISE_MUSCLE_MAPPING)) {
    if (exerciseName.includes(key) || key.includes(exerciseName.split(' ')[0])) {
      return muscles;
    }
  }
  
  // Default fallback
  return ['Full Body'];
}; 