// src/components/UserCard.jsx
import { useState, useEffect } from 'react'
import { Card, CardContent, Avatar, Typography, Button, Box, Snackbar, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useFollow } from '../context/FollowContext'
import { useAuth } from '../context/AuthContext'

const UserCard = ({ user, onFollowChange }) => {
  const navigate = useNavigate()
  const { followUser, unfollowUser, isFollowing } = useFollow()
  const { currentUser } = useAuth()
  const [following, setFollowing] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkFollowing = () => {
      const status = isFollowing(user.id)
      console.log(`User ${user.username} following status:`, status)
      setFollowing(status)
    }
    checkFollowing()
  }, [user.id, isFollowing, currentUser])

  const handleFollowToggle = async (e) => {
    e.stopPropagation()
    if (loading) return
    
    setLoading(true)
    try {
      if (following) {
        await unfollowUser(user.id)
        setSnackbar({
          open: true,
          message: `Unfollowed ${user.username}`,
          severity: 'info'
        })
        setFollowing(false)
      } else {
        await followUser(user.id)
        setSnackbar({
          open: true,
          message: `Following ${user.username}`,
          severity: 'success'
        })
        setFollowing(true)
      }
      if (onFollowChange) {
        await onFollowChange()
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      setSnackbar({
        open: true,
        message: 'Error updating follow status',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const isCurrentUser = currentUser?.id === user.id

  return (
    <>
      <Card 
        sx={{ 
          mb: 2, 
          cursor: 'pointer', 
          transition: 'transform 0.2s',
          '&:hover': { 
            transform: 'translateY(-2px)',
            boxShadow: 3
          } 
        }} 
        onClick={() => navigate(`/profile/${user.id}`)}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={user.profileImageUrl} sx={{ width: 56, height: 56 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.followers?.length || 0} followers • {user.following?.length || 0} following
                </Typography>
                {user.bio && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    {user.bio.substring(0, 60)}{user.bio.length > 60 ? '...' : ''}
                  </Typography>
                )}
              </Box>
            </Box>
            {!isCurrentUser && (
              <Button
                variant={following ? 'outlined' : 'contained'}
                size="small"
                onClick={handleFollowToggle}
                disabled={loading}
                sx={{ minWidth: 100 }}
              >
                {loading ? 'Please wait...' : (following ? 'Unfollow' : 'Follow')}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
      
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
    </>
  )
}

export default UserCard