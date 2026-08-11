
// src/api/adminAxios.js
import axios from 'axios'

const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000'

const adminAxiosInstance = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
adminAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(`[AdminAxios] Request: ${config.method.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('[AdminAxios] Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
adminAxiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[AdminAxios] Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('[AdminAxios] Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config
    })
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default adminAxiosInstance