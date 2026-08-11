
// src/components/common/Header.jsx
import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  TextField,
  InputAdornment,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  alpha,
  Tooltip,
  Chip,
} from '@mui/material'
import { 
  Search, 
  Notifications, 
  DarkMode, 
  LightMode, 
  Add, 
  Chat as ChatIcon 
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { useChat } from '../../context/ChatContext'
import { useAdmin } from '../../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { currentUser, logout, darkMode, setDarkMode } = useAuth()
  const { unreadCount: notificationUnreadCount } = useNotifications()
  const { unreadCount: chatUnreadCount } = useChat()
  const { isAdmin } = useAdmin()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [anchorEl, setAnchorEl] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`)
      setSearchQuery('')
    }
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    handleMenuClose()
  }

  // Helper function to navigate to profile safely
  const navigateToProfile = () => {
    if (currentUser?.id) {
      navigate(`/profile/${currentUser.id}`)
    } else {
      navigate('/home')
    }
    handleMenuClose()
  }

  // Helper function to navigate to admin dashboard
  const navigateToAdmin = () => {
    navigate('/admin/dashboard')
    handleMenuClose()
  }

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.95)
          : alpha(theme.palette.background.paper, 0.98),
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Logo */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            cursor: 'pointer',
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
            letterSpacing: '-0.5px',
            '&:hover': {
              transform: 'scale(1.02)',
              transition: 'transform 0.2s ease',
            },
          }}
          onClick={() => isAdmin ? navigate('/admin/dashboard') : navigate('/home')}
        >
          Amigos
        </Typography>
        
        {/* Search Bar - Desktop - Only for non-admin users */}
        {!isMobile && currentUser && !isAdmin && (
          <Box 
            component="form" 
            onSubmit={handleSearch} 
            sx={{ 
              flex: 1, 
              maxWidth: 500, 
              mx: 3,
              transition: 'all 0.3s ease',
              transform: searchFocused ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  backgroundColor: alpha(theme.palette.common.white, 0.05),
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                  '&.Mui-focused': {
                    backgroundColor: alpha(theme.palette.common.white, 0.12),
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                  sx: { py: 0.5 }
                }
              }}
            />
          </Box>
        )}
        
        {/* Right Section */}
        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Messages - Desktop - Only for non-admin users */}
            {!isMobile && !isAdmin && (
              <Tooltip title="Messages" arrow>
                <IconButton
                  onClick={() => navigate('/chat')}
                  sx={{
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Badge 
                    badgeContent={chatUnreadCount} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        animation: chatUnreadCount > 0 ? 'pulse 2s infinite' : 'none',
                      },
                    }}
                  >
                    <ChatIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {/* Theme Toggle - Always visible */}
            <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'} arrow>
              <IconButton 
                onClick={() => setDarkMode(!darkMode)}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
            
            {/* Notifications - Only for non-admin users */}
            {!isAdmin && (
              <Tooltip title="Notifications" arrow>
                <IconButton 
                  onClick={() => navigate('/notifications')}
                  sx={{
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Badge 
                    badgeContent={notificationUnreadCount} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        animation: notificationUnreadCount > 0 ? 'pulse 2s infinite' : 'none',
                      },
                    }}
                  >
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}
            
            {/* Create Post - Desktop - Only for non-admin users */}
            {!isMobile && !isAdmin && (
              <Tooltip title="Create Post" arrow>
                <IconButton
                  onClick={() => navigate('/create-post')}
                  sx={{
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Add />
                </IconButton>
              </Tooltip>
            )}
            
            {/* User Menu */}
            <IconButton 
              onClick={handleMenuOpen}
              sx={{
                p: 0.5,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                borderRadius: 3,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Avatar 
                src={currentUser?.profilePic} 
                sx={{ width: 36, height: 36 }}
              />
            </IconButton>
            
            {/* Menu - Shows different options for admin vs user */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1.5,
                    borderRadius: 3,
                    minWidth: 200,
                    boxShadow: theme.shadows[3],
                  },
                },
              }}
            >
              {isAdmin ? (
                // Admin Menu Items
                <MenuItem onClick={navigateToAdmin}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Admin Dashboard</span>
                  </Box>
                </MenuItem>
              ) : (
                // User Menu Items
                <>
                  <MenuItem onClick={navigateToProfile}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/notifications'); handleMenuClose() }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span>Notifications</span>
                      {notificationUnreadCount > 0 && (
                        <Chip 
                          label={notificationUnreadCount} 
                          size="small" 
                          color="primary"
                          sx={{ ml: 1, height: 20, fontSize: '0.65rem' }}
                        />
                      )}
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/chat'); handleMenuClose() }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span>Messages</span>
                      {chatUnreadCount > 0 && (
                        <Chip 
                          label={chatUnreadCount} 
                          size="small" 
                          color="primary"
                          sx={{ ml: 1, height: 20, fontSize: '0.65rem' }}
                        />
                      )}
                    </Box>
                  </MenuItem>
                  {isMobile && (
                    <MenuItem onClick={() => { navigate('/create-post'); handleMenuClose() }}>
                      Create Post
                    </MenuItem>
                  )}
                </>
              )}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
      
      {/* Mobile Search - Only for non-admin users */}
      {isMobile && currentUser && !isAdmin && (
        <Box sx={{ px: 2, pb: 2 }}>
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 30,
                  backgroundColor: alpha(theme.palette.common.white, 0.05),
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </form>
        </Box>
      )}
    </AppBar>
  )
}

export default Header