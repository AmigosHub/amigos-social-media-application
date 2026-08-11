
// src/pages/Following.jsx
import { useState, useEffect } from 'react'
import { Container, Typography, Box, CircularProgress, Button, Snackbar, Alert, Avatar } from '@mui/material'  // Added Avatar
import { useAuth } from '../context/AuthContext'
import { followAPI } from '../api/follow'
import { userAPI } from '../api/user'
import { useNavigate } from 'react-router-dom'

const Following = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [followingUsers, setFollowingUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [unfollowing, setUnfollowing] = useState({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    if (currentUser?.id) {
      loadFollowingUsers()
    } else {
      setLoading(false)
    }
  }, [currentUser])

  const loadFollowingUsers = async () => {
    if (!currentUser?.id) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    try {
      const response = await followAPI.getFollowing(currentUser.id)
      if (response.success) {
        setFollowingUsers(response.data.content || [])
      }
    } catch (error) {
      console.error('Error loading following users:', error)
      setSnackbar({
        open: true,
        message: 'Failed to load following users',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollow = async (userId) => {
    setUnfollowing(prev => ({ ...prev, [userId]: true }))
    try {
      const response = await followAPI.unfollowUser(userId)
      if (response.success) {
        // Remove user from the list
        setFollowingUsers(prev => prev.filter(user => user.id !== userId))
        setSnackbar({
          open: true,
          message: 'Unfollowed successfully',
          severity: 'success'
        })
        // Refresh current user data
        try {
          const userResponse = await userAPI.getCurrentUser()
          if (userResponse.success) {
            localStorage.setItem('user', JSON.stringify(userResponse.data))
            // Dispatch storage event to update other tabs
            window.dispatchEvent(new Event('storage'))
          }
        } catch (err) {
          console.error('Error refreshing user data:', err)
        }
      } else {
        throw new Error(response.message || 'Failed to unfollow user')
      }
    } catch (error) {
      console.error('Error unfollowing user:', error)
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to unfollow user',
        severity: 'error'
      })
    } finally {
      setUnfollowing(prev => ({ ...prev, [userId]: false }))
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (followingUsers.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Not following anyone yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search for users to follow and see their posts in your feed!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/search')}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Find People to Follow
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Following ({followingUsers.length})
        </Typography>
        
        {followingUsers.map((user) => (
          <Box
            key={user.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              mb: 2,
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
            }}
            onClick={() => navigate(`/profile/${user.id}`)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={user.profilePic}
                sx={{ width: 48, height: 48 }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.followersCount || 0} followers
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                handleUnfollow(user.id)
              }}
              disabled={unfollowing[user.id]}
              sx={{
                borderRadius: 2,
                minWidth: 100,
              }}
            >
              {unfollowing[user.id] ? 'Unfollowing...' : 'Unfollow'}
            </Button>
          </Box>
        ))}
      </Container>
      
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

export default Following