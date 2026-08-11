
// // src/components/Chat/ChatList.jsx
// import { useState, useEffect } from 'react'
// import {
//   Box,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Avatar,
//   Typography,
//   Badge,
//   TextField,
//   InputAdornment,
//   IconButton,
//   useTheme,
//   alpha,
//   Paper,
//   Skeleton,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Chip,
//   Divider,
//   Tooltip,
// } from '@mui/material'
// import { Search, MoreVert, Create, Close, Send } from '@mui/icons-material'
// import { useAuth } from '../../context/AuthContext'
// import { useChat } from '../../context/ChatContext'
// //import { formatDistanceToNow } from 'date-fns'
// import { chatAPI } from '../../api/chat'
// import { userAPI } from '../../api/user'
// import { formatRelativeTime } from '../../utils/dateFormatter'

// const ChatList = ({ onSelectChat, selectedUserId, onNewMessage }) => {
//   const theme = useTheme()
//   const { currentUser } = useAuth()
//   const { conversations, loadConversations, unreadCount, loading: chatLoading } = useChat()
//   const [searchQuery, setSearchQuery] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [createMessageOpen, setCreateMessageOpen] = useState(false)
//   const [followingUsers, setFollowingUsers] = useState([])
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [messageContent, setMessageContent] = useState('')
//   const [sending, setSending] = useState(false)
//   const [userSearchQuery, setUserSearchQuery] = useState('')
//   const [loadingFollowing, setLoadingFollowing] = useState(false)

//   // Load conversations on mount
//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true)
//       await loadConversations()
//       setLoading(false)
//     }
//     loadData()
//   }, [])

//   // Sort conversations by last message time (newest first)
//   const sortedConversations = [...conversations].sort((a, b) => {
//     const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
//     const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
//     return timeB - timeA
//   })

//   const loadFollowingUsers = async () => {
//     if (!currentUser?.id) return
//     setLoadingFollowing(true)
//     try {
//       const response = await userAPI.getFollowingUsers(currentUser.id)
//       if (response.success) {
//         setFollowingUsers(response.data.content || [])
//       }
//     } catch (error) {
//       console.error('Error loading following users:', error)
//     } finally {
//       setLoadingFollowing(false)
//     }
//   }

//   const handleOpenCreateMessage = () => {
//     setCreateMessageOpen(true)
//     loadFollowingUsers()
//     setUserSearchQuery('')
//     setSelectedUser(null)
//     setMessageContent('')
//   }

//   const handleSendMessage = async () => {
//     if (!selectedUser || !messageContent.trim() || sending) return

//     setSending(true)
//     try {
//       const response = await chatAPI.sendMessageToUser(selectedUser.id, messageContent.trim())
//       if (response.success) {
//         setCreateMessageOpen(false)
//         setSelectedUser(null)
//         setMessageContent('')
//         await loadConversations()
//         if (onNewMessage) {
//           onNewMessage(response.data)
//         }
//         // Find the conversation and select it
//         const convResponse = await chatAPI.getConversations(0, 50)
//         if (convResponse.success) {
//           const newConv = convResponse.data.content.find(
//             c => c.user1?.id === selectedUser.id || c.user2?.id === selectedUser.id
//           )
//           if (newConv && onSelectChat) {
//             onSelectChat(newConv)
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error sending message:', error)
//     } finally {
//       setSending(false)
//     }
//   }

//   // Filter conversations by search query
//   const filteredConversations = sortedConversations.filter(conv => {
//     const otherUser = conv.user1?.id === currentUser?.id ? conv.user2 : conv.user1
//     return otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//            otherUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
//   })

//   // Filter following users for new message dialog
//   const filteredFollowingUsers = followingUsers.filter(user =>
//     user.username?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
//     user.fullName?.toLowerCase().includes(userSearchQuery.toLowerCase())
//   )

//   return (
//     <>
//       <Paper
//         elevation={0}
//         sx={{
//           height: '100%',
//           display: 'flex',
//           flexDirection: 'column',
//           borderRadius: { xs: 0, md: 3 },
//           border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//           overflow: 'hidden',
//           bgcolor: theme.palette.background.paper,
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             p: 2,
//             borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             bgcolor: alpha(theme.palette.primary.main, 0.02),
//             flexShrink: 0,
//           }}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Typography variant="h6" sx={{ fontWeight: 700 }}>
//               Messages
//             </Typography>
//             {unreadCount > 0 && (
//               <Chip 
//                 label={unreadCount} 
//                 size="small" 
//                 color="primary"
//                 sx={{ borderRadius: 2, height: 20, fontSize: '0.65rem' }}
//               />
//             )}
//           </Box>
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             <Tooltip title="New Message" arrow>
//               <IconButton 
//                 size="small" 
//                 onClick={handleOpenCreateMessage}
//                 sx={{
//                   bgcolor: alpha(theme.palette.primary.main, 0.1),
//                   '&:hover': {
//                     bgcolor: alpha(theme.palette.primary.main, 0.2),
//                   },
//                 }}
//               >
//                 <Create />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         </Box>

