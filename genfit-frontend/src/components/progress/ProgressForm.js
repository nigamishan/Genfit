import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Collapse,
  Avatar,
  CircularProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import dayjs from 'dayjs';
import { AVAILABLE_METRIC_TYPES, METRIC_DISPLAY_NAMES } from '../../constants/progressConstants';

/**
 * Progress Entry Form Component
 */
const ProgressForm = ({ 
  newEntry, 
  showForm, 
  onEntryChange, 
  onDateChange, 
  onSubmit, 
  onToggleForm,
  submitting
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mb: 4 }}>
        {/* Toggle Form Button */}
        <Button 
          variant="contained" 
          startIcon={<AddCircleOutlineIcon />} 
          onClick={onToggleForm}
          size="large"
          sx={{ mb: 2 }}
        >
          {showForm ? 'Cancel' : 'Add New Progress Entry'}
        </Button>

        {/* Form */}
        <Collapse in={showForm}>
          <Paper elevation={2} sx={{ p: 3, border: '1px solid', borderColor: 'primary.light' }}>
            {/* Form Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
                <AddCircleOutlineIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Log New Progress Entry
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track your fitness journey with precise measurements
                </Typography>
              </Box>
            </Box>

            {/* Form Fields */}
            <Box component="form" onSubmit={onSubmit}>
              <Grid container spacing={3}>
                {/* Metric Type */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="metric-type-label">Metric Type</InputLabel>
                    <Select
                      labelId="metric-type-label"
                      name="metric_type"
                      value={newEntry.metric_type}
                      onChange={onEntryChange}
                      label="Metric Type"
                    >
                      {AVAILABLE_METRIC_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Typography>
                              {METRIC_DISPLAY_NAMES[type] || type}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Value */}
                <Grid item xs={12} sm={3}>
                  <TextField 
                    label="Value" 
                    name="value" 
                    type="number" 
                    value={newEntry.value} 
                    onChange={onEntryChange} 
                    fullWidth 
                    required 
                    InputProps={{ 
                      inputProps: { 
                        step: 'any',
                        min: 0
                      } 
                    }}
                    helperText="Enter a positive number"
                  />
                </Grid>

                {/* Unit (Display Only) */}
                <Grid item xs={12} sm={3}>
                  <TextField 
                    label="Unit" 
                    name="unit" 
                    value={newEntry.unit} 
                    fullWidth 
                    disabled 
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                        backgroundColor: 'grey.100'
                      }
                    }}
                  />
                </Grid>

                {/* Recorded Date */}
                <Grid item xs={12} sm={6}>
                  <DatePicker 
                    label="Recorded Date" 
                    value={newEntry.recorded_at} 
                    onChange={onDateChange} 
                    slotProps={{ 
                      textField: { 
                        fullWidth: true, 
                        required: true,
                        helperText: "When was this measurement taken?"
                      } 
                    }}
                    maxDate={dayjs()}
                  />
                </Grid>

                {/* Notes */}
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Notes (Optional)" 
                    name="notes" 
                    value={newEntry.notes} 
                    onChange={onEntryChange} 
                    fullWidth 
                    multiline 
                    rows={3}
                    placeholder="Add any relevant notes about this measurement..."
                    helperText="Optional context or details"
                  />
                </Grid>
              </Grid>

              {/* Form Actions */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={onToggleForm}
                  startIcon={<CancelIcon />}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={submitting || !newEntry.value || !newEntry.metric_type}
                  size="large"
                >
                  {submitting ? 'Logging...' : 'Log Entry'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Collapse>
      </Box>
    </LocalizationProvider>
  );
};

export default ProgressForm; 