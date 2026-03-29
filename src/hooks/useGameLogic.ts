import { useState, useCallback, useRef } from 'react'
import type { GameCard, GameState, Level } from '../types/game'
import { generateDeck } from '../utils/deck'

interface UseGameLogicReturn {
  cards: GameCard[]
  attempts: number
  gameState: GameState
  flipCard: (index: number) => void
  initGame: (level: Level) => void
}

export function useGameLogic(onFirstFlip: () => void, onClear: () => void): UseGameLogicReturn {
  const [cards, setCards] = useState<GameCard[]>([])
  const [attempts, setAttempts] = useState(0)
  const [gameState, setGameState] = useState<GameState>('idle')
  const flippedIndices = useRef<number[]>([])
  const hasStarted = useRef(false)

  const initGame = useCallback((level: Level) => {
    const deck = generateDeck(level.pairs)
    setCards(deck)
    setAttempts(0)
    setGameState('idle')
    flippedIndices.current = []
    hasStarted.current = false
  }, [])

  const flipCard = useCallback((index: number) => {
    if (gameState === 'checking' || gameState === 'cleared') return
    if (flippedIndices.current.length >= 2) return

    const card = cards[index]
    if (!card || card.isFlipped || card.isMatched) return

    if (!hasStarted.current) {
      hasStarted.current = true
      setGameState('playing')
      onFirstFlip()
    }

    const newCards = [...cards]
    newCards[index] = { ...card, isFlipped: true }
    const newFlipped = [...flippedIndices.current, index]
    flippedIndices.current = newFlipped
    setCards(newCards)

    if (newFlipped.length === 2) {
      setAttempts(a => a + 1)
      setGameState('checking')

      const first = newCards[newFlipped[0]]
      const second = newCards[newFlipped[1]]
      const isMatch = first.color === second.color && first.rank === second.rank

      setTimeout(() => {
        setCards(current => {
          const updated = [...current]
          if (isMatch) {
            updated[newFlipped[0]] = { ...updated[newFlipped[0]], isMatched: true }
            updated[newFlipped[1]] = { ...updated[newFlipped[1]], isMatched: true }
            if (updated.every(c => c.isMatched)) {
              setGameState('cleared')
              onClear()
            } else {
              setGameState('playing')
            }
          } else {
            updated[newFlipped[0]] = { ...updated[newFlipped[0]], isFlipped: false }
            updated[newFlipped[1]] = { ...updated[newFlipped[1]], isFlipped: false }
            setGameState('playing')
          }
          return updated
        })
        flippedIndices.current = []
      }, isMatch ? 400 : 1000)
    }
  }, [cards, gameState, onFirstFlip, onClear])

  return { cards, attempts, gameState, flipCard, initGame }
}
