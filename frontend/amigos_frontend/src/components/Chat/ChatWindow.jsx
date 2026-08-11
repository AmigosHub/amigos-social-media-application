// // // src/components/Chat/ChatWindow.jsx
// // import { useState, useEffect, useRef } from 'react'
// // import {
// //   Box,
// //   Paper,
// //   Avatar,
// //   Typography,
// //   TextField,
// //   IconButton,
// //   useTheme,
// //   alpha,
// //   Tooltip,
// //   Badge,
// //   CircularProgress,
// //   Menu,
// //   MenuItem,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   Snackbar,
// //   Alert,
// // } from '@mui/material'
// // import {
// //   Send,
// //   MoreVert,
// //   ArrowBack,
// //   Delete,
// //   Edit,
// //   Reply,
// //   Close,
// // } from '@mui/icons-material'
// // import { useAuth } from '../../context/AuthContext'
// // import { useChat } from '../../context/ChatContext'
// // //import { formatDistanceToNow } from 'date-fns'
// // import { formatRelativeTime } from '../../utils/dateFormatter'

// // const ChatWindow = ({ selectedConversation, onBack, isMobile }) => {
// //   const theme = useTheme()
// //   const { currentUser } = useAuth()
// //   const { 
// //     currentMessages, 
// //     loading, 
// //     sendMessageInConversation,
// //     loadMessages,
// //     markConversationAsRead,
// //     deleteMessage,
// //     updateMessage,
// //     loadUnreadCount
// //   } = useChat()
// //   const [message, setMessage] = useState('')
// //   const [sending, setSending] = useState(false)
// //   const [anchorEl, setAnchorEl] = useState(null)
// //   const [selectedMessage, setSelectedMessage] = useState(null)
// //   const [editDialogOpen, setEditDialogOpen] = useState(false)
// //   const [editContent, setEditContent] = useState('')
// //   const [replyingTo, setReplyingTo] = useState(null)
// //   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
// //   const messagesEndRef = useRef(null)
// //   const messagesContainerRef = useRef(null)

// //   // Load messages when conversation is selected
// //   useEffect(() => {
// //     if (selectedConversation) {
// //       loadMessages(selectedConversation.id, true)
// //       markConversationAsRead(selectedConversation.id)
// //       loadUnreadCount()
// //     }
// //   }, [selectedConversation])

// //   // Scroll to bottom when messages change (only when there are messages)
// //   useEffect(() => {
// //     if (currentMessages.length > 0) {
// //       scrollToBottom()
// //     }
// //   }, [currentMessages])

// //   const scrollToBottom = () => {
// //     if (messagesEndRef.current) {
// //       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
// //     }
// //   }

// //   const handleSendMessage = async () => {
// //     if (!message.trim() || sending) return

// //     setSending(true)
// //     try {
// //       const response = await sendMessageInConversation(
// //         selectedConversation.id,
// //         message.trim(),
// //         replyingTo?.id || null
// //       )
// //       if (response.success) {
// //         setMessage('')
// //         setReplyingTo(null)
// //         await loadUnreadCount()
// //         // Scroll to bottom after sending
// //         setTimeout(scrollToBottom, 100)
// //       }
// //     } catch (error) {
// //       console.error('Error sending message:', error)
// //       setSnackbar({
// //         open: true,
// //         message: 'Failed to send message',
// //         severity: 'error'
// //       })
// //     } finally {
// //       setSending(false)
// //     }
// //   }

// //   const handleKeyPress = (e) => {
// //     if (e.key === 'Enter' && !e.shiftKey) {
// //       e.preventDefault()
// //       handleSendMessage()
// //     }
// //   }

// //   const handleMenuOpen = (event, message) => {
// //     setAnchorEl(event.currentTarget)
// //     setSelectedMessage(message)
// //   }

// //   const handleMenuClose = () => {
// //     setAnchorEl(null)
// //     setSelectedMessage(null)
// //   }

// //   const handleEditMessage = () => {
// //     if (selectedMessage) {
// //       setEditContent(selectedMessage.content)
// //       setEditDialogOpen(true)
// //       handleMenuClose()
// //     }
// //   }

// //   const handleUpdateMessage = async () => {
// //     if (!editContent.trim() || !selectedMessage) return

// //     try {
// //       const response = await updateMessage(selectedMessage.id, editContent.trim())
// //       if (response.success) {
// //         setEditDialogOpen(false)
// //         setSnackbar({
// //           open: true,
// //           message: 'Message updated',
// //           severity: 'success'
// //         })
// //       }
// //     } catch (error) {
// //       console.error('Error updating message:', error)
// //       setSnackbar({
// //         open: true,
// //         message: 'Failed to update message',
// //         severity: 'error'
// //       })
// //     }
// //   }

// //   const handleDeleteMessage = async () => {
// //     if (!selectedMessage) return

// //     try {
// //       const response = await deleteMessage(selectedMessage.id)
// //       if (response.success) {
// //         handleMenuClose()
// //         setSnackbar({
// //           open: true,
// //           message: 'Message deleted',
// //           severity: 'success'
// //         })
// //       }
// //     } catch (error) {
// //       console.error('Error deleting message:', error)
// //       setSnackbar({
// //         open: true,
// //         message: 'Failed to delete message',
// //         severity: 'error'
// //       })
// //     }
// //   }

// //   const handleReplyToMessage = (message) => {
// //     setReplyingTo(message)
// //     handleMenuClose()
// //   }

