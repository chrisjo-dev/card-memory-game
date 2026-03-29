import { motion } from 'framer-motion'
import { formatTime } from '../utils/scoring'

interface ClearModalProps {
  level: number
  stars: number
  attempts: number
  seconds: number
  isLastLevel: boolean
  onRetry: () => void
  onNextLevel: () => void
  onHome: () => void
}

function AnimatedStars({ count }: { count: number }) {
  return (
    <div className="flex gap-2 justify-center my-4">
      {[1, 2, 3].map(i => (
        <motion.span
          key={i}
          className={`text-4xl ${i <= count ? 'text-yellow-400' : 'text-gray-600'}`}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3 + i * 0.2, type: 'spring', stiffness: 200 }}
        >
          ★
        </motion.span>
      ))}
    </div>
  )
}

export default function ClearModal({
  level,
  stars,
  attempts,
  seconds,
  isLastLevel,
  onRetry,
  onNextLevel,
  onHome,
}: ClearModalProps) {
  return (
    <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-gradient-to-b from-green-900 to-green-950 rounded-2xl border border-yellow-600/40 p-6 w-full max-w-sm text-center"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-yellow-400 font-serif">Level {level} Clear!</h2>

          <AnimatedStars count={stars} />

          <div className="space-y-2 text-white/80 mb-6">
            <p>Attempts: <span className="text-white font-semibold">{attempts}</span></p>
            <p>Time: <span className="text-white font-semibold">{formatTime(seconds)}</span></p>
          </div>

          <div className="flex flex-col gap-2">
            {!isLastLevel && (
              <button
                onClick={onNextLevel}
                className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-xl transition-colors"
              >
                Next Level →
              </button>
            )}
            <button
              onClick={onRetry}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              Retry
            </button>
            <button
              onClick={onHome}
              className="w-full py-2 text-white/50 hover:text-white/80 text-sm transition-colors"
            >
              Home
            </button>
          </div>
        </motion.div>
      </motion.div>
  )
}
