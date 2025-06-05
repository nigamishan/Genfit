// Workout form constants and defaults
export const WORKOUT_DEFAULTS = {
  MIN_REPS: 1,
  MAX_REPS: 100,
  MIN_WEIGHT: 0,
  MAX_WEIGHT: 1000,
  MIN_RPE: 1,
  MAX_RPE: 10,
  MIN_REST: 0,
  MAX_REST: 600, // 10 minutes
  WEIGHT_STEP: 0.5,
  DEFAULT_REPS: 10,
  DEFAULT_WEIGHT: 20, // 20kg is a reasonable default for most exercises
  DEFAULT_RPE: 7,
  DEFAULT_REST: 60
};

// Days of the week for workout planning
export const WORKOUT_DAYS = [
  { number: 1, name: 'Day 1', label: 'Monday' },
  { number: 2, name: 'Day 2', label: 'Tuesday' },
  { number: 3, name: 'Day 3', label: 'Wednesday' },
  { number: 4, name: 'Day 4', label: 'Thursday' },
  { number: 5, name: 'Day 5', label: 'Friday' },
  { number: 6, name: 'Day 6', label: 'Saturday' },
  { number: 7, name: 'Day 7', label: 'Sunday' }
];

// Field names for form handling
export const WORKOUT_FIELD_NAMES = {
  PLAN_NAME: 'name',
  PLAN_DESCRIPTION: 'description',
  EXERCISE_NAME: 'name',
  EXERCISE_ID: 'exercise_id',
  MUSCLES_TARGETED: 'muscles_targeted',
  DAY: 'day',
  SET_NUMBER: 'set_number',
  REPS: 'reps',
  WEIGHT: 'weight',
  RPE: 'rpe',
  REST_DURATION: 'rest_duration',
  IS_WARM_UP: 'is_warm_up'
};

// Exercise search configuration
export const EXERCISE_SEARCH = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300
}; 