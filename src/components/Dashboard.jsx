import { CheckCircle } from 'lucide-react'
import styles from './Dashboard.module.css'

function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.successIcon}>
        <CheckCircle size={32} strokeWidth={1.5} />
      </div>

      <h1 className={styles.title}>Access Granted</h1>
      <p className={styles.subtitle}>You are now authenticated</p>

      <div className={styles.footer}>
        Secure Access Terminal
      </div>
    </div>
  )
}

export default Dashboard