// //   // If no conversation is selected, show placeholder
// //   if (!selectedConversation) {
// //     return (
// //       <Paper
// //         elevation={0}
// //         sx={{
// //           height: '100%',
// //           display: 'flex',
// //           flexDirection: 'column',
// //           alignItems: 'center',
// //           justifyContent: 'center',
// //           borderRadius: { xs: 0, md: 3 },
// //           border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
// //           bgcolor: theme.palette.background.paper,
// //           gap: 2,
// //           p: 4,
// //         }}
// //       >
// //         <Box
// //           sx={{
// //             width: 80,
// //             height: 80,
// //             borderRadius: '50%',
// //             bgcolor: alpha(theme.palette.primary.main, 0.08),
// //             display: 'flex',
// //             alignItems: 'center',
// //             justifyContent: 'center',
// //           }}
// //         >
// //           <Typography variant="h2" sx={{ fontSize: 40 }}>
// //             💬
// //           </Typography>
// //         </Box>
// //         <Typography variant="h6" sx={{ fontWeight: 600 }}>
// //           Your Messages
// //         </Typography>
// //         <Typography variant="body2" align="center" sx={{ maxWidth: 300, color: theme.palette.text.secondary }}>
// //           Select a conversation to start messaging
// //         </Typography>
// //       </Paper>
// //     )
// //   }

// //   const otherUser = selectedConversation.user1?.id === currentUser?.id
// //     ? selectedConversation.user2
// //     : selectedConversation.user1

// //   const isOwnMessage = (senderId) => senderId === currentUser?.id

// //   // Sort messages by date (oldest first, newest last) for proper chat display
// //   const sortedMessages = [...currentMessages].sort((a, b) => {
// //     return new Date(a.createdAt) - new Date(b.createdAt)
// //   })

// //   return (
// //     <Paper
// //       elevation={0}
// //       sx={{
// //         height: '100%',
// //         display: 'flex',
// //         flexDirection: 'column',
// //         borderRadius: { xs: 0, md: 3 },
// //         border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
// //         overflow: 'hidden',
// //         bgcolor: theme.palette.background.paper,
// //       }}
// //     >
// //       {/* Chat Header */}
// //       <Box
// //         sx={{
// //           p: { xs: 1, sm: 1.5 },
// //           borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
// //           display: 'flex',
// //           alignItems: 'center',
// //           justifyContent: 'space-between',
// //           bgcolor: alpha(theme.palette.primary.main, 0.02),
// //           flexShrink: 0,
// //         }}
// //       >
// //         <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
// //           {isMobile && (
// //             <IconButton onClick={onBack} size="small">
// //               <ArrowBack />
// //             </IconButton>
// //           )}
// //           <Badge
// //             overlap="circular"
// //             anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// //             variant="dot"
// //             color="success"
// //             invisible={!selectedConversation?.isOnline}
// //           >
// //             <Avatar
// //               src={otherUser?.profilePic || otherUser?.profileImageUrl}
// //               sx={{ width: { xs: 40, sm: 44 }, height: { xs: 40, sm: 44 } }}
// //             />
// //           </Badge>
// //           <Box sx={{ minWidth: 0 }}>
// //             <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
// //               {otherUser?.username}
// //             </Typography>
// //             <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
// //               {selectedConversation?.isOnline ? 'Online' : 'Offline'}
// //             </Typography>
// //           </Box>
// //         </Box>
// //         {/* Archive icon removed */}
// //       </Box>

// //       {/* Reply indicator */}
// //       {replyingTo && (
// //         <Box
// //           sx={{
// //             p: 1,
// //             px: 2,
// //             bgcolor: alpha(theme.palette.primary.main, 0.08),
// //             borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
// //             display: 'flex',
// //             alignItems: 'center',
// //             justifyContent: 'space-between',
// //             flexShrink: 0,
// //           }}
// //         >
// //           <Box sx={{ overflow: 'hidden' }}>
// //             <Typography variant="caption" color="text.secondary">
// //               Replying to {replyingTo.sender?.username || 'user'}
// //             </Typography>
// //             <Typography variant="body2" sx={{ fontSize: '0.85rem', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
// //               {replyingTo.content}
// //             </Typography>
// //           </Box>
// //           <IconButton size="small" onClick={() => setReplyingTo(null)}>
// //             <Close />
// //           </IconButton>
// //         </Box>
// //       )}

// //       {/* Messages */}
// //       <Box
// //         ref={messagesContainerRef}
// //         sx={{
// //           flex: 1,
// //           overflowY: 'auto',
// //           overflowX: 'hidden',
// //           p: { xs: 1.5, sm: 2 },
// //           bgcolor: theme.palette.mode === 'dark'
// //             ? alpha(theme.palette.background.default, 0.3)
// //             : alpha(theme.palette.background.default, 0.5),
// //           display: 'flex',
// //           flexDirection: 'column',
// //           gap: 0.5,
// //         }}
// //       >
// //         {loading ? (
// //           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
// //             <CircularProgress />
// //           </Box>
// //         ) : (
// //           <>
// //             {sortedMessages.length === 0 ? (
// //               <Box
// //                 sx={{
// //                   display: 'flex',
// //                   flexDirection: 'column',
// //                   alignItems: 'center',
// //                   justifyContent: 'center',
// //                   height: '100%',
// //                   gap: 1,
// //                 }}
// //               >
// //                 <Typography variant="body2" color="text.secondary">
// //                   No messages yet
// //                 </Typography>
// //                 <Typography variant="caption" color="text.secondary">
// //                   Send a message to start the conversation
// //                 </Typography>
// //               </Box>
// //             ) : (
// //               sortedMessages.map((msg, index) => {
// //                 const isOwn = isOwnMessage(msg.sender?.id || msg.senderId)
// //                 const showAvatar = !isOwn && (index === 0 || sortedMessages[index - 1]?.sender?.id !== msg.sender?.id)

// //                 return (
// //                   <Box
// //                     key={msg.id}
// //                     sx={{
// //                       display: 'flex',
// //                       flexDirection: 'column',
// //                       alignItems: isOwn ? 'flex-end' : 'flex-start',
// //                       maxWidth: { xs: '85%', sm: '75%' },
// //                       alignSelf: isOwn ? 'flex-end' : 'flex-start',
// //                       animation: 'fadeIn 0.3s ease-out',
// //                     }}
// //                   >
// //                     {/* Reply indicator */}
// //                     {msg.replyTo && (
// //                       <Box
// //                         sx={{
// //                           maxWidth: '90%',
// //                           p: 1,
// //                           px: 1.5,
// //                           mb: 0.5,
// //                           bgcolor: alpha(theme.palette.common.white, 0.05),
// //                           borderRadius: 1,
// //                           borderLeft: `3px solid ${theme.palette.primary.main}`,
// //                         }}
// //                       >
// //                         <Typography variant="caption" color="text.secondary">
// //                           Reply to {msg.replyTo.sender?.username || 'user'}
// //                         </Typography>
// //                         <Typography variant="body2" sx={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
// //                           {msg.replyTo.content}
// //                         </Typography>
// //                       </Box>
// //                     )}

