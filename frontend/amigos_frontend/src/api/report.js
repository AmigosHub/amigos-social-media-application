// src/api/report.js
import axios from './axios'

export const reportAPI = {
  // Report a user
  reportUser: async (userId, data) => {
    const response = await axios.post(`/api/reports/users/${userId}`, data)
    return response.data
  },

  // Report a post
  reportPost: async (postId, data) => {
    const response = await axios.post(`/api/reports/posts/${postId}`, data)
    return response.data
  },

  // Report a comment
  reportComment: async (commentId, data) => {
    const response = await axios.post(`/api/reports/comments/${commentId}`, data)
    return response.data
  },
}

// Report reasons enum
export const REPORT_REASONS = [
  { value: 'SPAM', label: 'Spam' },
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'FAKE_ACCOUNT', label: 'Fake Account' },
  { value: 'HATE_SPEECH', label: 'Hate Speech' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content' },
  { value: 'COPYRIGHT', label: 'Copyright Infringement' },
  { value: 'OTHER', label: 'Other' },
]