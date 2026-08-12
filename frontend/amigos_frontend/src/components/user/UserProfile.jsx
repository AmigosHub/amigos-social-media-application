
// src/components/user/UserProfile.jsx
import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  alpha,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Edit, PhotoCamera } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { useFollow } from '../../context/FollowContext'

const UserProfile = ({ user, isOwnProfile, onUpdate }) => {
  const theme = useTheme()
  const { currentUser, updateUser } = useAuth()
  const { followUser, unfollowUser, isFollowing, getFollowStatus } = useFollow()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [following, setFollowing] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Check follow status on mount and when user changes
  useEffect(() => {
    const checkStatus = async () => {
      if (!user?.id || isOwnProfile) {
        setFollowing(false)
        setCheckingStatus(false)
        return
      }

      setCheckingStatus(true)
      try {
        // First check local state
        const localStatus = isFollowing(user.id)
        if (localStatus === 'following') {
          setFollowing(true)
          setCheckingStatus(false)
          return
        }

        // If not found locally, check via API
        const response = await getFollowStatus(user.id)
        if (response?.following === true) {
          setFollowing(true)
        } else {
          setFollowing(false)
        }
      } catch (error) {
        console.error('Error checking follow status:', error)
        setFollowing(false)
      } finally {
        setCheckingStatus(false)
      }
    }

    checkStatus()
  }, [user?.id, isOwnProfile, isFollowing, getFollowStatus])

  const handleFollowToggle = async () => {
    if (loading || checkingStatus || !user?.id) return
    
    setLoading(true)
    try {
      if (following) {
        // UNFOLLOW
        const response = await unfollowUser(user.id)
        if (response.success) {
          setFollowing(false)
          setSnackbar({
            open: true,
            message: `Unfollowed ${user.username}`,
            severity: 'info'
          })
          
          // Update current user's following list in context
          if (currentUser) {
            const updatedFollowing = (currentUser.following || []).filter(id => id !== user.id)
            await updateUser({ following: updatedFollowing })
          }
          
          if (onUpdate) onUpdate()
        } else {
          throw new Error(response.message || 'Failed to unfollow')
        }
      } else {
        // FOLLOW
        const response = await followUser(user.id)
        if (response.success) {
          setFollowing(true)
          setSnackbar({
            open: true,
            message: `Following ${user.username}`,
            severity: 'success'
          })
          
          // Update current user's following list in context
          if (currentUser) {
            const updatedFollowing = [...(currentUser.following || []), user.id]
            await updateUser({ following: updatedFollowing })
          }
          
          if (onUpdate) onUpdate()
        } else {
          throw new Error(response.message || 'Failed to follow')
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update follow status',
        severity: 'error'
      })
      // Re-check status on error
      try {
        const response = await getFollowStatus(user.id)
        setFollowing(response?.following === true)
      } catch {
        setFollowing(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <>
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
          <Avatar
            src={user?.profilePic}
            sx={{
              width: 120,
              height: 120,
              border: `3px solid ${theme.palette.primary.main}`,
            }}
          />
          
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              {user?.username}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user?.fullName}
            </Typography>
            {user?.bio && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                {user.bio}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={`${user?.postsCount || 0} posts`} sx={{ borderRadius: 2 }} />
              <Chip label={`${user?.followersCount || 0} followers`} sx={{ borderRadius: 2 }} />
              <Chip label={`${user?.followingCount || 0} following`} sx={{ borderRadius: 2 }} />
            </Box>
            
            {isOwnProfile ? (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap' }}>
                <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditDialogOpen(true)} sx={{ borderRadius: 2 }}>
                  Edit Profile
                </Button>
              </Box>
            ) : (
              <Button
                variant={following ? 'outlined' : 'contained'}
                color={following ? 'error' : 'primary'}
                onClick={handleFollowToggle}
                disabled={loading || checkingStatus}
                sx={{ 
                  borderRadius: 2,
                  minWidth: 120,
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : (following ? 'Unfollow' : 'Follow')}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Edit Profile Dialog */}
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
        <DialogTitle sx={{ fontWeight: 600 }}>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            value={editForm.fullName || ''}
            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
            margin="normal"
            slotProps={{
              input: { sx: { borderRadius: 2 } }
            }}
          />
          <TextField
            fullWidth
            label="Bio"
            value={editForm.bio || ''}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            slotProps={{
              input: { sx: { borderRadius: 2 } }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setEditDialogOpen(false)} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

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

export default UserProfile