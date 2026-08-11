// // src/components/admin/UserManagement.jsx
// import { useState, useEffect } from 'react'
// import {
//   Box,
//   Paper,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Avatar,
//   Chip,
//   IconButton,
//   TextField,
//   InputAdornment,
//   Button,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   useTheme,
//   alpha,
//   Tooltip,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from '@mui/material'
// import {
//   Search,
//   Block,
//   CheckCircle,
//   Delete,
//   Visibility,
//   Refresh,
//   BanUser,
// } from '@mui/icons-material'
// import { useAdmin } from '../../context/AdminContext'
// import { adminAPI } from '../../api/admin'
// import UserDetailDialog from './UserDetailDialog'
// import BanUserDialog from './BanUserDialog'

// const UserManagement = () => {
//   const theme = useTheme()
//   const { loadUsers, users, totalUsers, loadPendingReports } = useAdmin()
//   const [page, setPage] = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(20)
//   const [search, setSearch] = useState('')
//   const [roleFilter, setRoleFilter] = useState('')
//   const [statusFilter, setStatusFilter] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [userDetailOpen, setUserDetailOpen] = useState(false)
//   const [banDialogOpen, setBanDialogOpen] = useState(false)
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

//   useEffect(() => {
//     fetchUsers()
//   }, [page, rowsPerPage, search, roleFilter, statusFilter])

//   const fetchUsers = async () => {
//     setLoading(true)
//     try {
//       const isActive = statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : null
//       await loadUsers(page, rowsPerPage, search, roleFilter, isActive)
//     } catch (error) {
//       console.error('Error fetching users:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSearch = (e) => {
//     setSearch(e.target.value)
//     setPage(0)
//   }

//   const handleRoleFilter = (e) => {
//     setRoleFilter(e.target.value)
//     setPage(0)
//   }

//   const handleStatusFilter = (e) => {
//     setStatusFilter(e.target.value)
//     setPage(0)
//   }

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage)
//   }

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10))
//     setPage(0)
//   }

//   const handleViewUser = (user) => {
//     setSelectedUser(user)
//     setUserDetailOpen(true)
//   }

//   const handleToggleActive = async (user) => {
//     try {
//       const response = user.isActive 
//         ? await adminAPI.deactivateUser(user.id)
//         : await adminAPI.activateUser(user.id)
      
//       if (response.success) {
//         setSnackbar({
//           open: true,
//           message: `User ${user.isActive ? 'deactivated' : 'activated'} successfully`,
//           severity: 'success'
//         })
//         await fetchUsers()
//         await loadPendingReports()
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || 'Failed to update user status',
//         severity: 'error'
//       })
//     }
//   }

//   const handleBanUser = (user) => {
//     setSelectedUser(user)
//     setBanDialogOpen(true)
//   }

//   const handleUnbanUser = async (userId) => {
//     try {
//       const response = await adminAPI.unbanUser(userId)
//       if (response.success) {
//         setSnackbar({
//           open: true,
//           message: 'User unbanned successfully',
//           severity: 'success'
//         })
//         await fetchUsers()
//         await loadPendingReports()
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || 'Failed to unban user',
//         severity: 'error'
//       })
//     }
//   }

//   const handleDeleteUser = async (userId) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return

//     try {
//       const response = await adminAPI.deleteUser(userId)
//       if (response.success) {
//         setSnackbar({
//           open: true,
//           message: 'User deleted successfully',
//           severity: 'success'
//         })
//         await fetchUsers()
//         await loadPendingReports()
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || 'Failed to delete user',
//         severity: 'error'
//       })
//     }
//   }

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false })
//   }

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h5" sx={{ fontWeight: 700 }}>
//           User Management
//         </Typography>
//         <Button
//           variant="outlined"
//           startIcon={<Refresh />}
//           onClick={fetchUsers}
//           sx={{ borderRadius: 2 }}
//         >
//           Refresh
//         </Button>
//       </Box>

//       {/* Filters */}
//       <Paper
//         sx={{
//           p: 2,
//           mb: 3,
//           borderRadius: 3,
//           border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//           display: 'flex',
//           flexDirection: { xs: 'column', sm: 'row' },
//           gap: 2,
//         }}
//       >
//         <TextField
//           size="small"
//           placeholder="Search users..."
//           value={search}
//           onChange={handleSearch}
//           sx={{ flex: 1, minWidth: 150 }}
//           slotProps={{
//             input: {
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search />
//                 </InputAdornment>
//               ),
//             },
//           }}
//         />
//         <FormControl size="small" sx={{ minWidth: 120 }}>
//           <InputLabel>Role</InputLabel>
//           <Select value={roleFilter} onChange={handleRoleFilter} label="Role">
//             <MenuItem value="">All</MenuItem>
//             <MenuItem value="USER">User</MenuItem>
//             <MenuItem value="ADMIN">Admin</MenuItem>
//           </Select>
//         </FormControl>
//         <FormControl size="small" sx={{ minWidth: 120 }}>
//           <InputLabel>Status</InputLabel>
//           <Select value={statusFilter} onChange={handleStatusFilter} label="Status">
//             <MenuItem value="">All</MenuItem>
//             <MenuItem value="active">Active</MenuItem>
//             <MenuItem value="inactive">Inactive</MenuItem>
//           </Select>
//         </FormControl>
//       </Paper>

