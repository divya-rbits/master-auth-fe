import { CheckCircle, LogOut, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styles from './Dashboard.module.css'
import { useAuth } from '../context/AuthContext'
import { validateReturnUrl } from '../utils/urlValidator'
import { getToken, getSalt, getSessionId, getTokenExpiry } from '../services/storage'

function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [countdown, setCountdown] = useState(5)
  const [redirectUrl, setRedirectUrl] = useState(null)

  useEffect(() => {
    // Check if there's a redirect_uri stored from URL params
    const storedRedirectUri = sessionStorage.getItem('auth_redirect_uri')

    if (storedRedirectUri) {
      // Validate the redirect URL
      const validatedUrl = validateReturnUrl(storedRedirectUri, null)
      if (validatedUrl) {
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

        setRedirectUrl(validatedUrl) // Display the base URL (without credentials)

        // Start countdown timer
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
      }
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/', { state: { loggedOut: true } })
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.successIcon}>
        <CheckCircle size={32} strokeWidth={1.5} />
      </div>

      <h1 className={styles.title}>Access Granted</h1>
      <p className={styles.subtitle}>You are now authenticated</p>

      {redirectUrl ? (
        <>
          <div className={styles.countdownContainer}>
            <div className={styles.countdown}>{countdown}</div>
            <p className={styles.countdownText}>seconds</p>
          </div>
          <p className={styles.redirectMessage}>
            Redirecting you to
          </p>
          <div className={styles.urlInfo}>
            <ExternalLink size={14} />
            <span className={styles.urlText}>{new URL(redirectUrl).hostname}</span>
          </div>
        </>
      ) : (
        <button onClick={handleLogout} className={styles.logoutButton}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      )}

      <div className={styles.footer}>
        Secure Access Terminal
      </div>
    </div>
  )
}

export default Dashboard
