
// // src/context/ChatContext.jsx
// import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react'
// import { chatAPI } from '../api/chat'
// import { useAuth } from './AuthContext'
// import cache from '../utils/cache'

// const ChatContext = createContext()

// export const useChat = () => useContext(ChatContext)

// export const ChatProvider = ({ children }) => {
//   const { currentUser } = useAuth()
//   const [conversations, setConversations] = useState([])
//   const [currentMessages, setCurrentMessages] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [hasMore, setHasMore] = useState(true)
//   const [page, setPage] = useState(0)
//   const [unreadCount, setUnreadCount] = useState(0)

//   const loadUnreadCount = useCallback(async () => {
//     if (!currentUser) return
    
//     try {
//       const response = await chatAPI.getUnreadCount()
//       if (response.success) {
//         setUnreadCount(response.data || 0)
//       }
//     } catch (error) {
//       console.error('Error loading unread count:', error)
//     }
//   }, [currentUser])

//   const loadConversations = useCallback(async (reset = true) => {
//     if (!currentUser) return
    
//     setLoading(true)
//     try {
//       const currentPage = reset ? 0 : page
//       const response = await chatAPI.getConversations(currentPage, 20)
      
//       if (response.success) {
//         const newConversations = response.data.content
//         if (reset) {
//           setConversations(newConversations)
//           setPage(1)
//         } else {
//           setConversations(prev => [...prev, ...newConversations])
//           setPage(prev => prev + 1)
//         }
//         setHasMore(!response.data.last)
        
//         const totalUnread = newConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)
//         setUnreadCount(totalUnread)
//       }
//     } catch (error) {
//       console.error('Error loading conversations:', error)
//     } finally {
//       setLoading(false)
//     }
//   }, [currentUser, page])

//   const loadMessages = useCallback(async (conversationId, reset = true) => {
//     if (!conversationId) return
    
//     setLoading(true)
//     try {
//       const currentPage = reset ? 0 : page
//       const response = await chatAPI.getMessages(conversationId, currentPage, 50)
      
//       if (response.success) {
//         const newMessages = response.data.content
//         if (reset) {
//           setCurrentMessages(newMessages)
//           setPage(1)
//         } else {
//           setCurrentMessages(prev => [...newMessages.reverse(), ...prev])
//           setPage(prev => prev + 1)
//         }
//         setHasMore(!response.data.last)
        
//         if (reset) {
//           await markConversationAsRead(conversationId)
//         }
//       }
//     } catch (error) {
//       console.error('Error loading messages:', error)
//     } finally {
//       setLoading(false)
//     }
//   }, [page])

//   const markConversationAsRead = useCallback(async (conversationId) => {
//     try {
//       const response = await chatAPI.markConversationAsRead(conversationId)
//       if (response.success) {
//         setConversations(prev => prev.map(conv => 
//           conv.id === conversationId 
//             ? { ...conv, unreadCount: 0 }
//             : conv
//         ))
//         await loadUnreadCount()
//       }
//     } catch (error) {
//       console.error('Error marking conversation as read:', error)
//     }
//   }, [loadUnreadCount])

//   const sendMessage = useCallback(async (userId, content) => {
//     try {
//       const response = await chatAPI.sendMessageToUser(userId, content)
//       if (response.success) {
//         setCurrentMessages(prev => [...prev, response.data])
//         await loadConversations(true)
//         await loadUnreadCount()
//         return response
//       }
//       throw new Error(response.message || 'Failed to send message')
//     } catch (error) {
//       throw error
//     }
//   }, [loadConversations, loadUnreadCount])

//   const sendMessageInConversation = useCallback(async (conversationId, content, replyToMessageId = null) => {
//     try {
//       const response = await chatAPI.sendMessageInConversation(
//         conversationId,
//         content,
//         replyToMessageId
//       )
//       if (response.success) {
//         setCurrentMessages(prev => [...prev, response.data])
//         await loadConversations(true)
//         await loadUnreadCount()
//         return response
//       }
//       throw new Error(response.message || 'Failed to send message')
//     } catch (error) {
//       throw error
//     }
//   }, [loadConversations, loadUnreadCount])

//   const updateMessage = useCallback(async (messageId, content) => {
//     try {
//       const response = await chatAPI.updateMessage(messageId, content)
//       if (response.success) {
//         setCurrentMessages(prev => prev.map(msg => {
//           if (msg.id === messageId) {
//             return { ...msg, content: response.data.content, isEdited: true }
//           }
//           return msg
//         }))
//         return response
//       }
//       throw new Error(response.message || 'Failed to update message')
//     } catch (error) {
//       throw error
//     }
//   }, [])

