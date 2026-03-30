import { describe, it, expect } from 'vitest'
import { generateStimuli, isPositionMatch, isCardMatch } from '../utils/stimulus'

describe('generateStimuli', () => {
  it('should generate correct number of stimuli', () => {
    const stimuli = generateStimuli({ nLevel: 1, trialCount: 20, speed: 'normal', mode: 'dual' })
    expect(stimuli).toHaveLength(20)
  })

  it('should generate valid positions (0-8)', () => {
    const stimuli = generateStimuli({ nLevel: 2, trialCount: 30, speed: 'normal', mode: 'dual' })
    stimuli.forEach(s => {
      expect(s.position).toBeGreaterThanOrEqual(0)
      expect(s.position).toBeLessThanOrEqual(8)
    })
  })

  it('should generate valid cards with suit, rank, color, symbol', () => {
    const stimuli = generateStimuli({ nLevel: 1, trialCount: 20, speed: 'normal', mode: 'dual' })
    const validSuits = ['heart', 'diamond', 'spade', 'club']
    const validColors = ['red', 'black']
    const validRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

    stimuli.forEach(s => {
      expect(validSuits).toContain(s.card.suit)
      expect(validColors).toContain(s.card.color)
      expect(validRanks).toContain(s.card.rank)
      expect(s.card.symbol).toBeTruthy()
    })
  })

  it('should have color matching suit (red for heart/diamond, black for spade/club)', () => {
    const stimuli = generateStimuli({ nLevel: 1, trialCount: 100, speed: 'normal', mode: 'dual' })
    stimuli.forEach(s => {
      if (s.card.suit === 'heart' || s.card.suit === 'diamond') {
        expect(s.card.color).toBe('red')
      } else {
        expect(s.card.color).toBe('black')
      }
    })
  })

  it('should work with nLevel=1', () => {
    const stimuli = generateStimuli({ nLevel: 1, trialCount: 10, speed: 'normal', mode: 'dual' })
    expect(stimuli).toHaveLength(10)
  })

  it('should work with nLevel=3', () => {
    const stimuli = generateStimuli({ nLevel: 3, trialCount: 20, speed: 'normal', mode: 'dual' })
    expect(stimuli).toHaveLength(20)
  })

  it('should approximate 30% position match rate over many trials', () => {
    let posMatches = 0
    let totalScorable = 0
    for (let run = 0; run < 10; run++) {
      const stimuli = generateStimuli({ nLevel: 1, trialCount: 100, speed: 'normal', mode: 'dual' })
      for (let i = 1; i < stimuli.length; i++) {
        totalScorable++
        if (stimuli[i].position === stimuli[i - 1].position) posMatches++
      }
    }
    const rate = posMatches / totalScorable
    expect(rate).toBeGreaterThan(0.15)
    expect(rate).toBeLessThan(0.45)
  })

  it('should approximate 30% card match rate over many trials', () => {
    let cardMatches = 0
    let totalScorable = 0
    for (let run = 0; run < 10; run++) {
      const stimuli = generateStimuli({ nLevel: 1, trialCount: 100, speed: 'normal', mode: 'dual' })
      for (let i = 1; i < stimuli.length; i++) {
        totalScorable++
        if (stimuli[i].card.rank === stimuli[i - 1].card.rank && stimuli[i].card.color === stimuli[i - 1].card.color) {
          cardMatches++
        }
      }
    }
    const rate = cardMatches / totalScorable
    expect(rate).toBeGreaterThan(0.15)
    expect(rate).toBeLessThan(0.45)
  })
})

