// // src/components/admin/ReportDetailDialog.jsx
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Avatar,
//   Typography,
//   Chip,
//   Divider,
//   Grid,
//   useTheme,
//   alpha,
//   IconButton,
// } from '@mui/material'
// import { Close, Person, CalendarToday, Flag, Description } from '@mui/icons-material'
// import { formatDate } from '../../utils/dateFormatter'

// const ReportDetailDialog = ({ open, report, onClose }) => {
//   const theme = useTheme()

//   if (!report) return null

//   const getReasonLabel = (reason) => {
//     const reasons = {
//       SPAM: 'Spam',
//       HARASSMENT: 'Harassment',
//       FAKE_ACCOUNT: 'Fake Account',
//       HATE_SPEECH: 'Hate Speech',
//       INAPPROPRIATE_CONTENT: 'Inappropriate Content',
//       COPYRIGHT: 'Copyright',
//       OTHER: 'Other',
//     }
//     return reasons[reason] || reason
//   }

//   const getStatusChip = (status) => {
//     const colors = {
//       PENDING: 'warning',
//       RESOLVED: 'success',
//       DISMISSED: 'error',
//     }
//     return <Chip label={status} size="small" color={colors[status] || 'default'} sx={{ borderRadius: 2 }} />
//   }

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       slotProps={{
//         paper: {
//           sx: { borderRadius: 3 }
//         }
//       }}
//     >
//       <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         Report Details
//         <IconButton size="small" onClick={onClose}>
//           <Close />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent>
//         {/* Report Header */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
//           <Box>
//             <Typography variant="caption" color="text.secondary">Report ID</Typography>
//             <Typography variant="h6">#{report.id}</Typography>
//           </Box>
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             {getStatusChip(report.status)}
//             <Chip
//               label={getReasonLabel(report.reason)}
//               size="small"
//               color="primary"
//               sx={{ borderRadius: 2 }}
//             />
//           </Box>
//         </Box>

//         <Divider sx={{ my: 2 }} />

//         {/* Reporter Info */}
//         <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//           <Person fontSize="small" />
//           Reporter
//         </Typography>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2 }}>
//           <Avatar src={report.reporter?.profilePic} sx={{ width: 40, height: 40 }} />
//           <Box>
//             <Typography variant="body1" sx={{ fontWeight: 600 }}>
//               {report.reporter?.username || 'Unknown User'}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               {report.reporter?.email || 'No email'}
//             </Typography>
//           </Box>
//         </Box>

//         {/* Reported User/Post Info */}
//         <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//           <Flag fontSize="small" />
//           Reported Content
//         </Typography>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: alpha(theme.palette.error.main, 0.04), borderRadius: 2 }}>
//           <Avatar src={report.reportedUser?.profilePic} sx={{ width: 40, height: 40 }} />
//           <Box>
//             <Typography variant="body1" sx={{ fontWeight: 600 }}>
//               {report.reportedUser?.username || report.reportedPost?.title || 'Unknown'}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               {report.reportedUser?.email || 'User/Content reported'}
//             </Typography>
//           </Box>
//         </Box>

//         <Divider sx={{ my: 2 }} />

//         {/* Report Details */}
//         <Grid container spacing={2}>
//           <Grid size={{ xs: 12, sm: 6 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <CalendarToday sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
//               <Box>
//                 <Typography variant="caption" color="text.secondary">Reported At</Typography>
//                 <Typography variant="body2">{formatDate(report.createdAt, 'MMM dd, yyyy HH:mm')}</Typography>
//               </Box>
//             </Box>
//           </Grid>
//           <Grid size={{ xs: 12, sm: 6 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Description sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
//               <Box>
//                 <Typography variant="caption" color="text.secondary">Reason</Typography>
//                 <Typography variant="body2">{getReasonLabel(report.reason)}</Typography>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>

//         {report.description && (
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="caption" color="text.secondary">Description</Typography>
//             <Typography variant="body2" sx={{ mt: 0.5, p: 2, bgcolor: alpha(theme.palette.common.white, 0.05), borderRadius: 2 }}>
//               {report.description}
//             </Typography>
//           </Box>
//         )}

//         {report.resolvedAt && (
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="caption" color="text.secondary">Resolved At</Typography>
//             <Typography variant="body2">{formatDate(report.resolvedAt, 'MMM dd, yyyy HH:mm')}</Typography>
//           </Box>
//         )}

//         {report.action && (
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="caption" color="text.secondary">Action Taken</Typography>
//             <Typography variant="body2">
//               <Chip label={report.action} size="small" color="info" sx={{ borderRadius: 2 }} />
//             </Typography>
//           </Box>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2 }}>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default ReportDetailDialog

// src/components/admin/ReportDetailDialog.jsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Chip,
  Divider,
  Grid,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material'
import { Close, Person, CalendarToday, Flag, Description } from '@mui/icons-material'
import { formatDate } from '../../utils/dateFormatter'

const ReportDetailDialog = React.memo(({ open, report, onClose }) => {
  const theme = useTheme()

  if (!report) return null

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

  const getStatusChip = (status) => {
    const colors = {
      PENDING: 'warning',
      RESOLVED: 'success',
      DISMISSED: 'error',
    }
    return <Chip label={status} size="small" color={colors[status] || 'default'} sx={{ borderRadius: 2 }} />
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3 }
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Report Details
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Report Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Report ID</Typography>
            <Typography variant="h6">#{report.id}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {getStatusChip(report.status)}
            <Chip
              label={getReasonLabel(report.reason)}
              size="small"
              color="primary"
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Reporter Info */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Person fontSize="small" />
          Reporter
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2 }}>
          <Avatar src={report.reporter?.profilePic} sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {report.reporter?.username || 'Unknown User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {report.reporter?.email || 'No email'}
            </Typography>
          </Box>
        </Box>

        {/* Reported User/Post Info */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Flag fontSize="small" />
          Reported Content
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: alpha(theme.palette.error.main, 0.04), borderRadius: 2 }}>
          <Avatar src={report.reportedUser?.profilePic} sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {report.reportedUser?.username || report.reportedPost?.title || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {report.reportedUser?.email || 'User/Content reported'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Report Details */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
              <Box>
                <Typography variant="caption" color="text.secondary">Reported At</Typography>
                <Typography variant="body2">{formatDate(report.createdAt, 'MMM dd, yyyy HH:mm')}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Description sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
              <Box>
                <Typography variant="caption" color="text.secondary">Reason</Typography>
                <Typography variant="body2">{getReasonLabel(report.reason)}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {report.description && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">Description</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, p: 2, bgcolor: alpha(theme.palette.common.white, 0.05), borderRadius: 2 }}>
              {report.description}
            </Typography>
          </Box>
        )}

        {report.resolvedAt && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">Resolved At</Typography>
            <Typography variant="body2">{formatDate(report.resolvedAt, 'MMM dd, yyyy HH:mm')}</Typography>
          </Box>
        )}

        {report.action && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">Action Taken</Typography>
            <Typography variant="body2">
              <Chip label={report.action} size="small" color="info" sx={{ borderRadius: 2 }} />
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default ReportDetailDialog