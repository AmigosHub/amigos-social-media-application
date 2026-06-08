// src/pages/EditPost.jsx
import { useState, useEffect } from 'react'
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
  CircularProgress
} from '@mui/material'
import { usePosts } from '../context/PostContext'
import axios from '../api/axios'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updatePost, deletePost } = usePosts()
  const [post, setPost] = useState(null)
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    loadPost()
  }, [id])

  const loadPost = async () => {
    const posts = (await axios.get('/posts')).data
    const foundPost = posts.find(p => p.id === id)
    if (foundPost) {
      setPost(foundPost)
      setCaption(foundPost.caption)
    } else {
      navigate('/home')
    }
  }

  const handleUpdate = async () => {
    if (!caption.trim()) {
      setError('Caption cannot be empty')
      return
    }
    
    setLoading(true)
    try {
      await updatePost(id, { caption })
      setSnackbar({
        open: true,
        message: 'Post updated successfully!',
        severity: 'success'
      })
      setTimeout(() => navigate('/home'), 1500)
    } catch (err) {
      setError('Failed to update post')
      setSnackbar({
        open: true,
        message: 'Failed to update post',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(id)
      setSnackbar({
        open: true,
        message: 'Post deleted successfully!',
        severity: 'success'
      })
      setTimeout(() => navigate('/home'), 1500)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (!post) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Edit Post
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box sx={{ my: 2 }}>
          <img 
            src={post.imageUrl} 
            alt="Post" 
            style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
            }}
          />
        </Box>
        
        <TextField
          fullWidth
          label="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          margin="normal"
          multiline
          rows={3}
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={() => navigate('/home')}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default EditPost