//         {/* Search */}
//         <Box sx={{ p: 2, flexShrink: 0 }}>
//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Search messages..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 3,
//                 bgcolor: alpha(theme.palette.common.white, 0.05),
//                 '&:hover': {
//                   bgcolor: alpha(theme.palette.common.white, 0.08),
//                 },
//               },
//             }}
//             slotProps={{
//               input: {
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
//                   </InputAdornment>
//                 ),
//               },
//             }}
//           />
//         </Box>

//         {/* Conversations List */}
//         <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
//           {loading || chatLoading ? (
//             Array.from({ length: 5 }).map((_, index) => (
//               <Box key={index} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <Skeleton variant="circular" width={56} height={56} />
//                 <Box sx={{ flex: 1 }}>
//                   <Skeleton variant="text" width="60%" height={24} />
//                   <Skeleton variant="text" width="40%" height={20} />
//                 </Box>
//               </Box>
//             ))
//           ) : filteredConversations.length === 0 ? (
//             <Box
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 py: 8,
//                 px: 2,
//                 color: theme.palette.text.secondary,
//               }}
//             >
//               <Typography variant="body2" sx={{ mb: 1 }}>
//                 {searchQuery ? 'No conversations found' : 'No messages yet'}
//               </Typography>
//               {!searchQuery && (
//                 <Button
//                   variant="outlined"
//                   startIcon={<Create />}
//                   onClick={handleOpenCreateMessage}
//                   sx={{ mt: 2, borderRadius: 2 }}
//                 >
//                   Start a new conversation
//                 </Button>
//               )}
//             </Box>
//           ) : (
//             <List sx={{ p: 0 }}>
//               {filteredConversations.map((conv) => {
//                 const otherUser = conv.user1?.id === currentUser?.id ? conv.user2 : conv.user1
//                 const isSelected = selectedUserId === otherUser?.id
                
