interface NBackHUDProps {
  nLevel: number
  currentTrial: number
  totalTrials: number
  onHome: () => void
}

export default function NBackHUD({ nLevel, currentTrial, totalTrials, onHome }: NBackHUDProps) {
  const progress = ((currentTrial + 1) / totalTrials) * 100

  return (
    <div>
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
          backdropFilter: 'blur(12px)',
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
          {nLevel}-Back
        </span>
        <span className="text-xs font-mono text-white/50">{currentTrial + 1}/{totalTrials}</span>
      </div>
      <div className="h-0.5 bg-white/5">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--casino-gold-dim), var(--casino-gold))',
          }}
        />
      </div>
    </div>
  )
}