// //                     <Box
// //                       sx={{
// //                         display: 'flex',
// //                         alignItems: 'flex-end',
// //                         gap: 1,
// //                         flexDirection: isOwn ? 'row-reverse' : 'row',
// //                         maxWidth: '100%',
// //                       }}
// //                     >
// //                       {!isOwn && (
// //                         <Avatar
// //                           src={otherUser?.profilePic || otherUser?.profileImageUrl}
// //                           sx={{
// //                             width: 28,
// //                             height: 28,
// //                             opacity: showAvatar ? 1 : 0,
// //                             transition: 'opacity 0.2s ease',
// //                           }}
// //                         />
// //                       )}
// //                       <Box
// //                         sx={{
// //                           maxWidth: '100%',
// //                           px: { xs: 1.5, sm: 2 },
// //                           py: { xs: 1, sm: 1.5 },
// //                           borderRadius: isOwn
// //                             ? '18px 18px 4px 18px'
// //                             : '18px 18px 18px 4px',
// //                           bgcolor: isOwn
// //                             ? theme.palette.primary.main
// //                             : theme.palette.mode === 'dark'
// //                               ? alpha(theme.palette.common.white, 0.12)
// //                               : alpha(theme.palette.common.white, 0.9),
// //                           color: isOwn
// //                             ? 'white'
// //                             : theme.palette.text.primary,
// //                           boxShadow: isOwn
// //                             ? '0 1px 2px rgba(0,0,0,0.1)'
// //                             : '0 1px 2px rgba(0,0,0,0.05)',
// //                           wordBreak: 'break-word',
// //                         }}
// //                       >
// //                         <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, whiteSpace: 'pre-wrap' }}>
// //                           {msg.content}
// //                         </Typography>
// //                         {msg.isEdited && (
// //                           <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.6 }}>
// //                             (edited)
// //                           </Typography>
// //                         )}
// //                       </Box>
// //                     </Box>
// //                     <Box
// //                       sx={{
// //                         display: 'flex',
// //                         alignItems: 'center',
// //                         gap: 1,
// //                         mt: 0.5,
// //                       }}
// //                     >
// //                       {/* <Typography
// //                         variant="caption"
// //                         sx={{
// //                           color: theme.palette.text.secondary,
// //                           fontSize: { xs: '0.6rem', sm: '0.65rem' },
// //                           mx: isOwn ? 0 : 4,
// //                           opacity: 0.7,
// //                         }}
// //                       >
// //                         {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
// //                         {isOwn && (
// //                           <span style={{ marginLeft: 4 }}>
// //                             {msg.isRead ? '✓✓' : '✓'}
// //                           </span>
// //                         )}
// //                       </Typography> */}
// //                       <Typography
// //                         variant="caption"
// //                         sx={{
// //                           color: theme.palette.text.secondary,
// //                           fontSize: { xs: '0.6rem', sm: '0.65rem' },
// //                           mx: isOwn ? 0 : 4,
// //                           opacity: 0.7,
// //                         }}
// //                       >
// //                         {formatRelativeTime(msg.createdAt)}
// //                         {isOwn && (
// //                           <span style={{ marginLeft: 4 }}>
// //                             {msg.isRead ? '✓✓' : '✓'}
// //                           </span>
// //                         )}
// //                       </Typography>
// //                       {isOwn && !msg.isDeleted && (
// //                         <IconButton
// //                           size="small"
// //                           onClick={(e) => handleMenuOpen(e, msg)}
// //                           sx={{ p: 0.2 }}
// //                         >
// //                           <MoreVert sx={{ fontSize: 14 }} />
// //                         </IconButton>
// //                       )}
// //                       {!isOwn && (
// //                         <IconButton
// //                           size="small"
// //                           onClick={() => handleReplyToMessage(msg)}
// //                           sx={{ p: 0.2 }}
// //                         >
// //                           <Reply sx={{ fontSize: 14 }} />
// //                         </IconButton>
// //                       )}
// //                     </Box>
// //                   </Box>
// //                 )
// //               })
// //             )}
// //             <div ref={messagesEndRef} />
// //           </>
// //         )}
// //       </Box>

// //       {/* Message Input */}
// //       <Box
// //         sx={{
// //           p: { xs: 1, sm: 1.5 },
// //           borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
// //           bgcolor: theme.palette.background.paper,
// //           flexShrink: 0,
// //         }}
// //       >
// //         <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: { xs: 0.5, sm: 1 } }}>
// //           <TextField
// //             fullWidth
// //             multiline
// //             maxRows={4}
// //             placeholder="Type a message..."
// //             value={message}
// //             onChange={(e) => setMessage(e.target.value)}
// //             onKeyPress={handleKeyPress}
// //             disabled={sending}
// //             variant="outlined"
// //             size="small"
// //             sx={{
// //               '& .MuiOutlinedInput-root': {
// //                 borderRadius: 3,
// //                 bgcolor: alpha(theme.palette.common.white, 0.05),
// //                 '&:hover': {
// //                   bgcolor: alpha(theme.palette.common.white, 0.08),
// //                 },
// //                 '& textarea': {
// //                   padding: { xs: '8px 12px', sm: '10px 14px' },
// //                   fontSize: { xs: '0.85rem', sm: '0.95rem' },
// //                 },
// //                 '& fieldset': {
// //                   borderColor: alpha(theme.palette.divider, 0.2),
// //                 },
// //                 '&:hover fieldset': {
// //                   borderColor: alpha(theme.palette.primary.main, 0.3),
// //                 },
// //                 '&.Mui-focused fieldset': {
// //                   borderColor: theme.palette.primary.main,
// //                 },
// //               },
// //             }}
// //           />
// //           <IconButton
// //             onClick={handleSendMessage}
// //             disabled={!message.trim() || sending}
// //             sx={{
// //               bgcolor: message.trim() ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3),
// //               color: 'white',
// //               width: { xs: 40, sm: 48 },
// //               height: { xs: 40, sm: 48 },
// //               borderRadius: '50%',
// //               mb: { xs: 0.5, sm: 0 },
// //               '&:hover': {
// //                 bgcolor: message.trim() ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.3),
// //               },
// //               '&.Mui-disabled': {
// //                 bgcolor: alpha(theme.palette.primary.main, 0.3),
// //                 color: 'white',
// //               },
// //               transition: 'all 0.2s ease',
// //             }}
// //           >
// //             {sending ? <CircularProgress size={20} color="inherit" /> : <Send sx={{ fontSize: { xs: 18, sm: 22 } }} />}
// //           </IconButton>
// //         </Box>
// //       </Box>

