import axios from 'axios'

// Same relative base as axiosClient — goes through Vite proxy, no CORS
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Standalone axios instance for auth — no JWT interceptors (avoids redirect loop on 401)
const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const authApi = {
  // POST /api/auth/jwt/   body: { email, password }
  login:   (credentials) => authAxios.post('/auth/jwt/', credentials),
  refresh: (refresh)     => authAxios.post('/auth/jwt/refresh/', { refresh }),
  // GET /api/users/me/  — requires token already in localStorage
  getMe: () => {
    const token = localStorage.getItem('access_token')
    return authAxios.get('/users/me/', {
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}
