// src/components/comments/CommentList.jsx
import { Box, Typography } from '@mui/material'
import CommentItem from './CommentItem'

const CommentList = ({ comments, onDelete, isOwner }) => {
  if (!comments || comments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
        No comments yet
      </Typography>
    )
  }

  return (
    <Box>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onDelete={onDelete}
          isOwner={isOwner}
        />
      ))}
    </Box>
  )
}

export default CommentList