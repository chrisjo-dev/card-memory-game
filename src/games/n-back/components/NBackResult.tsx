import { motion } from 'framer-motion'

interface NBackResultProps {
  nLevel: number
  positionAccuracy: number
  cardAccuracy: number
  result: 'up' | 'stay' | 'down'
  onRetry: () => void
  onHome: () => void
}

function AccuracyBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'bg-green-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="text-white font-semibold">{value}%</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>
    </div>
  )
}

export default function NBackResult({ nLevel, positionAccuracy, cardAccuracy, result, onRetry, onHome }: NBackResultProps) {
  const resultConfig = {
    up: { text: `Level Up! → ${nLevel + 1}-Back`, color: 'text-green-400', bg: 'bg-green-400/10' },
    stay: { text: `Stay at ${nLevel}-Back`, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    down: { text: `Down to ${Math.max(1, nLevel - 1)}-Back`, color: 'text-red-400', bg: 'bg-red-400/10' },
  }[result]

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-8">
      <motion.div
        className="w-full max-w-sm bg-gradient-to-b from-green-900 to-green-950 rounded-2xl border border-yellow-600/40 p-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <h2 className="text-2xl font-bold text-yellow-400 font-serif text-center mb-4">
          Round Complete
        </h2>

        <motion.div
          className={`text-center py-3 rounded-xl mb-6 ${resultConfig.bg}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className={`text-lg font-bold ${resultConfig.color}`}>{resultConfig.text}</span>
        </motion.div>

        <div className="space-y-4 mb-6">
          <AccuracyBar label="Position" value={positionAccuracy} />
          <AccuracyBar label="Card" value={cardAccuracy} />
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onRetry}
            className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-xl transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={onHome}
            className="w-full py-2 text-white/50 hover:text-white/80 text-sm transition-colors"
          >
            Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  )
}
