import type { GridPosition, NBackCard, NBackStimulus, NBackRoundConfig, Suit, SuitColor, CardRank } from '../types/nback'

const SUITS: { suit: Suit; symbol: string; color: SuitColor }[] = [
  { suit: 'heart', symbol: '♥', color: 'red' },
  { suit: 'diamond', symbol: '♦', color: 'red' },
  { suit: 'spade', symbol: '♠', color: 'black' },
  { suit: 'club', symbol: '♣', color: 'black' },
]

const RANKS: CardRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function randomPosition(): GridPosition {
  return Math.floor(Math.random() * 9) as GridPosition
}

function randomCard(): NBackCard {
  const suitInfo = SUITS[Math.floor(Math.random() * SUITS.length)]
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)]
  return {
    suit: suitInfo.suit,
    rank,
    color: suitInfo.color,
    symbol: suitInfo.symbol,
  }
}

function differentPosition(exclude: GridPosition): GridPosition {
  let pos: GridPosition
  do {
    pos = randomPosition()
  } while (pos === exclude)
  return pos
}

function differentCard(exclude: NBackCard): NBackCard {
  let card: NBackCard
  do {
    card = randomCard()
  } while (card.rank === exclude.rank && card.color === exclude.color)
  return card
}

export function generateStimuli(config: NBackRoundConfig): NBackStimulus[] {
  const { nLevel, trialCount } = config
  const stimuli: NBackStimulus[] = []

  for (let i = 0; i < trialCount; i++) {
    if (i < nLevel) {
      stimuli.push({ position: randomPosition(), card: randomCard() })
      continue
    }

    const nBack = stimuli[i - nLevel]
    const posMatch = Math.random() < 0.3
    const cardMatch = Math.random() < 0.3

    const position = posMatch ? nBack.position : differentPosition(nBack.position)
    const card = cardMatch
      ? { ...nBack.card }
      : differentCard(nBack.card)

    stimuli.push({ position, card })
  }

  return stimuli
}

export function isPositionMatch(stimuli: NBackStimulus[], index: number, nLevel: number): boolean {
  if (index < nLevel) return false
  return stimuli[index].position === stimuli[index - nLevel].position
}

export function isCardMatch(stimuli: NBackStimulus[], index: number, nLevel: number): boolean {
  if (index < nLevel) return false
  const current = stimuli[index].card
  const nBack = stimuli[index - nLevel].card
  return current.rank === nBack.rank && current.color === nBack.color
}
