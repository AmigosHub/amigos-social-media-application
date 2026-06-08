// src/App.jsx
import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Box, useMediaQuery, useTheme, CircularProgress } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PostProvider } from './context/PostContext'
import { FollowProvider } from './context/FollowContext'
import PrivateRoute from './components/PrivateRoute'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MobileBottomNav from './components/MobileBottomNav'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import Search from './pages/Search'
import Following from './pages/Following'

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
  const { darkMode, loadDummyData, loading: authLoading } = useAuth()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const appTheme = getTheme(darkMode)
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const showSidebar = !isAuthPage
  const showMobileNav = !isAuthPage && isMobile

  useEffect(() => {
    const initData = async () => {
      await loadDummyData()
    }
    initData()
  }, [])

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

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {showSidebar && (
          <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        )}
        
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {!isAuthPage && <Header />}
          
          <Box component="main" sx={{ flexGrow: 1, pb: showMobileNav ? 8 : 0 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
              <Route path="/edit-post/:id" element={<PrivateRoute><EditPost /></PrivateRoute>} />
              <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
              <Route path="/following" element={<PrivateRoute><Following /></PrivateRoute>} />
            </Routes>
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
          <AppContent />
        </FollowProvider>
      </PostProvider>
    </AuthProvider>
  )
}

export default App