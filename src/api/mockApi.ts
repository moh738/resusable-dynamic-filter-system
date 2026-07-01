import mockJsonApiPkg from 'mock-json-api'
import type { Employee } from '../types'
import employeeData from '../data/employees.json'

const mockJsonApi = (mockJsonApiPkg as any).mockJsonApi ?? (mockJsonApiPkg as any).default ?? mockJsonApiPkg

export const fetchEmployees = async (): Promise<Employee[]> => {
  if (typeof mockJsonApi !== 'function') {
    // fallback: return static data if the mock API package isn't usable in the browser
    return Promise.resolve(employeeData as Employee[])
  }

  const api = mockJsonApi({ data: employeeData, delay: 100 })
  const response = await api.get('/')
  return response.data as Employee[]
}
