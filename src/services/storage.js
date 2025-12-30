import { config } from '../config/constants.js';
import { isLocalStorageAvailable, isSessionStorageAvailable, isQuotaExceededError } from '../utils/storage.js';

/**
 * Save permissions to browser storage
 * @param {string[]} permissions - Array of permission strings
 * @param {boolean} rememberMe - If true, use localStorage; if false, use sessionStorage
 */
export function savePermissions(permissions, rememberMe = false) {
  // Determine which storage to use based on rememberMe preference
  let storage;

  if (rememberMe) {
    storage = isLocalStorageAvailable() ? localStorage : sessionStorage;
  } else {
    storage = isSessionStorageAvailable() ? sessionStorage : localStorage;
  }

  if (!storage) {
    console.error('Browser storage unavailable, cannot save permissions');
    return;
  }

  try {
    storage.setItem(config.PERMISSIONS_KEY, JSON.stringify(permissions || []));
  } catch (error) {
    console.error('Error saving permissions:', error);
  }
}

/**
 * Retrieve permissions from browser storage
 * Checks both localStorage and sessionStorage
 * @returns {string[]} Array of permission strings, empty array if not found
 */
export function getPermissions() {
  try {
    // Try localStorage first
    const permissions = localStorage.getItem(config.PERMISSIONS_KEY);
    if (permissions) return JSON.parse(permissions);
  } catch (error) {
    console.error('Error retrieving permissions from localStorage:', error);
  }

  try {
    // Fall back to sessionStorage
    const permissions = sessionStorage.getItem(config.PERMISSIONS_KEY);
    if (permissions) return JSON.parse(permissions);
  } catch (error) {
    console.error('Error retrieving permissions from sessionStorage:', error);
  }

  return [];
}

/**
 * Save authentication token and expiration to browser storage
 * @param {string} token - The authentication token
 * @param {string} salt - The salt used for token encryption
 * @param {string} sessionId - The session ID
 * @param {number} expiresIn - Token lifetime in seconds
 * @param {boolean} rememberMe - If true, use localStorage; if false, use sessionStorage
 * @throws {Error} If storage is unavailable or quota exceeded
 */
export function saveToken(token, salt, sessionId, expiresIn, rememberMe = false) {
  // Determine which storage to use based on rememberMe preference
  let storage, type;

  if (rememberMe) {
    // User wants to be remembered - use localStorage
    if (isLocalStorageAvailable()) {
      storage = localStorage;
      type = 'localStorage';
    } else {
      // Fall back to sessionStorage if localStorage unavailable
      storage = sessionStorage;
      type = 'sessionStorage';
      console.warn('localStorage unavailable, falling back to sessionStorage');
    }
  } else {
    // Session only - use sessionStorage
    if (isSessionStorageAvailable()) {
      storage = sessionStorage;
      type = 'sessionStorage';
    } else {
      // Fall back to localStorage if sessionStorage unavailable
      storage = localStorage;
      type = 'localStorage';
      console.warn('sessionStorage unavailable, falling back to localStorage');
    }
  }

  if (!storage) {
    throw new Error('Browser storage is disabled. Please enable cookies and storage to continue.');
  }

  try {
    // Save token
    storage.setItem(config.TOKEN_KEY, token);

    // Save salt
    storage.setItem(config.SALT_KEY, salt);

    // Save session ID
    storage.setItem(config.SESSION_ID_KEY, sessionId);

    // Calculate and save expiration timestamp
    const expirationTime = Date.now() + (expiresIn * 1000);
    storage.setItem(config.EXPIRY_KEY, expirationTime.toString());

    // Log which storage was used (helpful for debugging)
    if (type === 'sessionStorage') {
      console.log('Using sessionStorage: your session will expire when you close the browser tab');
    } else {
      console.log('Using localStorage: your session will persist after closing the browser');
    }
  } catch (error) {
    console.error(`Error saving token to ${type}:`, error);

    if (isQuotaExceededError(error)) {
      throw new Error('Storage quota exceeded. Please clear your browser data and try again.');
    }

    throw new Error('Failed to save authentication token. Please check your browser settings.');
  }
}

/**
 * Retrieve authentication token from browser storage
 * Checks both localStorage and sessionStorage
 * @returns {string|null} The token or null if not found
 */
export function getToken() {
  try {
    // Try localStorage first
    const token = localStorage.getItem(config.TOKEN_KEY);
    if (token) return token;
  } catch (error) {
    console.error('Error retrieving token from localStorage:', error);
  }

  try {
    // Fall back to sessionStorage
    const token = sessionStorage.getItem(config.TOKEN_KEY);
    if (token) return token;
  } catch (error) {
    console.error('Error retrieving token from sessionStorage:', error);
  }

  return null;
}

/**
 * Retrieve salt from browser storage
 * Checks both localStorage and sessionStorage
 * @returns {string|null} The salt or null if not found
 */
export function getSalt() {
  try {
    // Try localStorage first
    const salt = localStorage.getItem(config.SALT_KEY);
    if (salt) return salt;
  } catch (error) {
    console.error('Error retrieving salt from localStorage:', error);
  }

  try {
    // Fall back to sessionStorage
    const salt = sessionStorage.getItem(config.SALT_KEY);
    if (salt) return salt;
  } catch (error) {
    console.error('Error retrieving salt from sessionStorage:', error);
  }

  return null;
}

