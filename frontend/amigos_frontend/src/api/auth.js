
// src/api/auth.js
import axios from './axios'

export const authAPI = {
  // User Registration
  register: async (userData) => {
    const response = await axios.post('/auth/signup', userData)
    return response.data
  },

  // User Login - Returns user data including role
  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials)
    // Make sure response includes user data with role
    return response.data
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}