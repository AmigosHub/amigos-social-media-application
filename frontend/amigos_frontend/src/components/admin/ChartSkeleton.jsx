// src/components/admin/ChartSkeleton.jsx
import { Skeleton, Paper, Box, Grid, useTheme, alpha } from '@mui/material'

const ChartSkeleton = () => {
  const theme = useTheme()

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={80} height={20} />
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
          <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto', display: 'block' }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Skeleton variant="text" width={60} height={16} />
            <Skeleton variant="text" width={60} height={16} />
            <Skeleton variant="text" width={60} height={16} />
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
        </Paper>
      </Grid>
    </Grid>
  )
}

export default ChartSkeleton