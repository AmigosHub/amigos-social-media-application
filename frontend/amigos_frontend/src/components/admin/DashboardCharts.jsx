
// // src/components/admin/DashboardCharts.jsx
// import { useState, useEffect } from 'react'
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   useTheme,
//   alpha,
//   CircularProgress,
// } from '@mui/material'
// import { motion } from 'framer-motion'
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
// } from 'recharts'
// import { getDailyActivity, getUserGrowth, getReportStatistics } from '../../api/admin'
// import ChartSkeleton from './ChartSkeleton'

// const DashboardCharts = () => {
//   const theme = useTheme()
//   const [loading, setLoading] = useState(true)
//   const [activityData, setActivityData] = useState([])
//   const [growthData, setGrowthData] = useState([])
//   const [reportStats, setReportStats] = useState([])
//   const [error, setError] = useState(null)

//   const isDarkMode = theme.palette.mode === 'dark'

//   const chartColors = {
//     posts: '#14B8A6',
//     comments: '#3B82F6',
//     likes: '#EC4899',
//     users: '#4F46E5',
//     activeUsers: '#14B8A6',
//     pending: '#F59E0B',
//     resolved: '#10B981',
//     dismissed: '#EF4444',
//   }

//   const chartTextColor = isDarkMode ? '#94A3B8' : '#64748B'
//   const chartGridColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'

//   useEffect(() => {
//     loadChartData()
//   }, [])

//   const loadChartData = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       // Get dates for last 7 days
//       const endDate = new Date()
//       const startDate = new Date()
//       startDate.setDate(startDate.getDate() - 6)

//       // Fetch real data from APIs
//       const [activityRes, growthRes, reportStatsRes] = await Promise.all([
//         getDailyActivity(startDate.toISOString(), endDate.toISOString()),
//         getUserGrowth(startDate.toISOString(), endDate.toISOString()),
//         getReportStatistics(),
//       ])

//       // Process activity data
//       if (activityRes.success && activityRes.data) {
//         const formattedActivity = activityRes.data.map(item => ({
//           date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
//           newPosts: item.newPosts || 0,
//           newComments: item.newComments || 0,
//           newLikes: item.newLikes || 0,
//           newUsers: item.newUsers || 0,
//         }))
//         setActivityData(formattedActivity)
//       }

//       // Process growth data
//       if (growthRes.success && growthRes.data) {
//         const formattedGrowth = growthRes.data.map(item => ({
//           date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
//           totalUsers: item.totalUsers || 0,
//           activeUsers: item.activeUsers || 0,
//           newUsers: item.newUsers || 0,
//         }))
//         setGrowthData(formattedGrowth)
//       }

//       // Process report statistics
//       if (reportStatsRes.success && reportStatsRes.data) {
//         const stats = reportStatsRes.data.reportsByStatus || []
//         setReportStats(stats)
//       }

//     } catch (error) {
//       console.error('Error loading chart data:', error)
//       setError('Failed to load chart data. Please refresh the page.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <Box
//           sx={{
//             bgcolor: theme.palette.background.paper,
//             p: 2,
//             borderRadius: 2,
//             boxShadow: theme.shadows[3],
//             border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//           }}
//         >
//           <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
//             {label}
//           </Typography>
//           {payload.map((item, index) => (
//             <Typography key={index} variant="body2" sx={{ fontWeight: 500 }}>
//               {item.name}: {item.value}
//             </Typography>
//           ))}
//         </Box>
//       )
//     }
//     return null
//   }

//   if (loading) {
//     return <ChartSkeleton />
//   }

