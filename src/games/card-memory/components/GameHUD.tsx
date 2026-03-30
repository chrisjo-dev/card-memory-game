import { formatTime } from '../utils/scoring'

interface GameHUDProps {
  level: number
  attempts: number
  seconds: number
  onHome: () => void
}

export default function GameHUD({ level, attempts, seconds, onHome }: GameHUDProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2.5"
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
      }}
    >
      <button
        onClick={onHome}
        className="text-white/50 hover:text-[var(--casino-gold)] transition-colors text-sm px-1"
        aria-label="Home"
      >
        ← Back
      </button>
      <span
        className="text-sm font-bold text-[var(--casino-gold)] tracking-wider"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Level {level}
      </span>
      <div className="flex gap-4 text-xs text-white/60">
        <span>Tries <span className="text-white/90 font-semibold">{attempts}</span></span>
        <span className="font-mono text-white/90">{formatTime(seconds)}</span>
      </div>
    </div>
  )
}
