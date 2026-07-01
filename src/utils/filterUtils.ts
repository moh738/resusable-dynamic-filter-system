import type { Employee, FilterCondition, FilterFieldDefinition } from '../types'

const parseNestedValue = (item: unknown, key: string): unknown => {
  if (!item || typeof item !== 'object') {
    return undefined
  }

  const keys = key.split('.')
  return keys.reduce<unknown>((current, path) => {
    if (current && typeof current === 'object' && path in current) {
      return (current as Record<string, unknown>)[path]
    }
    return undefined
  }, item)
}

const parseDateValue = (value: unknown): Date | null => {
  if (typeof value !== 'string') {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const normalizeText = (value: unknown) =>
  value == null ? '' : String(value).toLowerCase().trim()

const compareText = (value: unknown, operator: string, query: string) => {
  const text = normalizeText(value)
  const search = normalizeText(query)
  switch (operator) {
    case 'equals':
      return text === search
    case 'contains':
      return text.includes(search)
    case 'startsWith':
      return text.startsWith(search)
    case 'endsWith':
      return text.endsWith(search)
    case 'doesNotContain':
      return !text.includes(search)
    default:
      return false
  }
}

const compareNumber = (value: unknown, operator: string, query: unknown) => {
  const number = typeof value === 'number' ? value : Number(value)
  const queryNumber = typeof query === 'number' ? query : Number(query)
  if (Number.isNaN(number) || Number.isNaN(queryNumber)) {
    return false
  }
  switch (operator) {
    case 'equals':
      return number === queryNumber
    case 'greaterThan':
      return number > queryNumber
    case 'lessThan':
      return number < queryNumber
    case 'greaterThanOrEqual':
      return number >= queryNumber
    case 'lessThanOrEqual':
      return number <= queryNumber
    case 'between':
      if (!query || typeof query !== 'object') return false
      const range = query as { from?: number; to?: number }
      return (
        (range.from === undefined || number >= Number(range.from)) &&
        (range.to === undefined || number <= Number(range.to))
      )
    default:
      return false
  }
}

const compareDate = (value: unknown, query: unknown) => {
  const date = parseDateValue(value)
  if (!date) {
    return false
  }

  if (!query || typeof query !== 'object') {
    return false
  }

  const range = query as { from?: string; to?: string }
  const from = range.from ? parseDateValue(range.from) : undefined
  const to = range.to ? parseDateValue(range.to) : undefined

  if (from && to) {
    return date.getTime() >= from.getTime() && date.getTime() <= to.getTime()
  }
  if (from) {
    return date.getTime() >= from.getTime()
  }
  if (to) {
    return date.getTime() <= to.getTime()
  }
  return false
}

const compareSelect = (value: unknown, operator: string, query: unknown) => {
  switch (operator) {
    case 'is':
      return String(value) === String(query)
    case 'isNot':
      return String(value) !== String(query)
    default:
      return false
  }
}

const compareMultiSelect = (value: unknown, operator: string, query: unknown) => {
  if (!Array.isArray(value) || !Array.isArray(query)) {
    return false
  }
  const targetValues = query.map((item) => String(item))
  const sourceValues = value.map((item) => String(item))

  if (operator === 'in') {
    return sourceValues.some((item) => targetValues.includes(item))
  }

  if (operator === 'notIn') {
    return !sourceValues.some((item) => targetValues.includes(item))
  }

  return false
}

const compareBoolean = (value: unknown, query: unknown) => {
  return Boolean(value) === Boolean(query)
}

export const applyFilters = (
  data: Employee[],
  conditions: FilterCondition[],
  fields: FilterFieldDefinition[]
): Employee[] => {
  if (conditions.length === 0) {
    return data
  }

  return data.filter((item) =>
    conditions.every((condition) => {
      const field = fields.find((fieldDef) => fieldDef.key === condition.fieldKey)
      if (!field) {
        return false
      }
      const rawValue = parseNestedValue(item, field.key)

      switch (field.type) {
        case 'text':
          return compareText(rawValue, condition.operator, String(condition.value ?? ''))
        case 'number':
          return compareNumber(rawValue, condition.operator, condition.value)
        case 'date':
          return compareDate(rawValue, condition.value)
        case 'select':
          return compareSelect(rawValue, condition.operator, condition.value)
        case 'multi-select':
          return compareMultiSelect(rawValue, condition.operator, condition.value)
        case 'boolean':
          return compareBoolean(rawValue, condition.value)
        default:
          return false
      }
    })
  )
}
