import type { OperatorType, FieldType } from '../types'

export const operatorLabels: Record<OperatorType, string> = {
  equals: 'Equals',
  contains: 'Contains',
  startsWith: 'Starts With',
  endsWith: 'Ends With',
  doesNotContain: 'Does Not Contain',
  greaterThan: 'Greater Than',
  lessThan: 'Less Than',
  greaterThanOrEqual: 'Greater Than or Equal',
  lessThanOrEqual: 'Less Than or Equal',
  between: 'Between',
  before: 'Before',
  after: 'After',
  is: 'Is',
  isNot: 'Is Not',
  in: 'In',
  notIn: 'Not In',
  last30Days: 'Last 30 Days'
}

export const fieldOperators: Record<FieldType, OperatorType[]> = {
  text: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
  number: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'between'],
  date: ['before', 'after', 'between', 'last30Days'],
  select: ['is', 'isNot'],
  'multi-select': ['in', 'notIn'],
  boolean: ['is']
}
