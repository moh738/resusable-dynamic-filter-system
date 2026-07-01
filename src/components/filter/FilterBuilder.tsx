import { Box, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import type { FilterCondition, FilterFieldDefinition } from '../../types'
import { FilterRow } from './FilterRow'

interface FilterBuilderProps {
  fields: FilterFieldDefinition[]
  filters: FilterCondition[]
  onAddFilter: () => void
  onRemoveFilter: (id: string) => void
  onUpdateFilter: (id: string, next: Partial<FilterCondition>) => void
}

export const FilterBuilder = ({
  fields,
  filters,
  onAddFilter,
  onRemoveFilter,
  onUpdateFilter
}: FilterBuilderProps) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box>
      {filters.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Add a filter to begin narrowing the dataset.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {filters.map((condition) => (
            <FilterRow
              key={condition.id}
              condition={condition}
              fields={fields}
              onChange={(next) => onUpdateFilter(condition.id, next)}
              onRemove={() => onRemoveFilter(condition.id)}
            />
          ))}
        </Stack>
      )}
      <Box sx={{ display: 'flex', justifyContent: isSmall ? 'center' : 'flex-end', mt: 2 }}>
        <Button fullWidth={isSmall} variant="contained" onClick={onAddFilter}>
          Add filter condition
        </Button>
      </Box>
    </Box>
  )
}
