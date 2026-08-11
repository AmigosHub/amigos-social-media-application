
// src/api/notification.js
import axios from './axios'
import cache from '../utils/cache'

export const notificationAPI = {
  // Get all notifications with pagination
  getNotifications: async (page = 0, size = 20) => {
    const cacheKey = cache.getApiKey('/api/notifications', { page, size })
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get('/api/notifications', {
      params: { page, size },
    })
    if (response.data.success && page === 0) {
      cache.set(cacheKey, response.data, 1 * 60 * 1000) // 1 minute cache
    }
    return response.data
  },

  // Get unread notifications
  getUnreadNotifications: async () => {
    const cacheKey = cache.getApiKey('/api/notifications/unread')
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get('/api/notifications/unread')
    if (response.data.success) {
      cache.set(cacheKey, response.data, 30 * 1000) // 30 seconds cache
    }
    return response.data
  },

  // Get unread count
  getUnreadCount: async () => {
    const cacheKey = cache.getApiKey('/api/notifications/unread/count')
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get('/api/notifications/unread/count')
    if (response.data.success) {
      cache.set(cacheKey, response.data, 30 * 1000) // 30 seconds cache
    }
    return response.data
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await axios.patch(`/api/notifications/${notificationId}/read`)
    cache.invalidateEndpoint('/api/notifications')
    cache.invalidateEndpoint('/api/notifications/unread')
    cache.invalidateEndpoint('/api/notifications/unread/count')
    return response.data
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await axios.patch('/api/notifications/read-all')
    cache.invalidateEndpoint('/api/notifications')
    cache.invalidateEndpoint('/api/notifications/unread')
    cache.invalidateEndpoint('/api/notifications/unread/count')
    return response.data
  },

  // Get notification by ID
  getNotificationById: async (notificationId) => {
    const cacheKey = cache.getApiKey(`/api/notifications/${notificationId}`)
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get(`/api/notifications/${notificationId}`)
    if (response.data.success) {
      cache.set(cacheKey, response.data, 5 * 60 * 1000)
    }
    return response.data
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await axios.delete(`/api/notifications/${notificationId}`)
    cache.invalidateEndpoint('/api/notifications')
    cache.invalidateEndpoint('/api/notifications/unread')
    cache.invalidateEndpoint('/api/notifications/unread/count')
    return response.data
  },
}