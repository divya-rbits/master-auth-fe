/**
 * Storage utility functions for detecting and handling browser storage availability
 */

/**
 * Check if a storage type is available and working
 * @param {Storage} storage - The storage object to test (localStorage or sessionStorage)
 * @returns {boolean} True if storage is available and working
 */
function isStorageAvailable(storage) {
  try {
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
export function isLocalStorageAvailable() {
  try {
    return typeof localStorage !== 'undefined' && isStorageAvailable(localStorage);
  } catch (e) {
    return false;
  }
}

/**
 * Check if sessionStorage is available
 * @returns {boolean} True if sessionStorage is available
 */
export function isSessionStorageAvailable() {
  try {
    return typeof sessionStorage !== 'undefined' && isStorageAvailable(sessionStorage);
  } catch (e) {
    return false;
  }
}

/**
 * Check if an error is a quota exceeded error
 * @param {Error} error - The error to check
 * @returns {boolean} True if it's a quota exceeded error
 */
export function isQuotaExceededError(error) {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error.code === 22 ||
      error.code === 1014)
  );
}

/**
 * Get an appropriate storage mechanism (localStorage or sessionStorage)
 * @returns {{storage: Storage|null, type: string}} Storage object and its type
 */
export function getAvailableStorage() {
  if (isLocalStorageAvailable()) {
    return { storage: localStorage, type: 'localStorage' };
  }
  if (isSessionStorageAvailable()) {
    return { storage: sessionStorage, type: 'sessionStorage' };
  }
  return { storage: null, type: 'none' };
}
