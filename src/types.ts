export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'multi-select'
  | 'boolean'

export type OperatorType =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'doesNotContain'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'before'
  | 'after'
  | 'last30Days'
  | 'is'
  | 'isNot'
  | 'in'
  | 'notIn'

export interface FilterFieldOption {
  label: string
  value: string
}

export interface FilterFieldDefinition {
  key: string
  label: string
  type: FieldType
  options?: FilterFieldOption[]
  nestedKey?: string
}

export interface FilterCondition {
  id: string
  fieldKey: string
  operator: OperatorType
  value: unknown
}

export interface Employee {
  id: number
  name: string
  email: string
  department: string
  role: string
  salary: number
  joinDate: string
  isActive: boolean
  skills: string[]
  address: {
    city: string
    state: string
    country: string
  }
  projects: number
  lastReview: string
  performanceRating: number
}

export interface SortConfig {
  sortBy: string
  direction: 'asc' | 'desc'
}
