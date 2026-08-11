// src/socket/socket.js
import { WS_URL } from '../utils/constants'

class SocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
  }

  connect() {
    // WebSocket connection - to be implemented with backend
    // This is a placeholder for future WebSocket integration
    console.log('WebSocket connecting to:', WS_URL)
    this.isConnected = true
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
      this.isConnected = false
    }
  }

  send(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({ event, data }))
    } else {
      console.warn('Socket not connected')
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    this.send(event, data)
  }
}

export const socketService = new SocketService()