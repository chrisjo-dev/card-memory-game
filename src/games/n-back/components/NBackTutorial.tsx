import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NBackTutorialProps {
  onDone: () => void
}

const STEPS = [
  {
    title: '게임 목표',
    desc: '카드가 하나씩 나타납니다.\nN번 전에 나왔던 것과 비교해서 같으면 버튼을 누르세요.',
    grid: null as number | null,
    card: null as string | null,
    highlight: null as string | null,
  },
  {
    title: '1번째 카드',
    desc: '하트 A가 왼쪽 위(1번 칸)에 나타났어요.\n처음이라 비교 대상이 없으니 기억만 하세요.',
    grid: 0,
    card: 'A♥',
    highlight: null,
  },
  {
    title: '2번째 카드 (1-Back)',
    desc: '스페이드 3이 가운데(5번 칸)에 나타났어요.\n1번 전(하트 A, 1번 칸)과 비교합니다.',
    grid: 4,
    card: '3♠',
    highlight: null,
  },
  {
    title: '판단하기',
    desc: '위치가 같나요? → 1번 칸 vs 5번 칸 → 다름! ❌\n카드가 같나요? → A♥ vs 3♠ → 다름! ❌\n→ 아무 버튼도 안 누르면 됩니다.',
    grid: 4,
    card: '3♠',
    highlight: 'none',
  },
  {
    title: '3번째 카드',
    desc: '하트 A가 가운데(5번 칸)에 나타났어요.\n1번 전(스페이드 3, 5번 칸)과 비교합니다.',
    grid: 4,
    card: 'A♥',
    highlight: null,
  },
  {
    title: '판단하기',
    desc: '위치가 같나요? → 5번 칸 vs 5번 칸 → 같음! ✅\n카드가 같나요? → 3♠ vs A♥ → 다름! ❌\n→ 📍 Position 버튼만 누릅니다!',
    grid: 4,
    card: 'A♥',
    highlight: 'position',
  },
  {
    title: '준비 완료!',
    desc: '이렇게 매번 N번 전과 비교하면 됩니다.\nSlow 속도, 1-Back으로 시작해보세요!',
    grid: null,
    card: null,
    highlight: null,
  },
]

function MiniGrid({ active }: { active: number | null }) {
  return (
    <div className="grid grid-cols-3 gap-1 w-24 h-24 mx-auto">
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          className={`rounded ${i === active ? 'bg-white' : 'bg-green-950 border border-green-800/50'} flex items-center justify-center`}
        >
          {i === active && (
            <span className="text-xs font-bold text-red-600">A♥</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default function NBackTutorial({ onDone }: NBackTutorialProps) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8">
      <motion.div
        className="w-full max-w-sm bg-gradient-to-b from-green-900 to-green-950 rounded-2xl border border-yellow-600/40 p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="text-center mb-1">
          <span className="text-white/40 text-xs">{step + 1} / {STEPS.length}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-bold text-yellow-400 text-center mb-4">{current.title}</h2>

            {current.grid !== null && (
              <div className="mb-4">
                <MiniGrid active={current.grid} />
                {current.card && (
                  <p className="text-center text-white/70 text-sm mt-2">
                    {current.card.includes('♥') || current.card.includes('♦')
                      ? <span className="text-red-400 font-bold">{current.card}</span>
                      : <span className="text-white font-bold">{current.card}</span>
                    }
                  </p>
                )}
              </div>
            )}

            {current.highlight === 'position' && (
              <div className="flex gap-2 justify-center mb-4">
                <div className="px-4 py-2 rounded-lg border-2 border-green-400 bg-green-400/20 text-sm text-white">📍 Position ✅</div>
                <div className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/5 text-sm text-white/40">🃏 Card</div>
              </div>
            )}
            {current.highlight === 'none' && (
              <div className="flex gap-2 justify-center mb-4">
                <div className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/5 text-sm text-white/40">📍 Position</div>
                <div className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/5 text-sm text-white/40">🃏 Card</div>
              </div>
            )}

            <p className="text-white/70 text-sm text-center whitespace-pre-line leading-relaxed">
              {current.desc}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mt-6">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm"
            >
              ← 이전
            </button>
          )}
          <button
            onClick={() => isLast ? onDone() : setStep(s => s + 1)}
            className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-xl transition-colors"
          >
            {isLast ? '시작하기' : '다음 →'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
