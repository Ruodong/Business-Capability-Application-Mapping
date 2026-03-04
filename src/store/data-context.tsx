import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { DataState } from '@/types'
import { parseExcelBuffer } from '@/data/parser'
import { buildHierarchy } from '@/data/hierarchy'
import { loadDefaultData } from '@/data/load-default'

interface DataContextValue {
  readonly state: DataState
  readonly loadExcel: (buffer: ArrayBuffer) => void
  readonly isLoading: boolean
  readonly error: string | null
  readonly clearError: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>(() => loadDefaultData())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadExcel = useCallback((buffer: ArrayBuffer) => {
    try {
      setIsLoading(true)
      setError(null)
      const rows = parseExcelBuffer(buffer)
      const data = buildHierarchy(rows)
      setState(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse Excel file')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <DataContext.Provider value={{ state, loadExcel, isLoading, error, clearError }}>
      {children}
    </DataContext.Provider>
  )
}

export function useDataContext(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) {
    throw new Error('useDataContext must be used within DataProvider')
  }
  return ctx
}
