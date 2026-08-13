// src/components/admin/AdminHeader.jsx
import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, useTheme, alpha } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'

const AdminHeader = React.memo(({ onMenuClick }) => {
  const theme = useTheme()

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' }, mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Admin Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  )
})

export default AdminHeader