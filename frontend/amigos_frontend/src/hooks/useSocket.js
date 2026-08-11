// src/hooks/useSocket.js
import { useState, useEffect, useRef } from 'react'

export const useSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const socketRef = useRef(null)

  useEffect(() => {
    // WebSocket connection - to be implemented with backend
    // This is a placeholder for future WebSocket integration
    setIsConnected(true)

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [url])

  const sendMessage = (message) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(message))
    }
  }

  return {
    isConnected,
    lastMessage,
    sendMessage,
  }
}