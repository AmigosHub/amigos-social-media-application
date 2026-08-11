
// // src/components/posts/PostCard.jsx
// import { useState, useEffect, useRef } from 'react'
// import {
//   Card,
//   CardHeader,
//   CardMedia,
//   CardContent,
//   CardActions,
//   Avatar,
//   IconButton,
//   Typography,
//   Box,
//   TextField,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Menu,
//   MenuItem,
//   Snackbar,
//   Alert,
//   Tooltip,
//   alpha,
//   useTheme,
//   Collapse,
//   useMediaQuery,
//   CircularProgress,
//   Chip,
//   Divider,
// } from '@mui/material'
// import {
//   Favorite,
//   FavoriteBorder,
//   Comment,
//   Delete,
//   Edit,
//   MoreVert,
//   Send,
//   BookmarkBorder,
//   Bookmark,
//   Reply,
//   PlayArrow,
//   Pause,
//   VolumeUp,
//   VolumeOff,
//   Report,
//   Flag,
// } from '@mui/icons-material'
// //import { formatDistanceToNow } from 'date-fns'
// import { useAuth } from '../../context/AuthContext'
// import { usePosts } from '../../context/PostContext'
// import { useNavigate } from 'react-router-dom'
// import { savedPostAPI } from '../../api/savedPost'
// import { commentAPI } from '../../api/comment'
// import { reportAPI } from '../../api/report'
// import ReportDialog from '../common/ReportDialog'
// import CommentItem from '../comments/CommentItem'
// import { formatRelativeTime } from '../../utils/dateFormatter'

// const PostCard = ({ post, onDelete }) => {
//   const { currentUser } = useAuth()
//   const { likePost, unlikePost } = usePosts()
//   const navigate = useNavigate()
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
//   const [showComments, setShowComments] = useState(false)
//   const [commentText, setCommentText] = useState('')
//   const [replyText, setReplyText] = useState('')
//   const [replyTo, setReplyTo] = useState(null)
//   const [anchorEl, setAnchorEl] = useState(null)
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
//   const [isLiked, setIsLiked] = useState(post.likedByCurrentUser || false)
//   const [likesCount, setLikesCount] = useState(post.likesCount || 0)
//   const [isSaved, setIsSaved] = useState(post.savedByCurrentUser || false)
//   const [isAnimating, setIsAnimating] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [comments, setComments] = useState([])
//   const [commentsLoading, setCommentsLoading] = useState(false)
//   const [repliesLoading, setRepliesLoading] = useState({})
//   const [commentPage, setCommentPage] = useState(0)
//   const [hasMoreComments, setHasMoreComments] = useState(true)
//   const [checkingSaveStatus, setCheckingSaveStatus] = useState(false)
  
//   // Report states
//   const [reportDialogOpen, setReportDialogOpen] = useState(false)
//   const [reportLoading, setReportLoading] = useState(false)
//   const [reportError, setReportError] = useState(null)
  
//   // Video player states
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [isMuted, setIsMuted] = useState(true)
//   const [videoProgress, setVideoProgress] = useState(0)
//   const videoRef = useRef(null)

//   // Get user data from post
//   const userData = post.user || post
//   const userId = userData?.id || post.userId
//   const username = userData?.username || post.username
//   const userAvatar = userData?.profilePic || post.userAvatar || post.profileImageUrl
//   const isOwner = userId === currentUser?.id

//   const mediaUrl = post.mediaUrl || post.imageUrl
//   const content = post.content || post.caption
//   const mediaType = post.mediaType || 'IMAGE'

//   const isVideo = mediaType === 'VIDEO' || mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i)

//   // Load comments when toggled
//   useEffect(() => {
//     if (showComments) {
//       loadComments()
//     }
//   }, [showComments])

//   // Reset video state when post changes
//   useEffect(() => {
//     setIsPlaying(false)
//     setVideoProgress(0)
//     if (videoRef.current) {
//       videoRef.current.currentTime = 0
//     }
//   }, [post.id])

//   // Check save status on mount
//   useEffect(() => {
//     const checkSaveStatus = async () => {
//       if (checkingSaveStatus) return
//       setCheckingSaveStatus(true)
//       try {
//         const response = await savedPostAPI.getSavedPosts(0, 50)
//         if (response.success) {
//           const savedPostIds = response.data.content.map(p => p.id)
//           const isPostSaved = savedPostIds.includes(post.id)
//           setIsSaved(isPostSaved)
//         }
//       } catch (error) {
//         console.error('Error checking save status:', error)
//       } finally {
//         setCheckingSaveStatus(false)
//       }
//     }
    
//     checkSaveStatus()
//   }, [post.id])

//   const loadComments = async (reset = true) => {
//     setCommentsLoading(true)
//     try {
//       const page = reset ? 0 : commentPage
//       const response = await commentAPI.getPostComments(post.id, page, 20)
//       if (response.success) {
//         const newComments = response.data.content || []
        
