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
    <div className="flex gap-3 justify-center my-5">
      {[1, 2, 3].map(i => (
        <motion.span
          key={i}
          className={`text-4xl ${i <= count ? 'text-[var(--casino-gold)] drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]' : 'text-white/10'}`}
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
  level, stars, attempts, seconds, isLastLevel, onRetry, onNextLevel, onHome,
}: ClearModalProps) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 p-6"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="glass-card rounded-2xl p-7 w-full max-w-sm text-center"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
      >
        <h2
          className="text-2xl font-black text-[var(--casino-gold)] tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Level {level} Clear!
        </h2>

        <AnimatedStars count={stars} />

        <div className="space-y-1.5 text-sm text-white/50 mb-6">
          <p>Attempts <span className="text-white/90 font-semibold ml-1">{attempts}</span></p>
          <p>Time <span className="text-white/90 font-semibold font-mono ml-1">{formatTime(seconds)}</span></p>
        </div>

        <div className="flex flex-col gap-2">
          {!isLastLevel && (
            <button
              onClick={onNextLevel}
              className="btn-gold w-full py-3 rounded-xl text-sm"
            >
              Next Level →
            </button>
          )}
          <button
            onClick={onRetry}
            className="w-full py-3 glass-card hover:bg-white/10 text-white/80 rounded-xl transition-colors text-sm"
          >
            Retry
          </button>
          <button
            onClick={onHome}
            className="w-full py-2 text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            Dashboard
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
