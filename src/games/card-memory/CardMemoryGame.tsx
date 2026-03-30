import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameLogic } from './hooks/useGameLogic'
import { useTimer } from './hooks/useTimer'
import { useGameRecords } from './hooks/useGameRecords'
import { calculateStars } from './utils/scoring'
import { LEVELS } from './utils/deck'
import LevelSelect from './components/LevelSelect'
import GameHUD from './components/GameHUD'
import CardGrid from './components/CardGrid'
import ClearModal from './components/ClearModal'

const MAX_LEVEL = LEVELS.length

type Screen = 'menu' | 'game'

interface CardMemoryGameProps {
  onHome: () => void
}

export default function CardMemoryGame({ onHome }: CardMemoryGameProps) {
  const [screen, setScreen] = useState<Screen>('menu')
  const [currentLevel, setCurrentLevel] = useState(1)
  const { seconds, start, stop, reset } = useTimer()
  const { records, saveRecord, unlockedLevel } = useGameRecords()
  const savedRef = useRef(false)

  const onFirstFlip = useCallback(() => {
    start()
  }, [start])

  const onClear = useCallback(() => {
    stop()
  }, [stop])

  const { cards, attempts, gameState, flipCard, initGame } = useGameLogic(onFirstFlip, onClear)

  const levelConfig = LEVELS[currentLevel - 1]

  const handleSelectLevel = useCallback((level: number) => {
    setCurrentLevel(level)
    setScreen('game')
    reset()
    const config = LEVELS[level - 1]
    initGame(config)
  }, [reset, initGame])

  const handleHome = useCallback(() => {
    setScreen('menu')
    reset()
  }, [reset])

  const handleRetry = useCallback(() => {
    reset()
    initGame(levelConfig)
  }, [reset, initGame, levelConfig])

  const handleNextLevel = useCallback(() => {
    const next = currentLevel + 1
    if (next <= MAX_LEVEL) {
      setCurrentLevel(next)
      reset()
      initGame(LEVELS[next - 1])
    }
  }, [currentLevel, reset, initGame])

  const stars = gameState === 'cleared' ? calculateStars(attempts, levelConfig.pairs) : 0

  useEffect(() => {
    if (gameState === 'cleared' && stars > 0 && !savedRef.current) {
      savedRef.current = true
      saveRecord(currentLevel, attempts, seconds, stars)
    }
    if (gameState !== 'cleared') {
      savedRef.current = false
    }
  }, [gameState, stars, currentLevel, attempts, seconds, saveRecord])

  return (
    <div className="h-full flex flex-col">
      <AnimatePresence mode="wait">
        {screen === 'menu' ? (
          <motion.div
            key="menu"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LevelSelect
              records={records}
              unlockedLevel={unlockedLevel}
              onSelectLevel={handleSelectLevel}
              onHome={onHome}
            />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            className="h-full flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GameHUD
              level={currentLevel}
              attempts={attempts}
              seconds={seconds}
              onHome={handleHome}
            />
            <CardGrid
              cards={cards}
              gridCols={levelConfig.gridCols}
              onCardClick={flipCard}
              disabled={gameState === 'checking' || gameState === 'cleared'}
            />
            {gameState === 'cleared' && (
              <ClearModal
                level={currentLevel}
                stars={stars}
                attempts={attempts}
                seconds={seconds}
                isLastLevel={currentLevel === MAX_LEVEL}
                onRetry={handleRetry}
                onNextLevel={handleNextLevel}
                onHome={handleHome}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
