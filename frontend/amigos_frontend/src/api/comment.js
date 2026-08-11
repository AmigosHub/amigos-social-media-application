
// src/api/comment.js
import axios from './axios'

export const commentAPI = {
  // Create comment
  createComment: async (postId, content, parentId = null) => {
    const response = await axios.post(`/api/comments/posts/${postId}`, {
      content,
      parentId,
    })
    return response.data
  },

  // Get post comments
  getPostComments: async (postId, page = 0, size = 20) => {
    const response = await axios.get(`/api/comments/posts/${postId}`, {
      params: { page, size },
    })
    return response.data
  },

  // Update comment
  updateComment: async (commentId, content) => {
    const response = await axios.put(`/api/comments/${commentId}`, { content })
    return response.data
  },

  // Delete comment
  deleteComment: async (commentId) => {
    try {
      const response = await axios.delete(`/api/comments/${commentId}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 500 && 
          error.response?.data?.message?.includes('foreign key constraint')) {
        throw new Error('Cannot delete comment due to related notifications. Please contact support.')
      }
      throw error
    }
  },

  // Add reply to comment
  addReply: async (commentId, content) => {
    const response = await axios.post(`/api/comments/${commentId}/replies`, { content })
    return response.data
  },

  // Get comment replies
  getCommentReplies: async (commentId, page = 0, size = 20) => {
    const response = await axios.get(`/api/comments/${commentId}/replies`, {
      params: { page, size },
    })
    return response.data
  },

  // Update reply
  updateReply: async (replyId, content) => {
    const response = await axios.put(`/api/comments/replies/${replyId}`, { content })
    return response.data
  },

  // Delete reply
  deleteReply: async (replyId) => {
    try {
      const response = await axios.delete(`/api/comments/replies/${replyId}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 500 && 
          error.response?.data?.message?.includes('foreign key constraint')) {
        throw new Error('Cannot delete reply due to related notifications. Please contact support.')
      }
      throw error
    }
  },
}