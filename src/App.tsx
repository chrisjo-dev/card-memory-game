import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CardMemoryGame from './games/card-memory/CardMemoryGame'
import NBackGame from './games/n-back/NBackGame'
import ReverseSpanGame from './games/reverse-span/ReverseSpanGame'
import { useGameRecords } from './games/card-memory/hooks/useGameRecords'
import { useNBackRecords } from './games/n-back/hooks/useNBackRecords'
import { useReverseSpanRecords } from './games/reverse-span/hooks/useReverseSpanRecords'

type Screen = 'dashboard' | 'card-memory' | 'n-back' | 'reverse-span'

function GameCard({ icon, title, desc, stat, delay, onClick }: {
  icon: string; title: string; desc: string; stat: string; delay: number; onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full glass-card rounded-2xl p-5 text-left hover:border-[var(--casino-gold)]/40 active:scale-[0.98] transition-all group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 150, damping: 20 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--casino-gold)]/20 to-transparent border border-[var(--casino-gold)]/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-[var(--casino-cream)] tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            {title}
          </h2>
          <p className="text-white/40 text-xs mt-0.5">{desc}</p>
        </div>
        {stat && (
          <div className="text-right">
            <span className="text-[var(--casino-gold)] text-xs font-semibold">{stat}</span>
          </div>
        )}
      </div>
    </motion.button>
  )
}

function Dashboard({ onSelectGame, cardMemoryBestLevel, nBackBestN, reverseSpanBest }: {
  onSelectGame: (game: Screen) => void
  cardMemoryBestLevel: number
  nBackBestN: number
  reverseSpanBest: number
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <motion.div
        className="mb-1 text-[var(--casino-gold)]/30 text-5xl"
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        ♠ ♥ ♦ ♣
      </motion.div>
      <motion.h1
        className="text-gold-shimmer text-4xl font-black tracking-tight mb-1"
        style={{ fontFamily: 'var(--font-display)' }}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        Brain Training
      </motion.h1>
      <motion.div
        className="flex items-center gap-3 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--casino-gold)]/30" />
        <p className="text-white/30 text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-body)' }}>
          Train your memory
        </p>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--casino-gold)]/30" />
      </motion.div>

      <div className="w-full max-w-sm space-y-3">
        <GameCard
          icon="🃏"
          title="Card Memory"
          desc="Find matching card pairs"
          stat={cardMemoryBestLevel > 0 ? `Lv.${cardMemoryBestLevel}` : ''}
          delay={0.25}
          onClick={() => onSelectGame('card-memory')}
        />
        <GameCard
          icon="🧠"
          title="N-Back"
          desc="Working memory training"
          stat={nBackBestN > 1 ? `${nBackBestN}-Back` : ''}
          delay={0.35}
          onClick={() => onSelectGame('n-back')}
        />
        <GameCard
          icon="🔄"
          title="Reverse Span"
          desc="Memorize & reverse the order"
          stat={reverseSpanBest > 0 ? `${reverseSpanBest} cards` : ''}
          delay={0.45}
          onClick={() => onSelectGame('reverse-span')}
        />
      </div>
    </div>
  )
}

function App() {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const { records: cardRecords } = useGameRecords()
  const { bestN } = useNBackRecords()
  const { bestSpan } = useReverseSpanRecords()

  const cardMemoryBestLevel = Object.keys(cardRecords).length > 0
    ? Math.max(...Object.keys(cardRecords).map(Number))
    : 0

  return (
    <div className="h-full flex flex-col">
      <AnimatePresence mode="wait">
        {screen === 'dashboard' && (
          <motion.div
            key="dashboard"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Dashboard
              onSelectGame={setScreen}
              cardMemoryBestLevel={cardMemoryBestLevel}
              nBackBestN={bestN}
              reverseSpanBest={bestSpan}
            />
          </motion.div>
        )}
        {screen === 'card-memory' && (
          <motion.div
            key="card-memory"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CardMemoryGame onHome={() => setScreen('dashboard')} />
          </motion.div>
        )}
        {screen === 'n-back' && (
          <motion.div
            key="n-back"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <NBackGame onHome={() => setScreen('dashboard')} />
          </motion.div>
        )}
        {screen === 'reverse-span' && (
          <motion.div
            key="reverse-span"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ReverseSpanGame onHome={() => setScreen('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