//   const deleteMessage = useCallback(async (messageId) => {
//     try {
//       const response = await chatAPI.deleteMessage(messageId)
//       if (response.success) {
//         setCurrentMessages(prev => prev.filter(msg => msg.id !== messageId))
//         return response
//       }
//       throw new Error(response.message || 'Failed to delete message')
//     } catch (error) {
//       throw error
//     }
//   }, [])

//   const replyToMessage = useCallback(async (messageId, content) => {
//     try {
//       const response = await chatAPI.replyToMessage(messageId, content)
//       if (response.success) {
//         setCurrentMessages(prev => [...prev, response.data])
//         await loadConversations(true)
//         await loadUnreadCount()
//         return response
//       }
//       throw new Error(response.message || 'Failed to reply to message')
//     } catch (error) {
//       throw error
//     }
//   }, [loadConversations, loadUnreadCount])

//   const archiveConversation = useCallback(async (conversationId) => {
//     try {
//       const response = await chatAPI.archiveConversation(conversationId)
//       if (response.success) {
//         setConversations(prev => prev.filter(conv => conv.id !== conversationId))
//         await loadUnreadCount()
//         return response
//       }
//       throw new Error(response.message || 'Failed to archive conversation')
//     } catch (error) {
//       throw error
//     }
//   }, [loadUnreadCount])

//   const searchMessages = useCallback(async (query, conversationId = null) => {
//     try {
//       const response = await chatAPI.searchMessages(query, conversationId)
//       return response.data
//     } catch (error) {
//       console.error('Error searching messages:', error)
//       return null
//     }
//   }, [])

//   // Initial load
//   useEffect(() => {
//     if (currentUser) {
//       loadConversations()
//       loadUnreadCount()
      
//       const interval = setInterval(loadUnreadCount, 30000)
//       return () => clearInterval(interval)
//     }
//   }, [currentUser, loadConversations, loadUnreadCount])

//   const value = useMemo(() => ({
//     conversations,
//     currentMessages,
//     loading,
//     hasMore,
//     unreadCount,
//     loadConversations,
//     loadMessages,
//     sendMessage,
//     sendMessageInConversation,
//     updateMessage,
//     deleteMessage,
//     replyToMessage,
//     searchMessages,
//     markConversationAsRead,
//     archiveConversation,
//     loadUnreadCount,
//   }), [conversations, currentMessages, loading, hasMore, unreadCount, loadConversations, loadMessages, sendMessage, sendMessageInConversation, updateMessage, deleteMessage, replyToMessage, searchMessages, markConversationAsRead, archiveConversation, loadUnreadCount])

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
// }

// src/context/ChatContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react'
import { chatAPI } from '../api/chat'
import { useAuth } from './AuthContext'
import cache from '../utils/cache'
import { useNotifications } from './NotificationContext'

const ChatContext = createContext()

