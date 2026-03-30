import { formatTime } from '../utils/scoring'

interface GameHUDProps {
  level: number
  attempts: number
  seconds: number
  onHome: () => void
}

export default function GameHUD({ level, attempts, seconds, onHome }: GameHUDProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-black/30 backdrop-blur-sm text-white">
      <button
        onClick={onHome}
        className="text-lg px-2 py-1 hover:text-yellow-400 transition-colors"
        aria-label="Home"
      >
        &#8962;
      </button>
      <span className="text-sm font-semibold text-yellow-400">Level {level}</span>
      <span className="text-sm">Attempts: {attempts}</span>
      <span className="text-sm font-mono">{formatTime(seconds)}</span>
    </div>
  )
}