//         const commentsWithReplies = await Promise.all(
//           newComments.map(async (comment) => {
//             try {
//               const repliesResponse = await commentAPI.getCommentReplies(comment.id, 0, 10)
//               return {
//                 ...comment,
//                 replies: repliesResponse.success ? repliesResponse.data.content || [] : []
//               }
//             } catch (error) {
//               console.error(`Error loading replies for comment ${comment.id}:`, error)
//               return { ...comment, replies: [] }
//             }
//           })
//         )
        
//         if (reset) {
//           setComments(commentsWithReplies)
//           setCommentPage(1)
//         } else {
//           setComments(prev => [...prev, ...commentsWithReplies])
//           setCommentPage(prev => prev + 1)
//         }
//         setHasMoreComments(!response.data.last)
//       }
//     } catch (error) {
//       console.error('Error loading comments:', error)
//     } finally {
//       setCommentsLoading(false)
//     }
//   }

//   const loadRepliesForComment = async (commentId) => {
//     setRepliesLoading(prev => ({ ...prev, [commentId]: true }))
//     try {
//       const response = await commentAPI.getCommentReplies(commentId, 0, 10)
//       if (response.success) {
//         setComments(prev => prev.map(comment => 
//           comment.id === commentId 
//             ? { ...comment, replies: response.data.content || [] }
//             : comment
//         ))
//       }
//     } catch (error) {
//       console.error(`Error loading replies for comment ${commentId}:`, error)
//     } finally {
//       setRepliesLoading(prev => ({ ...prev, [commentId]: false }))
//     }
//   }

//   const handleLoadMoreComments = () => {
//     if (!commentsLoading && hasMoreComments) {
//       loadComments(false)
//     }
//   }

//   const handleAddComment = async () => {
//     if (!commentText.trim() || loading) return
//     setLoading(true)
//     try {
//       const response = await commentAPI.createComment(post.id, commentText.trim())
//       if (response.success) {
//         await loadComments(true)
//         setCommentText('')
//         setSnackbar({
//           open: true,
//           message: 'Comment added!',
//           severity: 'success'
//         })
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || 'Failed to add comment',
//         severity: 'error'
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAddReply = async (commentId) => {
//     if (!replyText.trim() || loading) return
//     setLoading(true)
//     try {
//       const response = await commentAPI.addReply(commentId, replyText.trim())
//       if (response.success) {
//         await loadRepliesForComment(commentId)
//         setReplyText('')
//         setReplyTo(null)
//         setSnackbar({
//           open: true,
//           message: 'Reply added!',
//           severity: 'success'
//         })
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || 'Failed to add reply',
//         severity: 'error'
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   // const handleDeleteComment = async (commentId) => {
//   //   try {
//   //     const response = await commentAPI.deleteComment(post.id, commentId)
//   //     if (response.success) {
//   //       await loadComments(true)
//   //       setSnackbar({
//   //         open: true,
//   //         message: 'Comment deleted!',
//   //         severity: 'success'
//   //       })
//   //     }
//   //   } catch (error) {
//   //     setSnackbar({
//   //       open: true,
//   //       message: error.message || 'Failed to delete comment',
//   //       severity: 'error'
//   //     })
//   //   }
//   // }

//   // src/components/posts/PostCard.jsx - Replace from line ~140 to ~160

// const handleDeleteComment = async (commentId) => {
//   try {
//     // Delete comment using just the commentId
//     const response = await commentAPI.deleteComment(commentId)
//     if (response.success) {
//       // Remove the comment from the local state
//       setComments(prev => prev.filter(c => c.id !== commentId))
//       setSnackbar({
//         open: true,
//         message: 'Comment deleted successfully!',
//         severity: 'success'
//       })
//     } else {
//       throw new Error(response.message || 'Failed to delete comment')
//     }
//   } catch (error) {
//     console.error('Error deleting comment:', error)
//     setSnackbar({
//       open: true,
//       message: error.message || 'Failed to delete comment. Please try again.',
//       severity: 'error'
//     })
//   }
// }

  
//   // Video controls
//   const togglePlay = (e) => {
//     e.stopPropagation()
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause()
//       } else {
//         videoRef.current.play()
//       }
//       setIsPlaying(!isPlaying)
//     }
//   }

//   const toggleMute = (e) => {
//     e.stopPropagation()
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted
//       setIsMuted(!isMuted)
//     }
//   }

//   const handleVideoProgress = () => {
//     if (videoRef.current) {
//       const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
//       setVideoProgress(progress)
//     }
//   }

//   const handleVideoEnded = () => {
//     setIsPlaying(false)
//     setVideoProgress(0)
//     if (videoRef.current) {
//       videoRef.current.currentTime = 0
//     }
//   }

//   const handleLike = async () => {
//     if (isAnimating || loading) return
//     setIsAnimating(true)
//     setLoading(true)
    
//     try {
//       if (!isLiked) {
//         await likePost(post.id)
//         setIsLiked(true)
//         setLikesCount(prev => prev + 1)
//       } else {
//         await unlikePost(post.id)
//         setIsLiked(false)
//         setLikesCount(prev => prev - 1)
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || 'Failed to update like',
//         severity: 'error'
//       })
//     } finally {
//       setLoading(false)
//       setTimeout(() => setIsAnimating(false), 300)
//     }
//   }

//   const handleSavePost = async () => {
//     if (loading || checkingSaveStatus) return
//     setLoading(true)
//     try {
//       if (!isSaved) {
//         const response = await savedPostAPI.savePost(post.id)
//         if (response.success) {
//           setIsSaved(true)
//           setSnackbar({
//             open: true,
//             message: 'Post saved!',
//             severity: 'success'
//           })
//         } else {
//           throw new Error(response.message || 'Failed to save post')
//         }
//       } else {
//         const response = await savedPostAPI.unsavePost(post.id)
//         if (response.success) {
//           setIsSaved(false)
//           setSnackbar({
//             open: true,
//             message: 'Post unsaved',
//             severity: 'info'
//           })
//         } else {
//           throw new Error(response.message || 'Failed to unsave post')
//         }
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || 'Failed to update save status',
//         severity: 'error'
//       })
//       setIsSaved(!isSaved)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Report handlers
//   const handleReportPost = async (reportData) => {
//     setReportLoading(true)
//     setReportError(null)
//     try {
//       const response = await reportAPI.reportPost(post.id, {
//         userId: currentUser?.id,
//         postId: post.id,
//         reason: reportData.reason,
//         description: reportData.description || '',
//       })
//       if (response.success) {
//         setSnackbar({
//           open: true,
//           message: 'Post reported successfully. Our team will review it.',
//           severity: 'success'
//         })
//         setReportDialogOpen(false)
//       } else {
//         throw new Error(response.message || 'Failed to report post')
//       }
//     } catch (error) {
//       setReportError(error.message || 'Failed to report post')
//     } finally {
//       setReportLoading(false)
//     }
//   }

//   const handleOpenReport = () => {
//     handleMenuClose()
//     setReportError(null)
//     setReportDialogOpen(true)
//   }

//   const handleEdit = () => {
//     navigate(`/edit-post/${post.id}`)
//     handleMenuClose()
//   }

//   const handleDelete = async () => {
//     await onDelete(post.id)
//     setDeleteDialogOpen(false)
//     setSnackbar({
//       open: true,
//       message: 'Post deleted successfully!',
//       severity: 'success'
//     })
//   }

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleMenuClose = () => {
//     setAnchorEl(null)
//   }

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false })
//   }

