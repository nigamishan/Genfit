// Profile form constants based on backend models
export const SEX_OPTIONS = ['male', 'female', 'other'];

export const FITNESS_LEVELS = ['beginner', 'intermediate', 'advanced'];

export const GOAL_TYPES = [
  'weight loss',
  'muscle gain',
  'endurance',
  'strength',
  'general fitness',
  'sport specific'
];

// Form validation constraints
export const VALIDATION_RULES = {
  MIN_AGE: 13,
  MIN_TRAINING_FREQUENCY: 1,
  MAX_TRAINING_FREQUENCY: 7,
  MAX_BODY_FAT: 50,
  MIN_WEIGHT: 0,
  MIN_HEIGHT: 0,
  WEIGHT_STEP: 0.1,
  HEIGHT_STEP: 0.1,
  BODY_FAT_STEP: 0.1,
  PERSONAL_RECORD_STEP: 0.5
};

// Form field names for easier maintenance
export const FIELD_NAMES = {
  // Basic info
  NAME: 'name',
  EMAIL: 'email',
  AGE: 'age',
  SEX: 'sex',
  WEIGHT: 'weight',
  HEIGHT: 'height',
  
  // Current fitness
  FITNESS_LEVEL: 'current_fitness.fitness_level',
  TRAINING_FREQUENCY: 'current_fitness.training_frequency',
  BODY_FAT: 'current_fitness.body_fat_percentage',
  
  // Personal records
  DEADLIFT_PR: 'current_fitness.personal_records.deadlift',
  SQUAT_PR: 'current_fitness.personal_records.squat',
  BENCH_PR: 'current_fitness.personal_records.bench',
  
  // Goals
  GOAL_TYPES: 'goals.goal_types',
  TARGET_WEIGHT: 'goals.target_weight',
  TARGET_BODY_FAT: 'goals.target_body_fat',
  
  // Target records
  TARGET_DEADLIFT: 'goals.target_personal_records.deadlift',
  TARGET_SQUAT: 'goals.target_personal_records.squat',
  TARGET_BENCH: 'goals.target_personal_records.bench'
}; 