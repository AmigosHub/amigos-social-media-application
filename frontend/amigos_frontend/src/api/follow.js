
// src/api/follow.js
import axios from './axios'
import cache from '../utils/cache'

export const followAPI = {
  // Follow user
  followUser: async (userId) => {
    try {
      const response = await axios.post(`/api/follow/${userId}`)
      cache.invalidateEndpoint('/api/follow/status')
      cache.invalidateEndpoint('/api/users/me')
      return response.data
    } catch (error) {
      if (error.response?.status === 400) {
        return { success: false, message: 'Already following or request pending' }
      }
      throw error
    }
  },

  // Unfollow user
  unfollowUser: async (userId) => {
    try {
      const response = await axios.delete(`/api/follow/${userId}`)
      cache.invalidateEndpoint('/api/follow/status')
      cache.invalidateEndpoint('/api/users/me')
      return response.data
    } catch (error) {
      if (error.response?.status === 400) {
        return { success: false, message: 'Already unfollowed' }
      }
      throw error
    }
  },

  // Get follow status with caching
  getFollowStatus: async (userId) => {
    const cacheKey = cache.getApiKey(`/api/follow/status/${userId}`)
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get(`/api/follow/status/${userId}`)
    if (response.data.success) {
      cache.set(cacheKey, response.data, 30 * 1000) // 30 seconds cache
    }
    return response.data
  },

  // Get followers with caching
  getFollowers: async (userId, page = 0, size = 20) => {
    const cacheKey = cache.getApiKey(`/api/follow/users/${userId}/followers`, { page, size })
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get(`/api/follow/users/${userId}/followers`, {
      params: { page, size },
    })
    if (response.data.success && page === 0) {
      cache.set(cacheKey, response.data, 2 * 60 * 1000)
    }
    return response.data
  },

  // Get following with caching
  getFollowing: async (userId, page = 0, size = 20) => {
    const cacheKey = cache.getApiKey(`/api/follow/users/${userId}/following`, { page, size })
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get(`/api/follow/users/${userId}/following`, {
      params: { page, size },
    })
    if (response.data.success && page === 0) {
      cache.set(cacheKey, response.data, 2 * 60 * 1000)
    }
    return response.data
  },

  // Accept follow request
  acceptFollowRequest: async (followId) => {
    try {
      const response = await axios.put(`/api/follow/requests/${followId}/accept`)
      cache.invalidateEndpoint('/api/follow/requests/pending')
      cache.invalidateEndpoint('/api/users/me')
      return response.data
    } catch (error) {
      console.error('Error accepting follow request:', error)
      throw error
    }
  },

  // Reject follow request
  rejectFollowRequest: async (followId) => {
    try {
      const response = await axios.delete(`/api/follow/requests/${followId}/reject`)
      cache.invalidateEndpoint('/api/follow/requests/pending')
      return response.data
    } catch (error) {
      console.error('Error rejecting follow request:', error)
      throw error
    }
  },

  // Get pending follow requests with caching
  getPendingRequests: async () => {
    const cacheKey = cache.getApiKey('/api/follow/requests/pending')
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get('/api/follow/requests/pending')
    if (response.data.success) {
      cache.set(cacheKey, response.data, 1 * 60 * 1000)
    }
    return response.data
  },

  // Get follow suggestions with caching
  getSuggestions: async () => {
    const cacheKey = cache.getApiKey('/api/follow/suggestions')
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get('/api/follow/suggestions')
    if (response.data.success) {
      cache.set(cacheKey, response.data, 5 * 60 * 1000)
    }
    return response.data
  },
}