//   return (
//     <>
//       <Card
//         elevation={0}
//         sx={{
//           mb: { xs: 2, sm: 3 },
//           borderRadius: { xs: 2, sm: 3, md: 4 },
//           overflow: 'hidden',
//           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//           border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//           '&:hover': {
//             transform: isMobile ? 'none' : 'translateY(-4px)',
//             boxShadow: isMobile ? 'none' : theme.shadows[8],
//           },
//         }}
//       >
//         {/* Card Header */}
//         <CardHeader
//           avatar={
//             <Avatar
//               src={userAvatar}
//               onClick={() => navigate(`/profile/${userId}`)}
//               sx={{
//                 cursor: 'pointer',
//                 width: { xs: 40, sm: 48 },
//                 height: { xs: 40, sm: 48 },
//                 border: `2px solid ${theme.palette.primary.main}`,
//                 transition: 'transform 0.2s ease',
//                 '&:hover': {
//                   transform: isMobile ? 'none' : 'scale(1.05)',
//                 },
//               }}
//             />
//           }
//           action={
//             <>
//               <Tooltip title="More options" arrow>
//                 <IconButton onClick={handleMenuOpen}>
//                   <MoreVert />
//                 </IconButton>
//               </Tooltip>
//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//               >
//                 {isOwner ? (
//                   <>
//                     <MenuItem onClick={handleEdit}>
//                       <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Post
//                     </MenuItem>
//                     <MenuItem onClick={() => setDeleteDialogOpen(true)} sx={{ color: 'error.main' }}>
//                       <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Post
//                     </MenuItem>
//                   </>
//                 ) : (
//                   <>
//                     <MenuItem onClick={handleOpenReport}>
//                       <Report fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} /> 
//                       Report Post
//                     </MenuItem>
//                     <Divider />
//                     <MenuItem onClick={() => navigate(`/profile/${userId}`)}>
//                       <Flag fontSize="small" sx={{ mr: 1 }} /> 
//                       View Profile
//                     </MenuItem>
//                   </>
//                 )}
//               </Menu>
//             </>
//           }
//           title={
//             <Typography
//               variant="subtitle1"
//               sx={{
//                 fontWeight: 700,
//                 fontSize: { xs: '0.9rem', sm: '1rem' },
//                 cursor: 'pointer',
//                 '&:hover': { color: theme.palette.primary.main },
//               }}
//               onClick={() => navigate(`/profile/${userId}`)}
//             >
//               {username}
//             </Typography>
//           }
//           subheader={
//             // <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
//             //   {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
//             // </Typography>
//             <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
//                 {formatRelativeTime(post.createdAt)}
//           </Typography>
//           }
//           sx={{ pb: 1, px: { xs: 1.5, sm: 2 } }}
//         />

