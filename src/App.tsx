import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { Download } from 'lucide-react'
import { FilterBuilder } from './components/filter/FilterBuilder'
import { DataTable } from './components/table/DataTable'
import { DashboardSummary } from './components/dashboard/DashboardSummary'
import { employeeFilterFields } from './constants/filterFields'
import { applyFilters } from './utils/filterUtils'
import { useFilterStore } from './store/filterStore'
import { fetchEmployees } from './api/mockApi'
import employeeData from './data/employees.json'
import type { Employee, SortConfig } from './types'
import './App.css'

const initialSort: SortConfig = { sortBy: 'name', direction: 'asc' }

function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort)
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))

  const filters = useFilterStore((state) => state.filters)
  const addFilter = useFilterStore((state) => state.addFilter)
  const removeFilter = useFilterStore((state) => state.removeFilter)
  const updateFilter = useFilterStore((state) => state.updateFilter)
  const clearFilters = useFilterStore((state) => state.clearFilters)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const data = await fetchEmployees().catch(() => employeeData as any)
        setEmployees(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filteredEmployees = useMemo(() => {
    const filtered = applyFilters(employees, filters, employeeFilterFields)
    if (!searchTerm.trim()) {
      return filtered
    }

    const search = searchTerm.trim().toLowerCase()
    return filtered.filter((employee) =>
      [
        employee.name,
        employee.email,
        employee.department,
        employee.role,
        employee.address.city,
        employee.address.state,
        employee.address.country,
        employee.skills.join(', '),
        String(employee.salary),
        String(employee.projects),
        String(employee.performanceRating)
      ]
        .join(' ')
        .toLowerCase()
        .includes(search)
    )
  }, [employees, filters, searchTerm])

  const activeEmployees = useMemo(
    () => employees.filter((employee) => employee.isActive).length,
    [employees]
  )

  const [page, setPage] = useState(1)
  const pageSize = 10

  const sortedEmployees = useMemo(() => {
    const rows = [...filteredEmployees]
    const comparer = (rowA: Employee, rowB: Employee) => {
      const valueA = String(rowA[sortConfig.sortBy as keyof Employee] ?? '')
      const valueB = String(rowB[sortConfig.sortBy as keyof Employee] ?? '')
      return sortConfig.direction === 'asc'
        ? valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: 'base' })
        : valueB.localeCompare(valueA, undefined, { numeric: true, sensitivity: 'base' })
    }
    rows.sort(comparer)
    return rows
  }, [filteredEmployees, sortConfig])

  const totalPages = Math.max(1, Math.ceil(sortedEmployees.length / pageSize))
  const pagedEmployees = useMemo(
    () => sortedEmployees.slice((page - 1) * pageSize, page * pageSize),
    [page, sortedEmployees]
  )

  const showingFrom = sortedEmployees.length === 0 ? 0 : (page - 1) * pageSize + 1
  const showingTo = Math.min(sortedEmployees.length, page * pageSize)

  useEffect(() => {
    if (page > totalPages) {
      setPage(1)
    }
  }, [page, totalPages])

  useEffect(() => {
    setPage(1)
  }, [filteredEmployees])

  const handleSort = (sortBy: string) => {
    setSortConfig((current) => ({
      sortBy,
      direction: current.sortBy === sortBy && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const downloadCsv = () => {
    const headers = [
      'Name',
      'Email',
      'Department',
      'Role',
      'Salary',
      'Join Date',
      'Active',
      'City',
      'Projects',
      'Performance Rating',
      'Skills'
    ]
    const rows = sortedEmployees.map((row) => [
      row.name,
      row.email,
      row.department,
      row.role,
      row.salary,
      row.joinDate,
      row.isActive ? 'Yes' : 'No',
      row.address.city,
      row.projects,
      row.performanceRating,
      row.skills.join('; ')
    ])
    const csvContent = [headers, ...rows]
      .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'filtered-employees.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper className="hero" elevation={0}>
        <Typography variant="h4" gutterBottom>
          Dynamic Filter Component System
        </Typography>
        <DashboardSummary
          total={employees.length}
          active={activeEmployees}
          filtered={filteredEmployees.length}
        />
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Paper className="panel" elevation={2}>
            <Box className="panelHeader" sx={{ flexDirection: isSmall ? 'column' : 'row', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', width: '100%' }}>
                <Box>
                  <Typography variant="h6">Filter Builder</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create filter conditions dynamically and update results instantly.
                  </Typography>
                </Box>
                <Button
                  color="error"
                  size="small"
                  onClick={clearFilters}
                  disabled={filters.length === 0}
                >
                  Clear all filters
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <FilterBuilder
              fields={employeeFilterFields}
              filters={filters}
              onAddFilter={addFilter}
              onRemoveFilter={removeFilter}
              onUpdateFilter={updateFilter}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Paper className="panel" elevation={2}>
            <Box className="panelHeader" sx={{ flexDirection: isSmall ? 'column' : 'row', alignItems: 'flex-start', gap: 2, width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minWidth: 0 }}>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isSmall ? 'center' : 'flex-end', width: '100%', gap: 1, flexWrap: 'wrap' }}>
                <TextField
                  sx={{ flex: 1, minWidth: isSmall ? '100%' : 240 }}
                  size="small"
                  variant="outlined"
                  placeholder="Search table..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <Button variant="outlined" onClick={downloadCsv} startIcon={<Download />}>
                  Export CSV
                </Button>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <DataTable
              data={pagedEmployees}
              loading={loading}
              sortConfig={sortConfig}
              onSort={handleSort}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {showingFrom} - {showingTo} of {sortedEmployees.length} entries
              </Typography>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
