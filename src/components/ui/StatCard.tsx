import { Paper, Typography } from '@mui/material'

interface StatCardProps {
  label: string
  value: string | number
}

export const StatCard = ({ label, value }: StatCardProps) => (
  <Paper className="summaryCard" elevation={0}>
    <Typography variant="overline" color="text.secondary">
      {label}
    </Typography>
    <Typography className="summaryValue">{value}</Typography>
  </Paper>
)
