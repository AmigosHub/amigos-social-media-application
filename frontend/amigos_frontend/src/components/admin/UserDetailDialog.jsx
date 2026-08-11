// // src/components/admin/UserDetailDialog.jsx
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Avatar,
//   Typography,
//   Chip,
//   Divider,
//   Grid,
//   useTheme,
//   alpha,
//   IconButton,
// } from '@mui/material'
// import { Close, Email, Person, CalendarToday, Badge } from '@mui/icons-material'
// import { formatDate } from '../../utils/dateFormatter'

// const UserDetailDialog = ({ open, user, onClose }) => {
//   const theme = useTheme()

//   if (!user) return null

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       slotProps={{
//         paper: {
//           sx: { borderRadius: 3 }
//         }
//       }}
//     >
//       <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         User Details
//         <IconButton size="small" onClick={onClose}>
//           <Close />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent>
//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
//           <Avatar
//             src={user.profilePic}
//             sx={{
//               width: 100,
//               height: 100,
//               border: `3px solid ${theme.palette.primary.main}`,
//             }}
//           />
//           <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
//             {user.username}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {user.fullName}
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
//             <Chip
//               label={user.role}
//               size="small"
//               color={user.role === 'ADMIN' ? 'primary' : 'default'}
//               sx={{ borderRadius: 2 }}
//             />
//             <Chip
//               label={user.isActive ? 'Active' : 'Inactive'}
//               size="small"
//               color={user.isActive ? 'success' : 'error'}
//               sx={{ borderRadius: 2 }}
//             />
//             {user.isBanned && (
//               <Chip label="Banned" size="small" color="error" sx={{ borderRadius: 2 }} />
//             )}
//           </Box>
//         </Box>

//         <Divider sx={{ my: 2 }} />

//         <Grid container spacing={2}>
//           <Grid size={{ xs: 12, sm: 6 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Email sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
//               <Box>
//                 <Typography variant="caption" color="text.secondary">Email</Typography>
//                 <Typography variant="body2">{user.email}</Typography>
//               </Box>
//             </Box>
//           </Grid>
//           <Grid size={{ xs: 12, sm: 6 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Badge sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
//               <Box>
//                 <Typography variant="caption" color="text.secondary">User ID</Typography>
//                 <Typography variant="body2">#{user.id}</Typography>
//               </Box>
//             </Box>
//           </Grid>
//           <Grid size={{ xs: 12, sm: 6 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <CalendarToday sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
//               <Box>
//                 <Typography variant="caption" color="text.secondary">Joined</Typography>
//                 <Typography variant="body2">{formatDate(user.createdAt)}</Typography>
//               </Box>
//             </Box>
//           </Grid>
//           <Grid size={{ xs: 12, sm: 6 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Person sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
//               <Box>
//                 <Typography variant="caption" color="text.secondary">Bio</Typography>
//                 <Typography variant="body2">{user.bio || 'No bio'}</Typography>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 2 }} />

//         <Grid container spacing={2}>
//           <Grid size={{ xs: 4 }}>
//             <Box sx={{ textAlign: 'center' }}>
//               <Typography variant="h6">{user.postsCount || 0}</Typography>
//               <Typography variant="caption" color="text.secondary">Posts</Typography>
//             </Box>
//           </Grid>
//           <Grid size={{ xs: 4 }}>
//             <Box sx={{ textAlign: 'center' }}>
//               <Typography variant="h6">{user.followersCount || 0}</Typography>
//               <Typography variant="caption" color="text.secondary">Followers</Typography>
//             </Box>
//           </Grid>
//           <Grid size={{ xs: 4 }}>
//             <Box sx={{ textAlign: 'center' }}>
//               <Typography variant="h6">{user.followingCount || 0}</Typography>
//               <Typography variant="caption" color="text.secondary">Following</Typography>
//             </Box>
//           </Grid>
//         </Grid>

//         {user.bio && (
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="caption" color="text.secondary">Bio</Typography>
//             <Typography variant="body2" sx={{ mt: 0.5 }}>
//               {user.bio}
//             </Typography>
//           </Box>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2 }}>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default UserDetailDialog

// src/components/admin/UserDetailDialog.jsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Chip,
  Divider,
  Grid,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material'
import { Close, Email, Person, CalendarToday, Badge } from '@mui/icons-material'
import { formatDate } from '../../utils/dateFormatter'

const UserDetailDialog = React.memo(({ open, user, onClose }) => {
  const theme = useTheme()

  if (!user) return null

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
      <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        User Details
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={user.profilePic}
            sx={{
              width: 100,
              height: 100,
              border: `3px solid ${theme.palette.primary.main}`,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
            {user.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.fullName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip
              label={user.role}
              size="small"
              color={user.role === 'ADMIN' ? 'primary' : 'default'}
              sx={{ borderRadius: 2 }}
            />
            <Chip
              label={user.isActive ? 'Active' : 'Inactive'}
              size="small"
              color={user.isActive ? 'success' : 'error'}
              sx={{ borderRadius: 2 }}
            />
            {user.isBanned && (
              <Chip label="Banned" size="small" color="error" sx={{ borderRadius: 2 }} />
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
              <Box>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body2">{user.email}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Badge sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
              <Box>
                <Typography variant="caption" color="text.secondary">User ID</Typography>
                <Typography variant="body2">#{user.id}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
              <Box>
                <Typography variant="caption" color="text.secondary">Joined</Typography>
                <Typography variant="body2">{formatDate(user.createdAt)}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
              <Box>
                <Typography variant="caption" color="text.secondary">Bio</Typography>
                <Typography variant="body2">{user.bio || 'No bio'}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{user.postsCount || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Posts</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{user.followersCount || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Followers</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{user.followingCount || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Following</Typography>
            </Box>
          </Grid>
        </Grid>

        {user.bio && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">Bio</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {user.bio}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default UserDetailDialog