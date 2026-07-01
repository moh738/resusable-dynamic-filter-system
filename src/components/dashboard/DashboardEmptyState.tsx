import { Paper, Typography } from '@mui/material'

export const DashboardEmptyState = () => (
  <Paper className="noResults" elevation={0}>
    <Typography variant="h6" gutterBottom>
      No filters yet
    </Typography>
    <Typography color="text.secondary">
      Add a filter condition to start narrowing the results.
    </Typography>
  </Paper>
)
