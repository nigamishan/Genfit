import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Alert
} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import InsightsIcon from '@mui/icons-material/Insights';
import { 
  generateChartData, 
  generateChartOptions,
  generateVolumeChartData,
  generateVolumeChartOptions,
  calculateProgressStats,
  formatMetricType,
  calculateTotalWeeklyVolume
} from '../../utils/progressUtils';
import { AVAILABLE_METRIC_TYPES } from '../../constants/progressConstants';

/**
 * Progress Summary Cards Component
 */
const ProgressSummaryCards = ({ summary }) => {
  if (!summary || Object.keys(summary).length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        No progress summary available. Start logging your progress to see insights!
      </Alert>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {Object.entries(summary).map(([metric, data]) => {
        const stats = calculateProgressStats(data);
        return (
          <Grid item xs={12} sm={6} md={4} key={metric}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
                    <InsightsIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatMetricType(metric)}
                  </Typography>
                </Box>
                
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Latest:</Typography>
                    <Chip label={stats.latest} size="small" color="primary" />
                  </Box>
                  
                  {stats.latestDate && (
                    <Typography variant="caption" color="text.secondary" align="center">
                      {stats.latestDate}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Range:</Typography>
                    <Typography variant="body2">{stats.min} - {stats.max}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Average:</Typography>
                    <Typography variant="body2">{stats.average}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

/**
 * Progress Trends Charts Component
 */
const ProgressTrendsCharts = ({ trends }) => {
  if (!trends || Object.keys(trends).length === 0) {
    return (
      <Alert severity="info">
        No trend data available. Log multiple entries for the same metric to see progress charts.
      </Alert>
    );
  }

  const metricsWithTrends = Object.keys(trends).filter(
    metricType => trends[metricType] && trends[metricType].length > 1
  );

  if (metricsWithTrends.length === 0) {
    return (
      <Alert severity="info">
        Trend charts require at least 2 data points per metric. Keep logging to see your progress!
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      {metricsWithTrends.map(metricType => (
        <Grid item xs={12} lg={6} key={metricType}>
          <Paper elevation={1} sx={{ p: 3, height: 400 }}>
            <Box sx={{ height: '100%' }}>
              <Line 
                data={generateChartData(metricType, trends[metricType])} 
                options={generateChartOptions(metricType)}
              />
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * Workout Volume Chart Component
 */
const WorkoutVolumeChart = ({ workoutVolume }) => {
  const totalWeeklyVolume = calculateTotalWeeklyVolume(workoutVolume?.daily_volumes || []);
  
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 48, height: 48 }}>
          <FitnessCenterIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
            Workout Volume
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Weekly training sets breakdown
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto', textAlign: 'right' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
            {totalWeeklyVolume}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Weekly Sets
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: 300 }}>
        <Bar 
          data={generateVolumeChartData(workoutVolume?.daily_volumes || [])} 
          options={generateVolumeChartOptions()}
        />
      </Box>

      {workoutVolume?.daily_volumes && workoutVolume.daily_volumes.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Daily Breakdown:
          </Typography>
          <Grid container spacing={1}>
            {workoutVolume.daily_volumes.map(dayData => (
              <Grid item xs={12} sm={6} md={3} key={dayData.day}>
                <Card variant="outlined" sx={{ p: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {dayData.day_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dayData.total_sets} sets
                  </Typography>
                  {dayData.exercises && dayData.exercises.length > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {dayData.exercises.length} exercise{dayData.exercises.length !== 1 ? 's' : ''}
                    </Typography>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

/**
 * Main Progress Dashboard Component
 */
const ProgressDashboard = ({ summary, trends, workoutVolume, loading }) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading dashboard data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
          <TrendingUpIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Progress Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visual insights into your fitness journey
          </Typography>
        </Box>
      </Box>

      {/* Workout Volume Section */}
      <WorkoutVolumeChart workoutVolume={workoutVolume} />

      {/* Progress Summary Cards */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Progress Summary
      </Typography>
      <ProgressSummaryCards summary={summary} />

      {/* Progress Trends Charts */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Progress Trends
      </Typography>
      <ProgressTrendsCharts trends={trends} />
    </Box>
  );
};

export default ProgressDashboard; 