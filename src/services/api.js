import axios from 'axios';
import { config } from '../config/constants.js';
import { isNetworkError, getNetworkErrorMessage } from '../utils/network.js';
import { saveRateLimitExpiry } from './storage.js';

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

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

/**
 * Retry an async function with exponential backoff
 * @param {Function} fn - The async function to retry
 * @param {number} retries - Number of retries remaining
 * @returns {Promise} The result of the function
 */
async function retryWithBackoff(fn, retries = MAX_RETRIES) {
  try {
    return await fn();
  } catch (error) {
    // Only retry network errors, not auth errors
    if (retries > 0 && error.isNetworkError) {
      const delay = RETRY_DELAY * (MAX_RETRIES - retries + 1);
      console.log(`Retrying in ${delay}ms... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1);
    }
    throw error;
  }
}

// API Functions

/**
 * Login with master password
 * @param {string} password - The master password
 * @returns {Promise<{
 *   success: boolean,
 *   token: string,           // JWE encrypted token
 *   expiresIn: number,       // Token expiration in seconds (e.g., 3600)
 *   expiresAt: string,       // ISO 8601 timestamp (e.g., "2025-12-05T11:00:00Z")
 *   sessionId: string        // Unique session identifier (UUID)
 * }>} Login response - Backend returns camelCase field names
 */
export async function login(password) {
  try {
    const response = await api.post('/api/auth/login', {
      password,
      application_id: config.getAppId(),
    });
    return response.data;
  } catch (error) {
    // Map error codes to user-friendly messages
    if (error.response) {
      const errorCode = error.response.data?.error;
      const errorMessage = error.response.data?.message;
      const retryAfter = error.response.data?.retryAfter;

      // Handle rate limiting (429 or AUTH006)
      if (error.response.status === 429 || errorCode === 'AUTH006') {
        // Calculate expiry timestamp
        const retrySeconds = retryAfter || 60; // Default to 60 seconds if not provided
        const expiryTimestamp = Date.now() + (retrySeconds * 1000);

        // Store rate limit expiry
        saveRateLimitExpiry('login', expiryTimestamp);

        // Throw error with rate limit info
        const rateLimitError = new Error('Too many attempts, please try again later');
        rateLimitError.isRateLimitError = true;
        rateLimitError.retryAfter = retrySeconds;
        rateLimitError.expiryTimestamp = expiryTimestamp;
        throw rateLimitError;
      }

      switch (errorCode) {
        case 'AUTH001':
          throw new Error('Invalid password');
        default:
          throw new Error(errorMessage || 'Login failed');
      }
    } else if (isNetworkError(error)) {
      const networkError = new Error(getNetworkErrorMessage(error));
      networkError.isNetworkError = true;
      throw networkError;
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

/**
 * Validate an existing token
 * @param {string} token - The authentication token
 * @param {string} salt - The salt used for token encryption
 * @returns {Promise<{
 *   success: boolean,
 *   valid: boolean,          // Whether token is valid
 *   expiresIn: number,       // Remaining seconds until expiration
 *   sessionId: string,       // Session identifier (UUID)
 *   applicationId: string,   // Application ID from token
 *   permissions: string[]    // Array of permissions (if any)
 * }>} Validation response - Backend returns camelCase field names
 */
export async function validateToken(token, salt) {
  try {
    const response = await api.post('/api/auth/validate', {
      token,
      salt,
      application_id: config.getAppId(),
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.message;
      const retryAfter = error.response.data?.retryAfter;

      // Handle rate limiting (429)
      if (error.response.status === 429) {
        // Calculate expiry timestamp
        const retrySeconds = retryAfter || 60; // Default to 60 seconds if not provided
        const expiryTimestamp = Date.now() + (retrySeconds * 1000);

        // Store rate limit expiry
        saveRateLimitExpiry('validate', expiryTimestamp);

        // Throw error with rate limit info
        const rateLimitError = new Error('Too many validation requests, please try again later');
        rateLimitError.isRateLimitError = true;
        rateLimitError.retryAfter = retrySeconds;
        rateLimitError.expiryTimestamp = expiryTimestamp;
        throw rateLimitError;
      }

      throw new Error(errorMessage || 'Token validation failed');
    } else if (isNetworkError(error)) {
      const networkError = new Error(getNetworkErrorMessage(error));
      networkError.isNetworkError = true;
      throw networkError;
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

/**
 * Logout and revoke token
 * @param {string} token - The authentication token to revoke
 * @param {string} salt - The salt used for token encryption
 * @returns {Promise<{
 *   success: boolean,
 *   message: string          // "Logout successful"
 * }>} Logout response - Backend returns camelCase field names
 */
export async function logout(token, salt) {
  try {
    const response = await api.post('/api/auth/logout', { token, salt });
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.message;
      throw new Error(errorMessage || 'Logout failed');
    } else if (isNetworkError(error)) {
      const networkError = new Error(getNetworkErrorMessage(error));
      networkError.isNetworkError = true;
      throw networkError;
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

/**
 * Refresh an existing token
 * @param {string} token - The current authentication token
 * @param {string} salt - The salt used for token encryption
 * @returns {Promise<{
 *   success: boolean,
 *   token: string,           // New JWE token (replace old one)
 *   salt: string,            // New salt for the refreshed token
 *   expiresIn: number,       // New expiration in seconds
 *   expiresAt: string,       // New expiration timestamp (ISO 8601)
 *   sessionId: string        // Session ID (same as before)
 * }>} Refresh response - Backend returns camelCase field names
 */
export async function refreshToken(token, salt) {
  try {
    const response = await api.post('/api/auth/refresh', { token, salt });
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.message;
      const retryAfter = error.response.data?.retryAfter;

      // Handle rate limiting (429)
      if (error.response.status === 429) {
        const retrySeconds = retryAfter || 60;
        const expiryTimestamp = Date.now() + (retrySeconds * 1000);

        saveRateLimitExpiry('refresh', expiryTimestamp);

        const rateLimitError = new Error('Too many refresh requests, please try again later');
        rateLimitError.isRateLimitError = true;
        rateLimitError.retryAfter = retrySeconds;
        rateLimitError.expiryTimestamp = expiryTimestamp;
        throw rateLimitError;
      }

      // Handle 401 - token revoked or invalid
      if (error.response.status === 401) {
        const authError = new Error(errorMessage || 'Token refresh failed - please login again');
        authError.isAuthError = true;
        throw authError;
      }

      throw new Error(errorMessage || 'Token refresh failed');
    } else if (isNetworkError(error)) {
      const networkError = new Error(getNetworkErrorMessage(error));
      networkError.isNetworkError = true;
      throw networkError;
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

export default api;
