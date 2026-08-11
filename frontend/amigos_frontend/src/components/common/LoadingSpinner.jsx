// src/components/common/LoadingSpinner.jsx
import { Box, CircularProgress, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material'

const LoadingSpinner = ({ message = 'Loading...', fullScreen = false }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: fullScreen ? '100vh' : '200px',
        p: 3,
      }}
    >
      <CircularProgress 
        size={48}
        sx={{
          color: theme.palette.primary.main,
        }}
      />
      <Typography 
        variant="body2" 
        sx={{ 
          color: theme.palette.text.secondary,
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </Box>
  )
}

export default LoadingSpinner