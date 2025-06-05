// Progress tracking constants and configurations

// Corrected metric types focused on fitness goals (matching backend API)
export const METRIC_TYPES = {
  WEIGHT: 'weight',
  BODY_FAT_PERCENTAGE: 'body_fat',
  DEADLIFT_PR: 'deadlift_pr',
  SQUAT_PR: 'squat_pr',
  BENCH_PRESS_PR: 'bench_pr'
};

// Available metric types array for forms and filters
export const AVAILABLE_METRIC_TYPES = [
  METRIC_TYPES.WEIGHT,
  METRIC_TYPES.BODY_FAT_PERCENTAGE,
  METRIC_TYPES.DEADLIFT_PR,
  METRIC_TYPES.SQUAT_PR,
  METRIC_TYPES.BENCH_PRESS_PR
];

// Units for each metric type
export const METRIC_UNITS = {
  [METRIC_TYPES.WEIGHT]: 'kg',
  [METRIC_TYPES.BODY_FAT_PERCENTAGE]: '%',
  [METRIC_TYPES.DEADLIFT_PR]: 'kg',
  [METRIC_TYPES.SQUAT_PR]: 'kg',
  [METRIC_TYPES.BENCH_PRESS_PR]: 'kg'
};

// Display names for metric types
export const METRIC_DISPLAY_NAMES = {
  [METRIC_TYPES.WEIGHT]: 'Weight',
  [METRIC_TYPES.BODY_FAT_PERCENTAGE]: 'Body Fat %',
  [METRIC_TYPES.DEADLIFT_PR]: 'Deadlift PR',
  [METRIC_TYPES.SQUAT_PR]: 'Squat PR',
  [METRIC_TYPES.BENCH_PRESS_PR]: 'Bench PR'
};

// Chart colors for different metrics
export const CHART_COLORS = {
  [METRIC_TYPES.WEIGHT]: 'rgb(75, 192, 192)',
  [METRIC_TYPES.BODY_FAT_PERCENTAGE]: 'rgb(255, 99, 132)',
  [METRIC_TYPES.DEADLIFT_PR]: 'rgb(54, 162, 235)',
  [METRIC_TYPES.SQUAT_PR]: 'rgb(255, 205, 86)',
  [METRIC_TYPES.BENCH_PRESS_PR]: 'rgb(153, 102, 255)'
};

// Days of the week for workout volume
export const WORKOUT_DAYS = [
  { number: 1, name: 'Monday', short: 'Mon' },
  { number: 2, name: 'Tuesday', short: 'Tue' },
  { number: 3, name: 'Wednesday', short: 'Wed' },
  { number: 4, name: 'Thursday', short: 'Thu' },
  { number: 5, name: 'Friday', short: 'Fri' },
  { number: 6, name: 'Saturday', short: 'Sat' },
  { number: 7, name: 'Sunday', short: 'Sun' }
];

// Default filter settings
export const DEFAULT_FILTERS = {
  metric_types: [],
  start_date: null,
  end_date: null,
  sort_order: 'desc',
  limit: 50
};

// Progress form field names
export const PROGRESS_FIELD_NAMES = {
  METRIC_TYPE: 'metric_type',
  VALUE: 'value',
  UNIT: 'unit',
  RECORDED_AT: 'recorded_at',
  NOTES: 'notes'
}; 