// //       {/* Message Actions Menu */}
// //       <Menu
// //         anchorEl={anchorEl}
// //         open={Boolean(anchorEl)}
// //         onClose={handleMenuClose}
// //         anchorOrigin={{
// //           vertical: 'bottom',
// //           horizontal: 'right',
// //         }}
// //         transformOrigin={{
// //           vertical: 'top',
// //           horizontal: 'right',
// //         }}
// //       >
// //         <MenuItem onClick={handleEditMessage}>
// //           <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
// //         </MenuItem>
// //         <MenuItem onClick={() => handleReplyToMessage(selectedMessage)}>
// //           <Reply fontSize="small" sx={{ mr: 1 }} /> Reply
// //         </MenuItem>
// //         <MenuItem onClick={handleDeleteMessage} sx={{ color: 'error.main' }}>
// //           <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
// //         </MenuItem>
// //       </Menu>

// //       {/* Edit Message Dialog */}
// //       <Dialog
// //         open={editDialogOpen}
// //         onClose={() => setEditDialogOpen(false)}
// //         maxWidth="sm"
// //         fullWidth
// //         slotProps={{
// //           paper: {
// //             sx: { borderRadius: 3 }
// //           }
// //         }}
// //       >
// //         <DialogTitle sx={{ fontWeight: 600 }}>Edit Message</DialogTitle>
// //         <DialogContent>
// //           <TextField
// //             autoFocus
// //             fullWidth
// //             multiline
// //             rows={3}
// //             value={editContent}
// //             onChange={(e) => setEditContent(e.target.value)}
// //             sx={{ mt: 1 }}
// //           />
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
// //           <Button 
// //             onClick={handleUpdateMessage} 
// //             variant="contained"
// //             disabled={!editContent.trim()}
// //           >
// //             Save
// //           </Button>
// //         </DialogActions>
// //       </Dialog>

// //       {/* Snackbar for notifications */}
// //       <Snackbar
// //         open={snackbar.open}
// //         autoHideDuration={4000}
// //         onClose={() => setSnackbar({ ...snackbar, open: false })}
// //         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// //       >
// //         <Alert
// //           onClose={() => setSnackbar({ ...snackbar, open: false })}
// //           severity={snackbar.severity}
// //           variant="filled"
// //           sx={{ width: '100%', borderRadius: 2 }}
// //         >
// //           {snackbar.message}
// //         </Alert>
// //       </Snackbar>

// //       {/* CSS animation */}
// //       <style>
// //         {`
// //           @keyframes fadeIn {
// //             from {
// //               opacity: 0;
// //               transform: translateY(10px);
// //             }
// //             to {
// //               opacity: 1;
// //               transform: translateY(0);
// //             }
// //           }
// //         `}
// //       </style>
// //     </Paper>
// //   )
// // }

// // export default ChatWindow

// // src/components/Chat/ChatWindow.jsx
// import { useState, useEffect, useRef } from 'react'
// import {
//   Box,
//   Paper,
//   Avatar,
//   Typography,
//   TextField,
//   IconButton,
//   useTheme,
//   alpha,
//   Tooltip,
//   Badge,
//   CircularProgress,
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Snackbar,
//   Alert,
// } from '@mui/material'
// import {
//   Send,
//   MoreVert,
//   ArrowBack,
//   Delete,
//   Edit,
//   Reply,
//   Close,
// } from '@mui/icons-material'
// import { useAuth } from '../../context/AuthContext'
// import { useChat } from '../../context/ChatContext'
// import { formatRelativeTime } from '../../utils/dateFormatter'

// const ChatWindow = ({ selectedConversation, onBack, isMobile }) => {
//   const theme = useTheme()
//   const { currentUser } = useAuth()
//   const { 
//     currentMessages, 
//     loading, 
//     sendMessageInConversation,
//     loadMessages,
//     markConversationAsRead,
//     deleteMessage,
//     updateMessage,
//     loadUnreadCount
//   } = useChat()
//   const [message, setMessage] = useState('')
//   const [sending, setSending] = useState(false)
//   const [anchorEl, setAnchorEl] = useState(null)
//   const [selectedMessage, setSelectedMessage] = useState(null)
//   const [editDialogOpen, setEditDialogOpen] = useState(false)
//   const [editContent, setEditContent] = useState('')
//   const [replyingTo, setReplyingTo] = useState(null)
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
//   const messagesEndRef = useRef(null)
//   const messagesContainerRef = useRef(null)

//   // Load messages when conversation is selected
//   useEffect(() => {
//     if (selectedConversation) {
//       loadMessages(selectedConversation.id, true)
//       markConversationAsRead(selectedConversation.id)
//       loadUnreadCount()
//     }
//   }, [selectedConversation])

//   // Scroll to bottom when messages change (only when there are messages)
//   useEffect(() => {
//     if (currentMessages.length > 0) {
//       scrollToBottom()
//     }
//   }, [currentMessages])

//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
//     }
//   }

//   const handleSendMessage = async () => {
//     if (!message.trim() || sending) return

