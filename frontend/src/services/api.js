import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medscan_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('medscan_token')
      delete api.defaults.headers.common['Authorization']
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup')) {
        window.location.href = '/login'
      }
    }

    const data = error.response?.data
    let message = data?.message || error.message || 'Request failed'

    if (!error.response) {
      message = `Cannot reach API at ${baseURL}. Is the backend running? Set VITE_API_URL on Vercel to your Render URL (e.g. https://your-app.onrender.com/api).`
    }

    return Promise.reject({ ...data, message })
  }
)

export default api
