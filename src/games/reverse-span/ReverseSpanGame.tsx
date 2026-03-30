import { useCallback, useEffect, useRef, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReverseSpanLogic } from './hooks/useReverseSpanLogic'
import { useReverseSpanRecords } from './hooks/useReverseSpanRecords'
import type { SpanCard } from './types/reverseSpan'

interface ReverseSpanGameProps {
  onHome: () => void
}

function CardDisplay({ card, size = 'lg' }: { card: SpanCard; size?: 'lg' | 'sm' }) {
  const textColor = card.color === 'red' ? 'text-red-600' : 'text-gray-900'
  const sizeClass = size === 'lg' ? 'w-24 h-34 text-3xl' : 'w-14 h-20 text-lg'
  return (
    <div className={`bg-white rounded-lg flex flex-col items-center justify-center shadow-md border border-gray-200 ${sizeClass}`}>
      <span className={`font-bold ${textColor}`}>{card.rank}</span>
      <span className={`${textColor} ${size === 'lg' ? 'text-2xl' : 'text-sm'}`}>{card.symbol}</span>
    </div>
  )
}

export default function ReverseSpanGame({ onHome }: ReverseSpanGameProps) {
  const {
    phase, spanLength, sequence, showingIndex,
    playerAnswers, isCorrect, streak,
    startRound, selectCard, reset,
  } = useReverseSpanLogic()

  const { saveBest, bestSpan } = useReverseSpanRecords()
  const savedRef = useRef(false)

  useEffect(() => {
    if (phase === 'result' && isCorrect && !savedRef.current) {
      savedRef.current = true
      saveBest(spanLength - 1) // spanLength already incremented
    }
    if (phase !== 'result') {
      savedRef.current = false
    }
  }, [phase, isCorrect, spanLength, saveBest])

  const handleStart = useCallback(() => {
    startRound()
  }, [startRound])

  // Shuffle choices once when answering phase starts
  const shuffledSequence = useMemo(() => {
    if (phase !== 'answering') return []
    const arr = [...sequence]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, sequence.length])

  const remainingCards = shuffledSequence.filter(
    card => !playerAnswers.some(a => a.id === card.id)
  )

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex items-center justify-between px-4 py-2 bg-black/30 backdrop-blur-sm text-white">
        <button onClick={onHome} className="text-lg px-2 py-1 hover:text-yellow-400 transition-colors" aria-label="Home">
          &#8962;
        </button>
        <span className="text-sm font-semibold text-yellow-400">Reverse Span</span>
        <span className="text-sm">Span: {phase === 'result' ? (isCorrect ? spanLength - 1 : spanLength + 1) : spanLength}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {phase === 'ready' && (
            <motion.div key="ready" className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold text-yellow-400 font-serif mb-2">Reverse Span</h2>
              <p className="text-white/60 text-sm mb-2">카드가 순서대로 나타납니다</p>
              <p className="text-white/60 text-sm mb-6">기억한 뒤 <span className="text-yellow-400 font-bold">역순</span>으로 눌러주세요!</p>
              <p className="text-white/40 text-xs mb-4">Best: {bestSpan}장 | 연속: {streak}회</p>
              <motion.button
                onClick={handleStart}
                className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-lg rounded-xl transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                Start ({spanLength}장)
              </motion.button>
            </motion.div>
          )}

          {phase === 'showing' && showingIndex >= 0 && sequence[showingIndex] && (
            <motion.div key={`show-${showingIndex}`} className="text-center" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.2 }}>
              <p className="text-white/50 text-sm mb-4">{showingIndex + 1} / {sequence.length}</p>
              <CardDisplay card={sequence[showingIndex]} size="lg" />
              <p className="text-white/40 text-xs mt-4">기억하세요!</p>
            </motion.div>
          )}

          {phase === 'answering' && (
            <motion.div key="answer" className="text-center w-full max-w-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-yellow-400 font-bold mb-2">역순으로 눌러주세요!</p>
              <p className="text-white/50 text-sm mb-4">{playerAnswers.length} / {sequence.length}</p>

              {playerAnswers.length > 0 && (
                <div className="flex gap-2 justify-center mb-4 flex-wrap">
                  {playerAnswers.map((card, i) => (
                    <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                      <CardDisplay card={card} size="sm" />
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 justify-center flex-wrap">
                {remainingCards.map(card => (
                  <motion.button
                    key={card.id}
                    onClick={() => selectCard(card)}
                    className="active:scale-95 transition-transform"
                    whileTap={{ scale: 0.95 }}
                  >
                    <CardDisplay card={card} size="sm" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div key="result" className="text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="text-6xl mb-4 block">{isCorrect ? '🎉' : '😅'}</span>
              <h2 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '정답!' : '틀렸어요'}
              </h2>

              {!isCorrect && (
                <div className="mb-4">
                  <p className="text-white/50 text-sm mb-2">정답:</p>
                  <div className="flex gap-1 justify-center flex-wrap">
                    {[...sequence].reverse().map((card, i) => (
                      <div key={i} className="relative">
                        <CardDisplay card={card} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-white/50 text-sm mb-4">
                {isCorrect ? `다음: ${spanLength}장` : `다시: ${spanLength}장`}
              </p>

              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={handleStart}
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-xl transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  {isCorrect ? 'Next' : 'Retry'}
                </motion.button>
                <button
                  onClick={() => { reset(); onHome() }}
                  className="px-6 py-3 text-white/50 hover:text-white/80 text-sm transition-colors"
                >
                  Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
