// src/api/axios.js
import axios from 'axios'

// Simulated API with localStorage
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class LocalAPI {
  static async get(endpoint) {
    await delay(300)
    const data = localStorage.getItem(endpoint)
    return { data: data ? JSON.parse(data) : [] }
  }

  static async post(endpoint, data) {
    await delay(300)
    localStorage.setItem(endpoint, JSON.stringify(data))
    return { data }
  }

  static async put(endpoint, data) {
    await delay(300)
    localStorage.setItem(endpoint, JSON.stringify(data))
    return { data }
  }

  static async delete(endpoint) {
    await delay(300)
    localStorage.removeItem(endpoint)
    return { data: { success: true } }
  }
}

const axiosInstance = {
  get: (url) => {
    // Remove leading slash and convert to key
    const key = url.startsWith('/') ? url.substring(1) : url
    return LocalAPI.get(key)
  },
  post: (url, data) => {
    const key = url.startsWith('/') ? url.substring(1) : url
    return LocalAPI.post(key, data)
  },
  put: (url, data) => {
    const key = url.startsWith('/') ? url.substring(1) : url
    return LocalAPI.put(key, data)
  },
  delete: (url) => {
    const key = url.startsWith('/') ? url.substring(1) : url
    return LocalAPI.delete(key)
  }
}

export default axiosInstance