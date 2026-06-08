// src/components/Sidebar.jsx - Completely fixed version
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
  Avatar,
  Badge,
} from '@mui/material'
import {
  Home,
  Person,
  AddBox,
  Search,
  People,
  Logout,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, currentUser } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/home' },
    { text: 'Profile', icon: <Person />, path: `/profile/${currentUser?.id}` },
    { text: 'Create Post', icon: <AddBox />, path: '/create-post' },
    { text: 'Search', icon: <Search />, path: '/search' },
    { text: 'Following', icon: <People />, path: '/following' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const drawerContent = (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <img
          src="/amigos.png"
          alt="Amigos"
          style={{
            height: 150,
            width: 'auto',
            transition: 'transform 0.3s ease',
          }}
        />
      </Box>

      {/* User Info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          mb: 2,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
        onClick={() => navigate(`/profile/${currentUser?.id}`)}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          color="success"
        >
          <Avatar src={currentUser?.profileImageUrl} sx={{ width: 48, height: 48 }} />
        </Badge>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {currentUser?.username}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            {currentUser?.fullName}
          </Typography>
        </Box>
      </Box>

      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiListItemText-root .MuiTypography-root': {
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? theme.palette.primary.main : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: isActive ? 600 : 500,
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ my: 2 }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.1),
                '& .MuiListItemIcon-root': {
                  color: theme.palette.error.main,
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  const drawerWidth = 280

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default Sidebar