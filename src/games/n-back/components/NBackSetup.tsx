import { useState } from 'react'
import { motion } from 'framer-motion'
import type { NBackRoundConfig, Speed, NBackMode } from '../types/nback'
import { SPEED_CONFIG } from '../types/nback'

interface NBackSetupProps {
  recommendedN: number
  onStart: (config: NBackRoundConfig) => void
  onHome: () => void
  onStats: () => void
}

const TRIAL_OPTIONS = [20, 30, 40] as const

export default function NBackSetup({ recommendedN, onStart, onHome, onStats }: NBackSetupProps) {
  const [nLevel, setNLevel] = useState(recommendedN)
  const [trialCount, setTrialCount] = useState<number>(20)
  const [speed, setSpeed] = useState<Speed>('normal')
  const [mode, setMode] = useState<NBackMode>('card-only')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-6 py-8">
      <button
        onClick={onHome}
        className="absolute top-4 left-4 text-xl text-white/60 hover:text-white transition-colors p-2"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
        aria-label="Dashboard"
      >
        &#8592;
      </button>

      <button
        onClick={onStats}
        className="absolute top-4 right-4 text-xl text-white/60 hover:text-white transition-colors p-2"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
        aria-label="Statistics"
      >
        📊
      </button>

      <motion.h1
        className="text-3xl font-bold text-yellow-400 font-serif mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Dual N-Back
      </motion.h1>
      <motion.p
        className="text-white/60 text-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Train your working memory
      </motion.p>

      <div className="w-full max-w-xs space-y-6">
        <div>
          <p className="text-white/70 text-sm mb-2 text-center">Mode</p>
          <div className="flex gap-2">
            {([['card-only', 'Card Only'], ['dual', 'Dual (Card + Position)']] as [NBackMode, string][]).map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${
                  mode === m
                    ? 'bg-yellow-600 border-yellow-400 text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-white/70 text-sm mb-2 text-center">N-Back Level</p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
              <button
                key={n}
                onClick={() => setNLevel(n)}
                className={`py-2 rounded-lg border text-sm font-bold transition-all ${
                  nLevel === n
                    ? 'bg-yellow-600 border-yellow-400 text-white'
                    : n === recommendedN
                    ? 'bg-white/10 border-yellow-600/60 text-yellow-400'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {recommendedN > 0 && (
            <p className="text-white/40 text-xs mt-1 text-center">Recommended: {recommendedN}</p>
          )}
        </div>

        <div>
          <p className="text-white/70 text-sm mb-2 text-center">Trials</p>
          <div className="flex gap-2">
            {TRIAL_OPTIONS.map(count => (
              <button
                key={count}
                onClick={() => setTrialCount(count)}
                className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${
                  trialCount === count
                    ? 'bg-yellow-600 border-yellow-400 text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-white/70 text-sm mb-2 text-center">Speed</p>
          <div className="flex gap-2">
            {(Object.keys(SPEED_CONFIG) as Speed[]).map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${
                  speed === s
                    ? 'bg-yellow-600 border-yellow-400 text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                {SPEED_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          onClick={() => onStart({ nLevel, trialCount, speed, mode })}
          className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-lg rounded-xl transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          Start
        </motion.button>
      </div>
    </div>
  )
}
