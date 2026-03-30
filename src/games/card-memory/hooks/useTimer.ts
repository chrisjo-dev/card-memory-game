import { useState, useRef, useCallback, useEffect } from 'react'

export function useTimer() {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<number | null>(null)

  const start = useCallback(() => {
    if (intervalRef.current !== null) return
    intervalRef.current = window.setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    stop()
    setSeconds(0)
  }, [stop])

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return { seconds, start, stop, reset }
}
