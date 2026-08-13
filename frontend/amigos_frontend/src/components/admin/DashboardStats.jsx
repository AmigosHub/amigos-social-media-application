
// src/components/admin/DashboardStats.jsx
import React from 'react'
import { Grid, Paper, Typography, Box, useTheme, alpha } from '@mui/material'
import {
  People,
  PostAdd,
  Flag,
  Chat,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

// Memoized Stat Card Component
const StatCard = React.memo(({ stat }) => {
  const theme = useTheme()

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 12,
          },
        },
      }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[4],
            borderColor: alpha(stat.color, 0.3),
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                color: theme.palette.text.primary,
              }}
            >
              {stat.value.toLocaleString()}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                mt: 0.5,
              }}
            >
              {stat.title}
            </Typography>
            {stat.subtext && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  display: 'block',
                  mt: 0.5,
                }}
              >
                {stat.subtext}
              </Typography>
            )}
            {stat.growth > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  {stat.growth}% growth
                </Typography>
              </Box>
            )}
            {stat.growth < 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
                  {Math.abs(stat.growth)}% decline
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
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                bgcolor: alpha(stat.color, 0.2),
              },
            }}
          >
            {stat.icon}
          </Box>
        </Box>
      </Paper>
    </motion.div>
  )
})

const DashboardStats = React.memo(({ stats }) => {
  const theme = useTheme()

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users?.totalUsers || 0,
      icon: <People sx={{ fontSize: 32 }} />,
      color: '#4F46E5',
      growth: stats?.users?.userGrowthPercentage || 0,
      subtext: `${stats?.users?.activeUsers || 0} active`,
    },
    {
      title: 'Total Posts',
      value: stats?.posts?.totalPosts || 0,
      icon: <PostAdd sx={{ fontSize: 32 }} />,
      color: '#14B8A6',
      growth: stats?.posts?.postGrowthPercentage || 0,
      subtext: `${stats?.posts?.newPostsToday || 0} new today`,
    },
    {
      title: 'Total Reports',
      value: stats?.reports?.totalReports || 0,
      icon: <Flag sx={{ fontSize: 32 }} />,
      color: '#EF4444',
      growth: 0,
      subtext: `${stats?.reports?.pendingReports || 0} pending`,
    },
    {
      title: 'Messages',
      value: stats?.chat?.totalMessages || 0,
      icon: <Chat sx={{ fontSize: 32 }} />,
      color: '#F59E0B',
      growth: 0,
      subtext: `${stats?.chat?.activeConversations || 0} active chats`,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <StatCard stat={stat} />
          </Grid>
        ))}
      </Grid>
    </motion.div>
  )
})

export default DashboardStats