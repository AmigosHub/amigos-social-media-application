// src/components/admin/TableSkeleton.jsx
import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme, alpha } from '@mui/material'

const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  const theme = useTheme()

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
          <TableRow>
            {Array.from({ length: cols }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" width={80} height={20} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton variant="text" width={colIndex === 0 ? 120 : 80} height={24} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableSkeleton