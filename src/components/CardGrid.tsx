import type { GameCard } from '../types/game'
import Card from './Card'

interface CardGridProps {
  cards: GameCard[]
  gridCols: number
  onCardClick: (index: number) => void
  disabled: boolean
}

export default function CardGrid({ cards, gridCols, onCardClick, disabled }: CardGridProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-3">
      <div
        className="grid gap-[1.5vw] w-full max-w-lg"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        }}
      >
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => onCardClick(index)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  )
}