//       {/* Users Table */}
//       <Paper
//         sx={{
//           borderRadius: 3,
//           border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//           overflow: 'hidden',
//         }}
//       >
//         <TableContainer>
//           <Table>
//             <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
//               <TableRow>
//                 <TableCell>User</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Role</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Posts</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
//                     <CircularProgress />
//                   </TableCell>
//                 </TableRow>
//               ) : users.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
//                     <Typography color="text.secondary">No users found</Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 users.map((user) => (
//                   <TableRow key={user.id} hover>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Avatar src={user.profilePic} sx={{ width: 40, height: 40 }} />
//                         <Box>
//                           <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                             {user.username}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             {user.fullName}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </TableCell>
//                     <TableCell>{user.email}</TableCell>
//                     <TableCell>
//                       <Chip
//                         label={user.role}
//                         size="small"
//                         color={user.role === 'ADMIN' ? 'primary' : 'default'}
//                         sx={{ borderRadius: 2 }}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Chip
//                           label={user.isActive ? 'Active' : 'Inactive'}
//                           size="small"
//                           color={user.isActive ? 'success' : 'error'}
//                           sx={{ borderRadius: 2 }}
//                         />
//                         {user.isBanned && (
//                           <Chip
//                             label="Banned"
//                             size="small"
//                             color="error"
//                             sx={{ borderRadius: 2 }}
//                           />
//                         )}
//                       </Box>
//                     </TableCell>
//                     <TableCell>{user.postsCount || 0}</TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', gap: 0.5 }}>
//                         <Tooltip title="View Details" arrow>
//                           <IconButton size="small" onClick={() => handleViewUser(user)}>
//                             <Visibility fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip title={user.isActive ? 'Deactivate' : 'Activate'} arrow>
//                           <IconButton 
//                             size="small" 
//                             onClick={() => handleToggleActive(user)}
//                             color={user.isActive ? 'warning' : 'success'}
//                           >
//                             {user.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
//                           </IconButton>
//                         </Tooltip>
//                         {!user.isBanned ? (
//                           <Tooltip title="Ban User" arrow>
//                             <IconButton 
//                               size="small" 
//                               onClick={() => handleBanUser(user)}
//                               color="error"
//                             >
//                               <BanUser fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         ) : (
//                           <Tooltip title="Unban User" arrow>
//                             <IconButton 
//                               size="small" 
//                               onClick={() => handleUnbanUser(user.id)}
//                               color="success"
//                             >
//                               <CheckCircle fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         )}
//                         <Tooltip title="Delete User" arrow>
//                           <IconButton 
//                             size="small" 
//                             onClick={() => handleDeleteUser(user.id)}
//                             color="error"
//                           >
//                             <Delete fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[10, 20, 50]}
//           component="div"
//           count={totalUsers}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>

//       {/* Dialogs */}
//       <UserDetailDialog
//         open={userDetailOpen}
//         user={selectedUser}
//         onClose={() => setUserDetailOpen(false)}
//       />
//       <BanUserDialog
//         open={banDialogOpen}
//         user={selectedUser}
//         onClose={() => setBanDialogOpen(false)}
//         onBanSuccess={fetchUsers}
//       />

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   )
// }

// export default UserManagement

// src/components/admin/UserManagement.jsx
import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Search,
  Block,
  CheckCircle,
  Delete,
  Visibility,
  Refresh,
  BanUser,
} from '@mui/icons-material'
import { useAdmin } from '../../context/AdminContext'
import { adminAPI } from '../../api/admin'
import UserDetailDialog from './UserDetailDialog'
import BanUserDialog from './BanUserDialog'