/**
 * Retrieve session ID from browser storage
 * Checks both localStorage and sessionStorage
 * @returns {string|null} The session ID or null if not found
 */
export function getSessionId() {
  try {
    // Try localStorage first
    const sessionId = localStorage.getItem(config.SESSION_ID_KEY);
    if (sessionId) return sessionId;
  } catch (error) {
    console.error('Error retrieving session ID from localStorage:', error);
  }

  try {
    // Fall back to sessionStorage
    const sessionId = sessionStorage.getItem(config.SESSION_ID_KEY);
    if (sessionId) return sessionId;
  } catch (error) {
    console.error('Error retrieving session ID from sessionStorage:', error);
  }

  return null;
}

/**
 * Retrieve token expiration timestamp from browser storage
 * Checks both localStorage and sessionStorage
 * @returns {number|null} The expiration timestamp or null if not found
 */
export function getTokenExpiry() {
  try {
    // Try localStorage first
    const expiry = localStorage.getItem(config.EXPIRY_KEY);
    if (expiry) return parseInt(expiry, 10);
  } catch (error) {
    console.error('Error retrieving token expiry from localStorage:', error);
  }

  try {
    // Fall back to sessionStorage
    const expiry = sessionStorage.getItem(config.EXPIRY_KEY);
    if (expiry) return parseInt(expiry, 10);
  } catch (error) {
    console.error('Error retrieving token expiry from sessionStorage:', error);
  }

  return null;
}

/**
 * Remove token and expiration from browser storage
 * Clears from both localStorage and sessionStorage
 */
export function clearToken() {
  // Clear from localStorage
  try {
    localStorage.removeItem(config.TOKEN_KEY);
    localStorage.removeItem(config.SALT_KEY);
    localStorage.removeItem(config.SESSION_ID_KEY);
    localStorage.removeItem(config.EXPIRY_KEY);
    localStorage.removeItem(config.PERMISSIONS_KEY);
  } catch (error) {
    console.error('Error clearing token from localStorage:', error);
  }

  // Clear from sessionStorage
  try {
    sessionStorage.removeItem(config.TOKEN_KEY);
    sessionStorage.removeItem(config.SALT_KEY);
    sessionStorage.removeItem(config.SESSION_ID_KEY);
    sessionStorage.removeItem(config.EXPIRY_KEY);
    sessionStorage.removeItem(config.PERMISSIONS_KEY);
  } catch (error) {
    console.error('Error clearing token from sessionStorage:', error);
  }
}

/**
 * Save user's storage preference (Remember Me)
 * @param {boolean} rememberMe - User's preference for persistent storage
 */
export function saveStoragePreference(rememberMe) {
  try {
    // Store preference in localStorage so it persists across sessions
    localStorage.setItem(config.STORAGE_PREFERENCE_KEY, rememberMe.toString());
  } catch (error) {
    console.error('Error saving storage preference:', error);
  }
}

/**
 * Get user's storage preference (Remember Me)
 * @returns {boolean} User's preference, defaults to false (session-only) for security
 */
export function getStoragePreference() {
  try {
    const preference = localStorage.getItem(config.STORAGE_PREFERENCE_KEY);
    return preference === 'true';
  } catch (error) {
    console.error('Error retrieving storage preference:', error);
    return false; // Default to session-only for security
  }
}

/**
 * Save rate limit expiry timestamp for a specific endpoint
 * @param {string} endpoint - The endpoint identifier ('login' or 'validate')
 * @param {number} expiryTimestamp - The timestamp when rate limit expires
 */
export function saveRateLimitExpiry(endpoint, expiryTimestamp) {
  try {
    const storageKey = endpoint === 'login'
      ? config.RATE_LIMIT_LOGIN_KEY
      : config.RATE_LIMIT_VALIDATE_KEY;

    localStorage.setItem(storageKey, expiryTimestamp.toString());
  } catch (error) {
    console.error(`Error saving rate limit expiry for ${endpoint}:`, error);
  }
}

/**
 * Get rate limit expiry timestamp for a specific endpoint
 * @param {string} endpoint - The endpoint identifier ('login' or 'validate')
 * @returns {number|null} The expiry timestamp or null if not rate limited
 */
export function getRateLimitExpiry(endpoint) {
  try {
    const storageKey = endpoint === 'login'
      ? config.RATE_LIMIT_LOGIN_KEY
      : config.RATE_LIMIT_VALIDATE_KEY;

    const expiry = localStorage.getItem(storageKey);
    return expiry ? parseInt(expiry, 10) : null;
  } catch (error) {
    console.error(`Error retrieving rate limit expiry for ${endpoint}:`, error);
    return null;
  }
}

/**
 * Clear rate limit expiry for a specific endpoint
 * @param {string} endpoint - The endpoint identifier ('login' or 'validate')
 */
export function clearRateLimitExpiry(endpoint) {
  try {
    const storageKey = endpoint === 'login'
      ? config.RATE_LIMIT_LOGIN_KEY
      : config.RATE_LIMIT_VALIDATE_KEY;

    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error(`Error clearing rate limit expiry for ${endpoint}:`, error);
  }
}

/**
 * Check if currently rate limited for a specific endpoint
 * @param {string} endpoint - The endpoint identifier ('login' or 'validate')
 * @returns {boolean} True if currently rate limited, false otherwise
 */
export function isRateLimited(endpoint) {
  const expiry = getRateLimitExpiry(endpoint);
  if (!expiry) return false;

  return Date.now() < expiry;
}
