
// src/components/admin/AdminLayout.jsx
import React, { useState, useCallback } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

const AdminLayout = React.memo(({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen)
  }, [mobileOpen])

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader onMenuClick={handleDrawerToggle} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3 },
            bgcolor: 'background.default',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
})

export default AdminLayout