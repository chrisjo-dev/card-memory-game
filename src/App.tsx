import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CardMemoryGame from './games/card-memory/CardMemoryGame'
import NBackGame from './games/n-back/NBackGame'
import ReverseSpanGame from './games/reverse-span/ReverseSpanGame'
import { useGameRecords } from './games/card-memory/hooks/useGameRecords'
import { useNBackRecords } from './games/n-back/hooks/useNBackRecords'
import { useReverseSpanRecords } from './games/reverse-span/hooks/useReverseSpanRecords'

type Screen = 'dashboard' | 'card-memory' | 'n-back' | 'reverse-span'

function Dashboard({ onSelectGame, cardMemoryBestLevel, nBackBestN, reverseSpanBest }: {
  onSelectGame: (game: Screen) => void
  cardMemoryBestLevel: number
  nBackBestN: number
  reverseSpanBest: number
}) {
  const games = [
    { id: 'card-memory' as const, icon: '🃏', title: 'Card Memory', desc: 'Find matching pairs', stat: `Best: Lv.${cardMemoryBestLevel}` },
    { id: 'n-back' as const, icon: '🧠', title: 'N-Back', desc: 'Working memory training', stat: `Best: ${nBackBestN}-Back` },
    { id: 'reverse-span' as const, icon: '🔄', title: 'Reverse Span', desc: 'Memorize & reverse order', stat: reverseSpanBest > 0 ? `Best: ${reverseSpanBest}장` : '' },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6">
      <motion.h1
        className="text-4xl font-bold text-yellow-400 font-serif mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Brain Training
      </motion.h1>
      <motion.p
        className="text-white/50 text-sm mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Train your memory
      </motion.p>
      <div className="w-full max-w-xs space-y-4">
        {games.map((game, i) => (
          <motion.button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className="w-full bg-white/10 border border-yellow-600/40 rounded-2xl p-5 text-left hover:bg-white/20 active:scale-[0.98] transition-all"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i }}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{game.icon}</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-yellow-400">{game.title}</h2>
                <p className="text-white/50 text-sm">{game.desc}</p>
              </div>
              <span className="text-white/40 text-xs">{game.stat}</span>
            </div>
          </motion.button>
        ))}
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
            transition={{ duration: 0.2 }}
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
            transition={{ duration: 0.2 }}
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
            transition={{ duration: 0.2 }}
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
            transition={{ duration: 0.2 }}
          >
            <ReverseSpanGame onHome={() => setScreen('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
