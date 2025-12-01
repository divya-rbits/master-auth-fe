import { createContext, useContext, useState, useEffect } from 'react'
import { getToken, saveToken, clearToken } from '../services/storage'
import { validateToken, login as apiLogin, logout as apiLogout } from '../services/api'
import { useTokenExpiry } from '../hooks/useTokenExpiry'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const logout = async () => {
    const token = getToken()

    try {
      if (token) {
        await apiLogout(token)
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      clearToken()
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  // Monitor token expiration and auto-logout when expired
  useTokenExpiry(logout)

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken()

      if (!token) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      // Token exists, validate it
      try {
        const response = await validateToken(token)

        if (response.valid) {
          setIsAuthenticated(true)
          setUser(response.user || null)
        } else {
          // Token invalid, clear it
          clearToken()
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Token validation failed:', error)

        // Only clear token if it's not a network error
        // If network error, keep token and user can retry later
        if (!error.isNetworkError) {
          clearToken()
        }
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (password, rememberMe = false) => {
    const response = await apiLogin(password)

    try {
      saveToken(response.token, response.expires_in, rememberMe)
    } catch (storageError) {
      // If storage fails, throw a user-friendly error
      // The error message from saveToken is already user-friendly
      throw storageError
    }

    setIsAuthenticated(true)
    setUser(response.user || null)
    return response
  }

  const value = {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
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
