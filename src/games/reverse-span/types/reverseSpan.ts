export type Suit = 'heart' | 'diamond' | 'spade' | 'club'
export type SuitColor = 'red' | 'black'
export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface SpanCard {
  suit: Suit
  rank: CardRank
  color: SuitColor
  symbol: string
  id: string
}

export type ReverseSpanPhase = 'ready' | 'showing' | 'answering' | 'result'

export interface ReverseSpanRecord {
  date: string
  bestSpan: number
}

export interface ReverseSpanRecords {
  bestSpan: number
  sessions: ReverseSpanRecord[]
}
