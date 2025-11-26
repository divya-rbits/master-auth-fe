import { config } from '../config/constants.js';

/**
 * Save authentication token and expiration to localStorage
 * @param {string} token - The authentication token
 * @param {number} expiresIn - Token lifetime in seconds
 */
export function saveToken(token, expiresIn) {
  try {
    // Save token
    localStorage.setItem(config.TOKEN_KEY, token);

    // Calculate and save expiration timestamp
    const expirationTime = Date.now() + (expiresIn * 1000);
    localStorage.setItem(config.EXPIRY_KEY, expirationTime.toString());
  } catch (error) {
    console.error('Error saving token to localStorage:', error);
    throw new Error('Failed to save authentication token');
  }
}

/**
 * Retrieve authentication token from localStorage
 * @returns {string|null} The token or null if not found
 */
export function getToken() {
  try {
    return localStorage.getItem(config.TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving token from localStorage:', error);
    return null;
  }
}

/**
 * Retrieve token expiration timestamp from localStorage
 * @returns {number|null} The expiration timestamp or null if not found
 */
export function getTokenExpiry() {
  try {
    const expiry = localStorage.getItem(config.EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  } catch (error) {
    console.error('Error retrieving token expiry from localStorage:', error);
    return null;
  }
}

/**
 * Remove token and expiration from localStorage
 */
export function clearToken() {
  try {
    localStorage.removeItem(config.TOKEN_KEY);
    localStorage.removeItem(config.EXPIRY_KEY);
  } catch (error) {
    console.error('Error clearing token from localStorage:', error);
  }
}
