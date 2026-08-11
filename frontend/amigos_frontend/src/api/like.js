// src/api/like.js
import axios from './axios'

export const likeAPI = {
  // Like post
  likePost: async (postId) => {
    const response = await axios.post(`/api/likes/posts/${postId}`)
    return response.data
  },

  // Unlike post
  unlikePost: async (postId) => {
    const response = await axios.delete(`/api/likes/posts/${postId}`)
    return response.data
  },

  // Get like count
  getLikeCount: async (postId) => {
    const response = await axios.get(`/api/likes/posts/${postId}/count`)
    return response.data
  },
}