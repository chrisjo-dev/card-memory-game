import { useState, useCallback, useRef, useEffect } from 'react'
import type { NBackPhase, NBackRoundConfig, NBackStimulus, NBackTrial } from '../types/nback'
import { generateStimuli, isPositionMatch, isCardMatch } from '../utils/stimulus'

interface UseNBackLogicReturn {
  phase: NBackPhase
  currentTrial: number
  currentStimulus: NBackStimulus | null
  isShowingCard: boolean
  trials: NBackTrial[]
  positionPressed: boolean
  cardPressed: boolean
  lastFeedback: { position: boolean; card: boolean } | null
  config: NBackRoundConfig | null
  startRound: (config: NBackRoundConfig) => void
  pressPosition: () => void
  pressCard: () => void
  positionAccuracy: number
  cardAccuracy: number
  adaptiveResult: 'up' | 'stay' | 'down'
  setPhase: (phase: NBackPhase) => void
}

export function useNBackLogic(): UseNBackLogicReturn {
  const [phase, setPhase] = useState<NBackPhase>('setup')
  const [currentTrial, setCurrentTrial] = useState(0)
  const [isShowingCard, setIsShowingCard] = useState(false)
  const [positionPressed, setPositionPressed] = useState(false)
  const [cardPressed, setCardPressed] = useState(false)
  const [lastFeedback, setLastFeedback] = useState<{ position: boolean; card: boolean } | null>(null)
  const [trials, setTrials] = useState<NBackTrial[]>([])
  const [config, setConfig] = useState<NBackRoundConfig | null>(null)

  const stimuliRef = useRef<NBackStimulus[]>([])
  const timeoutRef = useRef<number | null>(null)
  const feedbackTimeoutRef = useRef<number | null>(null)

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (feedbackTimeoutRef.current !== null) {
      clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    return clearTimeouts
  }, [clearTimeouts])

  const currentStimulus = phase === 'playing' && isShowingCard && stimuliRef.current[currentTrial]
    ? stimuliRef.current[currentTrial]
    : null

  const advanceTrial = useCallback((trialIndex: number, cfg: NBackRoundConfig, stimuli: NBackStimulus[]) => {
    const posMatch = isPositionMatch(stimuli, trialIndex, cfg.nLevel)
    const cardMatch = isCardMatch(stimuli, trialIndex, cfg.nLevel)

    setTrials(prev => {
      const updated = [...prev]
      updated[trialIndex] = {
        ...updated[trialIndex],
        isPositionMatch: posMatch,
        isCardMatch: cardMatch,
      }
      return updated
    })

    // Show feedback briefly
    setIsShowingCard(false)
    setLastFeedback(() => {
      const trial = trials[trialIndex] || { playerPositionResponse: null, playerCardResponse: null }
      const playerPos = trial.playerPositionResponse ?? false
      const playerCard = trial.playerCardResponse ?? false
      if (trialIndex < cfg.nLevel) return null
      return {
        position: playerPos === posMatch,
        card: playerCard === cardMatch,
      }
    })

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setLastFeedback(null)

      if (trialIndex + 1 >= cfg.trialCount) {
        setPhase('result')
        return
      }

      const nextTrial = trialIndex + 1
      setCurrentTrial(nextTrial)
      setPositionPressed(false)
      setCardPressed(false)
      setIsShowingCard(true)

      setTrials(prev => {
        const updated = [...prev]
        updated[nextTrial] = {
          stimulus: stimuli[nextTrial],
          isPositionMatch: false,
          isCardMatch: false,
          playerPositionResponse: null,
          playerCardResponse: null,
        }
        return updated
      })

      timeoutRef.current = window.setTimeout(() => {
        advanceTrial(nextTrial, cfg, stimuli)
      }, 2000)
    }, 500)
  }, [trials])

  const startRound = useCallback((cfg: NBackRoundConfig) => {
    clearTimeouts()
    const stimuli = generateStimuli(cfg)
    stimuliRef.current = stimuli
    setConfig(cfg)
    setPhase('playing')
    setCurrentTrial(0)
    setPositionPressed(false)
    setCardPressed(false)
    setLastFeedback(null)
    setIsShowingCard(true)

    const initialTrials: NBackTrial[] = [{
      stimulus: stimuli[0],
      isPositionMatch: false,
      isCardMatch: false,
      playerPositionResponse: null,
      playerCardResponse: null,
    }]
    setTrials(initialTrials)

    timeoutRef.current = window.setTimeout(() => {
      advanceTrial(0, cfg, stimuli)
    }, 2000)
  }, [clearTimeouts, advanceTrial])

  const pressPosition = useCallback(() => {
    if (!isShowingCard || !config || currentTrial < config.nLevel) return
    setPositionPressed(true)
    setTrials(prev => {
      const updated = [...prev]
      if (updated[currentTrial]) {
        updated[currentTrial] = { ...updated[currentTrial], playerPositionResponse: true }
      }
      return updated
    })
  }, [isShowingCard, config, currentTrial])

  const pressCard = useCallback(() => {
    if (!isShowingCard || !config || currentTrial < config.nLevel) return
    setCardPressed(true)
    setTrials(prev => {
      const updated = [...prev]
      if (updated[currentTrial]) {
        updated[currentTrial] = { ...updated[currentTrial], playerCardResponse: true }
      }
      return updated
    })
  }, [isShowingCard, config, currentTrial])

  // Calculate accuracy
  const scorableTrials = config ? trials.filter((_, i) => i >= config.nLevel) : []
  const positionAccuracy = scorableTrials.length > 0
    ? Math.round((scorableTrials.filter(t => (t.playerPositionResponse ?? false) === t.isPositionMatch).length / scorableTrials.length) * 100)
    : 0
  const cardAccuracy = scorableTrials.length > 0
    ? Math.round((scorableTrials.filter(t => (t.playerCardResponse ?? false) === t.isCardMatch).length / scorableTrials.length) * 100)
    : 0

  const adaptiveResult: 'up' | 'stay' | 'down' =
    positionAccuracy >= 80 && cardAccuracy >= 80 ? 'up'
    : positionAccuracy <= 50 || cardAccuracy <= 50 ? 'down'
    : 'stay'

  return {
    phase, currentTrial, currentStimulus, isShowingCard,
    trials, positionPressed, cardPressed, lastFeedback,
    config, startRound, pressPosition, pressCard,
    positionAccuracy, cardAccuracy, adaptiveResult, setPhase,
  }
}
