import axios from 'axios';
import { config } from '../config/constants.js';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: config.API_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// API Functions

/**
 * Login with master password
 * @param {string} password - The master password
 * @returns {Promise<Object>} Response data containing token and expiry
 */
export async function login(password) {
  try {
    const response = await api.post('/api/auth/login', {
      password,
      application_id: config.APP_ID,
    });
    return response.data;
  } catch (error) {
    // Map error codes to user-friendly messages
    if (error.response) {
      const errorCode = error.response.data?.error;
      const errorMessage = error.response.data?.message;

      switch (errorCode) {
        case 'AUTH001':
          throw new Error('Invalid password');
        case 'AUTH006':
          throw new Error('Too many attempts, please try again later');
        default:
          throw new Error(errorMessage || 'Login failed');
      }
    } else if (error.request) {
      throw new Error('Connection failed, please try again');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

/**
 * Validate an existing token
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} Validation result
 */
export async function validateToken(token) {
  try {
    const response = await api.post('/api/auth/validate', {
      token,
      application_id: config.APP_ID,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.message;
      throw new Error(errorMessage || 'Token validation failed');
    } else if (error.request) {
      throw new Error('Connection failed, please try again');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

/**
 * Logout and revoke token
 * @param {string} token - The authentication token to revoke
 * @returns {Promise<Object>} Logout result
 */
export async function logout(token) {
  try {
    const response = await api.post(
      '/api/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.message;
      throw new Error(errorMessage || 'Logout failed');
    } else if (error.request) {
      throw new Error('Connection failed, please try again');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

export default api;
