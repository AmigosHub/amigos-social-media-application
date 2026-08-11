// src/api/search.js
import axios from './axios'

export const searchAPI = {
  // Global search
  globalSearch: async (query, page = 0, size = 20) => {
    const response = await axios.get('/api/search', {
      params: { q: query, page, size },
    })
    return response.data
  },
}