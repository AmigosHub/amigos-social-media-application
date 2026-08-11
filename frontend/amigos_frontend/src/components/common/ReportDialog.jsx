
// src/components/common/ReportDialog.jsx
import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material'
import { Report } from '@mui/icons-material'
import { REPORT_REASONS } from '../../api/report'

const ReportDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  reportType,
  targetName,
  loading = false,
  error = null,
}) => {
  const theme = useTheme()
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    if (reason) {
      onSubmit({ reason, description })
    }
  }

  const handleClose = () => {
    setReason('')
    setDescription('')
    onClose()
  }

  const getTitle = () => {
    switch (reportType) {
      case 'user':
        return 'Report User'
      case 'post':
        return 'Report Post'
      case 'comment':
        return 'Report Comment'
      default:
        return 'Report'
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3 }
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Report sx={{ color: theme.palette.error.main }} />
        {getTitle()}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {targetName && `Reporting ${targetName}`}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Report Reason</InputLabel>
          <Select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            label="Report Reason"
            sx={{ borderRadius: 2 }}
          >
            {REPORT_REASONS.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Additional Details (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please provide any additional information about this report..."
          sx={{ 
            '& .MuiOutlinedInput-root': { borderRadius: 2 }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          color="error"
          disabled={!reason || loading}
          sx={{ borderRadius: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit Report'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReportDialog