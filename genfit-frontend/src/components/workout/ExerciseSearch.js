import React from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Typography,
  Grid,
  Box,
  Chip
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { getExerciseMuscleGroups } from '../../utils/workoutUtils';

/**
 * Reusable exercise search component with autocomplete
 * @param {Object} props - Component props
 * @param {Array} props.exercises - Array of exercise search results
 * @param {boolean} props.loading - Whether search is loading
 * @param {string} props.selectedExerciseId - Currently selected exercise ID
 * @param {Function} props.onSearch - Handler for search input changes
 * @param {Function} props.onSelect - Handler for exercise selection
 * @param {string} props.label - Label for the search field
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Whether the component is disabled
 * @returns {JSX.Element} Exercise search component
 */
const ExerciseSearch = ({
  exercises = [],
  loading = false,
  selectedExerciseId,
  onSearch,
  onSelect,
  label = "Search and Select Exercise",
  placeholder = "Type to search for exercises...",
  disabled = false
}) => {
  // Find selected exercise from the list
  const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId) || null;

  /**
   * Render individual exercise option
   * @param {Object} props - Props from Autocomplete
   * @param {Object} option - Exercise option
   * @returns {JSX.Element} Exercise option component
   */
  const renderOption = (props, option) => {
    // Use the fallback muscle group function
    const allMuscles = getExerciseMuscleGroups(option);
    // For display, we'll show all muscles as primary if API doesn't provide separation
    const primaryMuscles = option.primary_muscle_groups?.length > 0 ? option.primary_muscle_groups : allMuscles;
    const supportingMuscles = option.supporting_muscle_groups || [];
    
    return (
      <li {...props} key={option.id}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', py: 1.5 }}>
          <FitnessCenterIcon sx={{ mr: 2, color: 'primary.main', flexShrink: 0, mt: 0.5 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              {option.name}
            </Typography>
            
            {/* Primary Muscles */}
            {primaryMuscles.length > 0 && (
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Target Muscles:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {primaryMuscles.map((muscle, index) => (
                    <Chip 
                      key={index}
                      label={muscle}
                      size="small"
                      variant="filled"
                      color="primary"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {/* Supporting Muscles */}
            {supportingMuscles.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Supporting:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {supportingMuscles.map((muscle, index) => (
                    <Chip 
                      key={index}
                      label={muscle}
                      size="small"
                      variant="outlined"
                      color="secondary"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {/* No muscles case - shouldn't happen now with fallback */}
            {primaryMuscles.length === 0 && supportingMuscles.length === 0 && (
              <Typography variant="caption" color="text.secondary">
                No muscle information available
              </Typography>
            )}
          </Box>
        </Box>
      </li>
    );
  };

  return (
    <Autocomplete
      options={exercises}
      getOptionLabel={(option) => option.name || ''}
      value={selectedExercise}
      loading={loading}
      disabled={disabled}
      onInputChange={(event, newInputValue) => {
        if (onSearch) {
          onSearch(newInputValue);
        }
      }}
      onChange={(event, newValue) => {
        if (onSelect) {
          onSelect(newValue);
        }
      }}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label={label}
          placeholder={placeholder}
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={renderOption}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      filterOptions={(x) => x} // Don't filter client-side since we're doing server-side search
      noOptionsText="Type at least 2 characters to search for exercises"
      loadingText="Searching exercises..."
      sx={{ mb: 2 }}
      ListboxProps={{
        sx: {
          '& .MuiAutocomplete-option': {
            alignItems: 'flex-start !important'
          }
        }
      }}
    />
  );
};

export default ExerciseSearch; 