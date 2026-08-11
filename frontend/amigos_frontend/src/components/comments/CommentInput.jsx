// src/components/comments/CommentInput.jsx
import { useState } from 'react'
import { Box, TextField, Button, Avatar, alpha, useTheme } from '@mui/material'
import { Send } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'

const CommentInput = ({ postId, onCommentAdded, placeholder = 'Add a comment...' }) => {
  const theme = useTheme()
  const { currentUser } = useAuth()
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!commentText.trim() || loading) return
    setLoading(true)
    try {
      await onCommentAdded(commentText)
      setCommentText('')
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <Avatar
        src={currentUser?.profilePic}
        sx={{ width: 32, height: 32 }}
      />
      <TextField
        size="small"
        fullWidth
        placeholder={placeholder}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: alpha(theme.palette.common.white, 0.05),
          },
        }}
      />
      <Button
        variant="contained"
        size="small"
        onClick={handleSubmit}
        disabled={!commentText.trim() || loading}
        sx={{
          borderRadius: 3,
          minWidth: 'auto',
          px: 2,
        }}
      >
        <Send sx={{ fontSize: 18 }} />
      </Button>
    </Box>
  )
}

export default CommentInput