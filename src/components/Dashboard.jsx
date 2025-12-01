import { CheckCircle, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import styles from './Dashboard.module.css'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()

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

      <button onClick={handleLogout} className={styles.logoutButton}>
        <LogOut size={16} />
        <span>Logout</span>
      </button>

      <div className={styles.footer}>
        Secure Access Terminal
      </div>
    </div>
  )
}

export default Dashboard