//         {/* Post Media - Image or Video */}
//         {mediaUrl && (
//           <Box sx={{ position: 'relative', bgcolor: 'black' }}>
//             {isVideo ? (
//               // Video Player
//               <Box sx={{ position: 'relative' }}>
//                 <video
//                   ref={videoRef}
//                   src={mediaUrl}
//                   style={{
//                     width: '100%',
//                     maxHeight: isMobile ? 300 : 450,
//                     objectFit: 'contain',
//                     display: 'block',
//                     cursor: 'pointer',
//                   }}
//                   onClick={togglePlay}
//                   onTimeUpdate={handleVideoProgress}
//                   onEnded={handleVideoEnded}
//                   muted={isMuted}
//                   playsInline
//                 />
                
//                 {/* Video Controls Overlay */}
//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     bottom: 0,
//                     left: 0,
//                     right: 0,
//                     p: 1,
//                     background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 1,
//                   }}
//                 >
//                   <IconButton
//                     size="small"
//                     onClick={togglePlay}
//                     sx={{ color: 'white' }}
//                   >
//                     {isPlaying ? <Pause /> : <PlayArrow />}
//                   </IconButton>
                  
//                   {/* Progress Bar */}
//                   <Box
//                     sx={{
//                       flex: 1,
//                       height: 4,
//                       bgcolor: 'rgba(255,255,255,0.3)',
//                       borderRadius: 2,
//                       cursor: 'pointer',
//                       position: 'relative',
//                     }}
//                     onClick={(e) => {
//                       if (videoRef.current) {
//                         const rect = e.currentTarget.getBoundingClientRect()
//                         const x = (e.clientX - rect.left) / rect.width
//                         videoRef.current.currentTime = x * videoRef.current.duration
//                       }
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         width: `${videoProgress}%`,
//                         height: '100%',
//                         bgcolor: 'white',
//                         borderRadius: 2,
//                         transition: 'width 0.1s linear',
//                       }}
//                     />
//                   </Box>
                  
//                   <IconButton
//                     size="small"
//                     onClick={toggleMute}
//                     sx={{ color: 'white' }}
//                   >
//                     {isMuted ? <VolumeOff /> : <VolumeUp />}
//                   </IconButton>
//                 </Box>
//               </Box>
//             ) : (
//               // Image Display
//               <CardMedia
//                 component="img"
//                 height={isMobile ? 300 : 450}
//                 image={mediaUrl}
//                 alt={content}
//                 sx={{
//                   objectFit: 'cover',
//                   cursor: 'pointer',
//                   transition: 'transform 0.3s ease',
//                   '&:hover': {
//                     transform: isMobile ? 'none' : 'scale(1.02)',
//                   },
//                 }}
//                 onClick={() => window.open(mediaUrl, '_blank')}
//               />
//             )}
            
//             {/* Media Type Badge */}
//             {isVideo && (
//               <Chip
//                 label="Video"
//                 size="small"
//                 sx={{
//                   position: 'absolute',
//                   top: 8,
//                   right: 8,
//                   bgcolor: 'rgba(0,0,0,0.7)',
//                   color: 'white',
//                   borderRadius: 1,
//                   '& .MuiChip-label': { fontSize: '0.7rem' },
//                 }}
//               />
//             )}
//           </Box>
//         )}

//         {/* Card Actions */}
//         <CardActions disableSpacing sx={{ pt: 1, px: { xs: 1.5, sm: 2 } }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flex: 1 }}>
//             {/* FIX: Wrap IconButton in span for Tooltip when disabled */}
//             <Tooltip title={isLiked ? 'Unlike' : 'Like'} arrow>
//               <span>
//                 <IconButton
//                   onClick={handleLike}
//                   size={isMobile ? 'small' : 'medium'}
//                   disabled={loading}
//                   sx={{
//                     transition: 'all 0.2s ease',
//                     transform: isAnimating ? 'scale(1.3)' : 'scale(1)',
//                     color: isLiked ? '#ef4444' : 'inherit',
//                   }}
//                 >
//                   {isLiked ? <Favorite /> : <FavoriteBorder />}
//                 </IconButton>
//               </span>
//             </Tooltip>
//             <Tooltip title="Comment" arrow>
//               <span>
//                 <IconButton onClick={() => setShowComments(!showComments)} size={isMobile ? 'small' : 'medium'}>
//                   <Comment />
//                 </IconButton>
//               </span>
//             </Tooltip>
//           </Box>
//           <Tooltip title={isSaved ? 'Unsave' : 'Save'} arrow>
//             <span>
//               <IconButton 
//                 onClick={handleSavePost} 
//                 size={isMobile ? 'small' : 'medium'} 
//                 disabled={loading || checkingSaveStatus}
//               >
//                 {loading || checkingSaveStatus ? (
//                   <CircularProgress size={20} />
//                 ) : isSaved ? (
//                   <Bookmark sx={{ color: theme.palette.primary.main }} />
//                 ) : (
//                   <BookmarkBorder />
//                 )}
//               </IconButton>
//             </span>
//           </Tooltip>
//         </CardActions>

//         {/* Likes Count */}
//         <Box sx={{ px: { xs: 1.5, sm: 2 }, pt: 0.5 }}>
//           <Typography
//             variant="body2"
//             sx={{
//               fontWeight: 600,
//               fontSize: { xs: '0.8rem', sm: '0.875rem' },
//               cursor: 'pointer',
//               '&:hover': { textDecoration: 'underline' },
//             }}
//           >
//             {likesCount.toLocaleString()} likes
//           </Typography>
//         </Box>

