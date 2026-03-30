import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage'
import type { NBackRecords, NBackSessionRecord } from '../types/nback'

const STORAGE_KEY = 'nback-records'
const MAX_SESSIONS = 20

const DEFAULT_RECORDS: NBackRecords = {
  sessions: [],
  bestN: 1,
  recommendedN: 1,
}

export function useNBackRecords() {
  const [records, setRecords] = useLocalStorage<NBackRecords>(STORAGE_KEY, DEFAULT_RECORDS)

  const saveSession = useCallback((session: NBackSessionRecord) => {
    setRecords(prev => {
      const sessions = [session, ...prev.sessions].slice(0, MAX_SESSIONS)
      const bestN = Math.max(prev.bestN, session.nLevel)
      let recommendedN = session.nLevel
      if (session.result === 'up') recommendedN = session.nLevel + 1
      else if (session.result === 'down') recommendedN = Math.max(1, session.nLevel - 1)

      return { sessions, bestN, recommendedN }
    })
  }, [setRecords])

  const bestN = records.bestN
  const recommendedN = records.recommendedN

  const avgPositionAccuracy = useMemo(() => {
    if (records.sessions.length === 0) return 0
    return Math.round(records.sessions.reduce((sum, s) => sum + s.positionAccuracy, 0) / records.sessions.length)
  }, [records.sessions])

  const avgCardAccuracy = useMemo(() => {
    if (records.sessions.length === 0) return 0
    return Math.round(records.sessions.reduce((sum, s) => sum + s.cardAccuracy, 0) / records.sessions.length)
  }, [records.sessions])

  return { records, saveSession, bestN, recommendedN, avgPositionAccuracy, avgCardAccuracy }
}