//                 return (
//                   <ListItem
//                     key={conv.id}
//                     onClick={() => onSelectChat(conv)}
//                     sx={{
//                       cursor: 'pointer',
//                       py: 1.5,
//                       px: 2,
//                       transition: 'all 0.2s ease',
//                       bgcolor: isSelected
//                         ? alpha(theme.palette.primary.main, 0.08)
//                         : 'transparent',
//                       '&:hover': {
//                         bgcolor: alpha(theme.palette.primary.main, 0.04),
//                       },
//                       borderLeft: isSelected ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
//                     }}
//                   >
//                     <ListItemAvatar>
//                       <Badge
//                         overlap="circular"
//                         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                         variant="dot"
//                         color="success"
//                         invisible={!conv.isOnline}
//                         sx={{
//                           '& .MuiBadge-dot': {
//                             border: `2px solid ${theme.palette.background.paper}`,
//                             width: 12,
//                             height: 12,
//                             borderRadius: '50%',
//                           },
//                         }}
//                       >
//                         <Avatar
//                           src={otherUser?.profilePic}
//                           sx={{
//                             width: { xs: 48, sm: 56 },
//                             height: { xs: 48, sm: 56 },
//                           }}
//                         />
//                       </Badge>
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary={
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                           <Typography
//                             variant="subtitle1"
//                             sx={{
//                               fontWeight: conv.unreadCount > 0 ? 700 : 500,
//                               fontSize: { xs: '0.9rem', sm: '1rem' },
//                               overflow: 'hidden',
//                               textOverflow: 'ellipsis',
//                               whiteSpace: 'nowrap',
//                             }}
//                           >
//                             {otherUser?.username}
//                           </Typography>
//                           {/* <Typography
//                             variant="caption"
//                             sx={{
//                               color: theme.palette.text.secondary,
//                               fontSize: '0.65rem',
//                               flexShrink: 0,
//                               ml: 1,
//                             }}
//                           >
//                             {conv.lastMessageAt && formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
//                           </Typography> */}

//                           <Typography
//                             variant="caption"
//                             sx={{
//                               color: theme.palette.text.secondary,
//                               fontSize: '0.65rem',
//                               flexShrink: 0,
//                               ml: 1,
//                             }}
//                           >
//                             {conv.lastMessageAt && formatRelativeTime(conv.lastMessageAt)}
//                           </Typography>
//                         </Box>
//                       }
//                       secondary={
//                         <Box 
//                           component="span"
//                           sx={{ 
//                             display: 'flex', 
//                             justifyContent: 'space-between', 
//                             alignItems: 'center',
//                             width: '100%',
//                           }}
//                         >
//                           <Typography
//                             variant="body2"
//                             component="span"
//                             sx={{
//                               color: conv.unreadCount > 0 ? theme.palette.text.primary : theme.palette.text.secondary,
//                               fontWeight: conv.unreadCount > 0 ? 500 : 400,
//                               fontSize: { xs: '0.8rem', sm: '0.85rem' },
//                               overflow: 'hidden',
//                               textOverflow: 'ellipsis',
//                               whiteSpace: 'nowrap',
//                               maxWidth: { xs: '120px', sm: '200px' },
//                             }}
//                           >
//                             {conv.lastMessage || 'No messages yet'}
//                           </Typography>
//                           {conv.unreadCount > 0 && (
//                             <Badge
//                               badgeContent={conv.unreadCount}
//                               color="primary"
//                               sx={{
//                                 flexShrink: 0,
//                                 '& .MuiBadge-badge': {
//                                   fontSize: '0.65rem',
//                                   minWidth: 20,
//                                   height: 20,
//                                   borderRadius: 10,
//                                 },
//                               }}
//                             />
//                           )}
//                         </Box>
//                       }
//                     />
//                   </ListItem>
//                 )
//               })}
//             </List>
//           )}
//         </Box>
//       </Paper>

//       {/* Create Message Dialog */}
//       <Dialog
//         open={createMessageOpen}
//         onClose={() => setCreateMessageOpen(false)}
//         maxWidth="sm"
//         fullWidth
//         slotProps={{
//           paper: {
//             sx: { borderRadius: 3 }
//           }
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           New Message
//           <IconButton size="small" onClick={() => setCreateMessageOpen(false)}>
//             <Close />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Search users..."
//             value={userSearchQuery}
//             onChange={(e) => setUserSearchQuery(e.target.value)}
//             sx={{ mb: 2 }}
//             slotProps={{
//               input: {
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
//                   </InputAdornment>
//                 ),
//               },
//             }}
//           />

//           {selectedUser && (
//             <Box sx={{ mb: 2 }}>
//               <Chip
//                 avatar={<Avatar src={selectedUser.profilePic} />}
//                 label={selectedUser.username}
//                 onDelete={() => setSelectedUser(null)}
//                 sx={{ borderRadius: 2 }}
//               />
//             </Box>
//           )}

//           <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
//             {loadingFollowing ? (
//               <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//                 <CircularProgress size={30} />
//               </Box>
//             ) : filteredFollowingUsers.length === 0 ? (
//               <Box sx={{ textAlign: 'center', py: 4, color: theme.palette.text.secondary }}>
//                 <Typography variant="body2">
//                   {userSearchQuery ? 'No users found' : 'You are not following anyone yet'}
//                 </Typography>
//                 {!userSearchQuery && (
//                   <Typography variant="caption">
//                     Follow users to start a conversation with them
//                   </Typography>
//                 )}
//               </Box>
//             ) : (
//               filteredFollowingUsers.map((user) => (
//                 <ListItem
//                   key={user.id}
//                   onClick={() => setSelectedUser(user)}
//                   sx={{
//                     cursor: 'pointer',
//                     borderRadius: 2,
//                     mb: 0.5,
//                     bgcolor: selectedUser?.id === user.id ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
//                     '&:hover': {
//                       bgcolor: alpha(theme.palette.primary.main, 0.04),
//                     },
//                   }}
//                 >
//                   <ListItemAvatar>
//                     <Avatar src={user.profilePic} />
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={user.username}
//                     secondary={user.fullName}
//                   />
//                   {selectedUser?.id === user.id && (
//                     <Chip label="Selected" size="small" color="primary" />
//                   )}
//                 </ListItem>
//               ))
//             )}
//           </Box>

//           {selectedUser && (
//             <Box sx={{ mt: 2 }}>
//               <Divider sx={{ mb: 2 }} />
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={3}
//                 placeholder={`Send a message to ${selectedUser.username}...`}
//                 value={messageContent}
//                 onChange={(e) => setMessageContent(e.target.value)}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                   },
//                 }}
//               />
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setCreateMessageOpen(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={handleSendMessage}
//             disabled={!selectedUser || !messageContent.trim() || sending}
//             startIcon={sending ? <CircularProgress size={20} /> : <Send />}
//             sx={{ borderRadius: 2 }}
//           >
//             {sending ? 'Sending...' : 'Send'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   )
// }

// export default ChatList

// src/components/Chat/ChatList.jsx
import { useState, useEffect } from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
  Paper,
  Skeleton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
  Tooltip,
} from '@mui/material'
import { Search, MoreVert, Create, Close, Send } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { useChat } from '../../context/ChatContext'
import { chatAPI } from '../../api/chat'
import { userAPI } from '../../api/user'
import { formatRelativeTime } from '../../utils/dateFormatter'

const ChatList = ({ onSelectChat, selectedUserId, onNewMessage }) => {
  const theme = useTheme()
  const { currentUser } = useAuth()
  const { 
    conversations, 
    loadConversations, 
    unreadCount, 
    loading: chatLoading,
    refreshChatOnNotification,
  } = useChat()
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [createMessageOpen, setCreateMessageOpen] = useState(false)
  const [followingUsers, setFollowingUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messageContent, setMessageContent] = useState('')
  const [sending, setSending] = useState(false)
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [loadingFollowing, setLoadingFollowing] = useState(false)
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now())

  // Load conversations on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await loadConversations()
      setLoading(false)
    }
    loadData()
  }, [])

  // Refresh when notification arrives - ChatContext handles the actual refresh
  useEffect(() => {
    // This effect will trigger when refreshChatOnNotification changes
    // The actual refresh is handled in ChatContext
    const refreshOnNotification = async () => {
      if (refreshChatOnNotification) {
        console.log('[ChatList] Refreshing on notification...')
        // Refresh will be handled by ChatContext
        setLastRefreshTime(Date.now())
      }
    }
    refreshOnNotification()
  }, [refreshChatOnNotification])

  // Sort conversations by last message time (newest first)
  const sortedConversations = [...conversations].sort((a, b) => {
    const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
    const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
    return timeB - timeA
  })

  const loadFollowingUsers = async () => {
    if (!currentUser?.id) return
    setLoadingFollowing(true)
    try {
      const response = await userAPI.getFollowingUsers(currentUser.id)
      if (response.success) {
        setFollowingUsers(response.data.content || [])
      }
    } catch (error) {
      console.error('Error loading following users:', error)
    } finally {
      setLoadingFollowing(false)
    }
  }

  const handleOpenCreateMessage = () => {
    setCreateMessageOpen(true)
    loadFollowingUsers()
    setUserSearchQuery('')
    setSelectedUser(null)
    setMessageContent('')
  }

  const handleSendMessage = async () => {
    if (!selectedUser || !messageContent.trim() || sending) return

    setSending(true)
    try {
      const response = await chatAPI.sendMessageToUser(selectedUser.id, messageContent.trim())
      if (response.success) {
        setCreateMessageOpen(false)
        setSelectedUser(null)
        setMessageContent('')
        await loadConversations()
        if (onNewMessage) {
          onNewMessage(response.data)
        }
        // Find the conversation and select it
        const convResponse = await chatAPI.getConversations(0, 50)
        if (convResponse.success) {
          const newConv = convResponse.data.content.find(
            c => c.user1?.id === selectedUser.id || c.user2?.id === selectedUser.id
          )
          if (newConv && onSelectChat) {
            onSelectChat(newConv)
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  // Filter conversations by search query
  const filteredConversations = sortedConversations.filter(conv => {
    const otherUser = conv.user1?.id === currentUser?.id ? conv.user2 : conv.user1
    return otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Filter following users for new message dialog
  const filteredFollowingUsers = followingUsers.filter(user =>
    user.username?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(userSearchQuery.toLowerCase())
  )

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: 0, md: 3 },
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'hidden',
          bgcolor: theme.palette.background.paper,
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
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Messages
            </Typography>
            {unreadCount > 0 && (
              <Chip 
                label={unreadCount} 
                size="small" 
                color="primary"
                sx={{ borderRadius: 2, height: 20, fontSize: '0.65rem' }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="New Message" arrow>
              <IconButton 
                size="small" 
                onClick={handleOpenCreateMessage}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <Create />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Search */}
        <Box sx={{ p: 2, flexShrink: 0 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: alpha(theme.palette.common.white, 0.05),
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.white, 0.08),
                },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Conversations List */}
        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {loading || chatLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Box key={index} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={56} height={56} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
              </Box>
            ))
          ) : filteredConversations.length === 0 ? (
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
              <Typography variant="body2" sx={{ mb: 1 }}>
                {searchQuery ? 'No conversations found' : 'No messages yet'}
              </Typography>
              {!searchQuery && (
                <Button
                  variant="outlined"
                  startIcon={<Create />}
                  onClick={handleOpenCreateMessage}
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Start a new conversation
                </Button>
              )}
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredConversations.map((conv) => {
                const otherUser = conv.user1?.id === currentUser?.id ? conv.user2 : conv.user1
                const isSelected = selectedUserId === otherUser?.id
                
                return (
                  <ListItem
                    key={conv.id}
                    onClick={() => onSelectChat(conv)}
                    sx={{
                      cursor: 'pointer',
                      py: 1.5,
                      px: 2,
                      transition: 'all 0.2s ease',
                      bgcolor: isSelected
                        ? alpha(theme.palette.primary.main, 0.08)
                        : 'transparent',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                      borderLeft: isSelected ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        color="success"
                        invisible={!conv.isOnline}
                        sx={{
                          '& .MuiBadge-dot': {
                            border: `2px solid ${theme.palette.background.paper}`,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                          },
                        }}
                      >
                        <Avatar
                          src={otherUser?.profilePic}
                          sx={{
                            width: { xs: 48, sm: 56 },
                            height: { xs: 48, sm: 56 },
                          }}
                        />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: conv.unreadCount > 0 ? 700 : 500,
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {otherUser?.username}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: '0.65rem',
                              flexShrink: 0,
                              ml: 1,
                            }}
                          >
                            {conv.lastMessageAt && formatRelativeTime(conv.lastMessageAt)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box 
                          component="span"
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{
                              color: conv.unreadCount > 0 ? theme.palette.text.primary : theme.palette.text.secondary,
                              fontWeight: conv.unreadCount > 0 ? 500 : 400,
                              fontSize: { xs: '0.8rem', sm: '0.85rem' },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: { xs: '120px', sm: '200px' },
                            }}
                          >
                            {conv.lastMessage || 'No messages yet'}
                          </Typography>
                          {conv.unreadCount > 0 && (
                            <Badge
                              badgeContent={conv.unreadCount}
                              color="primary"
                              sx={{
                                flexShrink: 0,
                                '& .MuiBadge-badge': {
                                  fontSize: '0.65rem',
                                  minWidth: 20,
                                  height: 20,
                                  borderRadius: 10,
                                },
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                )
              })}
            </List>
          )}
        </Box>
      </Paper>

      {/* Create Message Dialog */}
      <Dialog
        open={createMessageOpen}
        onClose={() => setCreateMessageOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          New Message
          <IconButton size="small" onClick={() => setCreateMessageOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Search users..."
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {selectedUser && (
            <Box sx={{ mb: 2 }}>
              <Chip
                avatar={<Avatar src={selectedUser.profilePic} />}
                label={selectedUser.username}
                onDelete={() => setSelectedUser(null)}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          )}

          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {loadingFollowing ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={30} />
              </Box>
            ) : filteredFollowingUsers.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: theme.palette.text.secondary }}>
                <Typography variant="body2">
                  {userSearchQuery ? 'No users found' : 'You are not following anyone yet'}
                </Typography>
                {!userSearchQuery && (
                  <Typography variant="caption">
                    Follow users to start a conversation with them
                  </Typography>
                )}
              </Box>
            ) : (
              filteredFollowingUsers.map((user) => (
                <ListItem
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: selectedUser?.id === user.id ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={user.profilePic} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.username}
                    secondary={user.fullName}
                  />
                  {selectedUser?.id === user.id && (
                    <Chip label="Selected" size="small" color="primary" />
                  )}
                </ListItem>
              ))
            )}
          </Box>

          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder={`Send a message to ${selectedUser.username}...`}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateMessageOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!selectedUser || !messageContent.trim() || sending}
            startIcon={sending ? <CircularProgress size={20} /> : <Send />}
            sx={{ borderRadius: 2 }}
          >
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ChatList