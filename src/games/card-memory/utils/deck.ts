import type { Suit, SuitColor, CardRank, GameCard, Level } from '../types/game'

export const SUITS: { suit: Suit; symbol: string; color: SuitColor }[] = [
  { suit: 'heart', symbol: '♥', color: 'red' },
  { suit: 'diamond', symbol: '♦', color: 'red' },
  { suit: 'spade', symbol: '♠', color: 'black' },
  { suit: 'club', symbol: '♣', color: 'black' },
]

export const RANKS: CardRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export const LEVELS: Level[] = [
  { level: 1, totalCards: 8, pairs: 4, gridCols: 4 },
  { level: 2, totalCards: 12, pairs: 6, gridCols: 4 },
  { level: 3, totalCards: 16, pairs: 8, gridCols: 4 },
  { level: 4, totalCards: 20, pairs: 10, gridCols: 5 },
  { level: 5, totalCards: 24, pairs: 12, gridCols: 6 },
]

export function getSuitSymbol(suit: Suit): string {
  return SUITS.find(s => s.suit === suit)!.symbol
}

export function getSuitColor(suit: Suit): SuitColor {
  return SUITS.find(s => s.suit === suit)!.color
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function generateDeck(pairCount: number): GameCard[] {
  const shuffledRanks = shuffleArray(RANKS)
  const selectedRanks = shuffledRanks.slice(0, pairCount)

  const redSuits: [Suit, Suit] = ['heart', 'diamond']
  const blackSuits: [Suit, Suit] = ['spade', 'club']

  const cards: GameCard[] = []

  selectedRanks.forEach((rank, index) => {
    const suitPair = index % 2 === 0 ? redSuits : blackSuits
    const color = getSuitColor(suitPair[0])

    cards.push({
      id: `${suitPair[0]}-${rank}`,
      suit: suitPair[0],
      rank,
      color,
      isFlipped: false,
      isMatched: false,
    })
    cards.push({
      id: `${suitPair[1]}-${rank}`,
      suit: suitPair[1],
      rank,
      color,
      isFlipped: false,
      isMatched: false,
    })
  })

  return shuffleArray(cards)
}