// Memoized User Row Component
const UserRow = React.memo(({ user, onView, onToggleActive, onBan, onUnban, onDelete }) => {
  const theme = useTheme()

  return (
    <TableRow hover>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user.profilePic} sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.fullName}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Chip
          label={user.role}
          size="small"
          color={user.role === 'ADMIN' ? 'primary' : 'default'}
          sx={{ borderRadius: 2 }}
        />
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={user.isActive ? 'Active' : 'Inactive'}
            size="small"
            color={user.isActive ? 'success' : 'error'}
            sx={{ borderRadius: 2 }}
          />
          {user.isBanned && (
            <Chip
              label="Banned"
              size="small"
              color="error"
              sx={{ borderRadius: 2 }}
            />
          )}
        </Box>
      </TableCell>
      <TableCell>{user.postsCount || 0}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Details" arrow>
            <IconButton size="small" onClick={() => onView(user)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={user.isActive ? 'Deactivate' : 'Activate'} arrow>
            <IconButton 
              size="small" 
              onClick={() => onToggleActive(user)}
              color={user.isActive ? 'warning' : 'success'}
            >
              {user.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
            </IconButton>
          </Tooltip>
          {!user.isBanned ? (
            <Tooltip title="Ban User" arrow>
              <IconButton 
                size="small" 
                onClick={() => onBan(user)}
                color="error"
              >
                <BanUser fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Unban User" arrow>
              <IconButton 
                size="small" 
                onClick={() => onUnban(user.id)}
                color="success"
              >
                <CheckCircle fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete User" arrow>
            <IconButton 
              size="small" 
              onClick={() => onDelete(user.id)}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  )
})

const UserManagement = React.memo(() => {
  const theme = useTheme()
  const { loadUsers, users, totalUsers, loadPendingReports } = useAdmin()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetailOpen, setUserDetailOpen] = useState(false)
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    fetchUsers()
  }, [page, rowsPerPage, search, roleFilter, statusFilter])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const isActive = statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : null
      await loadUsers(page, rowsPerPage, search, roleFilter, isActive)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage, search, roleFilter, statusFilter, loadUsers])

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value)
    setPage(0)
  }, [])

  const handleRoleFilter = useCallback((e) => {
    setRoleFilter(e.target.value)
    setPage(0)
  }, [])

  const handleStatusFilter = useCallback((e) => {
    setStatusFilter(e.target.value)
    setPage(0)
  }, [])

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage)
  }, [])

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }, [])

  const handleViewUser = useCallback((user) => {
    setSelectedUser(user)
    setUserDetailOpen(true)
  }, [])

  const handleToggleActive = useCallback(async (user) => {
    try {
      const response = user.isActive 
        ? await adminAPI.deactivateUser(user.id)
        : await adminAPI.activateUser(user.id)
      
      if (response.success) {
        setSnackbar({
          open: true,
          message: `User ${user.isActive ? 'deactivated' : 'activated'} successfully`,
          severity: 'success'
        })
        await fetchUsers()
        await loadPendingReports()
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update user status',
        severity: 'error'
      })
    }
  }, [fetchUsers, loadPendingReports])

  const handleBanUser = useCallback((user) => {
    setSelectedUser(user)
    setBanDialogOpen(true)
  }, [])

  const handleUnbanUser = useCallback(async (userId) => {
    try {
      const response = await adminAPI.unbanUser(userId)
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'User unbanned successfully',
          severity: 'success'
        })
        await fetchUsers()
        await loadPendingReports()
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to unban user',
        severity: 'error'
      })
    }
  }, [fetchUsers, loadPendingReports])

  const handleDeleteUser = useCallback(async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await adminAPI.deleteUser(userId)
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'User deleted successfully',
          severity: 'success'
        })
        await fetchUsers()
        await loadPendingReports()
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to delete user',
        severity: 'error'
      })
    }
  }, [fetchUsers, loadPendingReports])

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar({ ...snackbar, open: false })
  }, [snackbar])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          User Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchUsers}
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {/* Filters */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <TextField
          size="small"
          placeholder="Search users..."
          value={search}
          onChange={handleSearch}
          sx={{ flex: 1, minWidth: 150 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Role</InputLabel>
          <Select value={roleFilter} onChange={handleRoleFilter} label="Role">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} onChange={handleStatusFilter} label="Status">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Users Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : (
        <Paper
          sx={{
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Posts</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No users found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onView={handleViewUser}
                      onToggleActive={handleToggleActive}
                      onBan={handleBanUser}
                      onUnban={handleUnbanUser}
                      onDelete={handleDeleteUser}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={totalUsers}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Dialogs */}
      <UserDetailDialog
        open={userDetailOpen}
        user={selectedUser}
        onClose={() => setUserDetailOpen(false)}
      />
      <BanUserDialog
        open={banDialogOpen}
        user={selectedUser}
        onClose={() => setBanDialogOpen(false)}
        onBanSuccess={fetchUsers}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
})

export default UserManagement