export const useChat = () => useContext(ChatContext)

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const { registerChatRefresh } = useNotifications()
  const [conversations, setConversations] = useState([])
  const [currentMessages, setCurrentMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  const refreshCallbackRef = useRef(null)

  // Store the selected conversation ID for refresh
  const setActiveConversation = useCallback((conversationId) => {
    setSelectedConversationId(conversationId)
  }, [])

  const loadUnreadCount = useCallback(async () => {
    if (!currentUser) return
    
    try {
      const response = await chatAPI.getUnreadCount()
      if (response.success) {
        setUnreadCount(response.data || 0)
      }
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }, [currentUser])

  const loadConversations = useCallback(async (reset = true) => {
    if (!currentUser) return
    
    setLoading(true)
    try {
      const currentPage = reset ? 0 : page
      const response = await chatAPI.getConversations(currentPage, 20)
      
      if (response.success) {
        const newConversations = response.data.content
        if (reset) {
          setConversations(newConversations)
          setPage(1)
        } else {
          setConversations(prev => [...prev, ...newConversations])
          setPage(prev => prev + 1)
        }
        setHasMore(!response.data.last)
        
        const totalUnread = newConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)
        setUnreadCount(totalUnread)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [currentUser, page])

  const loadMessages = useCallback(async (conversationId, reset = true) => {
    if (!conversationId) return
    
    setLoading(true)
    try {
      const currentPage = reset ? 0 : page
      const response = await chatAPI.getMessages(conversationId, currentPage, 50)
      
      if (response.success) {
        const newMessages = response.data.content
        if (reset) {
          setCurrentMessages(newMessages)
          setPage(1)
        } else {
          setCurrentMessages(prev => [...newMessages.reverse(), ...prev])
          setPage(prev => prev + 1)
        }
        setHasMore(!response.data.last)
        
        if (reset) {
          await markConversationAsRead(conversationId)
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }, [page])

  // ========== Refresh Chat on Notification ==========
  const refreshChatOnNotification = useCallback(async () => {
    console.log('[Chat] Refreshing on notification...')
    // Refresh conversations
    await loadConversations(true)
    // Refresh messages if a conversation is selected
    if (selectedConversationId) {
      await loadMessages(selectedConversationId, true)
    }
    // Refresh unread count
    await loadUnreadCount()
  }, [selectedConversationId, loadConversations, loadMessages, loadUnreadCount])

  // Register the refresh callback with NotificationContext
  useEffect(() => {
    if (registerChatRefresh) {
      registerChatRefresh(refreshChatOnNotification)
    }
  }, [registerChatRefresh, refreshChatOnNotification])

  const markConversationAsRead = useCallback(async (conversationId) => {
    try {
      const response = await chatAPI.markConversationAsRead(conversationId)
      if (response.success) {
        setConversations(prev => prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        ))
        await loadUnreadCount()
      }
    } catch (error) {
      console.error('Error marking conversation as read:', error)
    }
  }, [loadUnreadCount])

  const sendMessage = useCallback(async (userId, content) => {
    try {
      const response = await chatAPI.sendMessageToUser(userId, content)
      if (response.success) {
        setCurrentMessages(prev => [...prev, response.data])
        await loadConversations(true)
        await loadUnreadCount()
        return response
      }
      throw new Error(response.message || 'Failed to send message')
    } catch (error) {
      throw error
    }
  }, [loadConversations, loadUnreadCount])

  const sendMessageInConversation = useCallback(async (conversationId, content, replyToMessageId = null) => {
    try {
      const response = await chatAPI.sendMessageInConversation(
        conversationId,
        content,
        replyToMessageId
      )
      if (response.success) {
        setCurrentMessages(prev => [...prev, response.data])
        await loadConversations(true)
        await loadUnreadCount()
        return response
      }
      throw new Error(response.message || 'Failed to send message')
    } catch (error) {
      throw error
    }
  }, [loadConversations, loadUnreadCount])

  const updateMessage = useCallback(async (messageId, content) => {
    try {
      const response = await chatAPI.updateMessage(messageId, content)
      if (response.success) {
        setCurrentMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            return { ...msg, content: response.data.content, isEdited: true }
          }
          return msg
        }))
        return response
      }
      throw new Error(response.message || 'Failed to update message')
    } catch (error) {
      throw error
    }
  }, [])

  const deleteMessage = useCallback(async (messageId) => {
    try {
      const response = await chatAPI.deleteMessage(messageId)
      if (response.success) {
        setCurrentMessages(prev => prev.filter(msg => msg.id !== messageId))
        return response
      }
      throw new Error(response.message || 'Failed to delete message')
    } catch (error) {
      throw error
    }
  }, [])

  const replyToMessage = useCallback(async (messageId, content) => {
    try {
      const response = await chatAPI.replyToMessage(messageId, content)
      if (response.success) {
        setCurrentMessages(prev => [...prev, response.data])
        await loadConversations(true)
        await loadUnreadCount()
        return response
      }
      throw new Error(response.message || 'Failed to reply to message')
    } catch (error) {
      throw error
    }
  }, [loadConversations, loadUnreadCount])

  const archiveConversation = useCallback(async (conversationId) => {
    try {
      const response = await chatAPI.archiveConversation(conversationId)
      if (response.success) {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId))
        await loadUnreadCount()
        return response
      }
      throw new Error(response.message || 'Failed to archive conversation')
    } catch (error) {
      throw error
    }
  }, [loadUnreadCount])

  const searchMessages = useCallback(async (query, conversationId = null) => {
    try {
      const response = await chatAPI.searchMessages(query, conversationId)
      return response.data
    } catch (error) {
      console.error('Error searching messages:', error)
      return null
    }
  }, [])

  // Initial load
  useEffect(() => {
    if (currentUser) {
      loadConversations()
      loadUnreadCount()
      
      const interval = setInterval(loadUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [currentUser, loadConversations, loadUnreadCount])

  const value = useMemo(() => ({
    conversations,
    currentMessages,
    loading,
    hasMore,
    unreadCount,
    loadConversations,
    loadMessages,
    sendMessage,
    sendMessageInConversation,
    updateMessage,
    deleteMessage,
    replyToMessage,
    searchMessages,
    markConversationAsRead,
    archiveConversation,
    loadUnreadCount,
    setActiveConversation,
    refreshChatOnNotification,
  }), [
    conversations,
    currentMessages,
    loading,
    hasMore,
    unreadCount,
    loadConversations,
    loadMessages,
    sendMessage,
    sendMessageInConversation,
    updateMessage,
    deleteMessage,
    replyToMessage,
    searchMessages,
    markConversationAsRead,
    archiveConversation,
    loadUnreadCount,
    setActiveConversation,
    refreshChatOnNotification,
  ])

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}