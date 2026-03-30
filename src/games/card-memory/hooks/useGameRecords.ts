import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage'
import type { GameRecords, LevelRecord } from '../types/game'
import { LEVELS } from '../utils/deck'

const STORAGE_KEY = 'card-memory-records'

export function useGameRecords() {
  const [records, setRecords] = useLocalStorage<GameRecords>(STORAGE_KEY, {})

  const saveRecord = useCallback((level: number, attempts: number, time: number, stars: number) => {
    setRecords(prev => {
      const existing = prev[level]
      if (existing && existing.bestAttempts <= attempts && existing.bestTime <= time && existing.stars >= stars) {
        return prev
      }
      const newRecord: LevelRecord = {
        bestAttempts: existing ? Math.min(existing.bestAttempts, attempts) : attempts,
        bestTime: existing ? Math.min(existing.bestTime, time) : time,
        stars: existing ? Math.max(existing.stars, stars) : stars,
      }
      return { ...prev, [level]: newRecord }
    })
  }, [setRecords])

  const unlockedLevel = useMemo(() => {
    let maxUnlocked = 1
    for (let i = 1; i <= LEVELS.length; i++) {
      if (records[i]) {
        maxUnlocked = i + 1
      } else {
        break
      }
    }
    return Math.min(maxUnlocked, LEVELS.length)
  }, [records])

  return { records, saveRecord, unlockedLevel }
}
