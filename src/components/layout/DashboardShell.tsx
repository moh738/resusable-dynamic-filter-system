import { Box, Container } from '@mui/material'
import type { ReactNode } from 'react'

interface DashboardShellProps {
  children: ReactNode
}

export const DashboardShell = ({ children }: DashboardShellProps) => (
  <Container maxWidth="xl" sx={{ py: 4 }}>
    <Box>{children}</Box>
  </Container>
)