//   if (error) {
//     return (
//       <Paper sx={{ p: 3, borderRadius: 3 }}>
//         <Typography color="error" align="center">{error}</Typography>
//       </Paper>
//     )
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Grid container spacing={3}>
//         {/* Activity Chart - Area Chart */}
//         <Grid size={{ xs: 12, md: 8 }}>
//           <Paper
//             sx={{
//               p: 3,
//               borderRadius: 3,
//               border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//               height: '100%',
//             }}
//           >
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//               <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                 Daily Activity Overview
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Last 7 days
//               </Typography>
//             </Box>
//             <Box sx={{ height: 350 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={activityData}>
//                   <defs>
//                     <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor={chartColors.posts} stopOpacity={0.8}/>
//                       <stop offset="95%" stopColor={chartColors.posts} stopOpacity={0.1}/>
//                     </linearGradient>
//                     <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor={chartColors.comments} stopOpacity={0.8}/>
//                       <stop offset="95%" stopColor={chartColors.comments} stopOpacity={0.1}/>
//                     </linearGradient>
//                     <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor={chartColors.likes} stopOpacity={0.8}/>
//                       <stop offset="95%" stopColor={chartColors.likes} stopOpacity={0.1}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
//                   <XAxis 
//                     dataKey="date" 
//                     tick={{ fill: chartTextColor, fontSize: 12 }}
//                     axisLine={{ stroke: chartGridColor }}
//                   />
//                   <YAxis 
//                     tick={{ fill: chartTextColor, fontSize: 12 }}
//                     axisLine={{ stroke: chartGridColor }}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Area 
//                     type="monotone" 
//                     dataKey="newPosts" 
//                     name="New Posts"
//                     stroke={chartColors.posts}
//                     fill="url(#colorPosts)"
//                     strokeWidth={2}
//                   />
//                   <Area 
//                     type="monotone" 
//                     dataKey="newComments" 
//                     name="New Comments"
//                     stroke={chartColors.comments}
//                     fill="url(#colorComments)"
//                     strokeWidth={2}
//                   />
//                   <Area 
//                     type="monotone" 
//                     dataKey="newLikes" 
//                     name="New Likes"
//                     stroke={chartColors.likes}
//                     fill="url(#colorLikes)"
//                     strokeWidth={2}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </Box>
//           </Paper>
//         </Grid>

//         {/* Report Status Distribution - Pie Chart */}
//         <Grid size={{ xs: 12, md: 4 }}>
//           <Paper
//             sx={{
//               p: 3,
//               borderRadius: 3,
//               border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//               height: '100%',
//             }}
//           >
//             <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
//               Report Status
//             </Typography>
//             <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               {reportStats.length > 0 ? (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={reportStats}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={100}
//                       dataKey="count"
//                       nameKey="status"
//                       label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
//                       labelLine={{ stroke: chartTextColor }}
//                     >
//                       {reportStats.map((entry, index) => (
//                         <Cell 
//                           key={`cell-${index}`} 
//                           fill={entry.status === 'PENDING' ? chartColors.pending : 
//                                 entry.status === 'RESOLVED' ? chartColors.resolved : 
//                                 chartColors.dismissed}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <Typography color="text.secondary">No data available</Typography>
//               )}
//             </Box>
//           </Paper>
//         </Grid>

//         {/* User Growth Chart - Line Chart */}
//         <Grid size={{ xs: 12 }}>
//           <Paper
//             sx={{
//               p: 3,
//               borderRadius: 3,
//               border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//             }}
//           >
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//               <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                 User Growth Trend
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Last 7 days
//               </Typography>
//             </Box>
//             <Box sx={{ height: 300 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={growthData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
//                   <XAxis 
//                     dataKey="date" 
//                     tick={{ fill: chartTextColor, fontSize: 12 }}
//                     axisLine={{ stroke: chartGridColor }}
//                   />
//                   <YAxis 
//                     tick={{ fill: chartTextColor, fontSize: 12 }}
//                     axisLine={{ stroke: chartGridColor }}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Line 
//                     type="monotone" 
//                     dataKey="totalUsers" 
//                     name="Total Users"
//                     stroke={chartColors.users}
//                     strokeWidth={3}
//                     dot={{ r: 6, fill: chartColors.users }}
//                     activeDot={{ r: 8 }}
//                   />
//                   <Line 
//                     type="monotone" 
//                     dataKey="activeUsers" 
//                     name="Active Users"
//                     stroke={chartColors.activeUsers}
//                     strokeWidth={3}
//                     dot={{ r: 6, fill: chartColors.activeUsers }}
//                     activeDot={{ r: 8 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </motion.div>
//   )
// }

// export default DashboardCharts

// src/components/admin/DashboardCharts.jsx
import React, { useState, useEffect, useMemo } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material'
import { motion } from 'framer-motion'
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
import { getDailyActivity, getUserGrowth, getReportStatistics } from '../../api/admin'
import ChartSkeleton from './ChartSkeleton'

