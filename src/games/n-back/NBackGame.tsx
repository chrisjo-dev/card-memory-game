import { useCallback, useEffect, useRef } from 'react'
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
        {phase === 'setup' && (
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
              <NBackGrid
                activePosition={currentStimulus?.position ?? null}
                stimulus={currentStimulus}
                feedback={gridFeedback}
              />
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
