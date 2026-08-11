
// src/components/user/UserCard.jsx
import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  Avatar, 
  Typography, 
  Button, 
  Box, 
  Snackbar, 
  Alert, 
  CircularProgress, 
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material'
import { MoreVert, Report, Flag } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useFollow } from '../../context/FollowContext'
import { useAuth } from '../../context/AuthContext'
import { followAPI } from '../../api/follow'
import { reportAPI } from '../../api/report'
import ReportDialog from '../common/ReportDialog'

const UserCard = ({ user, onFollowChange }) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { followUser, unfollowUser, sendFollowRequest, isFollowing, getFollowStatus } = useFollow()
  const { currentUser } = useAuth()
  const [followStatus, setFollowStatus] = useState('not_following')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [loading, setLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  
  // Report states
  const [anchorEl, setAnchorEl] = useState(null)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [reportError, setReportError] = useState(null)

  useEffect(() => {
    checkFollowStatus()
  }, [user.id, currentUser])

  const checkFollowStatus = async () => {
    if (!currentUser || currentUser.id === user.id) {
      setFollowStatus('not_following')
      setCheckingStatus(false)
      return
    }

    setCheckingStatus(true)
    try {
      const status = isFollowing(user.id)
      if (status === 'following' || status === 'pending') {
        setFollowStatus(status)
        setCheckingStatus(false)
        return
      }

      const response = await getFollowStatus(user.id)
      if (response?.following === true) {
        setFollowStatus('following')
      } else if (response?.hasPendingRequest === true) {
        setFollowStatus('pending')
      } else {
        setFollowStatus('not_following')
      }
    } catch (error) {
      console.error('Error checking follow status:', error)
      setFollowStatus('not_following')
    } finally {
      setCheckingStatus(false)
    }
  }

  const handleFollowToggle = async (e) => {
    e.stopPropagation()
    if (loading || checkingStatus) return
    
    setLoading(true)
    try {
      if (followStatus === 'following') {
        const response = await unfollowUser(user.id)
        if (response.success) {
          setFollowStatus('not_following')
          setSnackbar({
            open: true,
            message: `Unfollowed ${user.username}`,
            severity: 'info'
          })
        }
      } else if (followStatus === 'pending') {
        setSnackbar({
          open: true,
          message: `Follow request already sent to ${user.username}`,
          severity: 'info'
        })
        setLoading(false)
        return
      } else {
        if (user.private) {
          const response = await sendFollowRequest(user.id)
          if (response.success) {
            setFollowStatus('pending')
            setSnackbar({
              open: true,
              message: `Follow request sent to ${user.username}`,
              severity: 'success'
            })
          }
        } else {
          const response = await followUser(user.id)
          if (response.success) {
            setFollowStatus('following')
            setSnackbar({
              open: true,
              message: `Following ${user.username}`,
              severity: 'success'
            })
          }
        }
      }
      if (onFollowChange) {
        await onFollowChange()
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      await checkFollowStatus()
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error updating follow status',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  // Report handlers
  const handleReportUser = async (reportData) => {
    setReportLoading(true)
    setReportError(null)
    try {
      const response = await reportAPI.reportUser(user.id, {
        userId: currentUser?.id,
        reason: reportData.reason,
        description: reportData.description || '',
      })
      if (response.success) {
        setSnackbar({
          open: true,
          message: `User reported successfully. Our team will review it.`,
          severity: 'success'
        })
        setReportDialogOpen(false)
      } else {
        throw new Error(response.message || 'Failed to report user')
      }
    } catch (error) {
      setReportError(error.message || 'Failed to report user')
    } finally {
      setReportLoading(false)
    }
  }

  const handleMenuOpen = (e) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleOpenReport = () => {
    handleMenuClose()
    setReportError(null)
    setReportDialogOpen(true)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const isCurrentUser = currentUser?.id === user.id

  const getButtonProps = () => {
    if (loading || checkingStatus) {
      return { label: 'Loading...', variant: 'contained', color: 'primary', disabled: true }
    }
    switch (followStatus) {
      case 'following':
        return { label: 'Unfollow', variant: 'outlined', color: 'error', disabled: false }
      case 'pending':
        return { label: 'Pending', variant: 'contained', color: 'warning', disabled: true }
      default:
        return { 
          label: user?.private ? 'Request to Follow' : 'Follow', 
          variant: 'contained', 
          color: 'primary', 
          disabled: false 
        }
    }
  }

  const buttonProps = getButtonProps()

  return (
    <>
      <Card 
        sx={{ 
          mb: 2, 
          cursor: 'pointer', 
          transition: 'transform 0.2s',
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          '&:hover': { 
            transform: 'translateY(-2px)',
            boxShadow: 3
          } 
        }} 
        onClick={() => navigate(`/profile/${user.id}`)}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <Avatar 
                src={user.profileImageUrl || user.profilePic} 
                sx={{ width: 56, height: 56 }} 
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {user.username}
                  {user.private && (
                    <Chip 
                      label="Private" 
                      size="small" 
                      sx={{ ml: 1, height: 18, fontSize: '0.6rem' }} 
                    />
                  )}
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
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isCurrentUser && (
                <>
                  <Button
                    variant={buttonProps.variant}
                    color={buttonProps.color}
                    size="small"
                    onClick={handleFollowToggle}
                    disabled={buttonProps.disabled || loading || checkingStatus}
                    sx={{ 
                      minWidth: 120,
                      borderRadius: 2,
                    }}
                  >
                    {loading || checkingStatus ? <CircularProgress size={20} /> : buttonProps.label}
                  </Button>
                  
                  <Tooltip title="More options" arrow>
                    <IconButton size="small" onClick={handleMenuOpen}>
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              {isCurrentUser && (
                <Chip label="You" size="small" sx={{ height: 20 }} />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenReport}>
          <Report fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} /> 
          Report User
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate(`/profile/${user.id}`)}>
          <Flag fontSize="small" sx={{ mr: 1 }} /> 
          View Profile
        </MenuItem>
      </Menu>
      
      {/* Report Dialog */}
      <ReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        onSubmit={handleReportUser}
        reportType="user"
        targetName={`@${user.username}`}
        loading={reportLoading}
        error={reportError}
      />
      
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

export default UserCard