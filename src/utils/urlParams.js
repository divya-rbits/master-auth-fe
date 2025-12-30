/**
 * Parse URL query parameters
 * @param {string} search - URL search string (e.g., window.location.search)
 * @returns {Object} Object with application_id and redirect_uri
 */
export function parseAuthParams(search) {
  const params = new URLSearchParams(search)

  return {
    applicationId: params.get('application_id'),
    redirectUri: params.get('redirect_uri'),
  }
}

/**
 * Get application ID from URL or fallback to environment variable
 * @param {string} search - URL search string
 * @param {string} fallback - Fallback application ID from environment
 * @returns {string|null} Application ID to use
 */
export function getApplicationId(search, fallback) {
  const { applicationId } = parseAuthParams(search)
  return applicationId || fallback
}

/**
 * Store auth parameters in sessionStorage for use across the app
 * @param {Object} params - Object with applicationId and redirectUri
 */
export function storeAuthParams(params) {
  if (params.applicationId) {
    sessionStorage.setItem('auth_application_id', params.applicationId)
  }
  if (params.redirectUri) {
    sessionStorage.setItem('auth_redirect_uri', params.redirectUri)
  }
}

/**
 * Retrieve stored auth parameters from sessionStorage
 * @returns {Object} Object with applicationId and redirectUri
 */
export function getStoredAuthParams() {
  return {
    applicationId: sessionStorage.getItem('auth_application_id'),
    redirectUri: sessionStorage.getItem('auth_redirect_uri'),
  }
}

/**
 * Clear stored auth parameters from sessionStorage
 */
export function clearAuthParams() {
  sessionStorage.removeItem('auth_application_id')
  sessionStorage.removeItem('auth_redirect_uri')
}
