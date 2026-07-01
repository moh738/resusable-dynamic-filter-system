import { create } from 'zustand'
import type { FilterCondition } from '../types'

interface FilterState {
  filters: FilterCondition[]
  addFilter: () => void
  removeFilter: (id: string) => void
  updateFilter: (id: string, next: Partial<FilterCondition>) => void
  clearFilters: () => void
}

const defaultCondition: FilterCondition = {
  id: String(Date.now()),
  fieldKey: 'name',
  operator: 'contains',
  value: ''
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: [defaultCondition],
  addFilter: () =>
    set((state) => ({
      filters: [
        ...state.filters,
        {
          id: String(Date.now() + Math.random()),
          fieldKey: 'name',
          operator: 'contains',
          value: ''
        }
      ]
    })),
  removeFilter: (id) =>
    set((state) => ({
      filters: state.filters.filter((filter) => filter.id !== id)
    })),
  updateFilter: (id, next) =>
    set((state) => ({
      filters: state.filters.map((filter) =>
        filter.id === id ? { ...filter, ...next } : filter
      )
    })),
  clearFilters: () => set({ filters: [defaultCondition] })
}))
