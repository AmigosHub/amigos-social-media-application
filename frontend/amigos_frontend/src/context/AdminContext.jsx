
// src/context/AdminContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { adminAPI } from '../api/admin'
import { useAuth } from './AuthContext'

const AdminContext = createContext()

export const useAdmin = () => useContext(AdminContext)

export const AdminProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState(null)
  const [users, setUsers] = useState([])
  const [reports, setReports] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalReports, setTotalReports] = useState(0)
  const [pendingReports, setPendingReports] = useState(0)

  useEffect(() => {
    checkAdminStatus()
  }, [currentUser])

  const checkAdminStatus = () => {
    console.log('[AdminContext] Checking admin status...')
    console.log('[AdminContext] currentUser from AuthContext:', currentUser)
    console.log('[AdminContext] currentUser?.role:', currentUser?.role)
    console.log('[AdminContext] currentUser object keys:', currentUser ? Object.keys(currentUser) : 'No user')
    
    // Check if user has ADMIN role
    if (currentUser?.role === 'ADMIN') {
      console.log('[AdminContext] ✅ User IS ADMIN')
      setIsAdmin(true)
    } else {
      console.log('[AdminContext] ❌ User is NOT ADMIN')
      console.log('[AdminContext] Role value:', currentUser?.role)
      setIsAdmin(false)
    }
    setLoading(false)
  }

  // Dashboard
  const loadDashboardStats = async () => {
    if (!isAdmin) {
      console.warn('[AdminContext] User is not admin, skipping dashboard stats load')
      return
    }
    try {
      console.log('[AdminContext] Loading dashboard stats from .NET API...')
      const response = await adminAPI.getDashboardStats()
      console.log('[AdminContext] Dashboard stats response:', response)
      if (response.success) {
        setDashboardStats(response.data)
        return response.data
      } else {
        throw new Error(response.message || 'Failed to load dashboard stats')
      }
    } catch (error) {
      console.error('[AdminContext] Error loading dashboard stats:', error)
      setDashboardStats(null)
      return null
    }
  }

  // Users
  const loadUsers = async (page = 0, size = 20, search = '', role = '', isActive = null) => {
    if (!isAdmin) return
    try {
      const response = await adminAPI.getUsers(page, size, search, role, isActive)
      if (response.success) {
        setUsers(response.data.content || [])
        setTotalUsers(response.data.totalElements || 0)
        return response.data
      }
    } catch (error) {
      console.error('[AdminContext] Error loading users:', error)
      throw error
    }
  }

  // Reports
  const loadReports = async (page = 0, size = 20, status = '') => {
    if (!isAdmin) return
    try {
      const response = await adminAPI.getReports(page, size, status)
      if (response.success) {
        setReports(response.data.content || [])
        setTotalReports(response.data.totalElements || 0)
        return response.data
      }
    } catch (error) {
      console.error('[AdminContext] Error loading reports:', error)
      throw error
    }
  }

  const loadPendingReports = async () => {
    if (!isAdmin) return
    try {
      const response = await adminAPI.getPendingReports()
      if (response.success) {
        setPendingReports(response.data?.length || 0)
        return response.data
      }
    } catch (error) {
      console.error('[AdminContext] Error loading pending reports:', error)
      throw error
    }
  }

  // Analytics
  const loadAnalytics = async () => {
    if (!isAdmin) return
    try {
      const response = await adminAPI.getAllAnalytics()
      if (response.success) {
        setAnalytics(response.data)
        return response.data
      }
    } catch (error) {
      console.error('[AdminContext] Error loading analytics:', error)
      throw error
    }
  }

  const value = {
    isAdmin,
    loading,
    dashboardStats,
    users,
    reports,
    analytics,
    totalUsers,
    totalReports,
    pendingReports,
    loadDashboardStats,
    loadUsers,
    loadReports,
    loadPendingReports,
    loadAnalytics,
    setUsers,
    setReports,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}