// Memoized Chart Components
const ActivityChart = React.memo(({ data, colors, textColor, gridColor }) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: 3,
      border: `1px solid ${alpha(useTheme().palette.divider, 0.1)}`,
      height: '100%',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Daily Activity Overview
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Last 7 days
      </Typography>
    </Box>
    <Box sx={{ height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.posts} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors.posts} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.comments} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors.comments} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.likes} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors.likes} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
          />
          <YAxis 
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="newPosts" 
            name="New Posts"
            stroke={colors.posts}
            fill="url(#colorPosts)"
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="newComments" 
            name="New Comments"
            stroke={colors.comments}
            fill="url(#colorComments)"
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="newLikes" 
            name="New Likes"
            stroke={colors.likes}
            fill="url(#colorLikes)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  </Paper>
))

const ReportStatusChart = React.memo(({ data, colors, textColor }) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: 3,
      border: `1px solid ${alpha(useTheme().palette.divider, 0.1)}`,
      height: '100%',
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
      Report Status
    </Typography>
    <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="count"
              nameKey="status"
              label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: textColor }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.status === 'PENDING' ? colors.pending : 
                        entry.status === 'RESOLVED' ? colors.resolved : 
                        colors.dismissed}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <Typography color="text.secondary">No data available</Typography>
      )}
    </Box>
  </Paper>
))

const UserGrowthChart = React.memo(({ data, colors, gridColor, textColor }) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: 3,
      border: `1px solid ${alpha(useTheme().palette.divider, 0.1)}`,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        User Growth Trend
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Last 7 days
      </Typography>
    </Box>
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
          />
          <YAxis 
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="totalUsers" 
            name="Total Users"
            stroke={colors.users}
            strokeWidth={3}
            dot={{ r: 6, fill: colors.users }}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="activeUsers" 
            name="Active Users"
            stroke={colors.activeUsers}
            strokeWidth={3}
            dot={{ r: 6, fill: colors.activeUsers }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </Paper>
))

const CustomTooltip = ({ active, payload, label }) => {
  const theme = useTheme()
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

const DashboardCharts = React.memo(() => {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [activityData, setActivityData] = useState([])
  const [growthData, setGrowthData] = useState([])
  const [reportStats, setReportStats] = useState([])
  const [error, setError] = useState(null)

  const isDarkMode = theme.palette.mode === 'dark'

  const chartColors = {
    posts: '#14B8A6',
    comments: '#3B82F6',
    likes: '#EC4899',
    users: '#4F46E5',
    activeUsers: '#14B8A6',
    pending: '#F59E0B',
    resolved: '#10B981',
    dismissed: '#EF4444',
  }

  const chartTextColor = isDarkMode ? '#94A3B8' : '#64748B'
  const chartGridColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'

  useEffect(() => {
    loadChartData()
  }, [])

  const loadChartData = async () => {
    setLoading(true)
    setError(null)
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 6)

      const [activityRes, growthRes, reportStatsRes] = await Promise.all([
        getDailyActivity(startDate.toISOString(), endDate.toISOString()),
        getUserGrowth(startDate.toISOString(), endDate.toISOString()),
        getReportStatistics(),
      ])

      if (activityRes.success && activityRes.data) {
        const formattedActivity = activityRes.data.map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
          newPosts: item.newPosts || 0,
          newComments: item.newComments || 0,
          newLikes: item.newLikes || 0,
          newUsers: item.newUsers || 0,
        }))
        setActivityData(formattedActivity)
      }

      if (growthRes.success && growthRes.data) {
        const formattedGrowth = growthRes.data.map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
          totalUsers: item.totalUsers || 0,
          activeUsers: item.activeUsers || 0,
          newUsers: item.newUsers || 0,
        }))
        setGrowthData(formattedGrowth)
      }

      if (reportStatsRes.success && reportStatsRes.data) {
        const stats = reportStatsRes.data.reportsByStatus || []
        setReportStats(stats)
      }

    } catch (error) {
      console.error('Error loading chart data:', error)
      setError('Failed to load chart data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <ChartSkeleton />
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography color="error" align="center">{error}</Typography>
      </Paper>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ActivityChart 
            data={activityData} 
            colors={chartColors}
            textColor={chartTextColor}
            gridColor={chartGridColor}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReportStatusChart 
            data={reportStats}
            colors={chartColors}
            textColor={chartTextColor}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <UserGrowthChart 
            data={growthData}
            colors={chartColors}
            gridColor={chartGridColor}
            textColor={chartTextColor}
          />
        </Grid>
      </Grid>
    </motion.div>
  )
})

export default DashboardCharts