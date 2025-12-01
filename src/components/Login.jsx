import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react'
import styles from './Login.module.css'
import ErrorMessage from './ErrorMessage'
import { useAuth } from '../context/AuthContext'
import { getStoragePreference, saveStoragePreference } from '../services/storage'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isNetworkError, setIsNetworkError] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    // Auto-focus on mount
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Load saved storage preference
    const savedPreference = getStoragePreference()
    setRememberMe(savedPreference)

    // Check for logout success message from navigation state
    if (location.state?.loggedOut) {
      setSuccessMessage('Logged out successfully')

      // Clear message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)

      // Clear the navigation state
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    if (!password || loading) return

    setError(false)
    setErrorMessage('')
    setIsNetworkError(false)
    setLoading(true)

    try {
      // Save storage preference for next time
      saveStoragePreference(rememberMe)

      // Call auth context login (which handles API call and token storage)
      await login(password, rememberMe)

      console.log('Login successful')

      // Clear password field
      setPassword('')
      setLoading(false)

      // Get returnUrl from query params or use default
      const params = new URLSearchParams(location.search)
      const returnUrl = params.get('returnUrl') || ''

      // Redirect to success page with returnUrl
      navigate(`/success${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`)
    } catch (error) {
      setLoading(false)
      setError(true)
      setErrorMessage(error.message || 'Login failed')
      setIsNetworkError(error.isNetworkError || false)

      // Don't auto-clear error if it's a network error (user needs to retry)
      if (!error.isNetworkError) {
        setTimeout(() => {
          setError(false)
          setErrorMessage('')
        }, 3000)
      }
    }
  }

  const handleRetry = () => {
    setError(false)
    setErrorMessage('')
    setIsNetworkError(false)
    handleSubmit()
  }

  const formClasses = [
    styles.formContainer,
    loading && styles.formContainerLoading,
    error && styles.formShake
  ].filter(Boolean).join(' ')

  const underlineClasses = [
    styles.underline,
    (isFocused || password.length > 0) ? styles.underlineActive : styles.underlineInactive
  ].filter(Boolean).join(' ')

  const lockClasses = [
    styles.lockIcon,
    isFocused && styles.lockIconFocused
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.loginContainer}>
      {/* Lock Icon Indicator */}
      <div className={lockClasses}>
        <Lock size={32} strokeWidth={1.5} />
      </div>

      {/* Success Message */}
      <ErrorMessage
        message={successMessage}
        type="success"
        show={!!successMessage}
      />

      {/* Error Message */}
      <ErrorMessage
        message={errorMessage}
        type="error"
        show={!!errorMessage}
      />

      {/* Retry Button for Network Errors */}
      {isNetworkError && errorMessage && (
        <button onClick={handleRetry} className={styles.retryButton}>
          <RefreshCw size={14} />
          <span>Retry</span>
        </button>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className={formClasses}>
        <input
          ref={inputRef}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={styles.passwordInput}
          placeholder="••••••"
          autoComplete="off"
        />

        {/* Password Toggle Button */}
        {password && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.toggleButton}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {/* Animated Underline */}
        <div className={styles.underlineContainer}>
          <div className={underlineClasses} />
        </div>
      </form>

      {/* Remember Me Checkbox */}
      <div className={styles.rememberMeContainer}>
        <label className={styles.rememberMeLabel}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className={styles.rememberMeCheckbox}
          />
          <span className={styles.checkboxText}>Remember me on this device</span>
        </label>
        <span className={styles.checkboxHint}>
          {rememberMe ? '(Persists after browser close)' : '(Session only - clears on close)'}
        </span>
      </div>

      {/* Action Container */}
      <div className={styles.actionContainer}>
        {loading ? (
          <div className={styles.loadingDots}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </div>
        ) : (
          <button
            onClick={() => handleSubmit()}
            disabled={!password}
            className={styles.submitButton}
          >
            <span>Enter System</span>
            <ArrowRight size={14} className={styles.arrowIcon} />
          </button>
        )}
      </div>

      {/* Footer Branding */}
      <div className={styles.footer}>
        Secure Access Terminal
      </div>
    </div>
  )
}

export default Login
