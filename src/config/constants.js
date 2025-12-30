// Application configuration constants

/**
 * Check if the current environment is localhost
 */
const isLocalhost = () => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
};

/**
 * Check if running in production mode
 */
const isProduction = () => {
  return import.meta.env.PROD;
};

/**
 * Enforce HTTPS for API URL in production (except localhost)
 */
const getSecureApiUrl = (url) => {
  if (!url) return 'http://localhost:3001';

  // If in production and not localhost, ensure HTTPS
  if (isProduction() && !isLocalhost() && url.startsWith('http://')) {
    console.warn('⚠️ API URL is using HTTP in production. Upgrading to HTTPS for security.');
    return url.replace('http://', 'https://');
  }

  return url;
};

/**
 * Warn if running on HTTP in production (except localhost)
 */
const checkHttpsEnforcement = () => {
  if (typeof window === 'undefined') return;

  const protocol = window.location.protocol;

  if (isProduction() && !isLocalhost() && protocol === 'http:') {
    console.warn('⚠️ WARNING: Application is running on HTTP in production. Please use HTTPS for secure communication.');
  }
};

// Run HTTPS check on module load
checkHttpsEnforcement();

export const config = {
  // API Configuration
  API_URL: getSecureApiUrl(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'),
  APP_ID: import.meta.env.VITE_APPLICATION_ID || 'master-password-auth',

  // Get dynamic application ID (from sessionStorage or fallback to env)
  getAppId: () => {
    const urlAppId = sessionStorage.getItem('auth_application_id')
    const envAppId = import.meta.env.VITE_APPLICATION_ID || 'master-password-auth'
    const appId = urlAppId || envAppId
    console.log('getAppId() - URL:', urlAppId, 'Env:', envAppId, 'Using:', appId)
    return appId
  },

  // Frontend URL - Used by 3rd party apps to construct returnUrl for cross-subdomain authentication flow
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || (typeof window !== 'undefined' ? window.location.origin : ''),

  // Security Configuration
  STRICT_APP_ID_CHECK: import.meta.env.VITE_STRICT_APP_ID_CHECK === 'true',

  // Storage Keys
  TOKEN_KEY: 'auth_token',
  SALT_KEY: 'auth_salt',
  SESSION_ID_KEY: 'session_id',
  EXPIRY_KEY: 'token_expires_at',
  PERMISSIONS_KEY: 'auth_permissions',
  STORAGE_PREFERENCE_KEY: 'storage_preference',
  RATE_LIMIT_LOGIN_KEY: 'rate_limit_login_expiry',
  RATE_LIMIT_VALIDATE_KEY: 'rate_limit_validate_expiry',

  // Timeouts (in milliseconds)
  API_TIMEOUT: 10000, // 10 seconds
  TOKEN_REFRESH_BUFFER: 5 * 60 * 1000, // 5 minutes before expiry
};
