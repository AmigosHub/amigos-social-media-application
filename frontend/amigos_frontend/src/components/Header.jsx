
// src/components/Header.jsx
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
  Switch,
  FormControlLabel,
  alpha,
  Tooltip,
  Fade
} from '@mui/material'
import { Search, Notifications, DarkMode, LightMode, Add, Menu as MenuIcon } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { currentUser, logout, darkMode, setDarkMode } = useAuth()
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
          onClick={() => navigate('/home')}
        >
          Amigos
        </Typography>
        
        {/* Search Bar - Desktop */}
        {!isMobile && currentUser && (
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
            {/* Theme Toggle */}
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
            
            {/* Notifications */}
            <Tooltip title="Notifications" arrow>
              <IconButton 
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <Badge 
                  badgeContent={3} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      animation: 'pulse 2s infinite',
                    },
                  }}
                >
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* Create Post - Desktop */}
            {!isMobile && (
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
                src={currentUser.profileImageUrl} 
                sx={{ width: 36, height: 36 }}
              />
            </IconButton>
            
            {/* Fixed Menu for MUI v9 - removed TransitionComponent and used slotProps */}
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
              <MenuItem onClick={() => { navigate(`/profile/${currentUser.id}`); handleMenuClose() }}>
                Profile
              </MenuItem>
              {isMobile && (
                <MenuItem onClick={() => { navigate('/create-post'); handleMenuClose() }}>
                  Create Post
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
      
      {/* Mobile Search */}
      {isMobile && currentUser && (
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