
// src/components/PostCard.jsx - Updated for better mobile responsiveness
import { useState } from 'react'
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
  Fade,
  alpha,
  useTheme,
  Collapse,
  useMediaQuery,
} from '@mui/material'
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Delete,
  Edit,
  MoreVert,
  Send,
  Share,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostContext'
import { useNavigate } from 'react-router-dom'

const PostCard = ({ post, onDelete }) => {
  const { currentUser } = useAuth()
  const { likePost, addComment, deleteComment } = usePosts()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?.id))
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0)
  const [isSaved, setIsSaved] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const isOwner = post.userId === currentUser?.id

  const handleLike = async () => {
    if (isAnimating) return
    setIsAnimating(true)
    
    if (!isLiked) {
      setIsLiked(true)
      setLikesCount(prev => prev + 1)
      await likePost(post.id)
      setSnackbar({
        open: true,
        message: 'Post liked!',
        severity: 'success'
      })
    } else {
      setIsLiked(false)
      setLikesCount(prev => prev - 1)
      await likePost(post.id)
    }
    
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleAddComment = async () => {
    if (commentText.trim()) {
      await addComment(post.id, commentText)
      setCommentText('')
      setSnackbar({
        open: true,
        message: 'Comment added!',
        severity: 'success'
      })
    }
  }

  const handleDeleteComment = async (commentId) => {
    await deleteComment(post.id, commentId)
    setSnackbar({
      open: true,
      message: 'Comment deleted!',
      severity: 'success'
    })
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`)
    setSnackbar({
      open: true,
      message: 'Link copied to clipboard!',
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
              src={post.userAvatar}
              onClick={() => navigate(`/profile/${post.userId}`)}
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
            isOwner && (
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
                  TransitionComponent={Fade}
                >
                  <MenuItem onClick={handleEdit}>
                    <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Caption
                  </MenuItem>
                  <MenuItem onClick={() => setDeleteDialogOpen(true)} sx={{ color: 'error.main' }}>
                    <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Post
                  </MenuItem>
                </Menu>
              </>
            )
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
              onClick={() => navigate(`/profile/${post.userId}`)}
            >
              {post.username}
            </Typography>
          }
          subheader={
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </Typography>
          }
          sx={{ pb: 1, px: { xs: 1.5, sm: 2 } }}
        />

        {/* Post Image */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height={isMobile ? 300 : 450}
            image={post.imageUrl}
            alt={post.caption}
            sx={{
              objectFit: 'cover',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: isMobile ? 'none' : 'scale(1.02)',
              },
            }}
            onClick={() => window.open(post.imageUrl, '_blank')}
          />
        </Box>

        {/* Card Actions */}
        <CardActions disableSpacing sx={{ pt: 1, px: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flex: 1 }}>
            <Tooltip title={isLiked ? 'Unlike' : 'Like'} arrow>
              <IconButton
                onClick={handleLike}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  transition: 'all 0.2s ease',
                  transform: isAnimating ? 'scale(1.3)' : 'scale(1)',
                  color: isLiked ? '#ef4444' : 'inherit',
                }}
              >
                {isLiked ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Comment" arrow>
              <IconButton onClick={() => setShowComments(!showComments)} size={isMobile ? 'small' : 'medium'}>
                <Comment />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share" arrow>
              <IconButton onClick={handleShare} size={isMobile ? 'small' : 'medium'}>
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
          <Tooltip title={isSaved ? 'Unsave' : 'Save'} arrow>
            <IconButton onClick={() => setIsSaved(!isSaved)} size={isMobile ? 'small' : 'medium'}>
              {isSaved ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
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

        {/* Caption */}
        <CardContent sx={{ pt: 1, pb: 0, px: { xs: 1.5, sm: 2 } }}>
          <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/profile/${post.userId}`)}
            >
              {post.username}
            </strong>{' '}
            {post.caption}
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
              Hide comments ({post.comments?.length || 0})
            </Typography>

            {post.comments?.map((comment) => (
              <Box
                key={comment.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  mb: 1.5,
                  p: 1,
                  borderRadius: 2,
                  transition: 'background 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.white, 0.05),
                  },
                }}
              >
                <Avatar
                  src={comment.userAvatar}
                  sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, mr: 1.5, cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${comment.userId}`)}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    <strong
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/profile/${comment.userId}`)}
                    >
                      {comment.username}
                    </strong>{' '}
                    {comment.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </Typography>
                </Box>
                {(comment.userId === currentUser?.id || isOwner) && (
                  <Tooltip title="Delete comment" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteComment(comment.id)}
                      sx={{ ml: 1 }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            ))}
          </Box>
        </Collapse>

        {/* Add Comment */}
        <Box sx={{ p: { xs: 1.5, sm: 2 }, pt: 0, display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <Avatar
            src={currentUser?.profileImageUrl}
            sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}
          />
          <TextField
            size="small"
            fullWidth
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
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
            disabled={!commentText.trim()}
            sx={{
              borderRadius: 3,
              minWidth: 'auto',
              px: { xs: 1.5, sm: 2 },
              '&:hover': {
                transform: isMobile ? 'none' : 'scale(1.05)',
              },
            }}
          >
            <Send sx={{ fontSize: { xs: 16, sm: 18 } }} />
          </Button>
        </Box>
      </Card>

      {/* Delete Dialog */}
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
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default PostCard