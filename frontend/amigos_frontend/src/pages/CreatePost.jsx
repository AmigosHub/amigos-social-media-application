
// src/pages/CreatePost.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  IconButton,
  Chip,
  LinearProgress,
  alpha,
  useTheme,
} from '@mui/material'
import { 
  PhotoCamera, 
  Close, 
  VideoLibrary,
  AttachFile,
  InsertPhoto,
} from '@mui/icons-material'
import { usePosts } from '../context/PostContext'

const CreatePost = () => {
  const navigate = useNavigate()
  const { createPost } = usePosts()
  const theme = useTheme()
  const [caption, setCaption] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [mediaType, setMediaType] = useState(null) // 'image' or 'video'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 10MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`)
      setSnackbar({
        open: true,
        message: `File size exceeds 10MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        severity: 'error'
      })
      return
    }

    // Check file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

    if (!isImage && !isVideo) {
      setError('Please upload a valid image (JPEG, PNG, GIF, WEBP) or video (MP4, WEBM, OGG) file')
      setSnackbar({
        open: true,
        message: 'Invalid file type. Please upload an image or video.',
        severity: 'error'
      })
      return
    }

    setSelectedFile(file)
    setMediaType(isImage ? 'image' : 'video')
    setError('')

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setMediaPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const removeMedia = () => {
    setSelectedFile(null)
    setMediaPreview(null)
    setMediaType(null)
    setUploadProgress(0)
    // Reset file input
    const fileInput = document.getElementById('file-input')
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!caption.trim() && !selectedFile) {
      setError('Please add a caption or upload a file')
      return
    }
    
    setLoading(true)
    setError('')
    setUploadProgress(0)
    
    try {
      // Simulate upload progress (in real app, you'd track actual upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      // Create FormData for file upload
      const formData = new FormData()
      if (caption.trim()) {
        formData.append('content', caption.trim())
      }
      if (selectedFile) {
        formData.append('media', selectedFile)
      }

      // Call the API with FormData
      await createPost(formData)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      setSnackbar({
        open: true,
        message: 'Post created successfully!',
        severity: 'success'
      })
      
      setTimeout(() => navigate('/home'), 1500)
    } catch (err) {
      setError(err.message || 'Failed to create post')
      setSnackbar({
        open: true,
        message: err.message || 'Failed to create post',
        severity: 'error'
      })
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Create New Post
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          {/* Caption Input */}
          <TextField
            fullWidth
            label="What's on your mind?"
            name="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            placeholder="Write a caption..."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          
          {/* File Upload Area */}
          <Box 
            sx={{ 
              mt: 2, 
              mb: 2,
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            {!mediaPreview ? (
              <Box>
                <AttachFile sx={{ fontSize: 48, color: theme.palette.text.secondary }} />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Click to upload image or video
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported: JPEG, PNG, GIF, WEBP, MP4, WEBM, OGG (Max 10MB)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                  <Chip 
                    icon={<InsertPhoto />} 
                    label="Image" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      document.getElementById('file-input').click()
                    }}
                  />
                  <Chip 
                    icon={<VideoLibrary />} 
                    label="Video" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      document.getElementById('file-input').click()
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <Box sx={{ position: 'relative' }}>
                {mediaType === 'image' ? (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: 400, 
                      borderRadius: 8,
                      objectFit: 'contain',
                    }} 
                  />
                ) : (
                  <video 
                    src={mediaPreview} 
                    controls 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: 400, 
                      borderRadius: 8,
                    }} 
                  />
                )}
                
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    removeMedia()
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                  }}
                >
                  <Close />
                </IconButton>
                
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {selectedFile?.name} ({formatFileSize(selectedFile?.size || 0)})
                  </Typography>
                  <Chip 
                    label={mediaType === 'image' ? 'Image' : 'Video'} 
                    size="small" 
                    color="primary"
                  />
                </Box>
              </Box>
            )}
          </Box>

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Uploading... {uploadProgress}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          )}
          
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
              type="submit" 
              variant="contained" 
              disabled={loading || (!caption.trim() && !selectedFile)}
              sx={{ 
                borderRadius: 2,
                ml: 'auto',
                minWidth: 120,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Post'}
            </Button>
          </Box>
        </form>
      </Paper>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default CreatePost