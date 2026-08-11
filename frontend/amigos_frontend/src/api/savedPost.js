// src/api/savedPost.js
import axios from './axios'

export const savedPostAPI = {
  // Save post
  savePost: async (postId) => {
    const response = await axios.post(`/api/saved-posts/posts/${postId}`)
    return response.data
  },

  // Unsave post
  unsavePost: async (postId) => {
    const response = await axios.delete(`/api/saved-posts/posts/${postId}`)
    return response.data
  },

  // Get saved posts
  getSavedPosts: async (page = 0, size = 20) => {
    const response = await axios.get('/api/saved-posts', {
      params: { page, size },
    })
    return response.data
  },
}