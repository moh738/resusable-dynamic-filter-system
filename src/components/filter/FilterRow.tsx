import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import type {
  FilterCondition,
  FilterFieldDefinition,
  OperatorType
} from '../../types'
import { fieldOperators, operatorLabels } from '../../constants/filterOperators'

interface FilterRowProps {
  condition: FilterCondition
  fields: FilterFieldDefinition[]
  onChange: (next: Partial<FilterCondition>) => void
  onRemove: () => void
}

const castValue = (value: unknown, type: string) => {
  if (type === 'boolean') {
    return Boolean(value)
  }
  return value
}

const getOptions = (field: FilterFieldDefinition) => field.options ?? []

export const FilterRow = ({ condition, fields, onChange, onRemove }: FilterRowProps) => {
  const field = fields.find((item) => item.key === condition.fieldKey) ?? fields[0]
  const operators = fieldOperators[field.type]
  const options = getOptions(field)
  const [range, setRange] = useState({
    from: '',
    to: ''
  })

  useEffect(() => {
    if (typeof condition.value === 'object' && condition.value !== null) {
      const parsed = condition.value as { from?: unknown; to?: unknown }
      setRange({
        from: parsed.from === undefined ? '' : String(parsed.from),
        to: parsed.to === undefined ? '' : String(parsed.to)
      })
    } else {
      setRange({ from: '', to: '' })
    }
  }, [condition.value])

  const operator = useMemo(
    () => operators.includes(condition.operator) ? condition.operator : operators[0],
    [condition.operator, operators]
  )

  const handleFieldChange = (event: SelectChangeEvent<string>) => {
    const nextKey = event.target.value
    const nextField = fields.find((item) => item.key === nextKey) ?? field
    const nextOperator = fieldOperators[nextField.type][0]
    setRange({ from: '', to: '' })
    onChange({ fieldKey: nextKey, operator: nextOperator, value: '' })
  }

  const handleOperatorChange = (event: SelectChangeEvent<string>) => {
    const nextOperator = event.target.value as OperatorType
    setRange({ from: '', to: '' })
    onChange({ operator: nextOperator, value: '' })
  }

  const handleValueChange = (value: unknown) => {
    onChange({ value })
  }

  const handleRangeValueChange = (next: Partial<typeof range>) => {
    const updated = { ...range, ...next }
    setRange(updated)
    onChange({ value: updated })
  }

  const valueInput = () => {
    if (field.type === 'text') {
      return (
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={String(condition.value ?? '')}
          onChange={(event) => handleValueChange(event.target.value)}
          placeholder="Enter value"
          inputProps={{ style: { minWidth: 0 } }}
        />
      )
    }

    if (field.type === 'number') {
      if (operator === 'between') {
        const rangeValue = typeof condition.value === 'object' && condition.value ? (condition.value as any) : {}
        return (
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={String(rangeValue.from ?? '')}
              onChange={(event) => handleRangeValueChange({ from: event.target.value === '' ? undefined : Number(event.target.value) })}
              placeholder="Min"
            />
            <TextField
              fullWidth
              size="small"
              type="number"
              value={String(rangeValue.to ?? '')}
              onChange={(event) => handleRangeValueChange({ to: event.target.value === '' ? undefined : Number(event.target.value) })}
              placeholder="Max"
            />
          </Stack>
        )
      }

      return (
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          type="number"
          value={String(condition.value ?? '')}
          onChange={(event) => handleValueChange(event.target.value === '' ? '' : Number(event.target.value))}
          placeholder="Enter number"
        />
      )
    }

    if (field.type === 'date') {
      if (operator === 'between') {
        return (
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={typeof condition.value === 'object' && condition.value ? (condition.value as any).from ?? '' : ''}
              onChange={(event) => handleRangeValueChange({ from: event.target.value })}
            />
            <TextField
              fullWidth
              size="small"
              type="date"
              value={typeof condition.value === 'object' && condition.value ? (condition.value as any).to ?? '' : ''}
              onChange={(event) => handleRangeValueChange({ to: event.target.value })}
            />
          </Stack>
        )
      }

      return (
        <TextField
          fullWidth
          size="small"
          type="date"
          value={String(condition.value ?? '')}
          onChange={(event) => handleValueChange(event.target.value)}
        />
      )
    }

    if (field.type === 'select') {
      return (
        <FormControl fullWidth>
          <InputLabel id={`value-select-${condition.id}`}>Value</InputLabel>
          <Select
            labelId={`value-select-${condition.id}`}
            value={String(condition.value ?? '')}
            label="Value"
            size="small"
            onChange={(event) => handleValueChange(event.target.value)}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    }

    if (field.type === 'multi-select') {
      return (
        <FormControl fullWidth>
          <InputLabel id={`multi-value-${condition.id}`}>Values</InputLabel>
          <Select
            labelId={`multi-value-${condition.id}`}
            multiple
            value={(condition.value as string[]) ?? []}
            label="Values"
            size="small"
            onChange={(event) => handleValueChange(event.target.value as string[])}
            renderValue={(selected) => (selected as string[]).join(', ')}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={((condition.value as string[]) ?? []).includes(option.value)} />
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    }

    if (field.type === 'boolean') {
      return (
        <ToggleButtonGroup
          value={String(castValue(condition.value, field.type) ?? 'true')}
          exclusive
          size="small"
          onChange={(_, selected) => selected !== null && handleValueChange(selected === 'true')}
        >
          <ToggleButton value="true">True</ToggleButton>
          <ToggleButton value="false">False</ToggleButton>
        </ToggleButtonGroup>
      )
    }

    return null
  }

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1}
      alignItems="center"
      className="filterRow"
      sx={{ width: '100%', flexWrap: 'wrap' }}
    >
      <FormControl fullWidth sx={{ minWidth: 140, flex: { xs: '1 1 100%', md: '0 0 180px' } }}>
        <InputLabel id={`field-select-${condition.id}`}>Field</InputLabel>
        <Select
          labelId={`field-select-${condition.id}`}
          value={field.key}
          label="Field"
          size="small"
          onChange={handleFieldChange}
        >
          {fields.map((option) => (
            <MenuItem key={option.key} value={option.key}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ minWidth: 140, flex: { xs: '1 1 100%', md: '0 0 180px' } }}>
        <InputLabel id={`operator-select-${condition.id}`}>Operator</InputLabel>
        <Select
          labelId={`operator-select-${condition.id}`}
          value={operator}
          label="Operator"
          size="small"
          onChange={handleOperatorChange}
        >
          {operators.map((op) => (
            <MenuItem key={op} value={op}>
              {operatorLabels[op]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ flex: '1 1 320px', minWidth: 180, width: '100%' }}>{valueInput()}</Box>
      <Button
        variant="outlined"
        color="error"
        onClick={onRemove}
        size="small"
        sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' }, minWidth: 120 }}
      >
        Remove
      </Button>
    </Stack>
  )
}
