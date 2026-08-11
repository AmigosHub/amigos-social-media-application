
// src/pages/EditPost.jsx
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material'
import { PlayArrow, Pause, VolumeUp, VolumeOff } from '@mui/icons-material'
import { usePosts } from '../context/PostContext'
import { postAPI } from '../api/post'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const { updatePost, deletePost } = usePosts()
  const [post, setPost] = useState(null)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  
  // Video player states
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [videoProgress, setVideoProgress] = useState(0)
  const videoRef = useRef(null)

  useEffect(() => {
    loadPost()
  }, [id])

  // Reset video state when post changes
  useEffect(() => {
    if (post) {
      setIsPlaying(false)
      setVideoProgress(0)
      if (videoRef.current) {
        videoRef.current.currentTime = 0
      }
    }
  }, [post])

  const loadPost = async () => {
    try {
      const response = await postAPI.getPostById(id)
      if (response.success) {
        setPost(response.data)
        setContent(response.data.content)
      }
    } catch (error) {
      console.error('Error loading post:', error)
      navigate('/home')
    } finally {
      setFetchLoading(false)
    }
  }

  // ========== FIXED: Update post ==========
  const handleUpdate = async () => {
    if (!content.trim()) {
      setError('Content cannot be empty')
      return
    }
    
    setLoading(true)
    try {
      // Send as { content: content } - the API and context will handle it
      await updatePost(id, { content: content })
      setSnackbar({
        open: true,
        message: 'Post updated successfully!',
        severity: 'success'
      })
      setTimeout(() => navigate('/home'), 1500)
    } catch (err) {
      setError(err.message || 'Failed to update post')
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update post',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }
  // ========== END OF FIX ==========

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id)
        setSnackbar({
          open: true,
          message: 'Post deleted successfully!',
          severity: 'success'
        })
        setTimeout(() => navigate('/home'), 1500)
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to delete post',
          severity: 'error'
        })
      }
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Check if media is video
  const isVideo = post?.mediaType === 'VIDEO' || post?.mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i)

  if (fetchLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography>Post not found</Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Edit Post
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
        
        {/* Media Display */}
        {post.mediaUrl && (
          <Box sx={{ my: 2, position: 'relative', bgcolor: 'black', borderRadius: 2, overflow: 'hidden' }}>
            {isVideo ? (
              // Video Player
              <Box sx={{ position: 'relative' }}>
                <video
                  ref={videoRef}
                  src={post.mediaUrl}
                  style={{
                    width: '100%',
                    maxHeight: 400,
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
                
                {/* Video Badge */}
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
              </Box>
            ) : (
              // Image Display
              <img 
                src={post.mediaUrl} 
                alt="Post" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: 400, 
                  borderRadius: 8,
                  objectFit: 'contain',
                }} 
              />
            )}
          </Box>
        )}
        
        {/* Content Input */}
        <TextField
          fullWidth
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          multiline
          rows={4}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/home')}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpdate} 
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Update'}
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDelete}
            sx={{ borderRadius: 2, ml: 'auto' }}
          >
            Delete
          </Button>
        </Box>
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

export default EditPost