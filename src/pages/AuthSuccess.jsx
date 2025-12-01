import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ExternalLink } from 'lucide-react'
import styles from './AuthSuccess.module.css'

function AuthSuccess() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(2)
  const [returnUrl, setReturnUrl] = useState('')

  useEffect(() => {
    // Get return URL from query parameters
    const params = new URLSearchParams(window.location.search)
    const url = params.get('returnUrl') || 'https://td.reversebits.com'
    setReturnUrl(url)

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          // Redirect after countdown
          window.location.href = url
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
