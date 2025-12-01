import { useEffect } from 'react'
import { getTokenExpiry } from '../services/storage'

/**
 * Custom hook to monitor token expiration and trigger logout when expired
 * @param {Function} onExpire - Callback function to call when token expires
 */
export function useTokenExpiry(onExpire) {
  useEffect(() => {
    // Function to check if token has expired
    const checkExpiration = () => {
      const expiryTime = getTokenExpiry()

      if (!expiryTime) {
        // No expiry time means no token, nothing to check
        return
      }

      const now = Date.now()
      const timeRemaining = expiryTime - now

      // If token has expired, call the onExpire callback
      if (timeRemaining <= 0) {
        console.log('Token has expired, logging out...')
        if (onExpire) {
          onExpire()
        }
      } else {
        // Log time remaining (useful for debugging)
        const minutesRemaining = Math.floor(timeRemaining / 1000 / 60)
        console.log(`Token expires in ${minutesRemaining} minutes`)
      }
    }

    // Check immediately on mount
    checkExpiration()

    // Set up interval to check every minute (60 seconds)
    const intervalId = setInterval(checkExpiration, 60 * 1000)

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [onExpire])
}
