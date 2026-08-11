// src/components/admin/StatsSkeleton.jsx
import { Skeleton, Grid, Paper, Box, useTheme, alpha } from '@mui/material'

const StatsSkeleton = ({ count = 4 }) => {
  const theme = useTheme()

  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width={80} height={40} />
                <Skeleton variant="text" width={120} height={20} sx={{ mt: 0.5 }} />
                <Skeleton variant="text" width={100} height={16} sx={{ mt: 0.5 }} />
              </Box>
              <Skeleton variant="circular" width={56} height={56} />
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default StatsSkeleton