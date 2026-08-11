
// src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAdmin } from '../context/AdminContext'
import AdminLayout from '../components/admin/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminReports from '../pages/admin/AdminReports'
import AdminAnalytics from '../pages/admin/AdminAnalytics'

const AdminRoutes = () => {
  const { currentUser } = useAuth()
  const { isAdmin } = useAdmin()

  // Check if user is logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // Check if user has admin role - if not, redirect to home
  if (!isAdmin) {
    return <Navigate to="/home" replace />
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/reports" element={<AdminReports />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
      </Routes>
    </AdminLayout>
  )
}

export default AdminRoutes