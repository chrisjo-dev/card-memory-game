import { motion } from 'framer-motion'

interface NBackControlsProps {
  onPosition: () => void
  onCard: () => void
  positionPressed: boolean
  cardPressed: boolean
  disabled: boolean
  feedback: { position: boolean; card: boolean } | null
}

function ControlButton({ label, onPress, pressed, disabled, correct }: {
  label: string
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
      className={`flex-1 py-4 rounded-xl border-2 font-semibold text-lg transition-colors ${borderClass} ${bgClass} ${
        disabled ? 'opacity-40' : 'active:scale-[0.97]'
      }`}
      onClick={onPress}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.97 }}
    >
      <span className="text-white">{label}</span>
    </motion.button>
  )
}

export default function NBackControls({ onPosition, onCard, positionPressed, cardPressed, disabled, feedback }: NBackControlsProps) {
  return (
    <div className="flex gap-3 px-4 pb-4 pt-2">
      <ControlButton
        label="Position"
        onPress={onPosition}
        pressed={positionPressed}
        disabled={disabled}
        correct={feedback?.position ?? null}
      />
      <ControlButton
        label="Card"
        onPress={onCard}
        pressed={cardPressed}
        disabled={disabled}
        correct={feedback?.card ?? null}
      />
    </div>
  )
}
