// src/components/admin/AdminSkeleton.jsx
import { Skeleton, Box, Card, CardContent, Grid, useTheme, alpha } from '@mui/material'

const AdminSkeleton = () => {
  const theme = useTheme()

  return (
    <Box>
      {/* Header Skeleton */}
      <Skeleton variant="text" width={250} height={40} sx={{ mb: 3 }} />

      {/* Stats Cards Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
            <Card
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
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Skeleton */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
            <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto', display: 'block' }} />
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminSkeleton