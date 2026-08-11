

// src/api/chat.js
import axios from './axios'
import cache from '../utils/cache'

export const chatAPI = {
  // Send message to user
  sendMessageToUser: async (userId, content) => {
    const response = await axios.post(`/api/chat/users/${userId}`, null, {
      params: { content },
    })
    cache.invalidateEndpoint('/api/chat/conversations')
    return response.data
  },

  // Send message in conversation
  sendMessageInConversation: async (conversationId, content, replyToMessageId = null) => {
    const response = await axios.post(
      `/api/chat/conversations/${conversationId}/messages`,
      null,
      { params: { content, replyToMessageId } }
    )
    cache.invalidateEndpoint('/api/chat/conversations')
    cache.invalidateEndpoint(`/api/chat/conversations/${conversationId}/messages`)
    return response.data
  },

  // Get conversations with caching
  getConversations: async (page = 0, size = 20) => {
    const cacheKey = cache.getApiKey('/api/chat/conversations', { page, size })
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get('/api/chat/conversations', {
      params: { page, size },
    })
    if (response.data.success && page === 0) {
      cache.set(cacheKey, response.data, 1 * 60 * 1000) // 1 minute cache
    }
    return response.data
  },

  // Get messages with caching
  getMessages: async (conversationId, page = 0, size = 50) => {
    const cacheKey = cache.getApiKey(`/api/chat/conversations/${conversationId}/messages`, { page, size })
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get(`/api/chat/conversations/${conversationId}/messages`, {
      params: { page, size },
    })
    if (response.data.success && page === 0) {
      cache.set(cacheKey, response.data, 30 * 1000) // 30 seconds cache
    }
    return response.data
  },

  // Update message
  updateMessage: async (messageId, content) => {
    const response = await axios.put(`/api/chat/messages/${messageId}`, null, {
      params: { content },
    })
    cache.invalidateEndpoint('/api/chat/conversations')
    return response.data
  },

  // Get message by ID
  getMessageById: async (messageId) => {
    const cacheKey = cache.getApiKey(`/api/chat/messages/${messageId}`)
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get(`/api/chat/messages/${messageId}`)
    if (response.data.success) {
      cache.set(cacheKey, response.data, 5 * 60 * 1000)
    }
    return response.data
  },

  // Reply to message
  replyToMessage: async (messageId, content) => {
    const response = await axios.post(`/api/chat/messages/${messageId}/reply`, null, {
      params: { content },
    })
    cache.invalidateEndpoint('/api/chat/conversations')
    return response.data
  },

  // Delete message
  deleteMessage: async (messageId) => {
    const response = await axios.delete(`/api/chat/messages/${messageId}`)
    cache.invalidateEndpoint('/api/chat/conversations')
    return response.data
  },

  // Mark conversation as read
  markConversationAsRead: async (conversationId) => {
    const response = await axios.patch(`/api/chat/conversations/${conversationId}/read`)
    cache.invalidateEndpoint('/api/chat/conversations')
    cache.invalidateEndpoint(`/api/chat/conversations/${conversationId}/messages`)
    return response.data
  },

  // Archive conversation
  archiveConversation: async (conversationId) => {
    const response = await axios.patch(`/api/chat/conversations/${conversationId}/archive`)
    cache.invalidateEndpoint('/api/chat/conversations')
    return response.data
  },

  // Get unread count with caching
  getUnreadCount: async () => {
    const cacheKey = cache.getApiKey('/api/chat/unread/count')
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }

    const response = await axios.get('/api/chat/unread/count')
    if (response.data.success) {
      cache.set(cacheKey, response.data, 30 * 1000) // 30 seconds cache
    }
    return response.data
  },

  // Search messages
  searchMessages: async (query, conversationId = null, page = 0, size = 20) => {
    const response = await axios.get('/api/chat/messages/search', {
      params: { q: query, conversationId, page, size },
    })
    return response.data
  },
}