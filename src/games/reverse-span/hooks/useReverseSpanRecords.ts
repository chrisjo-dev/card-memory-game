import { useCallback } from 'react'
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage'
import type { ReverseSpanRecords } from '../types/reverseSpan'

const STORAGE_KEY = 'reverse-span-records'
const DEFAULT: ReverseSpanRecords = { bestSpan: 0, sessions: [] }

export function useReverseSpanRecords() {
  const [records, setRecords] = useLocalStorage<ReverseSpanRecords>(STORAGE_KEY, DEFAULT)

  const saveBest = useCallback((span: number) => {
    setRecords(prev => ({
      bestSpan: Math.max(prev.bestSpan, span),
      sessions: [
        { date: new Date().toISOString(), bestSpan: span },
        ...prev.sessions,
      ].slice(0, 20),
    }))
  }, [setRecords])

  return { records, saveBest, bestSpan: records.bestSpan }
}
