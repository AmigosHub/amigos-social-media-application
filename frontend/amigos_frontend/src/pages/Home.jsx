
// src/pages/Home.jsx
import { useEffect } from 'react'
import { Container, Grid, Box, Typography, useMediaQuery, useTheme, Button, CircularProgress } from '@mui/material'
import { usePosts } from '../context/PostContext'
import PostCard from '../components/posts/PostCard'
import LoadingSkeleton from '../components/common/LoadingSkeleton'
import { motion, AnimatePresence } from 'framer-motion'

const Home = () => {
  const { feedPosts, loading, hasMore, loadPosts, deletePost, totalElements } = usePosts()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    loadPosts()
  }, [])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadPosts(false)
    }
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  if (loading && feedPosts.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 3, px: { xs: 1, sm: 2, md: 3 } }}>
        <LoadingSkeleton />
      </Container>
    )
  }

  if (feedPosts.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 3, px: { xs: 1, sm: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
              No posts to show
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Follow some users or create your first post!
            </Typography>
          </Box>
        </motion.div>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2, md: 3 } }}>
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <AnimatePresence>
            {feedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <PostCard post={post} onDelete={deletePost} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <Button 
                variant="outlined" 
                onClick={handleLoadMore}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Load More'}
              </Button>
            </Box>
          )}
          
          {!hasMore && feedPosts.length > 0 && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                You've seen all posts ({totalElements})
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Removed SuggestedUsers section completely */}
        {!isMobile && (
          <Grid size={{ md: 5, lg: 4 }}>
            {/* Empty sidebar - can be used for future features */}
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default Home