describe('isPositionMatch', () => {
  it('should return false for trials before nLevel', () => {
    const stimuli = generateStimuli({ nLevel: 2, trialCount: 10, speed: 'normal', mode: 'dual' })
    expect(isPositionMatch(stimuli, 0, 2)).toBe(false)
    expect(isPositionMatch(stimuli, 1, 2)).toBe(false)
  })

  it('should correctly detect position matches', () => {
    const stimuli = [
      { position: 0 as const, card: { suit: 'heart' as const, rank: 'A' as const, color: 'red' as const, symbol: '♥' } },
      { position: 0 as const, card: { suit: 'spade' as const, rank: '3' as const, color: 'black' as const, symbol: '♠' } },
    ]
    expect(isPositionMatch(stimuli, 1, 1)).toBe(true)
  })

  it('should correctly detect position non-matches', () => {
    const stimuli = [
      { position: 0 as const, card: { suit: 'heart' as const, rank: 'A' as const, color: 'red' as const, symbol: '♥' } },
      { position: 4 as const, card: { suit: 'spade' as const, rank: '3' as const, color: 'black' as const, symbol: '♠' } },
    ]
    expect(isPositionMatch(stimuli, 1, 1)).toBe(false)
  })
})

describe('isCardMatch', () => {
  it('should return false for trials before nLevel', () => {
    const stimuli = generateStimuli({ nLevel: 2, trialCount: 10, speed: 'normal', mode: 'dual' })
    expect(isCardMatch(stimuli, 0, 2)).toBe(false)
    expect(isCardMatch(stimuli, 1, 2)).toBe(false)
  })

  it('should match same rank + same color (different suit ok)', () => {
    const stimuli = [
      { position: 0 as const, card: { suit: 'heart' as const, rank: 'A' as const, color: 'red' as const, symbol: '♥' } },
      { position: 4 as const, card: { suit: 'diamond' as const, rank: 'A' as const, color: 'red' as const, symbol: '♦' } },
    ]
    expect(isCardMatch(stimuli, 1, 1)).toBe(true)
  })

  it('should NOT match same rank + different color', () => {
    const stimuli = [
      { position: 0 as const, card: { suit: 'heart' as const, rank: 'A' as const, color: 'red' as const, symbol: '♥' } },
      { position: 4 as const, card: { suit: 'spade' as const, rank: 'A' as const, color: 'black' as const, symbol: '♠' } },
    ]
    expect(isCardMatch(stimuli, 1, 1)).toBe(false)
  })

  it('should NOT match different rank + same color', () => {
    const stimuli = [
      { position: 0 as const, card: { suit: 'heart' as const, rank: 'A' as const, color: 'red' as const, symbol: '♥' } },
      { position: 4 as const, card: { suit: 'heart' as const, rank: '3' as const, color: 'red' as const, symbol: '♥' } },
    ]
    expect(isCardMatch(stimuli, 1, 1)).toBe(false)
  })

  it('should work with nLevel=2 (comparing index 2 with index 0)', () => {
    const stimuli = [
      { position: 0 as const, card: { suit: 'heart' as const, rank: 'A' as const, color: 'red' as const, symbol: '♥' } },
      { position: 1 as const, card: { suit: 'spade' as const, rank: '3' as const, color: 'black' as const, symbol: '♠' } },
      { position: 2 as const, card: { suit: 'diamond' as const, rank: 'A' as const, color: 'red' as const, symbol: '♦' } },
    ]
    expect(isCardMatch(stimuli, 2, 2)).toBe(true)
  })
})

