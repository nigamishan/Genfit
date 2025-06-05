import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Paper,
  Avatar,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { formatMetricType, formatProgressDate } from '../../utils/progressUtils';

/**
 * Individual Progress Entry Component
 */
const ProgressEntryItem = ({ entry, onDelete, loading }) => {
  return (
    <>
      <ListItem sx={{ py: 2 }}>
        <ListItemText 
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Chip 
                label={formatMetricType(entry.metric_type)} 
                size="small" 
                color="primary" 
                variant="outlined"
              />
              <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                {entry.value} {entry.unit}
              </Typography>
            </Box>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Recorded: {formatProgressDate(entry.recorded_at)}
              </Typography>
              {entry.notes && (
                <Typography variant="body2" sx={{ 
                  fontStyle: 'italic', 
                  color: 'text.secondary',
                  backgroundColor: 'grey.50',
                  p: 1,
                  borderRadius: 1,
                  mt: 1
                }}>
                  Notes: {entry.notes}
                </Typography>
              )}
            </Box>
          }
        />
        <ListItemSecondaryAction>
          <IconButton 
            edge="end" 
            aria-label="delete" 
            onClick={() => onDelete(entry.id)} 
            disabled={loading}
            color="error"
            sx={{
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'white'
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  );
};

/**
 * Empty State Component
 */
const EmptyState = () => (
  <Box sx={{ textAlign: 'center', py: 6 }}>
    <Avatar sx={{ 
      bgcolor: 'grey.100', 
      color: 'grey.400', 
      width: 80, 
      height: 80, 
      mx: 'auto', 
      mb: 2 
    }}>
      <ListAltIcon fontSize="large" />
    </Avatar>
    <Typography variant="h6" color="text.secondary" gutterBottom>
      No Progress Entries Found
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Try adjusting your filters or add a new progress entry to get started.
    </Typography>
  </Box>
);

/**
 * Loading State Component
 */
const LoadingState = () => (
  <Box sx={{ textAlign: 'center', py: 6 }}>
    <CircularProgress />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
      Loading progress entries...
    </Typography>
  </Box>
);

/**
 * Main Progress Logs Component
 */
const ProgressLogs = ({ progressEntries, onDeleteEntry, loading }) => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 56, height: 56 }}>
          <ListAltIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
            Progress Logs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            All your logged progress entries
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto', textAlign: 'right' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
            {progressEntries.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Entries
          </Typography>
        </Box>
      </Box>

      {/* Progress Entries List */}
      <Paper elevation={2}>
        {loading && progressEntries.length === 0 ? (
          <LoadingState />
        ) : progressEntries.length > 0 ? (
          <List sx={{ py: 0 }}>
            {progressEntries.map((entry) => (
              <ProgressEntryItem
                key={entry.id}
                entry={entry}
                onDelete={onDeleteEntry}
                loading={loading}
              />
            ))}
          </List>
        ) : (
          <EmptyState />
        )}
      </Paper>

      {/* Results Info */}
      {progressEntries.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {progressEntries.length} progress entries
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProgressLogs; 