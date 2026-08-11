// src/components/user/UserSearch.jsx
import { useState } from 'react'
import { TextField, InputAdornment, Paper, Box, useTheme, alpha } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'

const UserSearch = ({ onSearch, placeholder = 'Search users...' }) => {
  const theme = useTheme()
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
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
        placeholder={placeholder}
        value={query}
        onChange={handleSearch}
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
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.common.white, 0.05),
          },
        }}
      />
    </Paper>
  )
}

export default UserSearch