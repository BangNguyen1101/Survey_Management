// API Configuration
export const API_BASE_URL = 'http://localhost:5029';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/Auth/login',
  REGISTER: '/api/Auth/register',
  LOGOUT: '/api/Auth/logout',
  REFRESH_TOKEN: '/api/Auth/refresh',
  PROFILE: '/api/Auth/profile',
  
  // User endpoints
  USERS: '/api/User',
  USERS_ME: '/api/User/me',
  
  // Department endpoints
  DEPARTMENTS: '/api/Department',
  
  // Question endpoints
  QUESTIONS: '/api/Question',
  
  // Test endpoints
  TESTS: '/api/Test',
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};
