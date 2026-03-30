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
  const textColor = card.color === 'red' ? 'text-red-500' : 'text-gray-800'

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
          className="absolute inset-0 rounded-xl card-back-pattern shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="card-back-inner">
            <span className="card-back-symbol">♠</span>
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-xl border border-gray-200 flex flex-col p-1.5 overflow-hidden shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f6f0 100%)',
          }}
        >
          <div className={`flex flex-col items-center leading-none ${textColor} text-[clamp(0.6rem,2vw,0.9rem)]`}>
            <span className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>{card.rank}</span>
            <span className="text-[0.7em]">{symbol}</span>
          </div>

          <div className={`flex-1 flex items-center justify-center ${textColor}`}>
            <span className="text-[clamp(1.5rem,5vw,2.5rem)] drop-shadow-sm">{symbol}</span>
          </div>

          <div className={`flex flex-col items-center leading-none self-end rotate-180 ${textColor} text-[clamp(0.6rem,2vw,0.9rem)]`}>
            <span className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>{card.rank}</span>
            <span className="text-[0.7em]">{symbol}</span>
          </div>

          {card.isMatched && (
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, rgba(74,222,128,0.05) 70%)',
                border: '2px solid rgba(74,222,128,0.5)',
                boxShadow: '0 0 15px rgba(74,222,128,0.2)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}
