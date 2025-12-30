import { useAuth } from '../context/AuthContext'

/**
 * Custom hook to access user permissions
 * @returns {{
 *   permissions: string[],
 *   hasPermission: (permission: string) => boolean,
 *   loading: boolean
 * }}
 */
export function usePermissions() {
  const { permissions, loading } = useAuth()

  /**
   * Check if user has a specific permission
   * @param {string} permission - The permission to check
   * @returns {boolean} True if user has the permission
   */
  const hasPermission = (permission) => {
    if (!permissions || permissions.length === 0) {
      return false
    }
    return permissions.includes(permission)
  }

  return {
    permissions: permissions || [],
    hasPermission,
    loading,
  }
}
