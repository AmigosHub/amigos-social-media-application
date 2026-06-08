
// src/components/LoadingSkeleton.jsx - Responsive version
import { Skeleton, Card, CardContent, Box, useTheme, alpha } from '@mui/material'

const LoadingSkeleton = () => {
  const theme = useTheme()

  return (
    <>
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          elevation={0}
          sx={{
            mb: { xs: 2, sm: 3 },
            borderRadius: { xs: 2, sm: 3, md: 4 },
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', alignItems: 'center' }}>
            <Skeleton variant="circular" width={40} height={40} animation="wave" />
            <Box sx={{ ml: 2, flex: 1 }}>
              <Skeleton variant="text" width={120} height={24} animation="wave" />
              <Skeleton variant="text" width={80} height={20} animation="wave" />
            </Box>
          </Box>
          <Skeleton
            variant="rectangular"
            height={{ xs: 300, sm: 400 }}
            animation="wave"
            sx={{ borderRadius: 2, mx: { xs: 1, sm: 2 } }}
          />
          <CardContent sx={{ px: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Skeleton variant="circular" width={32} height={32} animation="wave" />
              <Skeleton variant="circular" width={32} height={32} animation="wave" />
              <Skeleton variant="circular" width={32} height={32} animation="wave" />
            </Box>
            <Skeleton variant="text" width={80} height={24} animation="wave" />
            <Skeleton variant="text" width="100%" height={20} animation="wave" />
            <Skeleton variant="text" width="90%" height={20} animation="wave" />
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default LoadingSkeleton