//     setSending(true)
//     try {
//       const response = await sendMessageInConversation(
//         selectedConversation.id,
//         message.trim(),
//         replyingTo?.id || null
//       )
//       if (response.success) {
//         setMessage('')
//         setReplyingTo(null)
//         await loadUnreadCount()
//         setTimeout(scrollToBottom, 100)
//       }
//     } catch (error) {
//       console.error('Error sending message:', error)
//       setSnackbar({
//         open: true,
//         message: 'Failed to send message',
//         severity: 'error'
//       })
//     } finally {
//       setSending(false)
//     }
//   }

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault()
//       handleSendMessage()
//     }
//   }

//   const handleMenuOpen = (event, message) => {
//     setAnchorEl(event.currentTarget)
//     setSelectedMessage(message)
//   }

//   const handleMenuClose = () => {
//     setAnchorEl(null)
//     setSelectedMessage(null)
//   }

//   const handleEditMessage = () => {
//     if (selectedMessage) {
//       setEditContent(selectedMessage.content)
//       setEditDialogOpen(true)
//       handleMenuClose()
//     }
//   }

//   const handleUpdateMessage = async () => {
//     if (!editContent.trim() || !selectedMessage) return

//     try {
//       const response = await updateMessage(selectedMessage.id, editContent.trim())
//       if (response.success) {
//         setEditDialogOpen(false)
//         setSnackbar({
//           open: true,
//           message: 'Message updated',
//           severity: 'success'
//         })
//       }
//     } catch (error) {
//       console.error('Error updating message:', error)
//       setSnackbar({
//         open: true,
//         message: 'Failed to update message',
//         severity: 'error'
//       })
//     }
//   }

//   const handleDeleteMessage = async () => {
//     if (!selectedMessage) return

//     try {
//       const response = await deleteMessage(selectedMessage.id)
//       if (response.success) {
//         handleMenuClose()
//         setSnackbar({
//           open: true,
//           message: 'Message deleted',
//           severity: 'success'
//         })
//       }
//     } catch (error) {
//       console.error('Error deleting message:', error)
//       setSnackbar({
//         open: true,
//         message: 'Failed to delete message',
//         severity: 'error'
//       })
//     }
//   }

//   const handleReplyToMessage = (message) => {
//     setReplyingTo(message)
//     handleMenuClose()
//   }

//   // If no conversation is selected, show placeholder
//   if (!selectedConversation) {
//     return (
//       <Paper
//         elevation={0}
//         sx={{
//           height: '100%',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           borderRadius: { xs: 0, md: 3 },
//           border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//           bgcolor: theme.palette.background.paper,
//           gap: 2,
//           p: 4,
//         }}
//       >
//         <Box
//           sx={{
//             width: 80,
//             height: 80,
//             borderRadius: '50%',
//             bgcolor: alpha(theme.palette.primary.main, 0.08),
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}
//         >
//           <Typography variant="h2" sx={{ fontSize: 40 }}>
//             💬
//           </Typography>
//         </Box>
//         <Typography variant="h6" sx={{ fontWeight: 600 }}>
//           Your Messages
//         </Typography>
//         <Typography variant="body2" align="center" sx={{ maxWidth: 300, color: theme.palette.text.secondary }}>
//           Select a conversation to start messaging
//         </Typography>
//       </Paper>
//     )
//   }

//   const otherUser = selectedConversation.user1?.id === currentUser?.id
//     ? selectedConversation.user2
//     : selectedConversation.user1

//   const isOwnMessage = (senderId) => senderId === currentUser?.id

//   // Sort messages by date (oldest first, newest last) for proper chat display
//   const sortedMessages = [...currentMessages].sort((a, b) => {
//     return new Date(a.createdAt) - new Date(b.createdAt)
//   })

//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         borderRadius: { xs: 0, md: 3 },
//         border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//         overflow: 'hidden',
//         bgcolor: theme.palette.background.paper,
//       }}
//     >
//       {/* Chat Header - ONLINE/OFFLINE TEXT REMOVED */}
//       <Box
//         sx={{
//           p: { xs: 1, sm: 1.5 },
//           borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           bgcolor: alpha(theme.palette.primary.main, 0.02),
//           flexShrink: 0,
//         }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
//           {isMobile && (
//             <IconButton onClick={onBack} size="small">
//               <ArrowBack />
//             </IconButton>
//           )}
//           <Badge
//             overlap="circular"
//             anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//             variant="dot"
//             color="success"
//             invisible={!selectedConversation?.isOnline}
//           >
//             <Avatar
//               src={otherUser?.profilePic || otherUser?.profileImageUrl}
//               sx={{ width: { xs: 40, sm: 44 }, height: { xs: 40, sm: 44 } }}
//             />
//           </Badge>
//           <Box sx={{ minWidth: 0 }}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
//               {otherUser?.username}
//             </Typography>
//             {/* ONLINE/OFFLINE TEXT REMOVED - Only the green dot badge remains */}
//           </Box>
//         </Box>
//         {/* Archive icon removed */}
//       </Box>

//       {/* Reply indicator */}
//       {replyingTo && (
//         <Box
//           sx={{
//             p: 1,
//             px: 2,
//             bgcolor: alpha(theme.palette.primary.main, 0.08),
//             borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             flexShrink: 0,
//           }}
//         >
//           <Box sx={{ overflow: 'hidden' }}>
//             <Typography variant="caption" color="text.secondary">
//               Replying to {replyingTo.sender?.username || 'user'}
//             </Typography>
//             <Typography variant="body2" sx={{ fontSize: '0.85rem', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//               {replyingTo.content}
//             </Typography>
//           </Box>
//           <IconButton size="small" onClick={() => setReplyingTo(null)}>
//             <Close />
//           </IconButton>
//         </Box>
//       )}

//       {/* Messages */}
//       <Box
//         ref={messagesContainerRef}
//         sx={{
//           flex: 1,
//           overflowY: 'auto',
//           overflowX: 'hidden',
//           p: { xs: 1.5, sm: 2 },
//           bgcolor: theme.palette.mode === 'dark'
//             ? alpha(theme.palette.background.default, 0.3)
//             : alpha(theme.palette.background.default, 0.5),
//           display: 'flex',
//           flexDirection: 'column',
//           gap: 0.5,
//         }}
//       >
//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <>
//             {sortedMessages.length === 0 ? (
//               <Box
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   height: '100%',
//                   gap: 1,
//                 }}
//               >
//                 <Typography variant="body2" color="text.secondary">
//                   No messages yet
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   Send a message to start the conversation
//                 </Typography>
//               </Box>
//             ) : (
//               sortedMessages.map((msg, index) => {
//                 const isOwn = isOwnMessage(msg.sender?.id || msg.senderId)
//                 const showAvatar = !isOwn && (index === 0 || sortedMessages[index - 1]?.sender?.id !== msg.sender?.id)

//                 return (
//                   <Box
//                     key={msg.id}
//                     sx={{
//                       display: 'flex',
//                       flexDirection: 'column',
//                       alignItems: isOwn ? 'flex-end' : 'flex-start',
//                       maxWidth: { xs: '85%', sm: '75%' },
//                       alignSelf: isOwn ? 'flex-end' : 'flex-start',
//                       animation: 'fadeIn 0.3s ease-out',
//                     }}
//                   >
//                     {/* Reply indicator */}
//                     {msg.replyTo && (
//                       <Box
//                         sx={{
//                           maxWidth: '90%',
//                           p: 1,
//                           px: 1.5,
//                           mb: 0.5,
//                           bgcolor: alpha(theme.palette.common.white, 0.05),
//                           borderRadius: 1,
//                           borderLeft: `3px solid ${theme.palette.primary.main}`,
//                         }}
//                       >
//                         <Typography variant="caption" color="text.secondary">
//                           Reply to {msg.replyTo.sender?.username || 'user'}
//                         </Typography>
//                         <Typography variant="body2" sx={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
//                           {msg.replyTo.content}
//                         </Typography>
//                       </Box>
//                     )}

//                     <Box
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'flex-end',
//                         gap: 1,
//                         flexDirection: isOwn ? 'row-reverse' : 'row',
//                         maxWidth: '100%',
//                       }}
//                     >
//                       {!isOwn && (
//                         <Avatar
//                           src={otherUser?.profilePic || otherUser?.profileImageUrl}
//                           sx={{
//                             width: 28,
//                             height: 28,
//                             opacity: showAvatar ? 1 : 0,
//                             transition: 'opacity 0.2s ease',
//                           }}
//                         />
//                       )}
//                       <Box
//                         sx={{
//                           maxWidth: '100%',
//                           px: { xs: 1.5, sm: 2 },
//                           py: { xs: 1, sm: 1.5 },
//                           borderRadius: isOwn
//                             ? '18px 18px 4px 18px'
//                             : '18px 18px 18px 4px',
//                           bgcolor: isOwn
//                             ? theme.palette.primary.main
//                             : theme.palette.mode === 'dark'
//                               ? alpha(theme.palette.common.white, 0.12)
//                               : alpha(theme.palette.common.white, 0.9),
//                           color: isOwn
//                             ? 'white'
//                             : theme.palette.text.primary,
//                           boxShadow: isOwn
//                             ? '0 1px 2px rgba(0,0,0,0.1)'
//                             : '0 1px 2px rgba(0,0,0,0.05)',
//                           wordBreak: 'break-word',
//                         }}
//                       >
//                         <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, whiteSpace: 'pre-wrap' }}>
//                           {msg.content}
//                         </Typography>
//                         {msg.isEdited && (
//                           <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.6 }}>
//                             (edited)
//                           </Typography>
//                         )}
//                       </Box>
//                     </Box>
//                     <Box
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 1,
//                         mt: 0.5,
//                       }}
//                     >
//                       <Typography
//                         variant="caption"
//                         sx={{
//                           color: theme.palette.text.secondary,
//                           fontSize: { xs: '0.6rem', sm: '0.65rem' },
//                           mx: isOwn ? 0 : 4,
//                           opacity: 0.7,
//                         }}
//                       >
//                         {formatRelativeTime(msg.createdAt)}
//                         {isOwn && (
//                           <span style={{ marginLeft: 4 }}>
//                             {msg.isRead ? '✓✓' : '✓'}
//                           </span>
//                         )}
//                       </Typography>
//                       {isOwn && !msg.isDeleted && (
//                         <IconButton
//                           size="small"
//                           onClick={(e) => handleMenuOpen(e, msg)}
//                           sx={{ p: 0.2 }}
//                         >
//                           <MoreVert sx={{ fontSize: 14 }} />
//                         </IconButton>
//                       )}
//                       {!isOwn && (
//                         <IconButton
//                           size="small"
//                           onClick={() => handleReplyToMessage(msg)}
//                           sx={{ p: 0.2 }}
//                         >
//                           <Reply sx={{ fontSize: 14 }} />
//                         </IconButton>
//                       )}
//                     </Box>
//                   </Box>
//                 )
//               })
//             )}
//             <div ref={messagesEndRef} />
//           </>
//         )}
//       </Box>

//       {/* Message Input */}
//       <Box
//         sx={{
//           p: { xs: 1, sm: 1.5 },
//           borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//           bgcolor: theme.palette.background.paper,
//           flexShrink: 0,
//         }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: { xs: 0.5, sm: 1 } }}>
//           <TextField
//             fullWidth
//             multiline
//             maxRows={4}
//             placeholder="Type a message..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             disabled={sending}
//             variant="outlined"
//             size="small"
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 3,
//                 bgcolor: alpha(theme.palette.common.white, 0.05),
//                 '&:hover': {
//                   bgcolor: alpha(theme.palette.common.white, 0.08),
//                 },
//                 '& textarea': {
//                   padding: { xs: '8px 12px', sm: '10px 14px' },
//                   fontSize: { xs: '0.85rem', sm: '0.95rem' },
//                 },
//                 '& fieldset': {
//                   borderColor: alpha(theme.palette.divider, 0.2),
//                 },
//                 '&:hover fieldset': {
//                   borderColor: alpha(theme.palette.primary.main, 0.3),
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: theme.palette.primary.main,
//                 },
//               },
//             }}
//           />
//           <IconButton
//             onClick={handleSendMessage}
//             disabled={!message.trim() || sending}
//             sx={{
//               bgcolor: message.trim() ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3),
//               color: 'white',
//               width: { xs: 40, sm: 48 },
//               height: { xs: 40, sm: 48 },
//               borderRadius: '50%',
//               mb: { xs: 0.5, sm: 0 },
//               '&:hover': {
//                 bgcolor: message.trim() ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.3),
//               },
//               '&.Mui-disabled': {
//                 bgcolor: alpha(theme.palette.primary.main, 0.3),
//                 color: 'white',
//               },
//               transition: 'all 0.2s ease',
//             }}
//           >
//             {sending ? <CircularProgress size={20} color="inherit" /> : <Send sx={{ fontSize: { xs: 18, sm: 22 } }} />}
//           </IconButton>
//         </Box>
//       </Box>

