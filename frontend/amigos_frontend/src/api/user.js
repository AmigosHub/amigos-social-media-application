// src/api/user.js
import axios from './axios'

export const userAPI = {
  // Get current user profile
  getCurrentUser: async () => {
    const response = await axios.get('/api/users/me')
    return response.data
  },

  // Get user profile by ID
  getUserById: async (userId) => {
    const response = await axios.get(`/api/users/${userId}`)
    return response.data
  },

  // Update profile
  updateProfile: async (params) => {
    const response = await axios.put('/api/users/me', null, { params })
    return response.data
  },

  // Update profile picture
  updateProfilePic: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await axios.post('/api/users/me/profile-pic', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // Remove profile picture
  removeProfilePic: async () => {
    const response = await axios.delete('/api/users/me/profile-pic')
    return response.data
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    const response = await axios.post('/api/users/me/change-password', null, {
      params: { oldPassword, newPassword },
    })
    return response.data
  },

  // Deactivate account
  deactivateAccount: async () => {
    const response = await axios.delete('/api/users/me/deactivate')
    return response.data
  },

  // Get user settings
  getSettings: async () => {
    const response = await axios.get('/api/users/me/settings')
    return response.data
  },

  // Update settings
  updateSettings: async (settings) => {
    const response = await axios.put('/api/users/me/settings', settings)
    return response.data
  },

  // Update privacy
  updatePrivacy: async (isPrivate) => {
    const response = await axios.patch('/api/users/me/privacy', null, {
      params: { isPrivate },
    })
    return response.data
  },

  // Update account status
  updateAccountStatus: async (isActive) => {
    const response = await axios.patch('/api/users/me/account-status', null, {
      params: { isActive },
    })
    return response.data
  },

  // Search users
  searchUsers: async (query, page = 0, size = 20) => {
    const response = await axios.get('/api/users/search', {
      params: { q: query, page, size },
    })
    return response.data
  },

  // Get following users
  getFollowingUsers: async (userId, page = 0, size = 20) => {
    const response = await axios.get(`/api/follow/users/${userId}/following`, {
      params: { page, size },
    })
    return response.data
  },
}