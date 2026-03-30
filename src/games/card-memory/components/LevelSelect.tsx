import { motion } from 'framer-motion'
import type { GameRecords } from '../types/game'
import { LEVELS } from '../utils/deck'

interface LevelSelectProps {
  records: GameRecords
  unlockedLevel: number
  onSelectLevel: (level: number) => void
  onHome?: () => void
}

function StarDisplay({ count }: { count: number }) {
  return (
    <span className="text-sm">
      {[1, 2, 3].map(i => (
        <span key={i} className={i <= count ? 'text-yellow-400' : 'text-gray-600'}>
          ★
        </span>
      ))}
    </span>
  )
}

export default function LevelSelect({ records, unlockedLevel, onSelectLevel, onHome }: LevelSelectProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-8">
      {onHome && (
        <button
          onClick={onHome}
          className="absolute top-4 left-4 text-xl text-white/60 hover:text-white transition-colors p-2"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
          aria-label="Dashboard"
        >
          &#8592;
        </button>
      )}
      <motion.h1
        className="text-4xl font-bold text-yellow-400 mb-2 font-serif tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Card Memory
      </motion.h1>
      <motion.p
        className="text-white/60 text-sm mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Find matching pairs!
      </motion.p>

      <div className="w-full max-w-xs space-y-3">
        {LEVELS.map((lvl, i) => {
          const unlocked = lvl.level <= unlockedLevel
          const record = records[lvl.level]

          return (
            <motion.button
              key={lvl.level}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all ${
                unlocked
                  ? 'bg-white/10 border-yellow-600/40 hover:bg-white/20 active:scale-[0.98]'
                  : 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => unlocked && onSelectLevel(lvl.level)}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              disabled={!unlocked}
            >
              <div className="flex items-center gap-3">
                {unlocked ? (
                  <span className="text-lg font-bold text-yellow-400">Lv.{lvl.level}</span>
                ) : (
                  <span className="text-lg">🔒</span>
                )}
                <span className="text-white/70 text-sm">{lvl.totalCards} cards</span>
              </div>
              {record && <StarDisplay count={record.stars} />}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
