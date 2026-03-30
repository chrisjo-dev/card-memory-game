export type Suit = 'heart' | 'diamond' | 'spade' | 'club'

export type SuitColor = 'red' | 'black'

export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  id: string
  suit: Suit
  rank: CardRank
  color: SuitColor
}

export interface GameCard extends Card {
  isFlipped: boolean
  isMatched: boolean
}

export interface Level {
  level: number
  totalCards: number
  pairs: number
  gridCols: number
}

export type GameState = 'idle' | 'playing' | 'checking' | 'cleared'

export interface LevelRecord {
  bestAttempts: number
  bestTime: number
  stars: number
}

export type GameRecords = Record<number, LevelRecord>
