import { useState, useCallback, useRef, useEffect } from 'react'
import type { SpanCard, ReverseSpanPhase, Suit, SuitColor, CardRank } from '../types/reverseSpan'

const SUITS: { suit: Suit; symbol: string; color: SuitColor }[] = [
  { suit: 'heart', symbol: '♥', color: 'red' },
  { suit: 'diamond', symbol: '♦', color: 'red' },
  { suit: 'spade', symbol: '♠', color: 'black' },
  { suit: 'club', symbol: '♣', color: 'black' },
]
const RANKS: CardRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function randomCard(index: number): SpanCard {
  const s = SUITS[Math.floor(Math.random() * SUITS.length)]
  const r = RANKS[Math.floor(Math.random() * RANKS.length)]
  return { suit: s.suit, rank: r, color: s.color, symbol: s.symbol, id: `${index}-${s.suit}-${r}` }
}

function generateSequence(length: number): SpanCard[] {
  return Array.from({ length }, (_, i) => randomCard(i))
}

export function useReverseSpanLogic() {
  const [phase, setPhase] = useState<ReverseSpanPhase>('ready')
  const [spanLength, setSpanLength] = useState(2)
  const [sequence, setSequence] = useState<SpanCard[]>([])
  const [showingIndex, setShowingIndex] = useState(-1)
  const [playerAnswers, setPlayerAnswers] = useState<SpanCard[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [streak, setStreak] = useState(0)
  const timeoutRef = useRef<number | null>(null)

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => clearTimeouts, [clearTimeouts])

  const startRound = useCallback((length?: number) => {
    clearTimeouts()
    const len = length ?? spanLength
    setSpanLength(len)
    const seq = generateSequence(len)
    setSequence(seq)
    setPlayerAnswers([])
    setIsCorrect(null)
    setPhase('showing')
    setShowingIndex(0)

    let i = 0
    const showNext = () => {
      i++
      if (i < len) {
        setShowingIndex(i)
        timeoutRef.current = window.setTimeout(showNext, 1200)
      } else {
        timeoutRef.current = window.setTimeout(() => {
          setShowingIndex(-1)
          setPhase('answering')
        }, 1200)
      }
    }
    timeoutRef.current = window.setTimeout(showNext, 1200)
  }, [spanLength, clearTimeouts])

  const selectCard = useCallback((card: SpanCard) => {
    if (phase !== 'answering') return

    const newAnswers = [...playerAnswers, card]
    setPlayerAnswers(newAnswers)

    if (newAnswers.length === sequence.length) {
      const reversed = [...sequence].reverse()
      const correct = newAnswers.every((a, i) =>
        a.rank === reversed[i].rank && a.color === reversed[i].color
      )
      setIsCorrect(correct)
      setPhase('result')

      if (correct) {
        setStreak(s => s + 1)
        setSpanLength(s => s + 1)
      } else {
        setStreak(0)
        setSpanLength(s => Math.max(2, s - 1))
      }
    }
  }, [phase, playerAnswers, sequence])

  const reset = useCallback(() => {
    clearTimeouts()
    setPhase('ready')
    setPlayerAnswers([])
    setIsCorrect(null)
  }, [clearTimeouts])

  return {
    phase, spanLength, sequence, showingIndex,
    playerAnswers, isCorrect, streak,
    startRound, selectCard, reset, setPhase,
  }
}
