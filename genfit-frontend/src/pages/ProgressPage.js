import React, { useState } from 'react';
import {
  Typography,
  Container,
  Paper,
  Box,
  Alert,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { 
  ProgressDashboard, 
  ProgressLogs, 
  ProgressFilters, 
  ProgressForm, 
  DeleteConfirmDialog 
} from '../components/progress';
import { useProgress } from '../hooks/useProgress';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

/**
 * Tab Panel Component
 */
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`progress-tabpanel-${index}`}
      aria-labelledby={`progress-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

/**
 * Main Progress Page Component
 */
const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Use the custom progress hook
  const {
    // Data
    progressEntries,
    summary,
    trends,
    workoutVolume,
    
    // UI State
    loading,
    submitting,
    error,
    success,
    
    // Form State
    filters,
    newEntry,
    showAddForm,
    deleteConfirm,
    
    // Handlers
    handleFilterChange,
    handleDateChange,
    applyFilters,
    resetFilters,
    handleNewEntryChange,
    handleNewEntryDateChange,
    toggleAddForm,
    addProgressEntry,
    openDeleteConfirm,
    closeDeleteConfirm,
    deleteEntry,
    clearMessages
  } = useProgress();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Clear messages when switching tabs
    clearMessages();
  };

  return (
    <Container maxWidth="xl">
      <Paper sx={{ p: { xs: 2, md: 3 }, mt: 3 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Progress Tracking
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Monitor your fitness journey with comprehensive tracking and insights
          </Typography>
        </Box>

        {/* Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearMessages}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={clearMessages}>
            {success}
          </Alert>
        )}

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="progress sections"
            variant="fullWidth"
          >
            <Tab 
              icon={<DashboardIcon />} 
              label="Dashboard" 
              id="progress-tab-0"
              aria-controls="progress-tabpanel-0"
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={
                <Badge badgeContent={progressEntries.length} color="primary" max={999}>
                  <ListAltIcon />
                </Badge>
              } 
              label="Progress Logs" 
              id="progress-tab-1"
              aria-controls="progress-tabpanel-1"
              sx={{ minHeight: 72 }}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        
        {/* Dashboard Tab */}
        <TabPanel value={activeTab} index={0}>
          <ProgressDashboard
            summary={summary}
            trends={trends}
            workoutVolume={workoutVolume}
            loading={loading}
          />
        </TabPanel>

        {/* Progress Logs Tab */}
        <TabPanel value={activeTab} index={1}>
          {/* Progress Entry Form */}
          <ProgressForm
            newEntry={newEntry}
            showForm={showAddForm}
            onEntryChange={handleNewEntryChange}
            onDateChange={handleNewEntryDateChange}
            onSubmit={addProgressEntry}
            onToggleForm={toggleAddForm}
            submitting={submitting}
          />

          {/* Filters */}
          <ProgressFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onDateChange={handleDateChange}
            onApplyFilters={applyFilters}
            onResetFilters={resetFilters}
            loading={loading}
          />

          {/* Progress Logs */}
          <ProgressLogs
            progressEntries={progressEntries}
            onDeleteEntry={openDeleteConfirm}
            loading={loading}
          />
        </TabPanel>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={deleteConfirm.open}
          onClose={closeDeleteConfirm}
          onConfirm={deleteEntry}
          loading={submitting}
        />
      </Paper>
    </Container>
  );
};

export default ProgressPage; 