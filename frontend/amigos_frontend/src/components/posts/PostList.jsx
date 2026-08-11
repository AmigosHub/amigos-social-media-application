// src/components/posts/PostList.jsx
import { Box, Container } from '@mui/material'
import PostCard from './PostCard'
import LoadingSkeleton from '../common/LoadingSkeleton'

const PostList = ({ posts, loading, onDelete, hasMore, loadMore }) => {
  if (loading && posts.length === 0) {
    return (
      <Container maxWidth="md">
        <LoadingSkeleton />
      </Container>
    )
  }

  if (posts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No posts to show
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Follow some users or create your first post!
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={onDelete} />
      ))}
      {loading && <LoadingSkeleton />}
      {hasMore && !loading && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Button onClick={loadMore} variant="outlined" sx={{ borderRadius: 2 }}>
            Load More
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default PostList