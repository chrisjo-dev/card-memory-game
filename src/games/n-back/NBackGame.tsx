import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNBackLogic } from './hooks/useNBackLogic'
import { useNBackRecords } from './hooks/useNBackRecords'
import type { NBackRoundConfig } from './types/nback'
import NBackSetup from './components/NBackSetup'
import NBackHUD from './components/NBackHUD'
import NBackGrid from './components/NBackGrid'
import NBackControls from './components/NBackControls'
import NBackResult from './components/NBackResult'
import StatsView from './components/StatsView'
import NBackTutorial from './components/NBackTutorial'

interface NBackGameProps {
  onHome: () => void
}

export default function NBackGame({ onHome }: NBackGameProps) {
  const {
    phase, currentTrial, currentStimulus, isShowingCard,
    trials, positionPressed, cardPressed, lastFeedback,
    config, startRound, pressPosition, pressCard,
    positionAccuracy, cardAccuracy, adaptiveResult, setPhase,
  } = useNBackLogic()

  const { records, saveSession, recommendedN } = useNBackRecords()

  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('nback-tutorial-done')
  })

  const handleStart = useCallback((cfg: NBackRoundConfig) => {
    startRound(cfg)
  }, [startRound])

  const handleRetry = useCallback(() => {
    setPhase('setup')
  }, [setPhase])

  const handleRoundComplete = useCallback(() => {
    if (!config) return
    saveSession({
      date: new Date().toISOString(),
      nLevel: config.nLevel,
      trialCount: config.trialCount,
      positionAccuracy,
      cardAccuracy,
      result: adaptiveResult,
    })
  }, [config, positionAccuracy, cardAccuracy, adaptiveResult, saveSession])

  const savedRef = useRef(false)
  useEffect(() => {
    if (phase === 'result' && config && !savedRef.current) {
      savedRef.current = true
      handleRoundComplete()
    }
    if (phase !== 'result') {
      savedRef.current = false
    }
  }, [phase, config, handleRoundComplete])

  // 키보드 단축키: Z=Position, X=Card
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'playing' || !config || !isShowingCard || currentTrial < config.nLevel) return
      if (e.key === 'z' || e.key === 'Z' || e.key === 'ArrowLeft') {
        e.preventDefault()
        pressPosition()
      }
      if (e.key === 'x' || e.key === 'X' || e.key === 'ArrowRight') {
        e.preventDefault()
        pressCard()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, config, isShowingCard, currentTrial, pressPosition, pressCard])

  // N번 전 자극 (힌트용)
  const nBackStimulus = config && currentTrial >= config.nLevel && trials[currentTrial - config.nLevel]
    ? trials[currentTrial - config.nLevel].stimulus
    : null

  const gridFeedback = lastFeedback
    ? (lastFeedback.position && lastFeedback.card ? 'correct'
      : !lastFeedback.position || !lastFeedback.card ? 'incorrect'
      : null)
    : null

  return (
    <div className="h-full flex flex-col relative">
      <AnimatePresence mode="wait">
        {showTutorial && (
          <motion.div
            key="tutorial"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <NBackTutorial onDone={() => {
              localStorage.setItem('nback-tutorial-done', '1')
              setShowTutorial(false)
            }} />
          </motion.div>
        )}
        {!showTutorial && phase === 'setup' && (
          <motion.div
            key="setup"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <NBackSetup
              recommendedN={recommendedN}
              onStart={handleStart}
              onHome={onHome}
              onStats={() => setPhase('stats')}
            />
          </motion.div>
        )}
        {phase === 'playing' && config && (
          <motion.div
            key="playing"
            className="h-full flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <NBackHUD
              nLevel={config.nLevel}
              currentTrial={currentTrial}
              totalTrials={config.trialCount}
              onHome={onHome}
            />
            <div className="flex-1 flex items-center justify-center px-4">
              {config.mode === 'dual' ? (
                <NBackGrid
                  activePosition={currentStimulus?.position ?? null}
                  stimulus={currentStimulus}
                  feedback={gridFeedback}
                />
              ) : (
                <div className="relative">
                  <AnimatePresence>
                    {currentStimulus ? (
                      <motion.div
                        key={currentTrial}
                        className="w-32 h-44 bg-white rounded-xl flex flex-col items-center justify-center shadow-lg border border-gray-200"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <span className={`text-4xl font-bold ${currentStimulus.card.color === 'red' ? 'text-red-600' : 'text-gray-900'}`}>
                          {currentStimulus.card.rank}
                        </span>
                        <span className={`text-3xl ${currentStimulus.card.color === 'red' ? 'text-red-600' : 'text-gray-900'}`}>
                          {currentStimulus.card.symbol}
                        </span>
                      </motion.div>
                    ) : (
                      <div className="w-32 h-44 bg-green-950 rounded-xl border-2 border-green-800/50" />
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {gridFeedback && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-6xl">{gridFeedback === 'correct' ? '✅' : '❌'}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            <NBackControls
              onPosition={pressPosition}
              onCard={pressCard}
              positionPressed={positionPressed}
              cardPressed={cardPressed}
              disabled={!isShowingCard || currentTrial < config.nLevel}
              feedback={lastFeedback}
              nBackStimulus={nBackStimulus}
              nLevel={config.nLevel}
              mode={config.mode}
            />
          </motion.div>
        )}
        {phase === 'result' && config && (
          <motion.div
            key="result"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <NBackResult
              nLevel={config.nLevel}
              positionAccuracy={positionAccuracy}
              cardAccuracy={cardAccuracy}
              result={adaptiveResult}
              onRetry={handleRetry}
              onHome={onHome}
            />
          </motion.div>
        )}
        {phase === 'stats' && (
          <motion.div
            key="stats"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <StatsView
              records={records}
              onBack={() => setPhase('setup')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