//       {/* Message Actions Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <MenuItem onClick={handleEditMessage}>
//           <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
//         </MenuItem>
//         <MenuItem onClick={() => handleReplyToMessage(selectedMessage)}>
//           <Reply fontSize="small" sx={{ mr: 1 }} /> Reply
//         </MenuItem>
//         <MenuItem onClick={handleDeleteMessage} sx={{ color: 'error.main' }}>
//           <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
//         </MenuItem>
//       </Menu>

//       {/* Edit Message Dialog */}
//       <Dialog
//         open={editDialogOpen}
//         onClose={() => setEditDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//         slotProps={{
//           paper: {
//             sx: { borderRadius: 3 }
//           }
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: 600 }}>Edit Message</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             fullWidth
//             multiline
//             rows={3}
//             value={editContent}
//             onChange={(e) => setEditContent(e.target.value)}
//             sx={{ mt: 1 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
//           <Button 
//             onClick={handleUpdateMessage} 
//             variant="contained"
//             disabled={!editContent.trim()}
//           >
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{ width: '100%', borderRadius: 2 }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       {/* CSS animation */}
//       <style>
//         {`
//           @keyframes fadeIn {
//             from {
//               opacity: 0;
//               transform: translateY(10px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//         `}
//       </style>
//     </Paper>
//   )
// }

// export default ChatWindow

// src/components/Chat/ChatWindow.jsx
import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  IconButton,
  useTheme,
  alpha,
  Tooltip,
  Badge,
  CircularProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material'
