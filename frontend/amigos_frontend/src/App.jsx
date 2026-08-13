
// src/App.jsx
import { useState, Suspense, lazy } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Box, useMediaQuery, useTheme, CircularProgress } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PostProvider } from './context/PostContext'
import { FollowProvider } from './context/FollowContext'
import { ChatProvider } from './context/ChatContext'
import { NotificationProvider } from './context/NotificationContext'
import { AdminProvider, useAdmin } from './context/AdminContext'
import PrivateRoute from './components/common/PrivateRoute'
import Header from './components/common/Header'
import Sidebar from './components/common/Sidebar'
import MobileBottomNav from './components/common/MobileBottomNav'
import LoadingSpinner from './components/common/LoadingSpinner'

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Home = lazy(() => import('./pages/Home'))
const Profile = lazy(() => import('./pages/Profile'))
const CreatePost = lazy(() => import('./pages/CreatePost'))
const EditPost = lazy(() => import('./pages/EditPost'))
const Search = lazy(() => import('./pages/Search'))
const Following = lazy(() => import('./pages/Following'))
const Chat = lazy(() => import('./pages/Chat'))
const Notifications = lazy(() => import('./pages/Notifications'))
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'))

// Create theme based on dark mode
const getTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: '#4F46E5',
      light: '#818CF8',
      dark: '#4338CA',
    },
    secondary: {
      main: '#14B8A6',
      light: '#5EEAD4',
      dark: '#0F766E',
    },
    background: {
      default: darkMode ? '#0F172A' : '#F8FAFC',
      paper: darkMode ? '#1E293B' : '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
  },
})

function AppContent() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { darkMode, loading: authLoading, currentUser } = useAuth()
  const { isAdmin } = useAdmin()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const appTheme = getTheme(darkMode)
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const isAdminPage = location.pathname.startsWith('/admin')
  
  const showSidebar = !isAuthPage && !isAdminPage
  const showMobileNav = !isAuthPage && !isAdminPage && isMobile

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Admin redirect logic
  if (currentUser && isAdmin && !isAdminPage && !isAuthPage) {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (currentUser && !isAdmin && isAdminPage) {
    return <Navigate to="/home" replace />
  }

  if (currentUser && isAuthPage) {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />
    } else {
      return <Navigate to="/home" replace />
    }
  }

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {showSidebar && (
          <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        )}
        
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {!isAuthPage && !isAdminPage && <Header />}
          
          <Box component="main" sx={{ flexGrow: 1, pb: showMobileNav ? 8 : 0 }}>
            <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
                <Route path="/edit-post/:id" element={<PrivateRoute><EditPost /></PrivateRoute>} />
                <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
                <Route path="/following" element={<PrivateRoute><Following /></PrivateRoute>} />
                <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                <Route path="/admin/*" element={<PrivateRoute><AdminRoutes /></PrivateRoute>} />
              </Routes>
            </Suspense>
          </Box>
          
          {showMobileNav && <MobileBottomNav />}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <FollowProvider>
          <NotificationProvider>
            <ChatProvider>
              <AdminProvider>
                <AppContent />
              </AdminProvider>
            </ChatProvider>
          </NotificationProvider>
        </FollowProvider>
      </PostProvider>
    </AuthProvider>
  )
}

export default App