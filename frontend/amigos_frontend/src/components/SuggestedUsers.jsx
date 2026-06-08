// src/components/SuggestedUsers.jsx
import { useState, useEffect } from 'react'
import { Box, Typography, Avatar, Button, Paper, useTheme, alpha, IconButton } from '@mui/material'
import { Close, PersonAdd } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import axios from '../api/axios'

const SuggestedUsers = () => {
  const { currentUser } = useAuth()
  const theme = useTheme()
  const [suggestedUsers, setSuggestedUsers] = useState([])

  useEffect(() => {
    loadSuggestedUsers()
  }, [currentUser])

  const loadSuggestedUsers = async () => {
    const allUsers = (await axios.get('/users')).data
    const suggested = allUsers
      .filter(user => user.id !== currentUser?.id && !currentUser?.following?.includes(user.id))
      .slice(0, 5)
    setSuggestedUsers(suggested)
  }

  const removeSuggestion = (userId) => {
    setSuggestedUsers(prev => prev.filter(user => user.id !== userId))
  }

  if (suggestedUsers.length === 0) return null

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        mt: 2,
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
        Suggested for you
      </Typography>

      {suggestedUsers.map((user) => (
        <Box
          key={user.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateX(4px)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar src={user.profileImageUrl} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user.username}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {user.fullName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Button
              size="small"
              variant="contained"
              startIcon={<PersonAdd sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontSize: 12,
                py: 0.5,
              }}
            >
              Follow
            </Button>
            <IconButton size="small" onClick={() => removeSuggestion(user.id)}>
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Paper>
  )
}

export default SuggestedUsers