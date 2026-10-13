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

      <motion.section
        className="w-full max-w-sm mt-6 glass-card rounded-2xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        aria-label="게임 소개 및 하는 방법"
      >
        <h2 className="text-sm font-bold text-[var(--casino-gold)] mb-3 tracking-wide">게임 소개 / 하는 방법</h2>
        <div className="space-y-2 text-xs text-white/50 leading-relaxed">
          <p>Brain Training은 기억력, 집중력을 키우는 뇌 훈련 게임 모음입니다.</p>
          <p><span className="text-white/70">🃏 카드 메모리</span> — 카드를 두 장씩 뒤집어 같은 숫자의 쌍을 모두 찾으면 클리어. 레벨 1(8장)부터 레벨 5(24장)까지 점점 어려워집니다.</p>
          <p><span className="text-white/70">🧠 N-Back</span> — 3×3 격자에 카드가 순서대로 나타날 때, N단계 전과 위치나 카드가 같으면 버튼을 누릅니다. 정확도에 따라 난이도가 자동 조정됩니다.</p>
          <p><span className="text-white/70">🔄 역방향 스팬</span> — 차례로 보여주는 카드를 기억한 뒤 역순으로 입력합니다. 성공할수록 카드 수가 늘어납니다.</p>
          <p className="text-white/30 pt-1">게임 기록은 이 기기의 브라우저에만 저장됩니다.</p>
        </div>
      </motion.section>

      <motion.footer
        className="w-full max-w-sm mt-4 mb-8 flex flex-wrap justify-center gap-x-4 gap-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
      >
        {[
          { label: 'wspace 홈', href: 'https://www.wspace.ai.kr/' },
          { label: '소개', href: 'https://www.wspace.ai.kr/about/' },
          { label: '개인정보처리방침', href: 'https://www.wspace.ai.kr/privacy/' },
          { label: '연락처', href: 'https://www.wspace.ai.kr/contact/' },
        ].map(({ label, href }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/25 text-xs hover:text-white/50 transition-colors"
          >
            {label}
          </a>
        ))}
      </motion.footer>
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
