
// src/components/comments/CommentItem.jsx
import { useState } from 'react'
import { Box, Avatar, Typography, IconButton, Tooltip, useTheme, alpha, Menu, MenuItem, Snackbar, Alert } from '@mui/material'
import { Delete, MoreVert, Report } from '@mui/icons-material'
//import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { reportAPI } from '../../api/report'
import ReportDialog from '../common/ReportDialog'
import { formatRelativeTime } from '../../utils/dateFormatter'

const CommentItem = ({ comment, onDelete, isOwner }) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { currentUser } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [reportError, setReportError] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const canDelete = isOwner || comment.user?.id === currentUser?.id
  const canReport = comment.user?.id !== currentUser?.id

  const handleMenuOpen = (e) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleReportComment = async (reportData) => {
    setReportLoading(true)
    setReportError(null)
    try {
      const response = await reportAPI.reportComment(comment.id, {
        userId: currentUser?.id,
        commentId: comment.id,
        postId: comment.postId || null,
        reason: reportData.reason,
        description: reportData.description || '',
      })
      if (response.success) {
        setReportDialogOpen(false)
        setSnackbar({
          open: true,
          message: 'Comment reported successfully. Our team will review it.',
          severity: 'success'
        })
      } else {
        throw new Error(response.message || 'Failed to report comment')
      }
    } catch (error) {
      setReportError(error.message || 'Failed to report comment')
    } finally {
      setReportLoading(false)
    }
  }

  const handleOpenReport = () => {
    handleMenuClose()
    setReportError(null)
    setReportDialogOpen(true)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment.id)
    }
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          mb: 1.5,
          p: 1,
          borderRadius: 2,
          transition: 'background 0.2s ease',
          '&:hover': {
            bgcolor: alpha(theme.palette.common.white, 0.05),
          },
        }}
      >
        <Avatar
          src={comment.user?.profilePic || comment.userAvatar}
          sx={{ width: 32, height: 32, mr: 1.5, cursor: 'pointer' }}
          onClick={() => navigate(`/profile/${comment.user?.id || comment.userId}`)}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2">
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/profile/${comment.user?.id || comment.userId}`)}
            >
              {comment.user?.username || comment.username}
            </strong>{' '}
            {comment.content}
          </Typography>
          {/* <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </Typography> */}
          <Typography variant="caption" color="text.secondary">
            {formatRelativeTime(comment.createdAt)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {(canDelete || canReport) && (
            <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 0.5 }}>
              <MoreVert fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Comment Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {canDelete && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Delete fontSize="small" sx={{ mr: 1 }} /> 
            Delete Comment
          </MenuItem>
        )}
        {canReport && (
          <MenuItem onClick={handleOpenReport}>
            <Report fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} /> 
            Report Comment
          </MenuItem>
        )}
      </Menu>

      {/* Report Dialog */}
      <ReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        onSubmit={handleReportComment}
        reportType="comment"
        targetName={`comment by ${comment.user?.username || 'user'}`}
        loading={reportLoading}
        error={reportError}
      />

      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default CommentItem