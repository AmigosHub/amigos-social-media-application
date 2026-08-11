
// src/api/post.js
import axios from './axios'
import cache from '../utils/cache'

export const postAPI = {
  // Create post (text only)
  createPost: async (content) => {
    const response = await axios.post('/api/posts', { content })
    // Invalidate feed cache after creating post
    cache.invalidateEndpoint('feed')
    return response.data
  },

  // Create post with media
  createPostWithMedia: async (formData) => {
    let data = formData
    if (!(formData instanceof FormData)) {
      data = new FormData()
      if (formData.content) data.append('content', formData.content)
      if (formData.media) data.append('media', formData.media)
    }
    
    const response = await axios.post('/api/posts', data, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    })
    cache.invalidateEndpoint('feed')
    return response.data
  },

  // Get feed with caching
  getFeed: async (page = 0, size = 20) => {
    const cacheKey = cache.getApiKey('/api/posts/feed', { page, size })
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      console.log('Using cached feed data for page:', page)
      return cachedData
    }

    const response = await axios.get('/api/posts/feed', {
      params: { page, size },
    })
    
    // Cache only first page (feed) for 2 minutes
    if (page === 0 && response.data.success) {
      cache.set(cacheKey, response.data, 2 * 60 * 1000)
    }
    
    return response.data
  },

  // Get post by ID with caching
  getPostById: async (postId) => {
    const cacheKey = cache.getApiKey(`/api/posts/${postId}`)
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get(`/api/posts/${postId}`)
    if (response.data.success) {
      cache.set(cacheKey, response.data, 5 * 60 * 1000)
    }
    return response.data
  },

  // Get user posts with caching
  getUserPosts: async (userId, page = 0, size = 20) => {
    const cacheKey = cache.getApiKey(`/api/posts/user/${userId}`, { page, size })
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get(`/api/posts/user/${userId}`, {
      params: { page, size },
    })
    if (response.data.success && page === 0) {
      cache.set(cacheKey, response.data, 3 * 60 * 1000)
    }
    return response.data
  },

  // Update post
  updatePost: async (postId, data) => {
    const formData = new FormData()
    formData.append('content', data.content || data.caption || '')
    
    const response = await axios.put(`/api/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // Invalidate post caches
    cache.invalidateEndpoint(`/api/posts/${postId}`)
    cache.invalidateEndpoint('feed')
    return response.data
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await axios.delete(`/api/posts/${postId}`)
    cache.invalidateEndpoint(`/api/posts/${postId}`)
    cache.invalidateEndpoint('feed')
    return response.data
  },

  // Get post likes
  getPostLikes: async (postId, page = 0, size = 20) => {
    const cacheKey = cache.getApiKey(`/api/posts/${postId}/likes`, { page, size })
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get(`/api/posts/${postId}/likes`, {
      params: { page, size },
    })
    if (response.data.success && page === 0) {
      cache.set(cacheKey, response.data, 5 * 60 * 1000)
    }
    return response.data
  },
}