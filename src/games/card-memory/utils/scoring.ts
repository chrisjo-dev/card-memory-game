export function calculateStars(attempts: number, pairCount: number): number {
  if (attempts <= pairCount * 1.5) return 3
  if (attempts <= pairCount * 2) return 2
  return 1
}

export function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
