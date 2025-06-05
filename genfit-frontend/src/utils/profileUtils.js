import { VALIDATION_RULES } from '../constants/profileConstants';

/**
 * Initialize form data from profile object
 * @param {Object} profile - User profile data from API
 * @returns {Object} Initialized form data structure
 */
export const getInitialFormData = (profile) => ({
  name: profile?.name || '',
  email: profile?.email || '',
  age: profile?.age || 18,
  sex: profile?.sex || '',
  weight: profile?.weight || 0,
  height: profile?.height || 0,
  current_fitness: {
    fitness_level: profile?.current_fitness?.fitness_level || '',
    training_frequency: profile?.current_fitness?.training_frequency || 3,
    body_fat_percentage: profile?.current_fitness?.body_fat_percentage || 0,
    personal_records: {
      deadlift: profile?.current_fitness?.personal_records?.deadlift || 0,
      squat: profile?.current_fitness?.personal_records?.squat || 0,
      bench: profile?.current_fitness?.personal_records?.bench || 0,
    }
  },
  goals: {
    goal_types: profile?.goals?.goal_types || [],
    target_weight: profile?.goals?.target_weight || 0,
    target_body_fat: profile?.goals?.target_body_fat || 0,
    target_personal_records: {
      deadlift: profile?.goals?.target_personal_records?.deadlift || 0,
      squat: profile?.goals?.target_personal_records?.squat || 0,
      bench: profile?.goals?.target_personal_records?.bench || 0,
    }
  },
});

/**
 * Validate form data before submission
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result with isValid flag and error message
 */
export const validateFormData = (formData) => {
  // Age validation
  if (formData.age < VALIDATION_RULES.MIN_AGE) {
    return {
      isValid: false,
      error: `Age must be at least ${VALIDATION_RULES.MIN_AGE} years old.`
    };
  }
  
  // Training frequency validation
  const { training_frequency } = formData.current_fitness;
  if (training_frequency < VALIDATION_RULES.MIN_TRAINING_FREQUENCY || 
      training_frequency > VALIDATION_RULES.MAX_TRAINING_FREQUENCY) {
    return {
      isValid: false,
      error: `Training frequency must be between ${VALIDATION_RULES.MIN_TRAINING_FREQUENCY} and ${VALIDATION_RULES.MAX_TRAINING_FREQUENCY} days per week.`
    };
  }
  
  // All validations passed
  return { isValid: true, error: null };
};

/**
 * Update nested form data based on field name path
 * @param {Object} formData - Current form data
 * @param {string} fieldName - Field name (can be nested with dots)
 * @param {any} value - New value
 * @returns {Object} Updated form data
 */
export const updateFormField = (formData, fieldName, value) => {
  if (!fieldName.includes('.')) {
    return { ...formData, [fieldName]: value };
  }

  const parts = fieldName.split('.');
  const newFormData = { ...formData };
  
  if (parts.length === 2) {
    const [parent, child] = parts;
    newFormData[parent] = { ...newFormData[parent], [child]: value };
  } else if (parts.length === 3) {
    const [parent, middle, child] = parts;
    newFormData[parent] = {
      ...newFormData[parent],
      [middle]: { ...newFormData[parent][middle], [child]: value }
    };
  }
  
  return newFormData;
};

/**
 * Check if any personal records are set
 * @param {Object} personalRecords - Personal records object
 * @returns {boolean} True if any record is greater than 0
 */
export const hasPersonalRecords = (personalRecords) => {
  if (!personalRecords) return false;
  return personalRecords.deadlift > 0 || 
         personalRecords.squat > 0 || 
         personalRecords.bench > 0;
};

/**
 * Format display value for optional numeric fields
 * @param {number} value - Numeric value
 * @param {string} unit - Unit suffix
 * @returns {string} Formatted display string
 */
export const formatOptionalValue = (value, unit = '') => {
  return value > 0 ? `${value}${unit}` : 'Not set';
}; 