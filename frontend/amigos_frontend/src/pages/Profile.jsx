// src/pages/Profile.jsx
import { useState, useEffect } from 'react'
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
  Divider,
  alpha,
  useTheme,
  Tooltip
} from '@mui/material'
import { Edit, Delete, Close, Visibility } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useFollow } from '../context/FollowContext'
import { usePosts } from '../context/PostContext'
import axios from '../api/axios'

const Profile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const { currentUser, updateUser, deleteUser } = useAuth()
  const { followUser, unfollowUser, isFollowing } = useFollow()
  const { posts, loadPosts } = usePosts()
  const [user, setUser] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [userPosts, setUserPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [viewPostDialogOpen, setViewPostDialogOpen] = useState(false)

  const isOwnProfile = currentUser?.id === id
  const following = isFollowing(id)

  useEffect(() => {
    loadUser()
    loadPosts()
  }, [id, currentUser])

  useEffect(() => {
    if (posts.length > 0) {
      setUserPosts(posts.filter(post => post.userId === id))
    }
  }, [posts, id])

  const loadUser = async () => {
    const users = (await axios.get('/users')).data
    const foundUser = users.find(u => u.id === id)
    if (foundUser) {
      setUser(foundUser)
      setEditForm(foundUser)
    } else {
      navigate('/home')
    }
  }

  const handleFollowToggle = async () => {
    if (following) {
      await unfollowUser(id)
    } else {
      await followUser(id)
    }
    await loadUser()
  }

  const handleUpdateProfile = async () => {
    await updateUser(editForm)
    setEditDialogOpen(false)
    await loadUser()
  }

  const handleDeleteAccount = async () => {
    await deleteUser()
    navigate('/login')
  }

  const handlePostClick = (post) => {
    if (isOwnProfile) {
      // If it's the user's own profile, allow editing
      navigate(`/edit-post/${post.id}`)
    } else {
      // If viewing another user's profile, just view the post (no edit)
      setSelectedPost(post)
      setViewPostDialogOpen(true)
    }
  }

  if (!user) return null

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
          <Avatar 
            src={user.profileImageUrl} 
            sx={{ 
              width: 120, 
              height: 120,
              border: `3px solid ${theme.palette.primary.main}`,
            }} 
          />
          
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              {user.username}
            </Typography>
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
                label={`${userPosts.length} posts`} 
                sx={{ borderRadius: 2 }}
              />
              <Chip 
                label={`${user.followers?.length || 0} followers`} 
                sx={{ borderRadius: 2 }}
              />
              <Chip 
                label={`${user.following?.length || 0} following`} 
                sx={{ borderRadius: 2 }}
              />
            </Box>
            
            {isOwnProfile ? (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
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
              </Box>
            ) : (
              <Button
                variant={following ? 'outlined' : 'contained'}
                onClick={handleFollowToggle}
                sx={{ borderRadius: 2 }}
              >
                {following ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
        Posts
      </Typography>
      
      {userPosts.length === 0 ? (
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
          {userPosts.map(post => (
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
                <CardMedia 
                  component="img" 
                  height="200" 
                  image={post.imageUrl} 
                  alt={post.caption}
                  sx={{ objectFit: 'cover' }}
                />
                
                {/* Overlay for non-own posts - shows "View" instead of "Edit" */}
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
                
                {/* Edit badge for own posts */}
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
          ))}
        </Grid>
      )}
      
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
          <TextField
            fullWidth
            label="Profile Image URL"
            value={editForm.profileImageUrl || ''}
            onChange={(e) => setEditForm({ ...editForm, profileImageUrl: e.target.value })}
            margin="normal"
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
      
      {/* Delete Account Dialog */}
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

      {/* View Post Dialog - For viewing other users' posts (read-only) */}
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
              <CardMedia
                component="img"
                image={selectedPost.imageUrl}
                alt={selectedPost.caption}
                sx={{ 
                  maxHeight: '60vh', 
                  objectFit: 'contain',
                  bgcolor: 'black'
                }}
              />
            </Box>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar src={user?.profileImageUrl} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {user?.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedPost.caption}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip 
                  label={`${selectedPost.likes?.length || 0} likes`} 
                  size="small"
                  sx={{ borderRadius: 2 }}
                />
                <Chip 
                  label={`${selectedPost.comments?.length || 0} comments`} 
                  size="small"
                  sx={{ borderRadius: 2 }}
                />
              </Box>
              
              {/* Show a message that you can't edit this post */}
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
    </Container>
  )
}

export default Profile