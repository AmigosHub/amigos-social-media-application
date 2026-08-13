
// src/pages/Login.jsx
import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login, currentUser } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      console.log('[Login] Current user:', currentUser)
      console.log('[Login] User role:', currentUser.role)
      
      if (currentUser.role === 'ADMIN') {
        console.log('[Login] Redirecting to admin dashboard')
        navigate('/admin/dashboard')
      } else {
        console.log('[Login] Redirecting to home')
        navigate('/home')
      }
    }
  }, [currentUser, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const user = await login(formData.email, formData.password)
      console.log('[Login] User object:', user)
      console.log('[Login] User role:', user?.role)
      
      // The login function now returns the user object directly
      // The useEffect will handle the redirect based on currentUser
      // No need to manually redirect here
    } catch (err) {
      console.error('[Login] Login error:', err)
      setError(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <div style={{ textAlign: "center" }}>
            <img src="/amigos.png" alt="Amigos" height={150}/>
          </div>
          
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Welcome Back
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
            
            <Typography align="center">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register">
                Sign up
              </Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login