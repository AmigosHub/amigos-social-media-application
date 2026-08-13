
// src/pages/Profile.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  alpha,
  useTheme,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Input,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  CardHeader,
  CardContent,
  CardActions,
} from '@mui/material'
import { 
  Edit, 
  Delete, 
  Close, 
  Visibility, 
  PhotoCamera, 
  PlayArrow, 
  Pause, 
  VolumeUp, 
  VolumeOff,
  Lock,
  LockOpen,
  Bookmark,
  BookmarkBorder,
  Favorite,
  FavoriteBorder,
  Comment,
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useFollow } from '../context/FollowContext'
import { usePosts } from '../context/PostContext'
import { userAPI } from '../api/user'
import { postAPI } from '../api/post'
import { savedPostAPI } from '../api/savedPost'

const Profile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const { currentUser, updateUser, updateProfilePic, removeProfilePic, deactivateAccount, updatePrivacy } = useAuth()
  const { followUser, unfollowUser, sendFollowRequest, isFollowing, getFollowStatus } = useFollow()
  const { getUserPosts } = usePosts()
  const [user, setUser] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [profilePicDialogOpen, setProfilePicDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [userPosts, setUserPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedPostsLoading, setSavedPostsLoading] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [viewPostDialogOpen, setViewPostDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [profilePicLoading, setProfilePicLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [followLoading, setFollowLoading] = useState(false)
  const [followStatus, setFollowStatus] = useState('not_following')
  const [isPrivate, setIsPrivate] = useState(false)
  const [privacyUpdating, setPrivacyUpdating] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [videoProgress, setVideoProgress] = useState(0)
  const videoRef = useRef(null)

  const userId = id || currentUser?.id
  const isOwnProfile = currentUser?.id === parseInt(userId)

  // Reset video when post changes
  useEffect(() => {
    if (selectedPost) {
      setIsPlaying(false)
      setVideoProgress(0)
      if (videoRef.current) {
        videoRef.current.currentTime = 0
      }
    }
  }, [selectedPost])

  // Handle redirects
  useEffect(() => {
    if (!id && currentUser?.id) {
      navigate(`/profile/${currentUser.id}`, { replace: true })
      return
    }
    
    if (id === 'undefined' || id === '') {
      if (currentUser?.id) {
        navigate(`/profile/${currentUser.id}`, { replace: true })
      } else {
        navigate('/home')
      }
      return
    }
    
    if (!id && !currentUser?.id) {
      navigate('/home')
      return
    }
  }, [id, currentUser, navigate])

  // Load user data
  const loadUserData = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [userResponse, postsResponse] = await Promise.all([
        userAPI.getUserById(userId),
        postAPI.getUserPosts(userId)
      ])
      
      if (userResponse.success) {
        setUser(userResponse.data)
        setEditForm(userResponse.data)
        setIsPrivate(userResponse.data.private || false)
      }

      if (postsResponse.success) {
        setUserPosts(postsResponse.data.content || [])
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load user data',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Load saved posts (only for own profile)
  const loadSavedPosts = useCallback(async () => {
    if (!isOwnProfile) return
    
    setSavedPostsLoading(true)
    try {
      const response = await savedPostAPI.getSavedPosts(0, 50)
      if (response.success) {
        setSavedPosts(response.data.content || [])
      }
    } catch (error) {
      console.error('Error loading saved posts:', error)
    } finally {
      setSavedPostsLoading(false)
    }
  }, [isOwnProfile])

  // Check follow status
  const checkFollowStatus = useCallback(async () => {
    if (!userId || isOwnProfile) {
      setFollowStatus('not_following')
      return
    }
    
    try {
      const status = await getFollowStatus(parseInt(userId))
      
      if (status?.following === true) {
        setFollowStatus('following')
      } else if (status?.hasPendingRequest === true) {
        setFollowStatus('pending')
      } else {
        setFollowStatus('not_following')
      }
    } catch (error) {
      if (currentUser?.following?.includes(parseInt(userId))) {
        setFollowStatus('following')
      } else if (currentUser?.pendingFollowRequests?.includes(parseInt(userId))) {
        setFollowStatus('pending')
      } else {
        setFollowStatus('not_following')
      }
    }
  }, [userId, isOwnProfile, currentUser, getFollowStatus])

  // Initial load
  useEffect(() => {
    if (!userId) return
    
    const loadData = async () => {
      await loadUserData()
      await checkFollowStatus()
      if (isOwnProfile) {
        await loadSavedPosts()
      }
    }
    
    loadData()
  }, [userId, loadUserData, checkFollowStatus, isOwnProfile, loadSavedPosts])

  const handleFollowToggle = async () => {
    if (!userId || followLoading) return
    
    setFollowLoading(true)
    try {
      if (followStatus === 'following') {
        const response = await unfollowUser(parseInt(userId))
        if (response.success) {
          setFollowStatus('not_following')
          
          if (currentUser) {
            const updatedFollowing = (currentUser.following || []).filter(id => id !== parseInt(userId))
            const updatedUser = {
              ...currentUser,
              following: updatedFollowing,
              pendingFollowRequests: (currentUser.pendingFollowRequests || []).filter(id => id !== parseInt(userId))
            }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            await updateUser({ 
              following: updatedFollowing,
              pendingFollowRequests: updatedUser.pendingFollowRequests 
            })
          }
          
          setSnackbar({
            open: true,
            message: `Unfollowed ${user?.username}`,
            severity: 'info'
          })
          
          await loadUserData()
          await checkFollowStatus()
        }
      } else if (followStatus === 'pending') {
        setSnackbar({
          open: true,
          message: `Follow request already sent to ${user?.username}`,
          severity: 'info'
        })
      } else {
        if (user?.private) {
          const response = await sendFollowRequest(parseInt(userId))
          if (response.success) {
            setFollowStatus('pending')
            setSnackbar({
              open: true,
              message: `Follow request sent to ${user?.username}`,
              severity: 'success'
            })
            if (currentUser) {
              const updatedUser = {
                ...currentUser,
                pendingFollowRequests: [...(currentUser.pendingFollowRequests || []), parseInt(userId)]
              }
              localStorage.setItem('user', JSON.stringify(updatedUser))
              await updateUser({ pendingFollowRequests: updatedUser.pendingFollowRequests })
            }
          }
        } else {
          const response = await followUser(parseInt(userId))
          if (response.success) {
            setFollowStatus('following')
            setSnackbar({
              open: true,
              message: `Following ${user?.username}`,
              severity: 'success'
            })
            if (currentUser) {
              const updatedUser = {
                ...currentUser,
                following: [...(currentUser.following || []), parseInt(userId)]
              }
              localStorage.setItem('user', JSON.stringify(updatedUser))
              await updateUser({ following: updatedUser.following })
            }
          }
        }
        await loadUserData()
        await checkFollowStatus()
      }
    } catch (error) {
      await checkFollowStatus()
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to update follow status',
        severity: 'error'
      })
    } finally {
      setFollowLoading(false)
    }
  }

  const handlePrivacyToggle = async () => {
    setPrivacyUpdating(true)
    try {
      const newPrivacy = !isPrivate
      const response = await updatePrivacy(newPrivacy)
      if (response.success) {
        setIsPrivate(newPrivacy)
        setSnackbar({
          open: true,
          message: `Profile is now ${newPrivacy ? 'private' : 'public'}`,
          severity: 'success'
        })
        await loadUserData()
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update privacy settings',
        severity: 'error'
      })
    } finally {
      setPrivacyUpdating(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      await updateUser({
        fullName: editForm.fullName,
        bio: editForm.bio,
      })
      setEditDialogOpen(false)
      await loadUserData()
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update profile',
        severity: 'error'
      })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await deactivateAccount()
      navigate('/login')
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete account',
        severity: 'error'
      })
    }
  }

  const handlePostClick = (post) => {
    if (isOwnProfile) {
      navigate(`/edit-post/${post.id}`)
    } else {
      setSelectedPost(post)
      setViewPostDialogOpen(true)
    }
  }

  const handleSavedPostClick = (post) => {
    setSelectedPost(post)
    setViewPostDialogOpen(true)
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSnackbar({
          open: true,
          message: 'Please select an image file',
          severity: 'error'
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'File size should be less than 5MB',
          severity: 'error'
        })
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadProfilePic = async () => {
    if (!selectedFile) return

    setProfilePicLoading(true)
    try {
      const response = await updateProfilePic(selectedFile)
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Profile picture updated successfully!',
          severity: 'success'
        })
        setProfilePicDialogOpen(false)
        setSelectedFile(null)
        setFilePreview(null)
        await loadUserData()
      } else {
        throw new Error(response.message || 'Failed to update profile picture')
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update profile picture',
        severity: 'error'
      })
    } finally {
      setProfilePicLoading(false)
    }
  }

  const handleRemoveProfilePic = async () => {
    setProfilePicLoading(true)
    try {
      const response = await removeProfilePic()
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Profile picture removed successfully!',
          severity: 'success'
        })
        setProfilePicDialogOpen(false)
        setSelectedFile(null)
        setFilePreview(null)
        await loadUserData()
      } else {
        throw new Error(response.message || 'Failed to remove profile picture')
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to remove profile picture',
        severity: 'error'
      })
    } finally {
      setProfilePicLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    if (newValue === 1 && isOwnProfile && savedPosts.length === 0) {
      loadSavedPosts()
    }
  }

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

  const isVideoPost = (post) => {
    return post.mediaType === 'VIDEO' || post.mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i)
  }

  const canViewPosts = () => {
    if (isOwnProfile) return true
    if (!user?.private) return true
    return followStatus === 'following' || currentUser?.following?.includes(parseInt(userId))
  }

  const getButtonProps = () => {
    if (followLoading) {
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6">User not found</Typography>
        </Paper>
      </Container>
    )
  }

  const buttonProps = getButtonProps()

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={user.profilePic} 
              sx={{ 
                width: 120, 
                height: 120,
                border: `3px solid ${theme.palette.primary.main}`,
              }} 
            />
            {isOwnProfile && (
              <Tooltip title="Change Profile Picture" arrow>
                <IconButton
                  size="small"
                  onClick={() => setProfilePicDialogOpen(true)}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    width: 36,
                    height: 36,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                    border: `2px solid ${theme.palette.background.paper}`,
                  }}
                >
                  <PhotoCamera sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                {user.username}
              </Typography>
              {user.private && (
                <Tooltip title="Private Account" arrow>
                  <Lock sx={{ color: theme.palette.text.secondary, fontSize: 20, mt: -0.5 }} />
                </Tooltip>
              )}
              {!user.private && isOwnProfile && (
                <Tooltip title="Public Account" arrow>
                  <LockOpen sx={{ color: theme.palette.text.secondary, fontSize: 20, mt: -0.5 }} />
                </Tooltip>
              )}
            </Box>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user.fullName}
            </Typography>
            {user.bio && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                {user.bio}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={`${user.postsCount || 0} posts`} 
                sx={{ borderRadius: 2 }}
              />
              <Chip 
                label={`${user.followersCount || 0} followers`} 
                sx={{ borderRadius: 2 }}
              />
              <Chip 
                label={`${user.followingCount || 0} following`} 
                sx={{ borderRadius: 2 }}
              />
            </Box>
            
            {isOwnProfile ? (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Edit />} 
                  onClick={() => setEditDialogOpen(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Edit Profile
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<Delete />} 
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Delete Account
                </Button>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPrivate}
                      onChange={handlePrivacyToggle}
                      disabled={privacyUpdating}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {isPrivate ? (
                        <Lock sx={{ fontSize: 16 }} />
                      ) : (
                        <LockOpen sx={{ fontSize: 16 }} />
                      )}
                      <Typography variant="body2">
                        {isPrivate ? 'Private' : 'Public'}
                      </Typography>
                    </Box>
                  }
                  sx={{ ml: 0 }}
                />
              </Box>
            ) : (
              <Button
                variant={buttonProps.variant}
                color={buttonProps.color}
                onClick={handleFollowToggle}
                disabled={buttonProps.disabled || followLoading}
                sx={{ 
                  borderRadius: 2,
                  minWidth: 120,
                }}
              >
                {followLoading ? <CircularProgress size={24} color="inherit" /> : buttonProps.label}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Tabs for Posts and Saved Posts (only for own profile) */}
      {isOwnProfile ? (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Posts" icon={<Visibility />} iconPosition="start" />
            <Tab label="Saved" icon={<Bookmark />} iconPosition="start" />
          </Tabs>
        </Box>
      ) : (
        <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
          Posts
        </Typography>
      )}
      
      {/* Posts Content */}
      {!canViewPosts() ? (
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Lock sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            This account is private
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {followStatus === 'pending' 
              ? `Follow request sent to ${user.username}. Wait for approval.` 
              : `Follow ${user.username} to see their posts`}
          </Typography>
        </Paper>
      ) : tabValue === 0 ? (
        // User Posts
        userPosts.length === 0 ? (
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography color="text.secondary">No posts yet</Typography>
          </Paper>
        ) : (
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            {userPosts.map(post => {
              const isVideo = isVideoPost(post)
              const mediaUrl = post.mediaUrl || post.imageUrl
              const postContent = post.content || post.caption
              
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4],
                      },
                      '&:hover .post-overlay': {
                        opacity: 1,
                      },
                    }} 
                    onClick={() => handlePostClick(post)}
                  >
                    {mediaUrl ? (
                      <Box sx={{ position: 'relative', bgcolor: 'black' }}>
                        {isVideo ? (
                          <Box sx={{ position: 'relative' }}>
                            <video
                              src={mediaUrl}
                              style={{
                                width: '100%',
                                height: 200,
                                objectFit: 'cover',
                                display: 'block',
                              }}
                              muted
                              playsInline
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                bgcolor: 'rgba(0,0,0,0.5)',
                                borderRadius: '50%',
                                width: 50,
                                height: 50,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <PlayArrow sx={{ color: 'white', fontSize: 30 }} />
                            </Box>
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
                                '& .MuiChip-label': { fontSize: '0.6rem' },
                              }}
                            />
                          </Box>
                        ) : (
                          <CardMedia 
                            component="img" 
                            height="200" 
                            image={mediaUrl} 
                            alt={postContent}
                            sx={{ objectFit: 'cover' }}
                          />
                        )}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No media
                        </Typography>
                      </Box>
                    )}
                    
                    {!isOwnProfile && (
                      <Box 
                        className="post-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: alpha(theme.palette.common.black, 0.6),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        <Visibility sx={{ color: 'white', fontSize: 40 }} />
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                          View Post
                        </Typography>
                      </Box>
                    )}
                    
                    {isOwnProfile && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: alpha(theme.palette.common.black, 0.7),
                          borderRadius: 2,
                          px: 1,
                          py: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        <Edit sx={{ color: 'white', fontSize: 14 }} />
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                          Click to edit
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )
      ) : (
        // Saved Posts
        savedPostsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : savedPosts.length === 0 ? (
          <Paper 
            sx={{ 
              p: 6, 
              textAlign: 'center',
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <BookmarkBorder sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No saved posts yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start saving posts you like by tapping the bookmark icon on any post
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            {savedPosts.map(post => {
              const isVideo = isVideoPost(post)
              const mediaUrl = post.mediaUrl || post.imageUrl
              const postContent = post.content || post.caption
              const postUser = post.user || post
              
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4],
                      },
                      '&:hover .post-overlay': {
                        opacity: 1,
                      },
                    }} 
                    onClick={() => handleSavedPostClick(post)}
                  >
                    {mediaUrl ? (
                      <Box sx={{ position: 'relative', bgcolor: 'black' }}>
                        {isVideo ? (
                          <Box sx={{ position: 'relative' }}>
                            <video
                              src={mediaUrl}
                              style={{
                                width: '100%',
                                height: 200,
                                objectFit: 'cover',
                                display: 'block',
                              }}
                              muted
                              playsInline
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                bgcolor: 'rgba(0,0,0,0.5)',
                                borderRadius: '50%',
                                width: 50,
                                height: 50,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <PlayArrow sx={{ color: 'white', fontSize: 30 }} />
                            </Box>
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
                                '& .MuiChip-label': { fontSize: '0.6rem' },
                              }}
                            />
                          </Box>
                        ) : (
                          <CardMedia 
                            component="img" 
                            height="200" 
                            image={mediaUrl} 
                            alt={postContent}
                            sx={{ objectFit: 'cover' }}
                          />
                        )}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No media
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Saved indicator */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: alpha(theme.palette.primary.main, 0.9),
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: theme.shadows[2],
                      }}
                    >
                      <Bookmark sx={{ color: 'white', fontSize: 16 }} />
                    </Box>
                    
                    {/* Username overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 1.5,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                        @{postUser.username}
                      </Typography>
                    </Box>
                    
                    <Box 
                      className="post-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: alpha(theme.palette.common.black, 0.6),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <Visibility sx={{ color: 'white', fontSize: 40 }} />
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                        View Post
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )
      )}
      
      {/* Dialogs */}
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
          <Button onClick={handleUpdateProfile} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog 
        open={profilePicDialogOpen} 
        onClose={() => setProfilePicDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Update Profile Picture</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 2 }}>
            <Avatar 
              src={filePreview || user.profilePic} 
              sx={{ 
                width: 150, 
                height: 150,
                border: `3px solid ${theme.palette.primary.main}`,
              }} 
            />
            
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              sx={{ borderRadius: 2 }}
            >
              Choose Photo
              <Input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileSelect}
              />
            </Button>
            
            {selectedFile && (
              <Typography variant="caption" color="text.secondary">
                Selected: {selectedFile.name}
              </Typography>
            )}
            
            {user.profilePic && (
              <Button
                variant="text"
                color="error"
                onClick={handleRemoveProfilePic}
                disabled={profilePicLoading}
                sx={{ borderRadius: 2 }}
              >
                Remove Current Photo
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfilePicDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUploadProfilePic} 
            variant="contained"
            disabled={!selectedFile || profilePicLoading}
            sx={{ borderRadius: 2 }}
          >
            {profilePicLoading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        slotProps={{
          paper: {
            sx: { borderRadius: 3 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete your account? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={viewPostDialogOpen} 
        onClose={() => setViewPostDialogOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3, overflow: 'hidden' }
          }
        }}
      >
        {selectedPost && (
          <>
            <Box sx={{ position: 'relative', bgcolor: 'black' }}>
              <IconButton
                onClick={() => setViewPostDialogOpen(false)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: alpha(theme.palette.common.black, 0.5),
                  color: 'white',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.black, 0.7),
                  },
                  zIndex: 1,
                }}
              >
                <Close />
              </IconButton>
              
              {isVideoPost(selectedPost) ? (
                <Box sx={{ position: 'relative' }}>
                  <video
                    ref={videoRef}
                    src={selectedPost.mediaUrl || selectedPost.imageUrl}
                    style={{
                      width: '100%',
                      maxHeight: '60vh',
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
                <CardMedia
                  component="img"
                  image={selectedPost.mediaUrl || selectedPost.imageUrl}
                  alt={selectedPost.content || selectedPost.caption}
                  sx={{ 
                    maxHeight: '60vh', 
                    objectFit: 'contain',
                    bgcolor: 'black'
                  }}
                />
              )}
            </Box>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar src={selectedPost.user?.profilePic || user?.profilePic} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {selectedPost.user?.username || user?.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedPost.content || selectedPost.caption}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip 
                  label={`${selectedPost.likesCount || selectedPost.likes?.length || 0} likes`} 
                  size="small"
                  sx={{ borderRadius: 2 }}
                />
                <Chip 
                  label={`${selectedPost.commentsCount || selectedPost.comments?.length || 0} comments`} 
                  size="small"
                  sx={{ borderRadius: 2 }}
                />
              </Box>
              
              <Box 
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  💡 You can like and comment on this post from your home feed
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Dialog>
      
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

export default Profile