//         {/* Content */}
//         <CardContent sx={{ pt: 1, pb: 0, px: { xs: 1.5, sm: 2 } }}>
//           <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
//             <strong
//               style={{ cursor: 'pointer' }}
//               onClick={() => navigate(`/profile/${userId}`)}
//             >
//               {username}
//             </strong>{' '}
//             {content}
//           </Typography>
//         </CardContent>

//         {/* Comments Section */}
//         <Collapse in={showComments}>
//           <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: 2 }}>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ cursor: 'pointer', mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
//               onClick={() => setShowComments(false)}
//             >
//               Hide comments ({post.commentsCount || 0})
//             </Typography>

//             {commentsLoading && comments.length === 0 ? (
//               <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
//                 <CircularProgress size={24} />
//               </Box>
//             ) : comments.length === 0 ? (
//               <Typography variant="body2" color="text.secondary" sx={{ py: 1, textAlign: 'center' }}>
//                 No comments yet
//               </Typography>
//             ) : (
//               comments.map((comment) => (
//                 <CommentItem
//                   key={comment.id}
//                   comment={comment}
//                   onDelete={handleDeleteComment}
//                   isOwner={isOwner}
//                 />
//               ))
//             )}

//             {hasMoreComments && comments.length > 0 && (
//               <Button
//                 size="small"
//                 onClick={handleLoadMoreComments}
//                 disabled={commentsLoading}
//                 sx={{ mt: 1 }}
//               >
//                 {commentsLoading ? <CircularProgress size={16} /> : 'Load more comments'}
//               </Button>
//             )}
//           </Box>
//         </Collapse>

//         {/* Add Comment */}
//         <Box sx={{ p: { xs: 1.5, sm: 2 }, pt: 0, display: 'flex', gap: 1, alignItems: 'flex-start' }}>
//           <Avatar
//             src={currentUser?.profilePic}
//             sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}
//           />
//           <TextField
//             size="small"
//             fullWidth
//             placeholder="Add a comment..."
//             value={commentText}
//             onChange={(e) => setCommentText(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
//             disabled={loading}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 3,
//                 bgcolor: alpha(theme.palette.common.white, 0.05),
//                 fontSize: { xs: '0.8rem', sm: '0.875rem' },
//               },
//             }}
//           />
//           <Button
//             variant="contained"
//             size="small"
//             onClick={handleAddComment}
//             disabled={!commentText.trim() || loading}
//             sx={{
//               borderRadius: 3,
//               minWidth: 'auto',
//               px: { xs: 1.5, sm: 2 },
//               '&:hover': {
//                 transform: isMobile ? 'none' : 'scale(1.05)',
//               },
//             }}
//           >
//             {loading ? <CircularProgress size={20} /> : <Send sx={{ fontSize: { xs: 16, sm: 18 } }} />}
//           </Button>
//         </Box>
//       </Card>

//       {/* Delete Post Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         PaperProps={{
//           sx: { borderRadius: 3, m: { xs: 2, sm: 0 } }
//         }}
//       >
//         <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Delete Post</DialogTitle>
//         <DialogContent>
//           <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
//             Are you sure you want to delete this post? This action cannot be undone.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Report Dialog */}
//       <ReportDialog
//         open={reportDialogOpen}
//         onClose={() => setReportDialogOpen(false)}
//         onSubmit={handleReportPost}
//         reportType="post"
//         targetName={`post by ${username}`}
//         loading={reportLoading}
//         error={reportError}
//       />

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </>
//   )
// }

// export default PostCard

