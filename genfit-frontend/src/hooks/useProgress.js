import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { 
  getMyProgress, 
  logProgress, 
  deleteProgressEntry, 
  getMyProgressSummary, 
  getMyProgressTrend,
  getWorkoutVolume 
} from '../api';
import { 
  DEFAULT_FILTERS, 
  METRIC_TYPES 
} from '../constants/progressConstants';
import { 
  createEmptyProgressEntry, 
  validateProgressEntry,
  getMetricUnit 
} from '../utils/progressUtils';

/**
 * Custom hook for managing progress data and operations
 */
export const useProgress = () => {
  // Progress data state
  const [progressEntries, setProgressEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [workoutVolume, setWorkoutVolume] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form and filter state
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [newEntry, setNewEntry] = useState(createEmptyProgressEntry(METRIC_TYPES.WEIGHT));
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, entryId: null });

  // Fetch progress entries with filters
  const fetchProgressData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      
      // Add metric types as array
      if (filters.metric_types.length > 0) {
        params.metric_types = filters.metric_types;
      }
      
      // Add other filter parameters
      if (filters.start_date) {
        params.start_date = filters.start_date.toISOString();
      }
      if (filters.end_date) {
        params.end_date = filters.end_date.toISOString();
      }
      params.sort_order = filters.sort_order;
      params.limit = filters.limit;
      
      const { data } = await getMyProgress(params);
      setProgressEntries(data.entries || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch progress entries.');
      if (err.response?.status === 401) {
        // Handle authentication error
        localStorage.removeItem('genfitAuth');
        window.location.href = '/login';
      }
    }
    setLoading(false);
  }, [filters]);

  // Fetch progress summary
  const fetchSummary = useCallback(async () => {
    try {
      const params = {};
      
      // Add metric types as array for summary
      if (filters.metric_types.length > 0) {
        params.metric_types = filters.metric_types;
      }
      
      const { data } = await getMyProgressSummary(params);
      setSummary(data.summary || {});
    } catch (err) {
      console.error("Failed to fetch summary:", err.response?.data?.message || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem('genfitAuth');
        window.location.href = '/login';
      }
    }
  }, [filters.metric_types]);

  // Fetch progress trends
  const fetchTrends = useCallback(async () => {
    try {
      const params = {};
      
      // Add metric types as array for trends
      const metricTypes = filters.metric_types.length > 0 
        ? filters.metric_types 
        : Object.values(METRIC_TYPES);
      
      params.metric_types = metricTypes;
      
      const { data } = await getMyProgressTrend(params);
      setTrends(data.trends || {});
    } catch (err) {
      console.error("Failed to fetch trends:", err.response?.data?.message || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem('genfitAuth');
        window.location.href = '/login';
      }
    }
  }, [filters.metric_types]);

  // Fetch workout volume data
  const fetchWorkoutVolume = useCallback(async () => {
    try {
      const { data } = await getWorkoutVolume();
      setWorkoutVolume(data);
    } catch (err) {
      console.error("Failed to fetch workout volume:", err.response?.data?.message || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem('genfitAuth');
        window.location.href = '/login';
      }
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchProgressData();
    fetchSummary();
    fetchTrends();
    fetchWorkoutVolume();
  }, [fetchProgressData, fetchSummary, fetchTrends, fetchWorkoutVolume]);

  // Auto-apply filters when they change (except on initial load)
  useEffect(() => {
    // Skip on initial load when all filters are default
    const isInitialState = 
      filters.metric_types.length === 0 && 
      !filters.start_date && 
      !filters.end_date && 
      filters.sort_order === 'desc';
    
    if (!isInitialState) {
      fetchProgressData();
      fetchTrends();
    }
  }, [filters, fetchProgressData, fetchTrends]);

  // Filter handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFilters(prev => ({ ...prev, [name]: date }));
  };

  const applyFilters = () => {
    // Force a re-fetch by triggering the useEffect dependency
    setLoading(true);
    // Use a small delay to ensure state is updated
    setTimeout(() => {
      fetchProgressData();
      fetchTrends();
    }, 50);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Form handlers
  const handleNewEntryChange = (e) => {
    const { name, value } = e.target;
    let updatedEntry = { ...newEntry, [name]: value };
    
    // Update unit when metric type changes
    if (name === 'metric_type') {
      updatedEntry.unit = getMetricUnit(value);
    }
    
    setNewEntry(updatedEntry);
  };

  const handleNewEntryDateChange = (date) => {
    setNewEntry(prev => ({ ...prev, recorded_at: date }));
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (!showAddForm) {
      // Reset form when opening
      setNewEntry(createEmptyProgressEntry(METRIC_TYPES.WEIGHT));
      setError('');
      setSuccess('');
    }
  };

  // CRUD operations
  const addProgressEntry = async (e) => {
    e.preventDefault();
    
    // Validate entry
    const validation = validateProgressEntry(newEntry);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const payload = {
        ...newEntry,
        value: parseFloat(newEntry.value),
        recorded_at: newEntry.recorded_at.toISOString(),
      };
      
      await logProgress(payload);
      setSuccess('Progress entry added successfully!');
      setShowAddForm(false);
      setNewEntry(createEmptyProgressEntry(METRIC_TYPES.WEIGHT));
      
      // Refresh all data
      await Promise.all([
        fetchProgressData(),
        fetchSummary(),
        fetchTrends()
      ]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add progress entry.');
      if (err.response?.status === 401) {
        localStorage.removeItem('genfitAuth');
        window.location.href = '/login';
      }
    }
    setSubmitting(false);
  };

  const openDeleteConfirm = (entryId) => {
    setDeleteConfirm({ open: true, entryId });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ open: false, entryId: null });
  };

  const deleteEntry = async () => {
    if (!deleteConfirm.entryId) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await deleteProgressEntry(deleteConfirm.entryId);
      setSuccess('Progress entry deleted successfully!');
      
      // Refresh all data
      await Promise.all([
        fetchProgressData(),
        fetchSummary(),
        fetchTrends()
      ]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete progress entry.');
      if (err.response?.status === 401) {
        localStorage.removeItem('genfitAuth');
        window.location.href = '/login';
      }
    }
    
    closeDeleteConfirm();
    setSubmitting(false);
  };

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return {
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
    clearMessages,
    
    // Manual refresh functions
    refreshData: () => {
      fetchProgressData();
      fetchSummary();
      fetchTrends();
      fetchWorkoutVolume();
    },
    refreshProgressData: fetchProgressData,
    refreshSummary: fetchSummary,
    refreshTrends: fetchTrends,
    refreshWorkoutVolume: fetchWorkoutVolume
  };
}; 