# Reusable Dynamic Filter Component System

A React + TypeScript application demonstrating a reusable dynamic filter builder for table data. This project uses a configuration-driven filter system with support for text, number, date, select, multi-select, and boolean filters.

## Features

- Dynamic filter builder with configurable fields and operators
- Client-side filtering for a local JSON dataset
- Responsive table with pagination and sortable columns
- Search bar for full-text filtering across row fields
- CSV export for filtered results
- Modular, type-safe component architecture using React + TypeScript
- Zustand state management for filter state
- Material UI for responsive layout and controls

## Project Structure

- `src/App.tsx` — main application and layout
- `src/components/filter/FilterBuilder.tsx` — filter builder container
- `src/components/filter/FilterRow.tsx` — dynamic filter row inputs
- `src/components/table/DataTable.tsx` — sortable data table
- `src/store/filterStore.ts` — Zustand filter state
- `src/constants/filterFields.ts` — field definitions and filter schema
- `src/constants/filterOperators.ts` — operator mappings per type
- `src/utils/filterUtils.ts` — filtering logic implementation
- `src/data/employees.json` — sample dataset

## Requirements

- Node.js 18 or newer
- npm

## Setup

```bash
cd c:/Users/admin/Documents/Assignment
npm install
```

## Run locally

```bash
npm run dev
```

Open the app at `http://localhost:5173`.

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Notes

- The filter system is designed to work with any table schema by passing field definitions and operator configuration.
- CSV export exports the currently filtered table rows.
- If `mock-json-api` is unavailable in the browser, the app falls back to local static JSON data.

## Repository

- Remote: `https://github.com/moh738/resusable-dynamic-filter-system.git`
