import { motion, AnimatePresence } from 'framer-motion'
import type { GridPosition, NBackStimulus } from '../types/nback'

interface NBackGridProps {
  activePosition: GridPosition | null
  stimulus: NBackStimulus | null
  feedback: 'correct' | 'incorrect' | null
}

export default function NBackGrid({ activePosition, stimulus, feedback }: NBackGridProps) {
  const cells = Array.from({ length: 9 }, (_, i) => i as GridPosition)

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 w-full max-w-[280px] mx-auto aspect-square">
        {cells.map(pos => {
          const isActive = activePosition === pos
          const feedbackBorder = isActive && feedback
            ? feedback === 'correct' ? 'border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]' : 'border-red-400 shadow-[0_0_20px_rgba(248,113,113,0.5)]'
            : 'border-green-800/50'
          const feedbackBg = isActive && feedback
            ? feedback === 'correct' ? 'bg-green-900' : 'bg-red-950'
            : 'bg-green-950'

          return (
            <div
              key={pos}
              className={`relative rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${feedbackBorder} ${feedbackBg}`}
            >
              <AnimatePresence>
                {isActive && stimulus && (
                  <motion.div
                    className="absolute inset-1 bg-white rounded-md flex flex-col items-center justify-center"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className={`text-2xl font-bold ${stimulus.card.color === 'red' ? 'text-red-600' : 'text-gray-900'}`}>
                      {stimulus.card.rank}
                    </span>
                    <span className={`text-lg ${stimulus.card.color === 'red' ? 'text-red-600' : 'text-gray-900'}`}>
                      {stimulus.card.symbol}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <span className={`text-6xl ${feedback === 'correct' ? 'drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]' : 'drop-shadow-[0_0_20px_rgba(248,113,113,0.8)]'}`}>
              {feedback === 'correct' ? '✅' : '❌'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
