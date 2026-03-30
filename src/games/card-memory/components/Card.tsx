import { motion } from 'framer-motion'
import type { GameCard } from '../types/game'
import { getSuitSymbol } from '../utils/deck'

interface CardProps {
  card: GameCard
  onClick: () => void
  disabled: boolean
}

export default function Card({ card, onClick, disabled }: CardProps) {
  const isOpen = card.isFlipped || card.isMatched
  const symbol = getSuitSymbol(card.suit)
  const textColor = card.color === 'red' ? 'text-red-600' : 'text-gray-900'

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ aspectRatio: '2.5 / 3.5' }}
      onClick={() => {
        if (!disabled && !card.isFlipped && !card.isMatched) onClick()
      }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && !card.isFlipped && !card.isMatched) {
          e.preventDefault()
          onClick()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={isOpen ? `${card.rank} ${symbol}` : 'Hidden card'}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isOpen ? 180 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <div
          className="absolute inset-0 rounded-lg border-2 border-yellow-600 flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1a5c32 0%, #0d3d1f 100%)',
          }}
        >
          <div className="w-3/4 h-3/4 rounded border border-yellow-700/50 flex items-center justify-center">
            <div className="text-yellow-700/60 text-2xl font-serif">&#9830;</div>
          </div>
        </div>

        <div
          className="absolute inset-0 bg-white rounded-lg border border-gray-300 flex flex-col p-1 overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className={`flex flex-col items-center leading-none ${textColor} text-[clamp(0.6rem,2vw,0.9rem)]`}>
            <span className="font-bold">{card.rank}</span>
            <span className="text-[0.7em]">{symbol}</span>
          </div>

          <div className={`flex-1 flex items-center justify-center ${textColor}`}>
            <span className="text-[clamp(1.5rem,5vw,2.5rem)]">{symbol}</span>
          </div>

          <div className={`flex flex-col items-center leading-none self-end rotate-180 ${textColor} text-[clamp(0.6rem,2vw,0.9rem)]`}>
            <span className="font-bold">{card.rank}</span>
            <span className="text-[0.7em]">{symbol}</span>
          </div>

          {card.isMatched && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-green-400/20 border-2 border-green-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}
