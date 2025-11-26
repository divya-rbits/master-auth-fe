import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import styles from './ErrorMessage.module.css'

function ErrorMessage({ message, type = 'error', show = false }) {
  if (!show || !message) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} />
      case 'info':
        return <Info size={16} />
      case 'error':
      default:
        return <AlertCircle size={16} />
    }
  }

  const messageClasses = [
    styles.message,
    styles[type],
    show && styles.show
  ].filter(Boolean).join(' ')

  return (
    <div className={messageClasses}>
      <span className={styles.icon}>{getIcon()}</span>
      <span className={styles.text}>{message}</span>
    </div>
  )
}

export default ErrorMessage
