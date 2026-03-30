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
    <span className="text-sm tracking-wider">
      {[1, 2, 3].map(i => (
        <span key={i} className={i <= count ? 'text-[var(--casino-gold)]' : 'text-white/15'}>
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
          className="absolute top-4 left-4 text-sm text-white/40 hover:text-[var(--casino-gold)] transition-colors p-2"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
          aria-label="Dashboard"
        >
          ← Back
        </button>
      )}
      <motion.div
        className="text-[var(--casino-gold)]/20 text-3xl mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        🃏
      </motion.div>
      <motion.h1
        className="text-3xl font-black text-[var(--casino-gold)] mb-1 tracking-tight"
        style={{ fontFamily: 'var(--font-display)' }}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Card Memory
      </motion.h1>
      <motion.p
        className="text-white/35 text-xs tracking-[0.15em] uppercase mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        Find matching pairs
      </motion.p>

      <div className="w-full max-w-xs space-y-2.5">
        {LEVELS.map((lvl, i) => {
          const unlocked = lvl.level <= unlockedLevel
          const record = records[lvl.level]

          return (
            <motion.button
              key={lvl.level}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl transition-all ${
                unlocked
                  ? 'glass-card hover:border-[var(--casino-gold)]/40 active:scale-[0.98]'
                  : 'bg-white/3 border border-white/5 opacity-40 cursor-not-allowed'
              }`}
              onClick={() => unlocked && onSelectLevel(lvl.level)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, type: 'spring', stiffness: 150, damping: 20 }}
              disabled={!unlocked}
              whileHover={unlocked ? { y: -1 } : {}}
              whileTap={unlocked ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-3">
                {unlocked ? (
                  <span
                    className="text-base font-bold text-[var(--casino-gold)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Lv.{lvl.level}
                  </span>
                ) : (
                  <span className="text-base text-white/30">🔒</span>
                )}
                <span className="text-white/45 text-xs">{lvl.totalCards} cards</span>
              </div>
              {record && <StarDisplay count={record.stars} />}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
