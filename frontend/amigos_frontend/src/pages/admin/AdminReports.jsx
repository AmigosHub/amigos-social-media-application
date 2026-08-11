
// src/pages/admin/AdminReports.jsx
import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Visibility,
  CheckCircle,
  Cancel,
  Refresh,
} from '@mui/icons-material'
import { useAdmin } from '../../context/AdminContext'
import { adminAPI } from '../../api/admin'
import ReportDetailDialog from '../../components/admin/ReportDetailDialog'
import TableSkeleton from '../../components/admin/TableSkeleton'

// Memoized Report Row Component
const ReportRow = React.memo(({ report, onView, onResolve, onDismiss }) => {
  const getStatusChip = (status) => {
    const colors = {
      PENDING: 'warning',
      RESOLVED: 'success',
      DISMISSED: 'error',
    }
    return <Chip label={status} size="small" color={colors[status] || 'default'} sx={{ borderRadius: 2 }} />
  }

  const getReasonLabel = (reason) => {
    const reasons = {
      SPAM: 'Spam',
      HARASSMENT: 'Harassment',
      FAKE_ACCOUNT: 'Fake Account',
      HATE_SPEECH: 'Hate Speech',
      INAPPROPRIATE_CONTENT: 'Inappropriate Content',
      COPYRIGHT: 'Copyright',
      OTHER: 'Other',
    }
    return reasons[reason] || reason
  }

  return (
    <TableRow hover>
      <TableCell>#{report.id}</TableCell>
      <TableCell>{report.reporter?.username || 'Unknown'}</TableCell>
      <TableCell>
        {report.reportedUser?.username || report.reportedPost?.title || 'Unknown'}
      </TableCell>
      <TableCell>{getReasonLabel(report.reason)}</TableCell>
      <TableCell>{getStatusChip(report.status)}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Details" arrow>
            <IconButton size="small" onClick={() => onView(report)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          {report.status === 'PENDING' && (
            <>
              <Tooltip title="Resolve" arrow>
                <IconButton 
                  size="small" 
                  onClick={() => onResolve(report)}
                  color="success"
                >
                  <CheckCircle fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Dismiss" arrow>
                <IconButton 
                  size="small" 
                  onClick={() => onDismiss(report)}
                  color="error"
                >
                  <Cancel fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </TableCell>
    </TableRow>
  )
})

const AdminReports = React.memo(() => {
  const theme = useTheme()
  const { loadReports, reports, totalReports, loadPendingReports } = useAdmin()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false)
  const [resolveLoading, setResolveLoading] = useState(false)
  const [resolveError, setResolveError] = useState(null)
  const [dismissLoading, setDismissLoading] = useState(false)
  const [actionData, setActionData] = useState({ action: '', reason: '', duration: '' })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    fetchReports()
    loadPendingReports()
  }, [page, rowsPerPage, statusFilter])

  const fetchReports = useCallback(async () => {
    setLoading(true)
    try {
      await loadReports(page, rowsPerPage, statusFilter)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage, statusFilter, loadReports])

  const handleStatusFilter = useCallback((e) => {
    setStatusFilter(e.target.value)
    setPage(0)
  }, [])

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage)
  }, [])

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }, [])

  const handleViewReport = useCallback((report) => {
    setSelectedReport(report)
    setDetailOpen(true)
  }, [])

  const handleResolveReport = useCallback(async () => {
    if (!selectedReport) return
    
    if (!actionData.action) {
      setSnackbar({
        open: true,
        message: 'Please select an action to resolve the report',
        severity: 'warning'
      })
      return
    }

    if (selectedReport.status !== 'PENDING') {
      setSnackbar({
        open: true,
        message: `This report is already ${selectedReport.status.toLowerCase()}`,
        severity: 'warning'
      })
      setResolveDialogOpen(false)
      return
    }

    setResolveLoading(true)
    setResolveError(null)
    
    try {
      const data = {
        action: actionData.action,
        reason: actionData.reason || 'Report resolved by admin',
        duration: actionData.duration || null
      }
      
      console.log('=== RESOLVING REPORT ===')
      console.log('Report ID:', selectedReport.id)
      console.log('Data being sent:', JSON.stringify(data, null, 2))
      
      const response = await adminAPI.resolveReport(selectedReport.id, data)
      
      console.log('Resolve response:', response)
      
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Report resolved successfully',
          severity: 'success'
        })
        setResolveDialogOpen(false)
        setActionData({ action: '', reason: '', duration: '' })
        await fetchReports()
        await loadPendingReports()
      } else {
        throw new Error(response.message || 'Failed to resolve report')
      }
    } catch (error) {
      console.error('=== ERROR RESOLVING REPORT ===')
      console.error('Error:', error)
      console.error('Error response:', error.response?.data)
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to resolve report. Please check backend logs.'
      setResolveError(errorMessage)
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      })
    } finally {
      setResolveLoading(false)
    }
  }, [selectedReport, actionData, fetchReports, loadPendingReports])

  const handleDismissReport = useCallback(async () => {
    if (!selectedReport) return

    if (selectedReport.status !== 'PENDING') {
      setSnackbar({
        open: true,
        message: `This report is already ${selectedReport.status.toLowerCase()}`,
        severity: 'warning'
      })
      setDismissDialogOpen(false)
      return
    }

    setDismissLoading(true)
    try {
      const data = {
        reason: actionData.reason || 'No violation found'
      }
      
      console.log('=== DISMISSING REPORT ===')
      console.log('Report ID:', selectedReport.id)
      console.log('Data being sent:', JSON.stringify(data, null, 2))
      
      const response = await adminAPI.dismissReport(selectedReport.id, data)
      
      console.log('Dismiss response:', response)
      
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Report dismissed successfully',
          severity: 'success'
        })
        setDismissDialogOpen(false)
        setActionData({ action: '', reason: '', duration: '' })
        await fetchReports()
        await loadPendingReports()
      } else {
        throw new Error(response.message || 'Failed to dismiss report')
      }
    } catch (error) {
      console.error('=== ERROR DISMISSING REPORT ===')
      console.error('Error:', error)
      console.error('Error response:', error.response?.data)
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to dismiss report. Please check backend logs.'
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      })
    } finally {
      setDismissLoading(false)
    }
  }, [selectedReport, actionData, fetchReports, loadPendingReports])

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar({ ...snackbar, open: false })
  }, [snackbar])

  const handleOpenResolveDialog = useCallback((report) => {
    setSelectedReport(report)
    setResolveDialogOpen(true)
  }, [])

  const handleOpenDismissDialog = useCallback((report) => {
    setSelectedReport(report)
    setDismissDialogOpen(true)
  }, [])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Report Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchReports}
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {/* Filters */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} onChange={handleStatusFilter} label="Status">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="RESOLVED">Resolved</MenuItem>
            <MenuItem value="DISMISSED">Dismissed</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Reports Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : (
        <Paper
          sx={{
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <TableRow>
                  <TableCell>Report ID</TableCell>
                  <TableCell>Reporter</TableCell>
                  <TableCell>Reported Content</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No reports found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <ReportRow
                      key={report.id}
                      report={report}
                      onView={handleViewReport}
                      onResolve={handleOpenResolveDialog}
                      onDismiss={handleOpenDismissDialog}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={totalReports}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Dialogs */}
      <ReportDetailDialog
        open={detailOpen}
        report={selectedReport}
        onClose={() => setDetailOpen(false)}
      />

      {/* Resolve Dialog */}
      <Dialog 
        open={resolveDialogOpen} 
        onClose={() => setResolveDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Resolve Report #{selectedReport?.id}</DialogTitle>
        <DialogContent>
          {resolveError && (
            <Alert severity="error" sx={{ mt: 2, mb: 2, borderRadius: 2 }}>
              {resolveError}
            </Alert>
          )}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Action</InputLabel>
            <Select
              value={actionData.action}
              onChange={(e) => setActionData({ ...actionData, action: e.target.value })}
              label="Action"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="WARN_USER">Warn User</MenuItem>
              <MenuItem value="BAN_USER">Ban User</MenuItem>
              <MenuItem value="DELETE_POST">Delete Post</MenuItem>
              <MenuItem value="DELETE_COMMENT">Delete Comment</MenuItem>
              <MenuItem value="NO_ACTION">No Action</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason"
            value={actionData.reason}
            onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
            margin="normal"
            placeholder="Provide reason for this action..."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          {actionData.action === 'BAN_USER' && (
            <TextField
              fullWidth
              label="Duration (e.g., 30 days)"
              value={actionData.duration}
              onChange={(e) => setActionData({ ...actionData, duration: e.target.value })}
              margin="normal"
              placeholder="e.g., 7 days, 30 days, Permanent"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setResolveDialogOpen(false)
            setActionData({ action: '', reason: '', duration: '' })
            setResolveError(null)
          }} disabled={resolveLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleResolveReport} 
            variant="contained" 
            color="success"
            disabled={resolveLoading || !actionData.action}
            sx={{ borderRadius: 2 }}
          >
            {resolveLoading ? <CircularProgress size={24} /> : 'Resolve'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dismiss Dialog */}
      <Dialog 
        open={dismissDialogOpen} 
        onClose={() => setDismissDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Dismiss Report #{selectedReport?.id}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for dismissal"
            value={actionData.reason}
            onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
            margin="normal"
            placeholder="Provide reason for dismissing this report..."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDismissDialogOpen(false)
            setActionData({ action: '', reason: '', duration: '' })
          }} disabled={dismissLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDismissReport} 
            variant="contained" 
            color="error"
            disabled={dismissLoading}
            sx={{ borderRadius: 2 }}
          >
            {dismissLoading ? <CircularProgress size={24} /> : 'Dismiss'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
})

export default AdminReports