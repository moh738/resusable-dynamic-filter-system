import type { FilterFieldDefinition } from '../types'

export const employeeFilterFields: FilterFieldDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text'
  },
  {
    key: 'email',
    label: 'Email',
    type: 'text'
  },
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { label: 'Engineering', value: 'Engineering' },
      { label: 'Product', value: 'Product' },
      { label: 'Design', value: 'Design' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'People', value: 'People' }
    ]
  },
  {
    key: 'role',
    label: 'Role',
    type: 'text'
  },
  {
    key: 'salary',
    label: 'Salary',
    type: 'number'
  },
  {
    key: 'joinDate',
    label: 'Join Date',
    type: 'date'
  },
  {
    key: 'isActive',
    label: 'Active Status',
    type: 'boolean'
  },
  {
    key: 'skills',
    label: 'Skills',
    type: 'multi-select',
    options: [
      { label: 'React', value: 'React' },
      { label: 'TypeScript', value: 'TypeScript' },
      { label: 'Node.js', value: 'Node.js' },
      { label: 'GraphQL', value: 'GraphQL' },
      { label: 'Figma', value: 'Figma' },
      { label: 'Python', value: 'Python' }
    ]
  },
  {
    key: 'address.city',
    label: 'City',
    type: 'select',
    options: [
      { label: 'San Francisco', value: 'San Francisco' },
      { label: 'Austin', value: 'Austin' },
      { label: 'New York', value: 'New York' },
      { label: 'Seattle', value: 'Seattle' }
    ]
  },
  {
    key: 'projects',
    label: 'Projects',
    type: 'number'
  },
  {
    key: 'performanceRating',
    label: 'Performance Rating',
    type: 'number'
  }
]