import {
  Send,
  MoreVert,
  ArrowBack,
  Delete,
  Edit,
  Reply,
  Close,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { useChat } from '../../context/ChatContext'
import { formatRelativeTime } from '../../utils/dateFormatter'

const ChatWindow = ({ selectedConversation, onBack, isMobile }) => {
  const theme = useTheme()
  const { currentUser } = useAuth()
  const { 
    currentMessages, 
    loading, 
    sendMessageInConversation,
    loadMessages,
    markConversationAsRead,
    deleteMessage,
    updateMessage,
    loadUnreadCount,
    setActiveConversation,
  } = useChat()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      setActiveConversation(selectedConversation.id)
      loadMessages(selectedConversation.id, true)
      markConversationAsRead(selectedConversation.id)
      loadUnreadCount()
    }
  }, [selectedConversation])

  // Scroll to bottom when messages change (only when there are messages)
  useEffect(() => {
    if (currentMessages.length > 0) {
      scrollToBottom()
    }
  }, [currentMessages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return

    setSending(true)
    try {
      const response = await sendMessageInConversation(
        selectedConversation.id,
        message.trim(),
        replyingTo?.id || null
      )
      if (response.success) {
        setMessage('')
        setReplyingTo(null)
        await loadUnreadCount()
        setTimeout(scrollToBottom, 100)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setSnackbar({
        open: true,
        message: 'Failed to send message',
        severity: 'error'
      })
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleMenuOpen = (event, message) => {
    setAnchorEl(event.currentTarget)
    setSelectedMessage(message)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedMessage(null)
  }

  const handleEditMessage = () => {
    if (selectedMessage) {
      setEditContent(selectedMessage.content)
      setEditDialogOpen(true)
      handleMenuClose()
    }
  }

  const handleUpdateMessage = async () => {
    if (!editContent.trim() || !selectedMessage) return

    try {
      const response = await updateMessage(selectedMessage.id, editContent.trim())
      if (response.success) {
        setEditDialogOpen(false)
        setSnackbar({
          open: true,
          message: 'Message updated',
          severity: 'success'
        })
      }
    } catch (error) {
      console.error('Error updating message:', error)
      setSnackbar({
        open: true,
        message: 'Failed to update message',
        severity: 'error'
      })
    }
  }

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return

    try {
      const response = await deleteMessage(selectedMessage.id)
      if (response.success) {
        handleMenuClose()
        setSnackbar({
          open: true,
          message: 'Message deleted',
          severity: 'success'
        })
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      setSnackbar({
        open: true,
        message: 'Failed to delete message',
        severity: 'error'
      })
    }
  }

  const handleReplyToMessage = (message) => {
    setReplyingTo(message)
    handleMenuClose()
  }

  // If no conversation is selected, show placeholder
  if (!selectedConversation) {
    return (
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: { xs: 0, md: 3 },
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: theme.palette.background.paper,
          gap: 2,
          p: 4,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h2" sx={{ fontSize: 40 }}>
            💬
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Your Messages
        </Typography>
        <Typography variant="body2" align="center" sx={{ maxWidth: 300, color: theme.palette.text.secondary }}>
          Select a conversation to start messaging
        </Typography>
      </Paper>
    )
  }

  const otherUser = selectedConversation.user1?.id === currentUser?.id
    ? selectedConversation.user2
    : selectedConversation.user1

  const isOwnMessage = (senderId) => senderId === currentUser?.id

  // Sort messages by date (oldest first, newest last) for proper chat display
  const sortedMessages = [...currentMessages].sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt)
  })

  return (
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
      {/* Chat Header - ONLINE/OFFLINE TEXT REMOVED */}
      <Box
        sx={{
          p: { xs: 1, sm: 1.5 },
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          {isMobile && (
            <IconButton onClick={onBack} size="small">
              <ArrowBack />
            </IconButton>
          )}
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            color="success"
            invisible={!selectedConversation?.isOnline}
          >
            <Avatar
              src={otherUser?.profilePic || otherUser?.profileImageUrl}
              sx={{ width: { xs: 40, sm: 44 }, height: { xs: 40, sm: 44 } }}
            />
          </Badge>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              {otherUser?.username}
            </Typography>
            {/* ONLINE/OFFLINE TEXT REMOVED - Only the green dot badge remains */}
          </Box>
        </Box>
        {/* Archive icon removed */}
      </Box>

      {/* Reply indicator */}
      {replyingTo && (
        <Box
          sx={{
            p: 1,
            px: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="caption" color="text.secondary">
              Replying to {replyingTo.sender?.username || 'user'}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {replyingTo.content}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setReplyingTo(null)}>
            <Close />
          </IconButton>
        </Box>
      )}

      {/* Messages */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          p: { xs: 1.5, sm: 2 },
          bgcolor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.default, 0.3)
            : alpha(theme.palette.background.default, 0.5),
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {sortedMessages.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  gap: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No messages yet
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Send a message to start the conversation
                </Typography>
              </Box>
            ) : (
              sortedMessages.map((msg, index) => {
                const isOwn = isOwnMessage(msg.sender?.id || msg.senderId)
                const showAvatar = !isOwn && (index === 0 || sortedMessages[index - 1]?.sender?.id !== msg.sender?.id)

                return (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isOwn ? 'flex-end' : 'flex-start',
                      maxWidth: { xs: '85%', sm: '75%' },
                      alignSelf: isOwn ? 'flex-end' : 'flex-start',
                      animation: 'fadeIn 0.3s ease-out',
                    }}
                  >
                    {/* Reply indicator */}
                    {msg.replyTo && (
                      <Box
                        sx={{
                          maxWidth: '90%',
                          p: 1,
                          px: 1.5,
                          mb: 0.5,
                          bgcolor: alpha(theme.palette.common.white, 0.05),
                          borderRadius: 1,
                          borderLeft: `3px solid ${theme.palette.primary.main}`,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Reply to {msg.replyTo.sender?.username || 'user'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                          {msg.replyTo.content}
                        </Typography>
                      </Box>
                    )}

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 1,
                        flexDirection: isOwn ? 'row-reverse' : 'row',
                        maxWidth: '100%',
                      }}
                    >
                      {!isOwn && (
                        <Avatar
                          src={otherUser?.profilePic || otherUser?.profileImageUrl}
                          sx={{
                            width: 28,
                            height: 28,
                            opacity: showAvatar ? 1 : 0,
                            transition: 'opacity 0.2s ease',
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          maxWidth: '100%',
                          px: { xs: 1.5, sm: 2 },
                          py: { xs: 1, sm: 1.5 },
                          borderRadius: isOwn
                            ? '18px 18px 4px 18px'
                            : '18px 18px 18px 4px',
                          bgcolor: isOwn
                            ? theme.palette.primary.main
                            : theme.palette.mode === 'dark'
                              ? alpha(theme.palette.common.white, 0.12)
                              : alpha(theme.palette.common.white, 0.9),
                          color: isOwn
                            ? 'white'
                            : theme.palette.text.primary,
                          boxShadow: isOwn
                            ? '0 1px 2px rgba(0,0,0,0.1)'
                            : '0 1px 2px rgba(0,0,0,0.05)',
                          wordBreak: 'break-word',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, whiteSpace: 'pre-wrap' }}>
                          {msg.content}
                        </Typography>
                        {msg.isEdited && (
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.6 }}>
                            (edited)
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: { xs: '0.6rem', sm: '0.65rem' },
                          mx: isOwn ? 0 : 4,
                          opacity: 0.7,
                        }}
                      >
                        {formatRelativeTime(msg.createdAt)}
                        {isOwn && (
                          <span style={{ marginLeft: 4 }}>
                            {msg.isRead ? '✓✓' : '✓'}
                          </span>
                        )}
                      </Typography>
                      {isOwn && !msg.isDeleted && (
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, msg)}
                          sx={{ p: 0.2 }}
                        >
                          <MoreVert sx={{ fontSize: 14 }} />
                        </IconButton>
                      )}
                      {!isOwn && (
                        <IconButton
                          size="small"
                          onClick={() => handleReplyToMessage(msg)}
                          sx={{ p: 0.2 }}
                        >
                          <Reply sx={{ fontSize: 14 }} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          p: { xs: 1, sm: 1.5 },
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: theme.palette.background.paper,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: { xs: 0.5, sm: 1 } }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: alpha(theme.palette.common.white, 0.05),
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.white, 0.08),
                },
                '& textarea': {
                  padding: { xs: '8px 12px', sm: '10px 14px' },
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                },
                '& fieldset': {
                  borderColor: alpha(theme.palette.divider, 0.2),
                },
                '&:hover fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!message.trim() || sending}
            sx={{
              bgcolor: message.trim() ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3),
              color: 'white',
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              borderRadius: '50%',
              mb: { xs: 0.5, sm: 0 },
              '&:hover': {
                bgcolor: message.trim() ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.3),
              },
              '&.Mui-disabled': {
                bgcolor: alpha(theme.palette.primary.main, 0.3),
                color: 'white',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {sending ? <CircularProgress size={20} color="inherit" /> : <Send sx={{ fontSize: { xs: 18, sm: 22 } }} />}
          </IconButton>
        </Box>
      </Box>

      {/* Message Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditMessage}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleReplyToMessage(selectedMessage)}>
          <Reply fontSize="small" sx={{ mr: 1 }} /> Reply
        </MenuItem>
        <MenuItem onClick={handleDeleteMessage} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Edit Message Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Edit Message</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateMessage} 
            variant="contained"
            disabled={!editContent.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* CSS animation */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Paper>
  )
}

export default ChatWindow