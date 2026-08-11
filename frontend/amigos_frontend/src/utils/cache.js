// src/utils/cache.js

const CACHE_PREFIX = 'social_media_cache_'
const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

export const cache = {
  // Set cache with key, data and optional TTL
  set: (key, data, ttl = DEFAULT_TTL) => {
    try {
      const cacheKey = CACHE_PREFIX + key
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  },

  // Get cache by key
  get: (key) => {
    try {
      const cacheKey = CACHE_PREFIX + key
      const cached = localStorage.getItem(cacheKey)
      if (!cached) return null

      const cacheData = JSON.parse(cached)
      const isExpired = Date.now() - cacheData.timestamp > cacheData.ttl
      
      if (isExpired) {
        localStorage.removeItem(cacheKey)
        return null
      }

      return cacheData.data
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  },

  // Remove specific cache
  remove: (key) => {
    try {
      localStorage.removeItem(CACHE_PREFIX + key)
    } catch (error) {
      console.error('Cache remove error:', error)
    }
  },

  // Clear all caches with prefix
  clear: () => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  },

  // Get cache key for API calls
  getApiKey: (endpoint, params = {}) => {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        if (params[key] !== undefined && params[key] !== null) {
          acc[key] = params[key]
        }
        return acc
      }, {})
    
    const paramString = Object.keys(sortedParams).length
      ? `?${new URLSearchParams(sortedParams).toString()}`
      : ''
    
    return `${endpoint}${paramString}`
  },

  // Invalidate all caches
  invalidateAll: () => {
    cache.clear()
  },

  // Invalidate specific endpoint
  invalidateEndpoint: (endpoint) => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX) && key.includes(endpoint)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Cache invalidate error:', error)
    }
  }
}

export default cache