import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile, deleteMyAccount } from '../api';
import { getInitialFormData, validateFormData, updateFormField } from '../utils/profileUtils';

/**
 * Custom hook for managing profile data and operations
 * @returns {Object} Profile state and handlers
 */
export const useProfile = () => {
  // State management
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(getInitialFormData(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const navigate = useNavigate();

  /**
   * Fetch user profile from API
   */
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { data } = await getMyProfile();
      setProfile(data);
      setFormData(getInitialFormData(data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile. Please try again.');
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        localStorage.removeItem('genfitAuth');
        navigate('/login', { state: { from: { pathname: '/profile' } } });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Handle form field changes
   */
  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => updateFormField(prev, name, parsedValue));
  }, []);

  /**
   * Handle goal types multi-select change
   */
  const handleGoalTypesChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        goal_types: typeof value === 'string' ? value.split(',') : value
      }
    }));
  }, []);

  /**
   * Submit form data to update profile
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate form data
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      setError(validation.error);
      setLoading(false);
      return;
    }

    try {
      const { data } = await updateMyProfile(formData);
      setProfile(data);
      setFormData(getInitialFormData(data));
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please ensure all fields are valid.');
    } finally {
      setLoading(false);
    }
  }, [formData]);

  /**
   * Delete user account
   */
  const handleDeleteAccount = useCallback(async () => {
    setDeleteConfirmOpen(false);
    setLoading(true);
    setError('');
    
    try {
      await deleteMyAccount();
      localStorage.removeItem('genfitAuth');
      navigate('/login', { state: { message: 'Account deleted successfully.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account.');
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Start editing mode
   */
  const startEditing = useCallback(() => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  }, []);

  /**
   * Cancel editing and reset form
   */
  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    setFormData(getInitialFormData(profile));
  }, [profile]);

  /**
   * Open delete confirmation dialog
   */
  const openDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(true);
  }, []);

  /**
   * Close delete confirmation dialog
   */
  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(false);
  }, []);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Return state and handlers
  return {
    // State
    profile,
    formData,
    loading,
    error,
    success,
    isEditing,
    deleteConfirmOpen,
    
    // Handlers
    handleChange,
    handleGoalTypesChange,
    handleSubmit,
    handleDeleteAccount,
    startEditing,
    cancelEditing,
    openDeleteConfirm,
    closeDeleteConfirm,
    
    // Utilities
    refetchProfile: fetchProfile
  };
}; 