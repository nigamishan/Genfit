import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the Authorization header from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const authDataString = localStorage.getItem('genfitAuth');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        if (authData && authData.token) {
          config.headers.Authorization = `Basic ${authData.token}`;
        }
      } catch (e) {
        console.error("Error parsing auth data from localStorage", e);
        // Optionally, clear the invalid item
        // localStorage.removeItem('genfitAuth');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- User Management --- Authenticated user uses /me, admin uses /admin/users/:username (not implemented here yet)

// GET /users/me (Get your profile)
export const getMyProfile = () => apiClient.get('/users/me');

// PUT /users/me (Update your profile)
export const updateMyProfile = (profileData) => apiClient.put('/users/me', profileData);

// DELETE /users/me (Delete your account)
export const deleteMyAccount = () => apiClient.delete('/users/me');

// POST /users (Create User - Public, but not part of the logged-in user flow defined for this UI)
// export const createUser = (userData) => apiClient.post('/users', userData);


// --- Progress Tracking --- All require auth

// GET /progress/me (Get your progress)
export const getMyProgress = (params) => {
  return apiClient.get('/progress/me', { 
    params,
    paramsSerializer: {
      indexes: false // This sends metric_types[]=value instead of metric_types[0]=value
    }
  });
};

// POST /progress (Log progress)
export const logProgress = (progressData) => apiClient.post('/progress', progressData);

// GET /progress/me/summary (Get your progress summary)
export const getMyProgressSummary = (params) => {
  return apiClient.get('/progress/me/summary', { 
    params,
    paramsSerializer: {
      indexes: false
    }
  });
};

// GET /progress/me/trend (Get your progress trend)
export const getMyProgressTrend = (params) => {
  return apiClient.get('/progress/me/trend', { 
    params,
    paramsSerializer: {
      indexes: false
    }
  });
};

// DELETE /progress (Delete progress entry)
export const deleteProgressEntry = (entryId) => apiClient.delete('/progress', { params: { entryId } });


// --- Workout Plan Management --- All require auth

// GET /workout/me (Get your workout plan)
export const getMyWorkoutPlan = () => apiClient.get('/workout/me');

// POST /workout/manual (Create workout plan - backend has /workout/manual, UI implies updating existing via PUT /workout/me)
// For simplicity, we'll assume a plan exists or is created, and /workout/me (PUT) handles its update.
// If a user has no plan, getMyWorkoutPlan might return 404, then UI could prompt to create or use PUT to set one.
export const createWorkoutPlan = (planData) => apiClient.post('/workout/manual', planData);

// PUT /workout/me (Update your workout plan)
export const updateMyWorkoutPlan = (planData) => apiClient.put('/workout/me', planData);

// DELETE /workout/me (Delete your workout plan)
export const deleteMyWorkoutPlan = () => apiClient.delete('/workout/me');


// --- Exercise Management (Admin & Public Search) ---

// GET /exercises/search (Public search for exercises)
export const searchExercises = (query) => apiClient.get('/exercises/search', { params: { query } });

// Admin exercise functions (not used by regular user UI directly based on requirements, but good to list if API supports)
// POST /admin/exercises
// GET /admin/exercises
// GET /admin/exercises/{id}
// PUT /admin/exercises/{id}
// DELETE /admin/exercises/{id}

// --- Workout Volume ---

// GET /workout/volume (Get daily workout volume data)
export const getWorkoutVolume = (params) => apiClient.get('/workout/volume', { params }); // params: day (optional)

export default apiClient;

// --- Authentication ---

// POST /auth/login (Login with Basic Auth)
export const login = (username, password) => {
  const credentials = btoa(`${username}:${password}`);
  return apiClient.post('/auth/login', {}, {
    headers: {
      'Authorization': `Basic ${credentials}`
    }
  });
}; 