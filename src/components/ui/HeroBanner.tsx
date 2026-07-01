import { Box, Paper, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface HeroBannerProps {
  title: string
  description: string
  children?: ReactNode
}

export const HeroBanner = ({ title, description, children }: HeroBannerProps) => (
  <Paper className="hero" elevation={0}>
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary" maxWidth={860}>
      {description}
    </Typography>
    {children}
  </Paper>
)
