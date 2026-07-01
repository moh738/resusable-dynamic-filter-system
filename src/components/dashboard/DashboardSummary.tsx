import { Box } from '@mui/material'
import { StatCard } from '../ui/StatCard'

interface DashboardSummaryProps {
  total: number
  active: number
  filtered: number
}

export const DashboardSummary = ({ total, active, filtered }: DashboardSummaryProps) => (
  <Box className="summaryCards">
    <StatCard label="Total employees" value={total} />
    <StatCard label="Active employees" value={active} />
    <StatCard label="Filtered results" value={filtered} />
  </Box>
)
