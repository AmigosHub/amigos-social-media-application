
// src/api/admin.js
import adminAxios from './adminAxios'

// ============= DASHBOARD APIs =============

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await adminAxios.get('/api/admin/dashboard/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
}

// Get daily activity
export const getDailyActivity = async (startDate, endDate) => {
  try {
    const response = await adminAxios.get('/api/admin/dashboard/activity', {
      params: { startDate, endDate }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching daily activity:', error)
    throw error
  }
}

// Get user growth
export const getUserGrowth = async (startDate, endDate) => {
  try {
    const response = await adminAxios.get('/api/admin/dashboard/user-growth', {
      params: { startDate, endDate }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching user growth:', error)
    throw error
  }
}

// ============= USER MANAGEMENT APIs =============

// Get all users (paginated)
export const getUsers = async (page = 0, size = 20, search = '', role = '', isActive = null) => {
  try {
    const params = { page, size }
    if (search) params.search = search
    if (role) params.role = role
    if (isActive !== null) params.isActive = isActive
    const response = await adminAxios.get('/api/admin/users', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await adminAxios.get(`/api/admin/users/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Get banned users
export const getBannedUsers = async (page = 0, size = 20) => {
  try {
    const response = await adminAxios.get('/api/admin/banned-users', {
      params: { page, size }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching banned users:', error)
    throw error
  }
}

// Activate user
export const activateUser = async (userId) => {
  try {
    const response = await adminAxios.patch(`/api/admin/users/${userId}/activate`)
    return response.data
  } catch (error) {
    console.error('Error activating user:', error)
    throw error
  }
}

// Deactivate user
export const deactivateUser = async (userId) => {
  try {
    const response = await adminAxios.patch(`/api/admin/users/${userId}/deactivate`)
    return response.data
  } catch (error) {
    console.error('Error deactivating user:', error)
    throw error
  }
}

// Ban user
export const banUser = async (userId, data) => {
  try {
    const response = await adminAxios.post(`/api/admin/users/${userId}/ban`, {
      reason: data.reason || '',
      duration: data.duration || 'Permanent'
    })
    return response.data
  } catch (error) {
    console.error('Error banning user:', error)
    throw error
  }
}

// Unban user
export const unbanUser = async (userId) => {
  try {
    const response = await adminAxios.delete(`/api/admin/users/${userId}/ban`)
    return response.data
  } catch (error) {
    console.error('Error unbanning user:', error)
    throw error
  }
}

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await adminAxios.delete(`/api/admin/users/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

// Search users
export const searchUsers = async (query, page = 0, size = 20, role = '') => {
  try {
    const params = { q: query, page, size }
    if (role) params.role = role
    const response = await adminAxios.get('/api/admin/search/users', { params })
    return response.data
  } catch (error) {
    console.error('Error searching users:', error)
    throw error
  }
}

// ============= REPORT MANAGEMENT APIs =============

// Get all reports
export const getReports = async (page = 0, size = 20, status = '') => {
  try {
    const params = { page, size }
    if (status) params.status = status
    const response = await adminAxios.get('/api/admin/reports', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching reports:', error)
    throw error
  }
}

// Get pending reports
export const getPendingReports = async () => {
  try {
    const response = await adminAxios.get('/api/admin/reports/pending')
    return response.data
  } catch (error) {
    console.error('Error fetching pending reports:', error)
    throw error
  }
}

// Get report by ID
export const getReportById = async (reportId) => {
  try {
    const response = await adminAxios.get(`/api/admin/reports/${reportId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching report:', error)
    throw error
  }
}

// Get report statistics
export const getReportStatistics = async () => {
  try {
    const response = await adminAxios.get('/api/admin/reports/statistics')
    return response.data
  } catch (error) {
    console.error('Error fetching report statistics:', error)
    throw error
  }
}

// Resolve report
export const resolveReport = async (reportId, data) => {
  try {
    console.log(`[AdminAPI] Resolving report ${reportId}`)
    console.log('[AdminAPI] Data being sent:', JSON.stringify(data, null, 2))
    
    const requestData = {
      action: data.action || 'NO_ACTION',
      reason: data.reason || 'Report resolved by admin',
      duration: data.duration || null
    }
    
    const response = await adminAxios.put(`/api/admin/reports/${reportId}/resolve`, requestData)
    console.log('[AdminAPI] Resolve response:', response.data)
    return response.data
  } catch (error) {
    console.error('[AdminAPI] Error resolving report:', error)
    if (error.response) {
      console.error('[AdminAPI] Status:', error.response.status)
      console.error('[AdminAPI] Data:', error.response.data)
      console.error('[AdminAPI] Headers:', error.response.headers)
    }
    throw error
  }
}

// Dismiss report
export const dismissReport = async (reportId, data) => {
  try {
    console.log(`[AdminAPI] Dismissing report ${reportId}`)
    console.log('[AdminAPI] Data being sent:', JSON.stringify(data, null, 2))
    
    const requestData = {
      action: data.action || 'DISMISS',
      reason: data.reason || 'No violation found',
      duration: data.duration || null
    }
    
    const response = await adminAxios.put(`/api/admin/reports/${reportId}/dismiss`, requestData)
    console.log('[AdminAPI] Dismiss response:', response.data)
    return response.data
  } catch (error) {
    console.error('[AdminAPI] Error dismissing report:', error)
    if (error.response) {
      console.error('[AdminAPI] Status:', error.response.status)
      console.error('[AdminAPI] Data:', error.response.data)
      console.error('[AdminAPI] Headers:', error.response.headers)
    }
    throw error
  }
}

// ============= ANALYTICS APIs =============

// Get all analytics
export const getAllAnalytics = async () => {
  try {
    const response = await adminAxios.get('/api/admin/analytics')
    return response.data
  } catch (error) {
    console.error('Error fetching analytics:', error)
    throw error
  }
}

// Get user analytics
export const getUserAnalytics = async () => {
  try {
    const response = await adminAxios.get('/api/admin/analytics/users')
    return response.data
  } catch (error) {
    console.error('Error fetching user analytics:', error)
    throw error
  }
}

// Get post analytics
export const getPostAnalytics = async () => {
  try {
    const response = await adminAxios.get('/api/admin/analytics/posts')
    return response.data
  } catch (error) {
    console.error('Error fetching post analytics:', error)
    throw error
  }
}

// Get comment analytics
export const getCommentAnalytics = async () => {
  try {
    const response = await adminAxios.get('/api/admin/analytics/comments')
    return response.data
  } catch (error) {
    console.error('Error fetching comment analytics:', error)
    throw error
  }
}

// Get message analytics
export const getMessageAnalytics = async () => {
  try {
    const response = await adminAxios.get('/api/admin/analytics/messages')
    return response.data
  } catch (error) {
    console.error('Error fetching message analytics:', error)
    throw error
  }
}

// Get report analytics
export const getReportAnalytics = async () => {
  try {
    const response = await adminAxios.get('/api/admin/analytics/reports')
    return response.data
  } catch (error) {
    console.error('Error fetching report analytics:', error)
    throw error
  }
}

// ============= EXPORT AS OBJECT FOR BACKWARD COMPATIBILITY =============
export const adminAPI = {
  getDashboardStats,
  getDailyActivity,
  getUserGrowth,
  getUsers,
  getUserById,
  getBannedUsers,
  activateUser,
  deactivateUser,
  banUser,
  unbanUser,
  deleteUser,
  searchUsers,
  getReports,
  getPendingReports,
  getReportById,
  getReportStatistics,
  resolveReport,
  dismissReport,
  getAllAnalytics,
  getUserAnalytics,
  getPostAnalytics,
  getCommentAnalytics,
  getMessageAnalytics,
  getReportAnalytics,
}