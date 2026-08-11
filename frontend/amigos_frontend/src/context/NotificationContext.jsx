
// // src/context/NotificationContext.jsx
// import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react'
// import { notificationAPI } from '../api/notification'
// import { useAuth } from './AuthContext'
// import cache from '../utils/cache'

// const NotificationContext = createContext()

// export const useNotifications = () => useContext(NotificationContext)

// export const NotificationProvider = ({ children }) => {
//   const { currentUser } = useAuth()
//   const [notifications, setNotifications] = useState([])
//   const [unreadCount, setUnreadCount] = useState(0)
//   const [loading, setLoading] = useState(false)
//   const [hasMore, setHasMore] = useState(true)
//   const [page, setPage] = useState(0)

//   const loadNotifications = useCallback(async (reset = true) => {
//     if (!currentUser) return
    
//     setLoading(true)
//     try {
//       const currentPage = reset ? 0 : page
//       const response = await notificationAPI.getNotifications(currentPage, 20)
      
//       if (response.success) {
//         const newNotifications = response.data.content || []
//         if (reset) {
//           setNotifications(newNotifications)
//           setPage(1)
//         } else {
//           setNotifications(prev => [...prev, ...newNotifications])
//           setPage(prev => prev + 1)
//         }
//         setHasMore(!response.data.last)
//       }
//     } catch (error) {
//       console.error('Error loading notifications:', error)
//     } finally {
//       setLoading(false)
//     }
//   }, [currentUser, page])

//   const loadUnreadCount = useCallback(async () => {
//     if (!currentUser) return
    
//     try {
//       const response = await notificationAPI.getUnreadCount()
//       if (response.success) {
//         setUnreadCount(response.data || 0)
//       }
//     } catch (error) {
//       console.error('Error loading unread count:', error)
//     }
//   }, [currentUser])

//   const markAsRead = useCallback(async (notificationId) => {
//     try {
//       const response = await notificationAPI.markAsRead(notificationId)
//       if (response.success) {
//         setNotifications(prev => prev.map(notif => 
//           notif.id === notificationId ? { ...notif, read: true } : notif
//         ))
//         setUnreadCount(prev => Math.max(prev - 1, 0))
//         cache.invalidateEndpoint('/api/notifications')
//         cache.invalidateEndpoint('/api/notifications/unread')
//         cache.invalidateEndpoint('/api/notifications/unread/count')
//         return response
//       }
//       throw new Error(response.message || 'Failed to mark notification as read')
//     } catch (error) {
//       console.error('Error marking notification as read:', error)
//       throw error
//     }
//   }, [])

//   const markAllAsRead = useCallback(async () => {
//     try {
//       const response = await notificationAPI.markAllAsRead()
//       if (response.success) {
//         setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
//         setUnreadCount(0)
//         cache.invalidateEndpoint('/api/notifications')
//         cache.invalidateEndpoint('/api/notifications/unread')
//         cache.invalidateEndpoint('/api/notifications/unread/count')
//         return response
//       }
//       throw new Error(response.message || 'Failed to mark all as read')
//     } catch (error) {
//       console.error('Error marking all as read:', error)
//       throw error
//     }
//   }, [])

//   const deleteNotification = useCallback(async (notificationId) => {
//     try {
//       const response = await notificationAPI.deleteNotification(notificationId)
//       if (response.success) {
//         const deletedNotif = notifications.find(n => n.id === notificationId)
//         setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
//         if (deletedNotif && !deletedNotif.read) {
//           setUnreadCount(prev => Math.max(prev - 1, 0))
//         }
//         cache.invalidateEndpoint('/api/notifications')
//         cache.invalidateEndpoint('/api/notifications/unread')
//         cache.invalidateEndpoint('/api/notifications/unread/count')
//         return response
//       }
//       throw new Error(response.message || 'Failed to delete notification')
//     } catch (error) {
//       console.error('Error deleting notification:', error)
//       throw error
//     }
//   }, [notifications])

//   const refreshNotifications = useCallback(async () => {
//     cache.invalidateEndpoint('/api/notifications')
//     cache.invalidateEndpoint('/api/notifications/unread')
//     cache.invalidateEndpoint('/api/notifications/unread/count')
//     await Promise.all([
//       loadNotifications(true),
//       loadUnreadCount()
//     ])
//   }, [loadNotifications, loadUnreadCount])

//   // Initial load
//   useEffect(() => {
//     if (currentUser) {
//       refreshNotifications()
      
//       const interval = setInterval(() => {
//         loadUnreadCount()
//       }, 30000)
      
