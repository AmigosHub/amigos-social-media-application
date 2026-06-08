// src/pages/Search.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Container,
  TextField,
  InputAdornment,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  alpha,
  useTheme
} from '@mui/material'
import { Search as SearchIcon, People } from '@mui/icons-material'
import UserCard from '../components/UserCard'
import axios from '../api/axios'
import { useAuth } from '../context/AuthContext'

const Search = () => {
  const [searchParams] = useSearchParams()
  const { currentUser } = useAuth()
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      setLoading(true)
      setError('')
      const timeout = setTimeout(() => {
        try {
          console.log('Searching for:', searchQuery)
          console.log('Available users:', users)
          
          const filtered = users.filter(user => {
            // Don't show current user in search results
            if (user.id === currentUser?.id) return false
            
            // Search by username or full name
            const usernameMatch = user.username?.toLowerCase().includes(searchQuery.toLowerCase())
            const fullNameMatch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
            
            return usernameMatch || fullNameMatch
          })
          
          console.log('Filtered users:', filtered)
          setFilteredUsers(filtered)
        } catch (err) {
          console.error('Error filtering users:', err)
          setError('Error searching users')
        } finally {
          setLoading(false)
        }
      }, 300)
      return () => clearTimeout(timeout)
    } else {
      setFilteredUsers([])
    }
  }, [searchQuery, users, currentUser])

  const loadUsers = async () => {
    try {
      setInitialLoading(true)
      const allUsers = (await axios.get('/users')).data
      console.log('All users loaded:', allUsers)
      setUsers(allUsers)
      setError('')
    } catch (err) {
      console.error('Error loading users:', err)
      setError('Error loading users. Please refresh the page.')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleFollowChange = async () => {
    // Reload users to update follow status
    await loadUsers()
  }

  if (initialLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper 
        sx={{ 
          p: 2, 
          mb: 3,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by username or full name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }
          }}
          autoFocus
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.common.white, 0.05),
            },
          }}
        />
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {!loading && searchQuery && filteredUsers.length === 0 && (
        <Paper 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No users match "{searchQuery}". Try a different search term.
          </Typography>
        </Paper>
      )}
      
      {!loading && filteredUsers.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Search Results ({filteredUsers.length})
          </Typography>
          
          {filteredUsers.map(user => (
            <UserCard 
              key={user.id} 
              user={user} 
              onFollowChange={handleFollowChange}
            />
          ))}
        </Box>
      )}
      
      {!searchQuery && !initialLoading && (
        <Paper 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <People sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Find Friends
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search for users by their username or full name to connect with them
          </Typography>
        </Paper>
      )}
    </Container>
  )
}

export default Search