describe('accuracy calculation scenarios', () => {
  it('scenario: player correctly identifies all matches → 100% accuracy', () => {
    // Simulate: all trials are matches, player presses both buttons
    const stimuli = [
      { position: 0 as const, card: { suit: 'heart' as const, rank: 'A' as const, color: 'red' as const, symbol: '♥' } },
      { position: 0 as const, card: { suit: 'diamond' as const, rank: 'A' as const, color: 'red' as const, symbol: '♦' } },
    ]

    const nLevel = 1
    const posMatch = isPositionMatch(stimuli, 1, nLevel) // true
    const cardMatch = isCardMatch(stimuli, 1, nLevel)     // true

    // Player pressed both → correct for both
    const playerPos = true
    const playerCard = true

    expect(posMatch).toBe(true)
    expect(cardMatch).toBe(true)
    expect(playerPos === posMatch).toBe(true)  // correct
    expect(playerCard === cardMatch).toBe(true) // correct
  })

  it('scenario: player presses nothing on non-match → correct', () => {
    const stimuli = [
      { position: 0 as const, card: { suit: 'heart' as const, rank: 'A' as const, color: 'red' as const, symbol: '♥' } },
      { position: 4 as const, card: { suit: 'spade' as const, rank: '3' as const, color: 'black' as const, symbol: '♠' } },
    ]

    const posMatch = isPositionMatch(stimuli, 1, 1) // false
    const cardMatch = isCardMatch(stimuli, 1, 1)     // false

    const playerPos = false // did not press
    const playerCard = false

    expect(posMatch).toBe(false)
    expect(cardMatch).toBe(false)
    expect(playerPos === posMatch).toBe(true)  // correct: didn't press, wasn't a match
    expect(playerCard === cardMatch).toBe(true) // correct
  })

  it('scenario: player presses position on non-match → incorrect', () => {
    const stimuli = [
      { position: 0 as const, card: { suit: 'heart' as const, rank: 'A' as const, color: 'red' as const, symbol: '♥' } },
      { position: 4 as const, card: { suit: 'spade' as const, rank: '3' as const, color: 'black' as const, symbol: '♠' } },
    ]

    const posMatch = isPositionMatch(stimuli, 1, 1)
    const playerPos = true // pressed but wrong

    expect(posMatch).toBe(false)
    expect(playerPos === posMatch).toBe(false) // incorrect: pressed but wasn't a match
  })

  it('scenario: player misses a match (doesnt press) → incorrect', () => {
    const stimuli = [
      { position: 0 as const, card: { suit: 'heart' as const, rank: 'A' as const, color: 'red' as const, symbol: '♥' } },
      { position: 0 as const, card: { suit: 'diamond' as const, rank: 'A' as const, color: 'red' as const, symbol: '♦' } },
    ]

    const posMatch = isPositionMatch(stimuli, 1, 1)
    const playerPos = false // didn't press

    expect(posMatch).toBe(true)
    expect(playerPos === posMatch).toBe(false) // incorrect: didn't press but was a match
  })
})

describe('adaptive difficulty', () => {
  function calcAdaptive(posAcc: number, cardAcc: number): 'up' | 'stay' | 'down' {
    if (posAcc >= 80 && cardAcc >= 80) return 'up'
    if (posAcc <= 50 || cardAcc <= 50) return 'down'
    return 'stay'
  }

  it('both >= 80% → up', () => {
    expect(calcAdaptive(80, 80)).toBe('up')
    expect(calcAdaptive(100, 90)).toBe('up')
  })

  it('either <= 50% → down', () => {
    expect(calcAdaptive(50, 80)).toBe('down')
    expect(calcAdaptive(80, 50)).toBe('down')
    expect(calcAdaptive(30, 30)).toBe('down')
  })

  it('between 51-79% → stay', () => {
    expect(calcAdaptive(70, 70)).toBe('stay')
    expect(calcAdaptive(79, 79)).toBe('stay')
    expect(calcAdaptive(51, 79)).toBe('stay')
  })

  it('edge case: exactly 80% and 50% → down (50 triggers down)', () => {
    expect(calcAdaptive(80, 50)).toBe('down')
  })

  it('edge case: 80% and 51% → stay', () => {
    expect(calcAdaptive(80, 51)).toBe('stay')
  })
})

describe('differentCard guarantees different card', () => {
  it('generated non-match card should differ in rank or color', () => {
    // Run generateStimuli many times and verify non-matches are actually different
    for (let run = 0; run < 20; run++) {
      const stimuli = generateStimuli({ nLevel: 1, trialCount: 20, speed: 'normal', mode: 'dual' })
      for (let i = 1; i < stimuli.length; i++) {
        const current = stimuli[i].card
        const nBack = stimuli[i - 1].card
        const isMatch = current.rank === nBack.rank && current.color === nBack.color
        // isPositionMatch/isCardMatch should agree with manual check
        expect(isCardMatch(stimuli, i, 1)).toBe(isMatch)
      }
    }
  })
})
