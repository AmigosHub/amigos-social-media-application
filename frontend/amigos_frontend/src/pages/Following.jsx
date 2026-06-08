

// src/pages/Following.jsx
import { useState, useEffect } from 'react'
import { Container, Typography, Box, CircularProgress } from '@mui/material'
import UserCard from '../components/UserCard'
import { useAuth } from '../context/AuthContext'
import axios from '../api/axios'

const Following = () => {
  const { currentUser } = useAuth()
  const [followingUsers, setFollowingUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser?.following) {
      loadFollowingUsers()
    } else {
      setLoading(false)
    }
  }, [currentUser])

  const loadFollowingUsers = async () => {
    setLoading(true)
    const allUsers = (await axios.get('/users')).data
    const following = allUsers.filter(user => currentUser.following?.includes(user.id))
    setFollowingUsers(following)
    setLoading(false)
  }

  const handleFollowChange = () => {
    loadFollowingUsers()
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (followingUsers.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Not following anyone yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search for users to follow and see their posts in your feed!
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Following ({followingUsers.length})
      </Typography>
      
      {followingUsers.map(user => (
        <UserCard key={user.id} user={user} onFollowChange={handleFollowChange} />
      ))}
    </Container>
  )
}

export default Following