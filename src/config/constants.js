// Application configuration constants

export const config = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  APP_ID: import.meta.env.VITE_APP_ID || 'master-password-auth',

  // Storage Keys
  TOKEN_KEY: 'auth_token',
  EXPIRY_KEY: 'token_expires_at',

  // Timeouts (in milliseconds)
  API_TIMEOUT: 10000, // 10 seconds
  TOKEN_REFRESH_BUFFER: 5 * 60 * 1000, // 5 minutes before expiry
};
