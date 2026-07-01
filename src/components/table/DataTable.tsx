import {
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { ArrowDown, ArrowUp } from 'lucide-react'
import type { Employee, SortConfig } from '../../types'

interface DataTableProps {
  data: Employee[]
  loading: boolean
  sortConfig: SortConfig
  onSort: (sortBy: string) => void
}

const formatValue = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  if (typeof value === 'object' && value !== null) {
    return Object.values(value).join(', ')
  }

  return String(value ?? '')
}

export const DataTable = ({ data, loading, sortConfig, onSort }: DataTableProps) => {
  return (
    <Box>
      {loading ? <LinearProgress /> : null}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { label: 'Name', key: 'name' },
                { label: 'Email', key: 'email' },
                { label: 'Department', key: 'department' },
                { label: 'Role', key: 'role' },
                { label: 'Salary', key: 'salary' },
                { label: 'Join Date', key: 'joinDate' },
                { label: 'Active', key: 'isActive' },
                { label: 'City', key: 'address' },
                { label: 'Projects', key: 'projects' },
                { label: 'Performance', key: 'performanceRating' }
              ].map((column) => (
                <TableCell
                  key={column.key}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onSort(column.key)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {column.label}
                    {sortConfig.sortBy === column.key ? (
                      sortConfig.direction === 'asc' ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      )
                    ) : null}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10}>
                  <Typography className="noResults" color="text.secondary">
                    No results found for the current filter selection.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.salary}</TableCell>
                  <TableCell>{row.joinDate}</TableCell>
                  <TableCell>{row.isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{row.address.city}</TableCell>
                  <TableCell>{row.projects}</TableCell>
                  <TableCell>{row.performanceRating}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
