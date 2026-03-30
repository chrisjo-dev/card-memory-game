export type Suit = 'heart' | 'diamond' | 'spade' | 'club'
export type SuitColor = 'red' | 'black'
export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export type GridPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface NBackCard {
  suit: Suit
  rank: CardRank
  color: SuitColor
  symbol: string
}

export interface NBackStimulus {
  position: GridPosition
  card: NBackCard
}

export interface NBackTrial {
  stimulus: NBackStimulus
  isPositionMatch: boolean
  isCardMatch: boolean
  playerPositionResponse: boolean | null
  playerCardResponse: boolean | null
}

export type NBackPhase = 'setup' | 'playing' | 'feedback' | 'result' | 'stats'

export interface NBackRoundConfig {
  nLevel: number
  trialCount: number
}

export interface NBackSessionRecord {
  date: string
  nLevel: number
  trialCount: number
  positionAccuracy: number
  cardAccuracy: number
  result: 'up' | 'stay' | 'down'
}

export interface NBackRecords {
  sessions: NBackSessionRecord[]
  bestN: number
  recommendedN: number
}
