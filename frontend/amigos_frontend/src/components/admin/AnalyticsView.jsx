// src/components/admin/AnalyticsView.jsx
import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material'
import {
  People,
  PostAdd,
  Comment,
  Chat,
  Flag,
  TrendingUp,
} from '@mui/icons-material'
import { useAdmin } from '../../context/AdminContext'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { motion } from 'framer-motion'
import ChartSkeleton from './ChartSkeleton'

// Memoized Stat Card Component
const StatCard = React.memo(({ stat }) => {
  const theme = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
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
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stat.value.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stat.title}
            </Typography>
            {stat.growth > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  {stat.growth}% growth
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
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

// Memoized Chart Section
const ChartSection = React.memo(({ title, children, height = 300 }) => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ height }}>
        {children}
      </Box>
    </Paper>
  )
})

const AnalyticsView = React.memo(() => {
  const theme = useTheme()
  const { loadAnalytics, analytics, loading } = useAdmin()

  const isDarkMode = theme.palette.mode === 'dark'
  const chartTextColor = isDarkMode ? '#94A3B8' : '#64748B'
  const chartGridColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'

  const chartColors = {
    users: '#4F46E5',
    posts: '#14B8A6',
    comments: '#F59E0B',
    messages: '#8B5CF6',
    reports: '#EF4444',
    likes: '#EC4899',
    pending: '#F59E0B',
    resolved: '#10B981',
    dismissed: '#EF4444',
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  if (loading || !analytics) {
    return <ChartSkeleton />
  }

  const userData = analytics.users || {}
  const postData = analytics.posts || {}
  const commentData = analytics.comments || {}
  const messageData = analytics.messages || {}
  const reportData = analytics.reports || {}

  // Prepare chart data from real API data
  const userGrowthData = useMemo(() => 
    userData.userGrowthTrend || [
      { month: 'Jan', users: userData.totalUsers || 0 },
      { month: 'Feb', users: userData.totalUsers || 0 },
      { month: 'Mar', users: userData.totalUsers || 0 },
      { month: 'Apr', users: userData.totalUsers || 0 },
      { month: 'May', users: userData.totalUsers || 0 },
      { month: 'Jun', users: userData.totalUsers || 0 },
    ],
    [userData]
  )

  const postActivityData = useMemo(() =>
    postData.postActivityTrend || [
      { month: 'Jan', posts: postData.totalPosts || 0 },
      { month: 'Feb', posts: postData.totalPosts || 0 },
      { month: 'Mar', posts: postData.totalPosts || 0 },
      { month: 'Apr', posts: postData.totalPosts || 0 },
      { month: 'May', posts: postData.totalPosts || 0 },
      { month: 'Jun', posts: postData.totalPosts || 0 },
    ],
    [postData]
  )

  const reportStatusData = useMemo(() => [
    { status: 'Pending', count: reportData.pendingReports || 0 },
    { status: 'Resolved', count: reportData.resolvedReports || 0 },
    { status: 'Dismissed', count: reportData.dismissedReports || 0 },
  ], [reportData])

  const mediaTypeData = postData.postsByMediaType || {}
  const mediaTypeChartData = useMemo(() =>
    Object.entries(mediaTypeData).map(([key, value]) => ({
      type: key,
      count: value,
    })),
    [mediaTypeData]
  )

  const engagementData = useMemo(() => [
    { metric: 'Avg Likes/Post', value: postData.averageLikesPerPost || 0 },
    { metric: 'Avg Comments/Post', value: postData.averageCommentsPerPost || 0 },
    { metric: 'Avg Messages/Conversation', value: messageData.averageMessagesPerConversation || 0 },
    { metric: 'Report Resolution Rate', value: reportData.reportResolutionRate || 0 },
  ], [postData, messageData, reportData])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: theme.palette.background.paper,
            p: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          {payload.map((item, index) => (
            <Typography key={index} variant="body2" sx={{ fontWeight: 500 }}>
              {item.name}: {item.value}
            </Typography>
          ))}
        </Box>
      )
    }
    return null
  }

  const statCards = useMemo(() => [
    {
      title: 'Total Users',
      value: userData.totalUsers || 0,
      icon: <People />,
      color: '#4F46E5',
      growth: userData.userGrowthPercentage || 0,
    },
    {
      title: 'Total Posts',
      value: postData.totalPosts || 0,
      icon: <PostAdd />,
      color: '#14B8A6',
      growth: postData.postGrowthPercentage || 0,
    },
    {
      title: 'Total Comments',
      value: commentData.totalComments || 0,
      icon: <Comment />,
      color: '#F59E0B',
      growth: commentData.commentGrowthPercentage || 0,
    },
    {
      title: 'Total Messages',
      value: messageData.totalMessages || 0,
      icon: <Chat />,
      color: '#8B5CF6',
      growth: messageData.messageGrowthPercentage || 0,
    },
    {
      title: 'Total Reports',
      value: reportData.totalReports || 0,
      icon: <Flag />,
      color: '#EF4444',
      growth: 0,
    },
    {
      title: 'Avg Likes/Post',
      value: postData.averageLikesPerPost || 0,
      icon: <TrendingUp />,
      color: '#EC4899',
      growth: 0,
    },
  ], [userData, postData, commentData, messageData, reportData])

  return (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <StatCard stat={stat} />
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartSection title="User Growth Trend">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.users} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={chartColors.users} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: chartTextColor, fontSize: 12 }}
                  axisLine={{ stroke: chartGridColor }}
                />
                <YAxis 
                  tick={{ fill: chartTextColor, fontSize: 12 }}
                  axisLine={{ stroke: chartGridColor }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  name="Users"
                  stroke={chartColors.users}
                  fill="url(#userGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartSection title="Post Activity">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: chartTextColor, fontSize: 12 }}
                  axisLine={{ stroke: chartGridColor }}
                />
                <YAxis 
                  tick={{ fill: chartTextColor, fontSize: 12 }}
                  axisLine={{ stroke: chartGridColor }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="posts" 
                  name="Posts"
                  fill={chartColors.posts}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartSection title="Report Status Distribution">
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="count"
                    nameKey="status"
                    label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: chartTextColor }}
                  >
                    {reportStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.status === 'Pending' ? chartColors.pending : 
                              entry.status === 'Resolved' ? chartColors.resolved : 
                              chartColors.dismissed}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </ChartSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartSection title="Media Type Distribution">
            <Box sx={{ height: 300 }}>
              {mediaTypeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mediaTypeChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                    <XAxis 
                      type="number"
                      tick={{ fill: chartTextColor, fontSize: 12 }}
                      axisLine={{ stroke: chartGridColor }}
                    />
                    <YAxis 
                      type="category"
                      dataKey="type" 
                      tick={{ fill: chartTextColor, fontSize: 12 }}
                      axisLine={{ stroke: chartGridColor }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="count" 
                      name="Posts"
                      fill={chartColors.messages}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  No media type data available
                </Typography>
              )}
            </Box>
          </ChartSection>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <ChartSection title="Engagement Metrics" height={250}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis 
                  dataKey="metric" 
                  tick={{ fill: chartTextColor, fontSize: 12 }}
                  axisLine={{ stroke: chartGridColor }}
                />
                <YAxis 
                  tick={{ fill: chartTextColor, fontSize: 12 }}
                  axisLine={{ stroke: chartGridColor }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  name="Value"
                  fill={chartColors.likes}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>
        </Grid>
      </Grid>
    </Box>
  )
})

export default AnalyticsView