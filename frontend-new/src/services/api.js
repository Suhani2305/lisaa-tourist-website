import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Check if we're on admin pages - use adminToken
    const isAdminRoute = window.location.pathname.includes('/admin');
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');
    
    // Priority: adminToken for admin routes, userToken for regular routes
    const token = isAdminRoute && adminToken ? adminToken : userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.includes('/admin');
      const isLoginPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
      
      // Don't clear tokens on admin routes
      if (!isAdminRoute) {
        const errorMessage = error.response?.data?.message || '';
        const errorCode = error.response?.data?.code || '';
        
        // Only clear tokens if it's explicitly a token-related error
        // Don't clear on generic 401s (might be permission issues, not auth issues)
        const isTokenError = 
          errorMessage.toLowerCase().includes('token') || 
          errorMessage.toLowerCase().includes('expired') || 
          errorMessage.toLowerCase().includes('invalid') ||
          errorMessage.toLowerCase().includes('unauthorized') ||
          errorCode === 'TOKEN_EXPIRED' ||
          errorCode === 'INVALID_TOKEN';
        
        if (isTokenError) {
          // Clear tokens only if it's a token error
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Only redirect if not already on login/register page
          if (!isLoginPage) {
            // Use setTimeout to avoid redirect loops
            setTimeout(() => {
              if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
                window.location.href = '/login';
              }
            }, 100);
          }
        }
        // If it's a 401 but not a token error, just reject - don't clear tokens
        // This handles cases like permission denied but user is still authenticated
      }
    }
    return Promise.reject(error);
  }
);

export default api;
