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
  Snackbar
} from '@mui/material'
import { usePosts } from '../context/PostContext'

const CreatePost = () => {
  const navigate = useNavigate()
  const { createPost } = usePosts()
  const [formData, setFormData] = useState({ imageUrl: '', caption: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.imageUrl.trim()) {
      setError('Image URL is required')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      await createPost(formData)
      setSnackbar({
        open: true,
        message: 'Post created successfully!',
        severity: 'success'
      })
      setTimeout(() => navigate('/home'), 1500)
    } catch (err) {
      setError('Failed to create post')
      setSnackbar({
        open: true,
        message: 'Failed to create post',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Create New Post
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            margin="normal"
            required
            placeholder="https://example.com/image.jpg"
          />
          
          {formData.imageUrl && (
            <Box sx={{ my: 2 }}>
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL'
                }}
              />
            </Box>
          )}
          
          <TextField
            fullWidth
            label="Caption"
            name="caption"
            value={formData.caption}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            placeholder="Write a caption..."
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={() => navigate('/home')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Creating...' : 'Create Post'}
            </Button>
          </Box>
        </form>
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

export default CreatePost