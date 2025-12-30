import { useEffect, useRef } from 'react'
import { getTokenExpiry } from '../services/storage'
import { config } from '../config/constants'

/**
 * Custom hook to monitor token expiration and trigger refresh/logout
 * @param {Function} onRefresh - Callback function to refresh token
 * @param {Function} onExpire - Callback function to call when token expires
 */
export function useTokenExpiry(onRefresh, onExpire) {
  const refreshTimeoutRef = useRef(null)
  const expiryTimeoutRef = useRef(null)
  const isRefreshingRef = useRef(false)

  useEffect(() => {
    // Clear any existing timeouts
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
      refreshTimeoutRef.current = null
    }
    if (expiryTimeoutRef.current) {
      clearTimeout(expiryTimeoutRef.current)
      expiryTimeoutRef.current = null
    }

    const expiryTime = getTokenExpiry()

    if (!expiryTime) {
      // No expiry time means no token, nothing to check
      return
    }

    const now = Date.now()
    const timeUntilExpiry = expiryTime - now

    // If token already expired, call onExpire immediately
    if (timeUntilExpiry <= 0) {
      console.log('Token has expired, logging out...')
      if (onExpire) {
        onExpire()
      }
      return
    }

    // Calculate time until refresh (5 minutes before expiry)
    const timeUntilRefresh = timeUntilExpiry - config.TOKEN_REFRESH_BUFFER

    // Schedule refresh if we have time
    if (timeUntilRefresh > 0 && onRefresh) {
      console.log(`Token refresh scheduled in ${Math.floor(timeUntilRefresh / 1000 / 60)} minutes`)

      refreshTimeoutRef.current = setTimeout(async () => {
        // Prevent multiple simultaneous refresh requests
        if (isRefreshingRef.current) {
          console.log('Refresh already in progress, skipping...')
          return
        }

        try {
          isRefreshingRef.current = true
          console.log('Refreshing token...')
          await onRefresh()
          console.log('Token refreshed successfully')
        } catch (error) {
          console.error('Token refresh failed:', error)
          // If refresh fails, logout
          if (onExpire) {
            onExpire()
          }
        } finally {
          isRefreshingRef.current = false
        }
      }, timeUntilRefresh)
    } else {
      console.log('Token expires too soon to schedule refresh, will expire naturally')
    }

    // Schedule expiry check at exact expiration time
    expiryTimeoutRef.current = setTimeout(() => {
      console.log('Token has expired, logging out...')
      if (onExpire) {
        onExpire()
      }
    }, timeUntilExpiry)

    // Cleanup timeouts on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
      if (expiryTimeoutRef.current) {
        clearTimeout(expiryTimeoutRef.current)
      }
    }
  }, [onRefresh, onExpire])
}