//       return () => clearInterval(interval)
//     }
//   }, [currentUser, refreshNotifications, loadUnreadCount])

//   const value = useMemo(() => ({
//     notifications,
//     unreadCount,
//     loading,
//     hasMore,
//     loadNotifications,
//     loadUnreadCount,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//     refreshNotifications,
//   }), [notifications, unreadCount, loading, hasMore, loadNotifications, loadUnreadCount, markAsRead, markAllAsRead, deleteNotification, refreshNotifications])

//   return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
// }

// src/context/NotificationContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react'
import { notificationAPI } from '../api/notification'
import { useAuth } from './AuthContext'
import cache from '../utils/cache'

const NotificationContext = createContext()

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  // Callback for chat refresh when new message notification arrives
  const [onNewMessageNotification, setOnNewMessageNotification] = useState(null)

  const loadNotifications = useCallback(async (reset = true) => {
    if (!currentUser) return
    
    setLoading(true)
    try {
      const currentPage = reset ? 0 : page
      const response = await notificationAPI.getNotifications(currentPage, 20)
      
      if (response.success) {
        const newNotifications = response.data.content || []
        
        // Check if there's a new message notification
        if (!reset && newNotifications.length > 0) {
          const hasNewMessage = newNotifications.some(n => n.type === 'NEW_MESSAGE')
          if (hasNewMessage && onNewMessageNotification) {
            onNewMessageNotification()
          }
        }
        
        if (reset) {
          setNotifications(newNotifications)
          setPage(1)
        } else {
          setNotifications(prev => [...prev, ...newNotifications])
          setPage(prev => prev + 1)
        }
        setHasMore(!response.data.last)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [currentUser, page, onNewMessageNotification])

  const loadUnreadCount = useCallback(async () => {
    if (!currentUser) return
    
    try {
      const response = await notificationAPI.getUnreadCount()
      if (response.success) {
        setUnreadCount(response.data || 0)
      }
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }, [currentUser])

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await notificationAPI.markAsRead(notificationId)
      if (response.success) {
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        ))
        setUnreadCount(prev => Math.max(prev - 1, 0))
        cache.invalidateEndpoint('/api/notifications')
        cache.invalidateEndpoint('/api/notifications/unread')
        cache.invalidateEndpoint('/api/notifications/unread/count')
        return response
      }
      throw new Error(response.message || 'Failed to mark notification as read')
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await notificationAPI.markAllAsRead()
      if (response.success) {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
        setUnreadCount(0)
        cache.invalidateEndpoint('/api/notifications')
        cache.invalidateEndpoint('/api/notifications/unread')
        cache.invalidateEndpoint('/api/notifications/unread/count')
        return response
      }
      throw new Error(response.message || 'Failed to mark all as read')
    } catch (error) {
      console.error('Error marking all as read:', error)
      throw error
    }
  }, [])

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const response = await notificationAPI.deleteNotification(notificationId)
      if (response.success) {
        const deletedNotif = notifications.find(n => n.id === notificationId)
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
        if (deletedNotif && !deletedNotif.read) {
          setUnreadCount(prev => Math.max(prev - 1, 0))
        }
        cache.invalidateEndpoint('/api/notifications')
        cache.invalidateEndpoint('/api/notifications/unread')
        cache.invalidateEndpoint('/api/notifications/unread/count')
        return response
      }
      throw new Error(response.message || 'Failed to delete notification')
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }, [notifications])

  const refreshNotifications = useCallback(async () => {
    cache.invalidateEndpoint('/api/notifications')
    cache.invalidateEndpoint('/api/notifications/unread')
    cache.invalidateEndpoint('/api/notifications/unread/count')
    await Promise.all([
      loadNotifications(true),
      loadUnreadCount()
    ])
  }, [loadNotifications, loadUnreadCount])

  // ========== Register callback for new message notifications ==========
  const registerChatRefresh = useCallback((callback) => {
    setOnNewMessageNotification(() => callback)
  }, [])
  // ========== END OF FIX ==========

  // Initial load
  useEffect(() => {
    if (currentUser) {
      refreshNotifications()
      
      const interval = setInterval(() => {
        loadUnreadCount()
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [currentUser, refreshNotifications, loadUnreadCount])

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    hasMore,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    registerChatRefresh, // Add this to the exported value
  }), [notifications, unreadCount, loading, hasMore, loadNotifications, loadUnreadCount, markAsRead, markAllAsRead, deleteNotification, refreshNotifications, registerChatRefresh])

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}