import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/authApi'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function useAuth() {
  const { login, logout, user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (credentials) => {
    // Backend User model uses email as USERNAME_FIELD
    // credentials = { email, password }
    const { data } = await authApi.login(credentials)
    let userProfile = null
    try {
      localStorage.setItem('access_token', data.access)
      const res = await authApi.getMe()
      userProfile = res.data
    } catch {}
    login(data, userProfile)
    toast.success('Welcome back!')
    navigate('/dashboard')
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return { handleLogin, handleLogout, user, isAuthenticated }
}
