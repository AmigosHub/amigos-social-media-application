
// src/components/common/MobileBottomNav.jsx
import { BottomNavigation, BottomNavigationAction, Paper, alpha, useTheme } from '@mui/material'
import { Home, Person, Search, People, AddCircle, Chat as ChatIcon } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAdmin } from '../../context/AdminContext'
import { motion } from 'framer-motion'

const MobileBottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const { isAdmin } = useAdmin()
  const theme = useTheme()

  // Admin users don't see mobile bottom nav
  if (isAdmin) {
    return null
  }

  const getValue = () => {
    if (location.pathname === '/home') return 0
    if (location.pathname === `/profile/${currentUser?.id}` || location.pathname === '/profile') return 1
    if (location.pathname === '/create-post') return 2
    if (location.pathname === '/following') return 3
    if (location.pathname === '/chat') return 4
    return 0
  }

  const navItems = [
    { label: 'Home', icon: <Home />, path: '/home', value: 0 },
    { label: 'Profile', icon: <Person />, path: currentUser?.id ? `/profile/${currentUser.id}` : '/profile', value: 1 },
    { label: 'Create', icon: <AddCircle />, path: '/create-post', value: 2 },
    { label: 'People', icon: <People />, path: '/following', value: 3 },
    { label: 'Messages', icon: <ChatIcon />, path: '/chat', value: 4 },
  ]

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', sm: 'none' },
        bgcolor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
      elevation={0}
    >
      <BottomNavigation
        value={getValue()}
        onChange={(event, newValue) => {
          const item = navItems.find(i => i.value === newValue)
          if (item) navigate(item.path)
        }}
        sx={{
          height: 65,
          '& .Mui-selected': {
            color: theme.palette.primary.main,
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
            },
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            icon={
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                {item.icon}
              </motion.div>
            }
            value={item.value}
            sx={{
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.7rem',
                transition: 'all 0.2s ease',
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}

export default MobileBottomNav