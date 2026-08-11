// // src/components/admin/AdminSidebar.jsx
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Box,
//   Divider,
//   Typography,
//   useTheme,
//   alpha,
//   Avatar,
//   Tooltip,
// } from '@mui/material'
// import {
//   Dashboard,
//   People,
//   Flag,
//   Analytics,
//   Logout,
//   AdminPanelSettings,
// } from '@mui/icons-material'
// import { useNavigate, useLocation } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'

// const AdminSidebar = ({ mobileOpen, handleDrawerToggle, isMobile }) => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { logout, currentUser } = useAuth()
//   const theme = useTheme()

//   const menuItems = [
//     { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
//     { text: 'Users', icon: <People />, path: '/admin/users' },
//     { text: 'Reports', icon: <Flag />, path: '/admin/reports' },
//     { text: 'Analytics', icon: <Analytics />, path: '/admin/analytics' },
//   ]

//   const handleLogout = () => {
//     logout()
//     navigate('/admin/login')
//   }

//   const drawerContent = (
//     <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
//       {/* Logo */}
//       <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
//         <Typography
//           variant="h5"
//           sx={{
//             fontWeight: 800,
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             backgroundClip: 'text',
//             WebkitBackgroundClip: 'text',
//             color: 'transparent',
//             cursor: 'pointer',
//           }}
//           onClick={() => navigate('/admin/dashboard')}
//         >
//           Admin Panel
//         </Typography>
//       </Box>

//       {/* Admin Info */}
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: 2,
//           p: 2,
//           mb: 2,
//           borderRadius: 3,
//           bgcolor: alpha(theme.palette.primary.main, 0.05),
//         }}
//       >
//         <Avatar src={currentUser?.profilePic} sx={{ width: 48, height: 48 }}>
//           <AdminPanelSettings />
//         </Avatar>
//         <Box>
//           <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
//             {currentUser?.username}
//           </Typography>
//           <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
//             Administrator
//           </Typography>
//         </Box>
//       </Box>

//       <Divider sx={{ mb: 2 }} />

//       {/* Navigation Menu */}
//       <List sx={{ flex: 1 }}>
//         {menuItems.map((item) => {
//           const isActive = location.pathname === item.path
//           return (
//             <ListItem key={item.text} disablePadding>
//               <ListItemButton
//                 onClick={() => navigate(item.path)}
//                 selected={isActive}
//                 sx={{
//                   borderRadius: 2,
//                   mb: 0.5,
//                   '&.Mui-selected': {
//                     bgcolor: alpha(theme.palette.primary.main, 0.1),
//                     '& .MuiListItemIcon-root': {
//                       color: theme.palette.primary.main,
//                     },
//                     '& .MuiListItemText-root .MuiTypography-root': {
//                       color: theme.palette.primary.main,
//                       fontWeight: 600,
//                     },
//                   },
//                   '&:hover': {
//                     bgcolor: alpha(theme.palette.primary.main, 0.08),
//                   },
//                 }}
//               >
//                 <ListItemIcon sx={{ minWidth: 40, color: isActive ? theme.palette.primary.main : 'inherit' }}>
//                   {item.icon}
//                 </ListItemIcon>
//                 <ListItemText primary={item.text} />
//               </ListItemButton>
//             </ListItem>
//           )
//         })}
//       </List>

//       <Divider sx={{ my: 2 }} />

//       {/* Logout */}
//       <List>
//         <ListItem disablePadding>
//           <ListItemButton
//             onClick={handleLogout}
//             sx={{
//               borderRadius: 2,
//               '&:hover': {
//                 bgcolor: alpha(theme.palette.error.main, 0.1),
//                 '& .MuiListItemIcon-root': {
//                   color: theme.palette.error.main,
//                 },
//               },
//             }}
//           >
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               <Logout />
//             </ListItemIcon>
//             <ListItemText primary="Logout" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Box>
//   )

//   const drawerWidth = 280

//   return (
//     <Drawer
//       variant={isMobile ? 'temporary' : 'permanent'}
//       open={isMobile ? mobileOpen : true}
//       onClose={handleDrawerToggle}
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         '& .MuiDrawer-paper': {
//           width: drawerWidth,
//           boxSizing: 'border-box',
//           borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//           bgcolor: theme.palette.background.paper,
//         },
//       }}
//     >
//       {drawerContent}
//     </Drawer>
//   )
// }

// export default AdminSidebar

// src/components/admin/AdminSidebar.jsx
import React from 'react'
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
  useTheme,
  alpha,
  Avatar,
  Tooltip,
} from '@mui/material'
import {
  Dashboard,
  People,
  Flag,
  Analytics,
  Logout,
  AdminPanelSettings,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Memoized Menu Item - FIXED: Moved useTheme inside component
const MenuItem = React.memo(({ item, isActive, navigate }) => {
  const theme = useTheme() // useTheme called inside component, not at top level
  
  return (
    <ListItem disablePadding>
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
        <ListItemText primary={item.text} />
      </ListItemButton>
    </ListItem>
  )
})

const AdminSidebar = React.memo(({ mobileOpen, handleDrawerToggle, isMobile }) => {
  // ✅ ALL HOOKS MUST BE CALLED AT THE TOP LEVEL, BEFORE ANY CONDITIONAL RETURNS
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, currentUser } = useAuth()
  const theme = useTheme()

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Users', icon: <People />, path: '/admin/users' },
    { text: 'Reports', icon: <Flag />, path: '/admin/reports' },
    { text: 'Analytics', icon: <Analytics />, path: '/admin/analytics' },
  ]

  const handleLogout = React.useCallback(() => {
    logout()
    navigate('/admin/login')
  }, [logout, navigate])

  // ✅ No conditional returns before hooks are called
  // The drawer content is defined after all hooks

  const drawerContent = (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo - Amigos Image */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 3,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/admin/dashboard')}
      >
        <img
          src="/amigos.png"
          alt="Amigos"
          style={{
            height: 120,
            width: 'auto',
            transition: 'transform 0.3s ease',
          }}
        />
      </Box>

      {/* Admin Info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          mb: 2,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
        }}
      >
        <Avatar src={currentUser?.profilePic} sx={{ width: 48, height: 48 }}>
          <AdminPanelSettings />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {currentUser?.username}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            Administrator
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Navigation Menu */}
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <MenuItem 
              key={item.text} 
              item={item} 
              isActive={isActive} 
              navigate={navigate}
            />
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

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : true}
      onClose={handleDrawerToggle}
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
})

export default AdminSidebar