import { useEffect, useState } from 'react'
import { CheckCircle, ExternalLink } from 'lucide-react'
import styles from './AuthSuccess.module.css'
import { validateReturnUrl } from '../utils/urlValidator'
import { getToken, getSalt, getSessionId, getTokenExpiry } from '../services/storage'

function AuthSuccess() {
  const [countdown, setCountdown] = useState(2)
  const [returnUrl, setReturnUrl] = useState('')

  useEffect(() => {
    // Get return URL from query parameters
    const params = new URLSearchParams(window.location.search)
    const rawUrl = params.get('returnUrl')

    // Validate URL to prevent open redirect vulnerability
    const validatedUrl = validateReturnUrl(rawUrl, 'https://td.reversebits.com')

    // Get authentication credentials from storage
    const token = getToken()
    const salt = getSalt()
    const sessionId = getSessionId()
    const expiryTimestamp = getTokenExpiry()

    // Calculate expiresIn from expiry timestamp
    const expiresIn = expiryTimestamp ? Math.max(0, Math.floor((expiryTimestamp - Date.now()) / 1000)) : 3600

    // Build callback URL with credentials as query parameters
    let finalUrl = validatedUrl
    if (token && salt) {
      const urlObj = new URL(validatedUrl)
      urlObj.searchParams.set('token', token)
      urlObj.searchParams.set('salt', salt)
      if (sessionId) {
        urlObj.searchParams.set('sessionId', sessionId)
      }
      urlObj.searchParams.set('expiresIn', expiresIn.toString())
      finalUrl = urlObj.toString()
    }

    setReturnUrl(validatedUrl) // Display the base URL (without credentials)

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          // Redirect after countdown with credentials
          window.location.href = finalUrl
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [])

  return (
    <div className={styles.successContainer}>
      <div className={styles.successIcon}>
        <CheckCircle size={48} strokeWidth={1.5} />
      </div>

      <h1 className={styles.title}>Authentication Successful</h1>
      <p className={styles.subtitle}>Redirecting you back...</p>

      <div className={styles.countdownContainer}>
        <div className={styles.countdown}>{countdown}</div>
        <p className={styles.countdownText}>seconds</p>
      </div>

      {returnUrl && (
        <div className={styles.urlInfo}>
          <ExternalLink size={14} />
          <span className={styles.urlText}>{new URL(returnUrl).hostname}</span>
        </div>
      )}

      <div className={styles.footer}>
        Secure Access Terminal
      </div>
    </div>
  )
}

export default AuthSuccess
