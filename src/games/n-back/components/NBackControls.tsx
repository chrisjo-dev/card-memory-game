import { motion } from 'framer-motion'
import type { NBackStimulus, GridPosition } from '../types/nback'

interface NBackControlsProps {
  onPosition: () => void
  onCard: () => void
  positionPressed: boolean
  cardPressed: boolean
  disabled: boolean
  feedback: { position: boolean; card: boolean } | null
  nBackStimulus: NBackStimulus | null
  nLevel: number
}

function PositionHint({ position }: { position: GridPosition }) {
  return (
    <div className="grid grid-cols-3 gap-0.5 w-7 h-7 mx-auto mb-1">
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          className={`rounded-sm ${i === position ? 'bg-yellow-400' : 'bg-white/20'}`}
        />
      ))}
    </div>
  )
}

function CardHint({ stimulus }: { stimulus: NBackStimulus }) {
  const color = stimulus.card.color === 'red' ? 'text-red-400' : 'text-white'
  return (
    <div className={`text-center mb-1 ${color}`}>
      <span className="text-sm font-bold">{stimulus.card.rank}</span>
      <span className="text-xs">{stimulus.card.symbol}</span>
    </div>
  )
}

function ControlButton({ label, icon, hint, onPress, pressed, disabled, correct }: {
  label: string
  icon: string
  hint: React.ReactNode
  onPress: () => void
  pressed: boolean
  disabled: boolean
  correct: boolean | null
}) {
  let borderClass = 'border-yellow-600/40'
  let bgClass = 'bg-white/10'

  if (correct !== null) {
    borderClass = correct ? 'border-green-400' : 'border-red-400'
    bgClass = correct ? 'bg-green-400/20' : 'bg-red-400/20'
  } else if (pressed) {
    borderClass = 'border-yellow-400'
    bgClass = 'bg-yellow-600/30'
  }

  return (
    <motion.button
      className={`flex-1 py-3 rounded-xl border-2 transition-colors ${borderClass} ${bgClass} ${
        disabled ? 'opacity-40' : 'active:scale-[0.97]'
      }`}
      onClick={onPress}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.97 }}
    >
      <div className="flex flex-col items-center">
        {hint}
        <span className="text-white text-lg">{icon}</span>
        <span className="text-white/60 text-xs mt-0.5">{label}</span>
      </div>
    </motion.button>
  )
}

export default function NBackControls({
  onPosition, onCard, positionPressed, cardPressed, disabled, feedback,
  nBackStimulus, nLevel,
}: NBackControlsProps) {
  return (
    <div className="px-4 pb-4 pt-2">
      <p className="text-white/40 text-xs text-center mb-2">
        {nBackStimulus ? `${nLevel}번 전과 같으면 누르세요` : `첫 ${nLevel}개는 기억만 하세요`}
      </p>
      <div className="flex gap-3">
        <ControlButton
          label="Same Position"
          icon="📍"
          hint={nBackStimulus ? <PositionHint position={nBackStimulus.position} /> : <div className="h-8" />}
          onPress={onPosition}
          pressed={positionPressed}
          disabled={disabled}
          correct={feedback?.position ?? null}
        />
        <ControlButton
          label="Same Card"
          icon="🃏"
          hint={nBackStimulus ? <CardHint stimulus={nBackStimulus} /> : <div className="h-8" />}
          onPress={onCard}
          pressed={cardPressed}
          disabled={disabled}
          correct={feedback?.card ?? null}
        />
      </div>
    </div>
  )
}
