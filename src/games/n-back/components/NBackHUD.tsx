interface NBackHUDProps {
  nLevel: number
  currentTrial: number
  totalTrials: number
  onHome: () => void
}

export default function NBackHUD({ nLevel, currentTrial, totalTrials, onHome }: NBackHUDProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-black/30 backdrop-blur-sm text-white">
      <button
        onClick={onHome}
        className="text-lg px-2 py-1 hover:text-yellow-400 transition-colors"
        aria-label="Home"
      >
        &#8962;
      </button>
      <span className="text-sm font-semibold text-yellow-400">{nLevel}-Back</span>
      <span className="text-sm font-mono">{currentTrial + 1}/{totalTrials}</span>
    </div>
  )
}
