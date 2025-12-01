/**
 * Check if the browser is online
 * @returns {boolean} True if online, false if offline
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Check if an error is a timeout error
 * @param {Error} error - The error object from axios
 * @returns {boolean} True if it's a timeout error
 */
export function isTimeoutError(error) {
  return error.code === 'ECONNABORTED' || error.message?.includes('timeout');
}

/**
 * Check if an error is a network error (no connection)
 * @param {Error} error - The error object from axios
 * @returns {boolean} True if it's a network error
 */
export function isNetworkError(error) {
  // Timeout errors are handled separately
  if (isTimeoutError(error)) {
    return true;
  }

  // No response received (network issue)
  if (error.request && !error.response) {
    return true;
  }

  // Check common network error codes
  if (error.code === 'ERR_NETWORK') {
    return true;
  }

  return false;
}

/**
 * Get user-friendly error message for network errors
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export function getNetworkErrorMessage(error) {
  // Check for timeout first
  if (isTimeoutError(error)) {
    return 'Request timed out. Please try again.';
  }

  if (!isOnline()) {
    return 'No internet connection. Please check your network and try again.';
  }

  if (isNetworkError(error)) {
    return 'Unable to reach server. Please try again.';
  }

  return 'Connection failed. Please try again.';
}
