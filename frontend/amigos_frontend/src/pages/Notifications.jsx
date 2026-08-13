

// src/pages/Notifications.jsx
import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Chip,
  Snackbar,
  Alert,
  useTheme,
  alpha,
} from '@mui/material'
import { 
  Close, 
  Check, 
  Delete as DeleteIcon, 
  DoneAll,
  PersonAdd,
  Favorite,
  Comment,
  Notifications as NotifIcon,
} from '@mui/icons-material'
import { useNotifications } from '../context/NotificationContext'
import { useChat } from '../context/ChatContext'
import { useNavigate } from 'react-router-dom'
import { useFollow } from '../context/FollowContext'
import { formatRelativeTime } from '../utils/dateFormatter'

const Notifications = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { 
    notifications, 
    unreadCount, 
    loading, 
    hasMore, 
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  } = useNotifications()
  const { refreshChatOnNotification } = useChat()
  const { acceptFollowRequest, rejectFollowRequest, loadPendingRequests } = useFollow()
  const [processing, setProcessing] = useState({})
  const [pendingRequests, setPendingRequests] = useState([])
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [loadingRequests, setLoadingRequests] = useState(true)

  useEffect(() => {
    refreshNotifications()
    loadPendingRequestsData()
    markAllAsRead()
  }, [])

  const loadPendingRequestsData = async () => {
    setLoadingRequests(true)
    try {
      const requests = await loadPendingRequests()
      console.log('=== PENDING REQUESTS DEBUG ===')
      console.log('Raw pending requests response:', requests)
      
      let requestsArray = []
      if (requests && requests.content) {
        requestsArray = requests.content
      } else if (Array.isArray(requests)) {
        requestsArray = requests
      }
      
      console.log('Requests array:', requestsArray)
      console.log('Number of requests:', requestsArray.length)
      
      // Log each request with the new followRequestId field
      requestsArray.forEach((req, index) => {
        console.log(`Request ${index + 1}:`, {
          followRequestId: req.followRequestId,
          userId: req.user?.id,
          username: req.user?.username,
          status: req.status,
          createdAt: req.createdAt
        })
      })
      
      setPendingRequests(requestsArray)
    } catch (error) {
      console.error('Error loading pending requests:', error)
      setPendingRequests([])
    } finally {
      setLoadingRequests(false)
    }
  }

  // Get the follow request ID from pending requests using the new followRequestId field
  const getFollowRequestId = (senderId) => {
    console.log('=== LOOKING FOR FOLLOW REQUEST ===')
    console.log('Sender ID:', senderId)
    console.log('Pending requests array:', pendingRequests)
    
    if (!Array.isArray(pendingRequests) || pendingRequests.length === 0) {
      console.log('No pending requests found')
      return null
    }
    
    // Find the request where the user.id matches the sender ID
    const foundRequest = pendingRequests.find(req => req.user?.id === senderId)
    
    if (foundRequest) {
      console.log('Found matching request:', foundRequest)
      console.log('Follow request ID:', foundRequest.followRequestId)
      
      // Return the followRequestId from the response
      if (foundRequest.followRequestId) {
        return foundRequest.followRequestId
      }
      
      // Fallback: if no followRequestId, try using the user id (but this will fail)
      console.warn('No followRequestId found in request, using user ID as fallback')
      return senderId
    }
    
    console.log('No matching user found in pending requests')
    return null
  }

  const handleAcceptRequest = async (notification) => {
    console.log('=== HANDLING ACCEPT REQUEST ===')
    console.log('Notification:', notification)
    
    let followId = null
    
    // First try to get from notification
    followId = notification.followRequestId || notification.data?.followRequestId
    console.log('1. From notification:', followId)
    
    // If not in notification, try to get from pending requests using the new structure
    if (!followId && notification.sender?.id) {
      // Ensure pending requests are loaded
      if (pendingRequests.length === 0) {
        console.log('No pending requests loaded, refreshing...')
        await loadPendingRequestsData()
      }
      followId = getFollowRequestId(notification.sender.id)
      console.log('2. From pending requests:', followId)
    }
    
    console.log('Final follow ID to use:', followId)
    
    if (!followId) {
      setSnackbar({
        open: true,
        message: 'Could not find follow request ID. Please refresh and try again.',
        severity: 'error'
      })
      await loadPendingRequestsData()
      return
    }

    setProcessing(prev => ({ ...prev, [notification.id]: true }))
    try {
      console.log('Calling acceptFollowRequest with ID:', followId)
      const response = await acceptFollowRequest(followId)
      console.log('Accept response:', response)
      
      if (response.success) {
        await deleteNotification(notification.id)
        await loadPendingRequestsData()
        await refreshNotifications()
        setSnackbar({
          open: true,
          message: 'Follow request accepted!',
          severity: 'success'
        })
      }
    } catch (error) {
      console.error('Error accepting request:', error)
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to accept request',
        severity: 'error'
      })
    } finally {
      setProcessing(prev => ({ ...prev, [notification.id]: false }))
    }
  }

  const handleRejectRequest = async (notification) => {
    console.log('=== HANDLING REJECT REQUEST ===')
    console.log('Notification:', notification)
    
    let followId = null
    
    // First try to get from notification
    followId = notification.followRequestId || notification.data?.followRequestId
    console.log('1. From notification:', followId)
    
    // If not in notification, try to get from pending requests using the new structure
    if (!followId && notification.sender?.id) {
      if (pendingRequests.length === 0) {
        console.log('No pending requests loaded, refreshing...')
        await loadPendingRequestsData()
      }
      followId = getFollowRequestId(notification.sender.id)
      console.log('2. From pending requests:', followId)
    }
    
    console.log('Final follow ID to use:', followId)
    
    if (!followId) {
      setSnackbar({
        open: true,
        message: 'Could not find follow request ID. Please refresh and try again.',
        severity: 'error'
      })
      await loadPendingRequestsData()
      return
    }

    setProcessing(prev => ({ ...prev, [notification.id]: true }))
    try {
      console.log('Calling rejectFollowRequest with ID:', followId)
      const response = await rejectFollowRequest(followId)
      console.log('Reject response:', response)
      
      if (response.success) {
        await deleteNotification(notification.id)
        await loadPendingRequestsData()
        await refreshNotifications()
        setSnackbar({
          open: true,
          message: 'Follow request rejected',
          severity: 'info'
        })
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to reject request',
        severity: 'error'
      })
    } finally {
      setProcessing(prev => ({ ...prev, [notification.id]: false }))
    }
  }

  // ========== UPDATED: Handle notification click with chat refresh ==========
  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id)
    }
    
    // Handle different notification types
    if (notification.type === 'FOLLOW_REQUEST') {
      return
    } else if (notification.type === 'NEW_MESSAGE') {
      // If it's a message notification, refresh chat and navigate to chat
      if (refreshChatOnNotification) {
        console.log('[Notifications] Refreshing chat on message notification...')
        await refreshChatOnNotification()
      }
      navigate('/chat')
      return
    } else if (notification.type === 'POST_LIKED' && notification.post?.id) {
      navigate(`/post/${notification.post.id}`)
    } else if (notification.type === 'POST_COMMENTED' && notification.comment?.post?.id) {
      navigate(`/post/${notification.comment.post.id}`)
    } else if (notification.type === 'NEW_FOLLOWER') {
      navigate(`/profile/${notification.sender?.id}`)
    }
  }
  // ========== END OF UPDATE ==========

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId)
      setSnackbar({
        open: true,
        message: 'Notification deleted',
        severity: 'success'
      })
    } catch (error) {
      console.error('Error deleting notification:', error)
      setSnackbar({
        open: true,
        message: 'Failed to delete notification',
        severity: 'error'
      })
    }
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadNotifications(false)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'FOLLOW_REQUEST':
      case 'NEW_FOLLOWER':
        return <PersonAdd sx={{ color: theme.palette.primary.main }} />
      case 'POST_LIKED':
        return <Favorite sx={{ color: '#ef4444' }} />
      case 'POST_COMMENTED':
        return <Comment sx={{ color: theme.palette.info.main }} />
      case 'NEW_MESSAGE':
        return <NotifIcon sx={{ color: theme.palette.secondary.main }} />
      default:
        return <NotifIcon />
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (loading && notifications.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper 
        sx={{ 
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: alpha(theme.palette.primary.main, 0.02),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip 
                label={unreadCount} 
                size="small" 
                color="primary"
                sx={{ borderRadius: 2 }}
              />
            )}
          </Box>
          {notifications.some(n => !n.read) && (
            <Button
              size="small"
              startIcon={<DoneAll />}
              onClick={markAllAsRead}
              sx={{ borderRadius: 2 }}
            >
              Mark all read
            </Button>
          )}
        </Box>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              px: 2,
              color: theme.palette.text.secondary,
            }}
          >
            <NotifIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6" gutterBottom>
              No notifications
            </Typography>
            <Typography variant="body2">
              You're all caught up!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => {
              const isPending = processing[notification.id]
              const isFollowRequest = notification.type === 'FOLLOW_REQUEST'
              
              // Check if we have a valid follow ID from the pending requests
              let hasFollowId = false
              if (isFollowRequest && notification.sender?.id) {
                const followId = getFollowRequestId(notification.sender.id)
                hasFollowId = !!followId
              }

              return (
                <Box key={notification.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 2,
                      bgcolor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.04),
                      cursor: isFollowRequest ? 'default' : 'pointer',
                      transition: 'background 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                      },
                    }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={notification.sender?.profilePic}
                        sx={{ 
                          width: 48, 
                          height: 48,
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (notification.sender?.id) {
                            navigate(`/profile/${notification.sender.id}`)
                          }
                        }}
                      >
                        {notification.sender?.username?.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {getNotificationIcon(notification.type)}
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{
                            fontWeight: notification.read ? 400 : 600,
                          }}
                        >
                          <strong
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (notification.sender?.id) {
                                navigate(`/profile/${notification.sender.id}`)
                              }
                            }}
                          >
                            {notification.sender?.username}
                          </strong>
                          {' '}
                          {notification.message}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" component="span">
                          {formatRelativeTime(notification.createdAt)}
                        </Typography>
                        {!notification.read && (
                          <Chip 
                            label="New" 
                            size="small" 
                            color="primary"
                            sx={{ height: 20, fontSize: '0.6rem' }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Accept/Reject Buttons - Only show for follow requests with a valid follow ID */}
                    {isFollowRequest && notification.sender?.id && (
                      <Box sx={{ display: 'flex', gap: 0.5, ml: 1, flexShrink: 0 }}>
                        {hasFollowId ? (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAcceptRequest(notification)
                              }}
                              disabled={isPending}
                              sx={{
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.success.main, 0.2),
                                },
                              }}
                            >
                              {isPending ? <CircularProgress size={18} /> : <Check />}
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRejectRequest(notification)
                              }}
                              disabled={isPending}
                              sx={{
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.error.main, 0.2),
                                },
                              }}
                            >
                              <Close />
                            </IconButton>
                          </>
                        ) : (
                          <Chip 
                            label={loadingRequests ? "Loading..." : "No Request"} 
                            size="small" 
                            color="warning"
                            sx={{ height: 24 }}
                          />
                        )}
                      </Box>
                    )}
                    {!isFollowRequest && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteNotification(notification.id)
                        }}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </Box>
              )
            })}
          </List>
        )}

        {/* Load More */}
        {hasMore && notifications.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Button
              variant="outlined"
              onClick={handleLoadMore}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Load More'}
            </Button>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Notifications