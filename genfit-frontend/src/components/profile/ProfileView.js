import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Avatar, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  LinearProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScaleIcon from '@mui/icons-material/Scale';
import HeightIcon from '@mui/icons-material/Height';
import CakeIcon from '@mui/icons-material/Cake';
import EmailIcon from '@mui/icons-material/Email';
import SportsIcon from '@mui/icons-material/Sports';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { hasPersonalRecords } from '../../utils/profileUtils';

/**
 * Component to display user basic information
 */
const UserInfoSection = ({ profile }) => {
  return (
    <Card elevation={2} sx={{ mb: 3, border: '1px solid', borderColor: 'primary.light' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
              User Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Basic personal details
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={profile.name} 
                  secondary="Full Name"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={profile.email} 
                  secondary="Email Address"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CakeIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={`${profile.age} years old`} 
                  secondary="Age"
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Chip 
                      label={profile.sex} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  } 
                  secondary="Gender"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ScaleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={`${profile.weight} kg`} 
                  secondary="Weight"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HeightIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={`${profile.height} cm`} 
                  secondary="Height"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

/**
 * Component to display current fitness information
 */
const CurrentFitnessSection = ({ profile }) => {
  const currentFitness = profile.current_fitness || {};
  const personalRecords = currentFitness.personal_records || {};
  const hasRecords = hasPersonalRecords(personalRecords);

  // Calculate fitness level progress (beginner: 33%, intermediate: 66%, advanced: 100%)
  const getFitnessProgress = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return 33;
      case 'intermediate': return 66;
      case 'advanced': return 100;
      default: return 0;
    }
  };

  return (
    <Card elevation={2} sx={{ mb: 3, border: '1px solid', borderColor: 'success.light' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 48, height: 48 }}>
            <FitnessCenterIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
              Current Fitness
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your current fitness status and achievements
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {/* Fitness Level */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Fitness Level
                </Typography>
                <Chip 
                  label={currentFitness.fitness_level || 'Not set'} 
                  size="small" 
                  color="success"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={getFitnessProgress(currentFitness.fitness_level)} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            {/* Training Frequency */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarViewWeekIcon sx={{ mr: 2, color: 'success.main' }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {currentFitness.training_frequency || 0} days/week
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Training Frequency
                </Typography>
              </Box>
            </Box>

            {/* Body Fat Percentage */}
            {currentFitness.body_fat_percentage > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SportsIcon sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {currentFitness.body_fat_percentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Body Fat Percentage
                  </Typography>
                </Box>
              </Box>
            )}
          </Grid>

          {/* Personal Records */}
          {hasRecords && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
                Personal Records (PR)
              </Typography>
              <Stack spacing={2}>
                {personalRecords.deadlift > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Deadlift</Typography>
                    <Chip label={`${personalRecords.deadlift} kg`} size="small" variant="outlined" />
                  </Box>
                )}
                {personalRecords.squat > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Squat</Typography>
                    <Chip label={`${personalRecords.squat} kg`} size="small" variant="outlined" />
                  </Box>
                )}
                {personalRecords.bench > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Bench Press</Typography>
                    <Chip label={`${personalRecords.bench} kg`} size="small" variant="outlined" />
                  </Box>
                )}
              </Stack>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

/**
 * Component to display fitness goals
 */
const GoalsSection = ({ profile }) => {
  const goals = profile.goals || {};
  const targetRecords = goals.target_personal_records || {};
  const hasTargetRecords = hasPersonalRecords(targetRecords);

  return (
    <Card elevation={2} sx={{ mb: 3, border: '1px solid', borderColor: 'warning.light' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'warning.main', mr: 2, width: 48, height: 48 }}>
            <TrendingUpIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'warning.main' }}>
              Fitness Goals
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your targets and aspirations
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {/* Goal Types */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Goal Types
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {goals.goal_types && goals.goal_types.length > 0 ? (
                  goals.goal_types.map((goal, index) => (
                    <Chip 
                      key={index} 
                      label={goal} 
                      size="small" 
                      color="warning" 
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No goals specified
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Target Values */}
            <Stack spacing={2}>
              {goals.target_weight > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ScaleIcon sx={{ mr: 2, color: 'warning.main' }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {goals.target_weight} kg
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Target Weight
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {goals.target_body_fat > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SportsIcon sx={{ mr: 2, color: 'warning.main' }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {goals.target_body_fat}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Target Body Fat
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </Grid>

          {/* Target Personal Records */}
          {hasTargetRecords && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'warning.main' }}>
                Target Personal Records
              </Typography>
              <Stack spacing={2}>
                {targetRecords.deadlift > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Target Deadlift</Typography>
                    <Chip label={`${targetRecords.deadlift} kg`} size="small" color="warning" variant="outlined" />
                  </Box>
                )}
                {targetRecords.squat > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Target Squat</Typography>
                    <Chip label={`${targetRecords.squat} kg`} size="small" color="warning" variant="outlined" />
                  </Box>
                )}
                {targetRecords.bench > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Target Bench Press</Typography>
                    <Chip label={`${targetRecords.bench} kg`} size="small" color="warning" variant="outlined" />
                  </Box>
                )}
              </Stack>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

/**
 * ProfileView component for displaying user profile in read-only mode
 * @param {Object} profile - User profile data
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onDelete - Callback when delete button is clicked
 * @param {boolean} loading - Loading state
 */
const ProfileView = ({ profile, onEdit, onDelete, loading }) => {
  return (
    <Box>
      {/* User Information Section */}
      <UserInfoSection profile={profile} />
      
      {/* Current Fitness Section */}
      <CurrentFitnessSection profile={profile} />
      
      {/* Goals Section */}
      <GoalsSection profile={profile} />

      {/* Action Buttons */}
      <Card elevation={2} sx={{ bgcolor: 'grey.50' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              onClick={onEdit} 
              disabled={loading}
              startIcon={<EditIcon />}
              size="large"
              sx={{ minWidth: 140 }}
            >
              Edit Profile
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={onDelete} 
              disabled={loading}
              startIcon={<DeleteIcon />}
              size="large"
              sx={{ minWidth: 140 }}
            >
              Delete Account
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileView; 