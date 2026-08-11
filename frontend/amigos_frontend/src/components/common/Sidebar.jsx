
// src/components/common/Sidebar.jsx
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
  Chat as ChatIcon,
  Dashboard,
  Flag,
  Analytics,
  AdminPanelSettings,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAdmin } from '../../context/AdminContext'

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, currentUser } = useAuth()
  const { isAdmin } = useAdmin()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Different menu items based on user role
  const userMenuItems = [
    { text: 'Home', icon: <Home />, path: '/home' },
    { text: 'Profile', icon: <Person />, path: currentUser?.id ? `/profile/${currentUser.id}` : '/profile' },
    { text: 'Create Post', icon: <AddBox />, path: '/create-post' },
    { text: 'Search', icon: <Search />, path: '/search' },
    { text: 'Messages', icon: <ChatIcon />, path: '/chat' },
    { text: 'Following', icon: <People />, path: '/following' },
  ]

  const adminMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Users', icon: <People />, path: '/admin/users' },
    { text: 'Reports', icon: <Flag />, path: '/admin/reports' },
    { text: 'Analytics', icon: <Analytics />, path: '/admin/analytics' },
  ]

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

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
            height: isAdmin ? 100 : 150,
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
        onClick={() => {
          if (isAdmin) {
            navigate('/admin/dashboard')
          } else if (currentUser?.id) {
            navigate(`/profile/${currentUser.id}`)
          } else {
            navigate('/home')
          }
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          color="success"
        >
          <Avatar src={currentUser?.profilePic} sx={{ width: 48, height: 48 }} />
        </Badge>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {currentUser?.username}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            {isAdmin ? 'Administrator' : currentUser?.fullName}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Navigation Menu */}
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/profile' && location.pathname.startsWith('/profile/'))
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

      {/* Logout */}
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