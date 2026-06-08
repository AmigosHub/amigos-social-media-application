// src/components/TrendingSection.jsx
import { Box, Typography, Chip, Paper, useTheme, alpha } from '@mui/material'
import { TrendingUp, Tag, MusicNote, LocationOn } from '@mui/icons-material'

const TrendingSection = () => {
  const theme = useTheme()

  const trendingTopics = [
    { id: 1, topic: '#DesignInspiration', posts: '12.5K', icon: <Tag fontSize="small" /> },
    { id: 2, topic: '#React2026', posts: '8.2K', icon: <Tag fontSize="small" /> },
    { id: 3, topic: 'Summer Vibes', posts: '45.3K', icon: <MusicNote fontSize="small" /> },
    { id: 4, topic: 'Tech Conference', posts: '3.1K', icon: <LocationOn fontSize="small" /> },
  ]

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TrendingUp sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Trending Now
        </Typography>
      </Box>

      {trendingTopics.map((topic, index) => (
        <Box
          key={topic.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1.5,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateX(4px)',
              color: theme.palette.primary.main,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 600,
                minWidth: 24,
              }}
            >
              #{index + 1}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {topic.icon}
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {topic.topic}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            {topic.posts} posts
          </Typography>
        </Box>
      ))}
    </Paper>
  )
}

export default TrendingSection