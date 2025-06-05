import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { AVAILABLE_METRIC_TYPES, METRIC_DISPLAY_NAMES } from '../../constants/progressConstants';

/**
 * Progress Filters Component
 */
const ProgressFilters = ({ 
  filters, 
  onFilterChange, 
  onDateChange, 
  onApplyFilters, 
  onResetFilters,
  loading 
}) => {
  const hasActiveFilters = () => {
    return filters.metric_types.length > 0 || 
           filters.start_date || 
           filters.end_date;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FilterListIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Filter Progress Entries
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            {hasActiveFilters() && (
              <Chip 
                label={`${filters.metric_types.length} filters active`} 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        {/* Filter Controls */}
        <Grid container spacing={1} alignItems="center">
          {/* Metric Types Filter */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="metric-types-filter-label">Metrics</InputLabel>
              <Select
                labelId="metric-types-filter-label"
                multiple
                name="metric_types"
                value={filters.metric_types}
                onChange={onFilterChange}
                label="Metrics"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={METRIC_DISPLAY_NAMES[value] || value} 
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              >
                {AVAILABLE_METRIC_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Typography variant="body2">
                      {METRIC_DISPLAY_NAMES[type] || type}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Start Date Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker 
              label="From" 
              value={filters.start_date} 
              onChange={(date) => onDateChange('start_date', date)} 
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  size: 'small'
                } 
              }}
              maxDate={filters.end_date || undefined}
            />
          </Grid>

          {/* End Date Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker 
              label="To" 
              value={filters.end_date} 
              onChange={(date) => onDateChange('end_date', date)} 
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  size: 'small'
                } 
              }}
              minDate={filters.start_date || undefined}
            />
          </Grid>

          {/* Sort Order Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-order-label">Sort</InputLabel>
              <Select
                labelId="sort-order-label"
                name="sort_order"
                value={filters.sort_order}
                onChange={onFilterChange}
                label="Sort"
              >
                <MenuItem value="desc">Newest</MenuItem>
                <MenuItem value="asc">Oldest</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} md={3}>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              justifyContent: { xs: 'center', md: 'flex-start' },
              flexWrap: 'wrap'
            }}>
              <Button 
                variant="contained" 
                onClick={onApplyFilters} 
                disabled={loading}
                startIcon={<SearchIcon />}
                size="small"
                sx={{ minWidth: 80, fontSize: '0.8rem' }}
              >
                Apply
              </Button>
              
              {hasActiveFilters() && (
                <Button
                  variant="outlined"
                  onClick={onResetFilters} 
                  disabled={loading}
                  color="secondary"
                  size="small"
                  startIcon={<ClearIcon />}
                  sx={{ minWidth: 80, fontSize: '0.8rem' }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Active Filters Summary */}
        {hasActiveFilters() && (
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Active Filters:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {filters.metric_types.map(type => (
                <Chip 
                  key={type}
                  label={METRIC_DISPLAY_NAMES[type] || type}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
              {filters.start_date && (
                <Chip 
                  label={`From: ${filters.start_date.format('MMM DD, YYYY')}`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              )}
              {filters.end_date && (
                <Chip 
                  label={`To: ${filters.end_date.format('MMM DD, YYYY')}`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </LocalizationProvider>
  );
};

export default ProgressFilters; 