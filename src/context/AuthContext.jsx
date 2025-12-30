import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getToken, getSalt, saveToken, clearToken, getSessionId, getPermissions, savePermissions } from '../services/storage'
import { validateToken, login as apiLogin, logout as apiLogout, refreshToken as apiRefreshToken } from '../services/api'
import { useTokenExpiry } from '../hooks/useTokenExpiry'
import { config } from '../config/constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const logout = async () => {
    const token = getToken()
    const salt = getSalt()

    try {
      if (token && salt) {
        await apiLogout(token, salt)
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      clearToken()
      setIsAuthenticated(false)
      setUser(null)
      setSessionId(null)
      setPermissions([])
    }
  }

  const refreshToken = useCallback(async () => {
    const token = getToken()
    const salt = getSalt()
    const currentSessionId = getSessionId()

    if (!token || !salt) {
      console.error('No token or salt to refresh')
      return
    }

    try {
      setIsRefreshing(true)
      const response = await apiRefreshToken(token, salt)

      // Save new token and salt with same sessionId
      // Determine storage type based on where the token was found
      const rememberMe = !!localStorage.getItem('auth_token')
      saveToken(response.token, response.salt, response.sessionId, response.expiresIn, rememberMe)

      console.log('Token refreshed successfully')
    } catch (error) {
      console.error('Token refresh failed:', error)
      throw error // Re-throw so useTokenExpiry can handle logout
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  // Monitor token expiration and auto-refresh/logout
  useTokenExpiry(refreshToken, logout)

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken()
      const salt = getSalt()

      if (!token) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      if (!salt) {
        console.error('Token found but salt is missing, clearing session')
        clearToken()
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      // Restore permissions from storage
      const storedPermissions = getPermissions()
      setPermissions(storedPermissions)

      // Token exists, validate it
      try {
        const response = await validateToken(token, salt)

        if (response.valid) {
          // Security: Validate applicationId matches expected APP_ID
          // This prevents tokens from other applications being used here
          const responseAppId = response.applicationId
          const expectedAppId = config.getAppId()
          if (responseAppId && responseAppId !== expectedAppId) {
            console.warn(
              `Token applicationId mismatch: expected ${expectedAppId}, got ${responseAppId}`
            )

            if (config.STRICT_APP_ID_CHECK) {
              // Strict mode: Reject token and force logout
              console.error('Strict mode enabled: Rejecting token due to applicationId mismatch')
              clearToken()
              setIsAuthenticated(false)
              setPermissions([])
              setLoading(false)
              return
            }
            // Permissive mode: Log warning but allow access (continues below)
          }

          setIsAuthenticated(true)
          setUser(response.user || null)
          setSessionId(response.sessionId || null)

          // Extract and store permissions from validate response
          const responsePermissions = response.permissions || []
          setPermissions(responsePermissions)

          // Determine storage type based on where the token was found
          const rememberMe = !!localStorage.getItem('auth_token')
          savePermissions(responsePermissions, rememberMe)
        } else {
          // Token invalid, clear it
          clearToken()
          setIsAuthenticated(false)
          setPermissions([])
        }
      } catch (error) {
        console.error('Token validation failed:', error)

        // Only clear token if it's not a network error
        // If network error, keep token and user can retry later
        if (!error.isNetworkError) {
          clearToken()
          setPermissions([])
        }
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  /**
   * Login with master password
   * @param {string} password - The master password
   * @param {boolean} rememberMe - Whether to persist session across browser restarts
   * @returns {Promise<{
   *   success: boolean,
   *   token: string,
   *   expiresIn: number,
   *   expiresAt: string,
   *   sessionId: string
   * }>} Login response from API (camelCase field names)
   */
  const login = async (password, rememberMe = false) => {
    const response = await apiLogin(password)

    try {
      saveToken(response.token, response.salt, response.sessionId, response.expiresIn, rememberMe)
    } catch (storageError) {
      // If storage fails, throw a user-friendly error
      // The error message from saveToken is already user-friendly
      throw storageError
    }

    // Extract and store permissions from login response
    const responsePermissions = response.permissions || []
    setPermissions(responsePermissions)
    savePermissions(responsePermissions, rememberMe)

    setIsAuthenticated(true)
    setUser(response.user || null)
    setSessionId(response.sessionId || null)
    return response
  }

  const value = {
    isAuthenticated,
    loading,
    user,
    sessionId,
    permissions,
    login,
    logout,
    isRefreshing,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