// src/components/posts/PostCard.jsx
import { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Tooltip,
  alpha,
  useTheme,
  Collapse,
  useMediaQuery,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material'
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Delete,
  Edit,
  MoreVert,
  Send,
  BookmarkBorder,
  Bookmark,
  Reply,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Report,
  Flag,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { usePosts } from '../../context/PostContext'
import { useNavigate } from 'react-router-dom'
import { savedPostAPI } from '../../api/savedPost'
import { commentAPI } from '../../api/comment'
import { reportAPI } from '../../api/report'
import ReportDialog from '../common/ReportDialog'
import CommentItem from '../comments/CommentItem'
import { formatRelativeTime } from '../../utils/dateFormatter'
import { likeAPI } from '../../api/like'

const PostCard = ({ post, onDelete }) => {
  const { currentUser } = useAuth()
  const { likePost, unlikePost } = usePosts()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [replyText, setReplyText] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [isLiked, setIsLiked] = useState(post.likedByCurrentUser || false)
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)
  const [isSaved, setIsSaved] = useState(post.savedByCurrentUser || false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [repliesLoading, setRepliesLoading] = useState({})
  const [commentPage, setCommentPage] = useState(0)
  const [hasMoreComments, setHasMoreComments] = useState(true)
  const [checkingSaveStatus, setCheckingSaveStatus] = useState(false)
  
  // Report states
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [reportError, setReportError] = useState(null)
  
  // Video player states
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [videoProgress, setVideoProgress] = useState(0)
  const videoRef = useRef(null)

  // Get user data from post
  const userData = post.user || post
  const userId = userData?.id || post.userId
  const username = userData?.username || post.username
  const userAvatar = userData?.profilePic || post.userAvatar || post.profileImageUrl
  const isOwner = userId === currentUser?.id

  const mediaUrl = post.mediaUrl || post.imageUrl
  const content = post.content || post.caption
  const mediaType = post.mediaType || 'IMAGE'

  const isVideo = mediaType === 'VIDEO' || mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i)

  // Load comments when toggled
  useEffect(() => {
    if (showComments) {
      loadComments()
    }
  }, [showComments])

  // Reset video state when post changes
  useEffect(() => {
    setIsPlaying(false)
    setVideoProgress(0)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }, [post.id])

  // ========== FIX: Update like count when post prop changes ==========
  useEffect(() => {
    setIsLiked(post.likedByCurrentUser || false)
    setLikesCount(post.likesCount || 0)
  }, [post.likedByCurrentUser, post.likesCount])
  // ========== END OF FIX ==========

  // Check save status on mount
  useEffect(() => {
    const checkSaveStatus = async () => {
      if (checkingSaveStatus) return
      setCheckingSaveStatus(true)
      try {
        const response = await savedPostAPI.getSavedPosts(0, 50)
        if (response.success) {
          const savedPostIds = response.data.content.map(p => p.id)
          const isPostSaved = savedPostIds.includes(post.id)
          setIsSaved(isPostSaved)
        }
      } catch (error) {
        console.error('Error checking save status:', error)
      } finally {
        setCheckingSaveStatus(false)
      }
    }
    
    checkSaveStatus()
  }, [post.id])

  const loadComments = async (reset = true) => {
    setCommentsLoading(true)
    try {
      const page = reset ? 0 : commentPage
      const response = await commentAPI.getPostComments(post.id, page, 20)
      if (response.success) {
        const newComments = response.data.content || []
        
        const commentsWithReplies = await Promise.all(
          newComments.map(async (comment) => {
            try {
              const repliesResponse = await commentAPI.getCommentReplies(comment.id, 0, 10)
              return {
                ...comment,
                replies: repliesResponse.success ? repliesResponse.data.content || [] : []
              }
            } catch (error) {
              console.error(`Error loading replies for comment ${comment.id}:`, error)
              return { ...comment, replies: [] }
            }
          })
        )
        
        if (reset) {
          setComments(commentsWithReplies)
          setCommentPage(1)
        } else {
          setComments(prev => [...prev, ...commentsWithReplies])
          setCommentPage(prev => prev + 1)
        }
        setHasMoreComments(!response.data.last)
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setCommentsLoading(false)
    }
  }

  const loadRepliesForComment = async (commentId) => {
    setRepliesLoading(prev => ({ ...prev, [commentId]: true }))
    try {
      const response = await commentAPI.getCommentReplies(commentId, 0, 10)
      if (response.success) {
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, replies: response.data.content || [] }
            : comment
        ))
      }
    } catch (error) {
      console.error(`Error loading replies for comment ${commentId}:`, error)
    } finally {
      setRepliesLoading(prev => ({ ...prev, [commentId]: false }))
    }
  }

  const handleLoadMoreComments = () => {
    if (!commentsLoading && hasMoreComments) {
      loadComments(false)
    }
  }

  const handleAddComment = async () => {
    if (!commentText.trim() || loading) return
    setLoading(true)
    try {
      const response = await commentAPI.createComment(post.id, commentText.trim())
      if (response.success) {
        await loadComments(true)
        setCommentText('')
        setSnackbar({
          open: true,
          message: 'Comment added!',
          severity: 'success'
        })
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add comment',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddReply = async (commentId) => {
    if (!replyText.trim() || loading) return
    setLoading(true)
    try {
      const response = await commentAPI.addReply(commentId, replyText.trim())
      if (response.success) {
        await loadRepliesForComment(commentId)
        setReplyText('')
        setReplyTo(null)
        setSnackbar({
          open: true,
          message: 'Reply added!',
          severity: 'success'
        })
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add reply',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      // Delete comment using just the commentId
      const response = await commentAPI.deleteComment(commentId)
      if (response.success) {
        // Remove the comment from the local state
        setComments(prev => prev.filter(c => c.id !== commentId))
        setSnackbar({
          open: true,
          message: 'Comment deleted successfully!',
          severity: 'success'
        })
      } else {
        throw new Error(response.message || 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete comment. Please try again.',
        severity: 'error'
      })
    }
  }

  // Video controls
  const togglePlay = (e) => {
    e.stopPropagation()
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVideoProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setVideoProgress(progress)
    }
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
    setVideoProgress(0)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  // ========== FIXED: Like handler with proper state update ==========
  const handleLike = async () => {
    if (isAnimating || loading) return
    setIsAnimating(true)
    setLoading(true)
    
    try {
      if (!isLiked) {
        // Like the post
        const response = await likePost(post.id)
        if (response.success) {
          setIsLiked(true)
          // Update likes count from response or fetch fresh count
          const countResponse = await likeAPI.getLikeCount(post.id)
          if (countResponse.success) {
            setLikesCount(countResponse.data)
          } else {
            setLikesCount(prev => prev + 1)
          }
        }
      } else {
        // Unlike the post
        const response = await unlikePost(post.id)
        if (response.success) {
          setIsLiked(false)
          // Update likes count from response or fetch fresh count
          const countResponse = await likeAPI.getLikeCount(post.id)
          if (countResponse.success) {
            setLikesCount(countResponse.data)
          } else {
            setLikesCount(prev => Math.max(prev - 1, 0))
          }
        }
      }
    } catch (error) {
      console.error('Error updating like:', error)
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update like',
        severity: 'error'
      })
      // Revert optimistic update on error
      const countResponse = await likeAPI.getLikeCount(post.id)
      if (countResponse.success) {
        setLikesCount(countResponse.data)
      }
    } finally {
      setLoading(false)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }
  // ========== END OF FIX ==========

  const handleSavePost = async () => {
    if (loading || checkingSaveStatus) return
    setLoading(true)
    try {
      if (!isSaved) {
        const response = await savedPostAPI.savePost(post.id)
        if (response.success) {
          setIsSaved(true)
          setSnackbar({
            open: true,
            message: 'Post saved!',
            severity: 'success'
          })
        } else {
          throw new Error(response.message || 'Failed to save post')
        }
      } else {
        const response = await savedPostAPI.unsavePost(post.id)
        if (response.success) {
          setIsSaved(false)
          setSnackbar({
            open: true,
            message: 'Post unsaved',
            severity: 'info'
          })
        } else {
          throw new Error(response.message || 'Failed to unsave post')
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update save status',
        severity: 'error'
      })
      setIsSaved(!isSaved)
    } finally {
      setLoading(false)
    }
  }

  // Report handlers
  const handleReportPost = async (reportData) => {
    setReportLoading(true)
    setReportError(null)
    try {
      const response = await reportAPI.reportPost(post.id, {
        userId: currentUser?.id,
        postId: post.id,
        reason: reportData.reason,
        description: reportData.description || '',
      })
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Post reported successfully. Our team will review it.',
          severity: 'success'
        })
        setReportDialogOpen(false)
      } else {
        throw new Error(response.message || 'Failed to report post')
      }
    } catch (error) {
      setReportError(error.message || 'Failed to report post')
    } finally {
      setReportLoading(false)
    }
  }

  const handleOpenReport = () => {
    handleMenuClose()
    setReportError(null)
    setReportDialogOpen(true)
  }

  const handleEdit = () => {
    navigate(`/edit-post/${post.id}`)
    handleMenuClose()
  }

  const handleDelete = async () => {
    await onDelete(post.id)
    setDeleteDialogOpen(false)
    setSnackbar({
      open: true,
      message: 'Post deleted successfully!',
      severity: 'success'
    })
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <>
      <Card
        elevation={0}
        sx={{
          mb: { xs: 2, sm: 3 },
          borderRadius: { xs: 2, sm: 3, md: 4 },
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          '&:hover': {
            transform: isMobile ? 'none' : 'translateY(-4px)',
            boxShadow: isMobile ? 'none' : theme.shadows[8],
          },
        }}
      >
        {/* Card Header */}
        <CardHeader
          avatar={
            <Avatar
              src={userAvatar}
              onClick={() => navigate(`/profile/${userId}`)}
              sx={{
                cursor: 'pointer',
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                border: `2px solid ${theme.palette.primary.main}`,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: isMobile ? 'none' : 'scale(1.05)',
                },
              }}
            />
          }
          action={
            <>
              <Tooltip title="More options" arrow>
                <IconButton onClick={handleMenuOpen}>
                  <MoreVert />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {isOwner ? (
                  <>
                    <MenuItem onClick={handleEdit}>
                      <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Post
                    </MenuItem>
                    <MenuItem onClick={() => setDeleteDialogOpen(true)} sx={{ color: 'error.main' }}>
                      <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Post
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={handleOpenReport}>
                      <Report fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} /> 
                      Report Post
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => navigate(`/profile/${userId}`)}>
                      <Flag fontSize="small" sx={{ mr: 1 }} /> 
                      View Profile
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          }
          title={
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                cursor: 'pointer',
                '&:hover': { color: theme.palette.primary.main },
              }}
              onClick={() => navigate(`/profile/${userId}`)}
            >
              {username}
            </Typography>
          }
          subheader={
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {formatRelativeTime(post.createdAt)}
          </Typography>
          }
          sx={{ pb: 1, px: { xs: 1.5, sm: 2 } }}
        />

        {/* Post Media - Image or Video */}
        {mediaUrl && (
          <Box sx={{ position: 'relative', bgcolor: 'black' }}>
            {isVideo ? (
              // Video Player
              <Box sx={{ position: 'relative' }}>
                <video
                  ref={videoRef}
                  src={mediaUrl}
                  style={{
                    width: '100%',
                    maxHeight: isMobile ? 300 : 450,
                    objectFit: 'contain',
                    display: 'block',
                    cursor: 'pointer',
                  }}
                  onClick={togglePlay}
                  onTimeUpdate={handleVideoProgress}
                  onEnded={handleVideoEnded}
                  muted={isMuted}
                  playsInline
                />
                
                {/* Video Controls Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 1,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={togglePlay}
                    sx={{ color: 'white' }}
                  >
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  
                  {/* Progress Bar */}
                  <Box
                    sx={{
                      flex: 1,
                      height: 4,
                      bgcolor: 'rgba(255,255,255,0.3)',
                      borderRadius: 2,
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={(e) => {
                      if (videoRef.current) {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = (e.clientX - rect.left) / rect.width
                        videoRef.current.currentTime = x * videoRef.current.duration
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: `${videoProgress}%`,
                        height: '100%',
                        bgcolor: 'white',
                        borderRadius: 2,
                        transition: 'width 0.1s linear',
                      }}
                    />
                  </Box>
                  
                  <IconButton
                    size="small"
                    onClick={toggleMute}
                    sx={{ color: 'white' }}
                  >
                    {isMuted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                </Box>
              </Box>
            ) : (
              // Image Display
              <CardMedia
                component="img"
                height={isMobile ? 300 : 450}
                image={mediaUrl}
                alt={content}
                sx={{
                  objectFit: 'cover',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: isMobile ? 'none' : 'scale(1.02)',
                  },
                }}
                onClick={() => window.open(mediaUrl, '_blank')}
              />
            )}
            
            {/* Media Type Badge */}
            {isVideo && (
              <Chip
                label="Video"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  borderRadius: 1,
                  '& .MuiChip-label': { fontSize: '0.7rem' },
                }}
              />
            )}
          </Box>
        )}

        {/* Card Actions */}
        <CardActions disableSpacing sx={{ pt: 1, px: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flex: 1 }}>
            <Tooltip title={isLiked ? 'Unlike' : 'Like'} arrow>
              <span>
                <IconButton
                  onClick={handleLike}
                  size={isMobile ? 'small' : 'medium'}
                  disabled={loading}
                  sx={{
                    transition: 'all 0.2s ease',
                    transform: isAnimating ? 'scale(1.3)' : 'scale(1)',
                    color: isLiked ? '#ef4444' : 'inherit',
                  }}
                >
                  {isLiked ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Comment" arrow>
              <span>
                <IconButton onClick={() => setShowComments(!showComments)} size={isMobile ? 'small' : 'medium'}>
                  <Comment />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Tooltip title={isSaved ? 'Unsave' : 'Save'} arrow>
            <span>
              <IconButton 
                onClick={handleSavePost} 
                size={isMobile ? 'small' : 'medium'} 
                disabled={loading || checkingSaveStatus}
              >
                {loading || checkingSaveStatus ? (
                  <CircularProgress size={20} />
                ) : isSaved ? (
                  <Bookmark sx={{ color: theme.palette.primary.main }} />
                ) : (
                  <BookmarkBorder />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </CardActions>

        {/* Likes Count */}
        <Box sx={{ px: { xs: 1.5, sm: 2 }, pt: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {likesCount.toLocaleString()} likes
          </Typography>
        </Box>

        {/* Content */}
        <CardContent sx={{ pt: 1, pb: 0, px: { xs: 1.5, sm: 2 } }}>
          <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/profile/${userId}`)}
            >
              {username}
            </strong>{' '}
            {content}
          </Typography>
        </CardContent>

        {/* Comments Section */}
        <Collapse in={showComments}>
          <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ cursor: 'pointer', mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              onClick={() => setShowComments(false)}
            >
              Hide comments ({post.commentsCount || 0})
            </Typography>

            {commentsLoading && comments.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : comments.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 1, textAlign: 'center' }}>
                No comments yet
              </Typography>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                  isOwner={isOwner}
                />
              ))
            )}

            {hasMoreComments && comments.length > 0 && (
              <Button
                size="small"
                onClick={handleLoadMoreComments}
                disabled={commentsLoading}
                sx={{ mt: 1 }}
              >
                {commentsLoading ? <CircularProgress size={16} /> : 'Load more comments'}
              </Button>
            )}
          </Box>
        </Collapse>

        {/* Add Comment */}
        <Box sx={{ p: { xs: 1.5, sm: 2 }, pt: 0, display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <Avatar
            src={currentUser?.profilePic}
            sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}
          />
          <TextField
            size="small"
            fullWidth
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: alpha(theme.palette.common.white, 0.05),
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
              },
            }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleAddComment}
            disabled={!commentText.trim() || loading}
            sx={{
              borderRadius: 3,
              minWidth: 'auto',
              px: { xs: 1.5, sm: 2 },
              '&:hover': {
                transform: isMobile ? 'none' : 'scale(1.05)',
              },
            }}
          >
            {loading ? <CircularProgress size={20} /> : <Send sx={{ fontSize: { xs: 16, sm: 18 } }} />}
          </Button>
        </Box>
      </Card>

      {/* Delete Post Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, m: { xs: 2, sm: 0 } }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Delete Post</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Are you sure you want to delete this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Report Dialog */}
      <ReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        onSubmit={handleReportPost}
        reportType="post"
        targetName={`post by ${username}`}
        loading={reportLoading}
        error={reportError}
      />

      {/* Snackbar */}
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
    </>
  )
}

export default PostCard