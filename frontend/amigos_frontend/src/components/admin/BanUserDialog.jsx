// src/components/admin/BanUserDialog.jsx
import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Avatar,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material'
import { adminAPI } from '../../api/admin'

const BanUserDialog = ({ open, user, onClose, onBanSuccess }) => {
  const theme = useTheme()
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) return null

  const handleBan = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for banning')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await adminAPI.banUser(user.id, {
        reason: reason.trim(),
        duration: duration || 'Permanent',
      })
      if (response.success) {
        onClose()
        if (onBanSuccess) onBanSuccess()
      } else {
        setError(response.message || 'Failed to ban user')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to ban user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3 }
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Ban User
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar src={user.profilePic} sx={{ width: 48, height: 48 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Reason for Ban"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please provide a reason for banning this user..."
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth>
          <InputLabel>Duration</InputLabel>
          <Select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            label="Duration"
          >
            <MenuItem value="">Permanent</MenuItem>
            <MenuItem value="1 day">1 Day</MenuItem>
            <MenuItem value="3 days">3 Days</MenuItem>
            <MenuItem value="7 days">7 Days</MenuItem>
            <MenuItem value="14 days">14 Days</MenuItem>
            <MenuItem value="30 days">30 Days</MenuItem>
          </Select>
        </FormControl>

        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: alpha(theme.palette.error.main, 0.05),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
          }}
        >
          <Typography variant="caption" color="error.main">
            ⚠️ This action will prevent the user from accessing the platform.
            All their posts and content will be hidden.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleBan}
          variant="contained"
          color="error"
          disabled={loading || !reason.trim()}
          sx={{ borderRadius: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Ban User'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BanUserDialog