
// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  People,
  PostAdd,
  Flag,
  Chat,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material'
import { useAdmin } from '../../context/AdminContext'
import DashboardStats from '../../components/admin/DashboardStats'
import DashboardCharts from '../../components/admin/DashboardCharts'
import AdminSkeleton from '../../components/admin/AdminSkeleton'

const AdminDashboard = React.memo(() => {
  const theme = useTheme()
  const { loadDashboardStats, dashboardStats, loading } = useAdmin()
  const [error, setError] = useState(null)
  const [activityData, setActivityData] = useState([])
  const [growthData, setGrowthData] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      await loadDashboardStats()
      // Load activity and growth data would be separate API calls
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data. Please make sure the .NET API is running on port 5000.')
    }
  }

  const stats = useMemo(() => {
    if (!dashboardStats) return []
    return [
      {
        title: 'Total Users',
        value: dashboardStats.users?.totalUsers || 0,
        icon: <People sx={{ fontSize: 32 }} />,
        color: '#4F46E5',
        growth: dashboardStats.users?.userGrowthPercentage || 0,
      },
      {
        title: 'Total Posts',
        value: dashboardStats.posts?.totalPosts || 0,
        icon: <PostAdd sx={{ fontSize: 32 }} />,
        color: '#14B8A6',
        growth: dashboardStats.posts?.postGrowthPercentage || 0,
      },
      {
        title: 'Total Reports',
        value: dashboardStats.reports?.totalReports || 0,
        icon: <Flag sx={{ fontSize: 32 }} />,
        color: '#EF4444',
        growth: 0,
      },
      {
        title: 'Messages',
        value: dashboardStats.chat?.totalMessages || 0,
        icon: <Chat sx={{ fontSize: 32 }} />,
        color: '#F59E0B',
        growth: 0,
      },
    ]
  }, [dashboardStats])

  if (loading) {
    return <AdminSkeleton />
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
            Error Loading Dashboard
          </Typography>
          <Typography variant="body2">{error}</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Please ensure:
              <br />
              1. .NET Admin API is running on port 5000
              <br />
              2. You have admin privileges
              <br />
              3. Your JWT token is valid
            </Typography>
          </Box>
        </Alert>
      </Box>
    )
  }

  if (!dashboardStats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="body1" color="text.secondary">
          No dashboard data available
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stat.value.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  {stat.growth > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                      <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="caption" color="success.main">
                        {stat.growth}% growth
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: alpha(stat.color, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <DashboardCharts />
    </Box>
  )
})

export default AdminDashboard