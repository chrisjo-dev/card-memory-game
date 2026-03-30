import { motion } from 'framer-motion'
import type { NBackRecords } from '../types/nback'

interface StatsViewProps {
  records: NBackRecords
  onBack: () => void
}

function LineChart({ sessions }: { sessions: NBackRecords['sessions'] }) {
  if (sessions.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-white/40 text-sm">
        No sessions yet
      </div>
    )
  }

  const reversed = [...sessions].reverse()
  const maxN = Math.max(9, ...reversed.map(s => s.nLevel))
  const width = 280
  const height = 160
  const padding = { top: 10, right: 10, bottom: 20, left: 30 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const points = reversed.map((s, i) => {
    const x = padding.left + (reversed.length === 1 ? chartW / 2 : (i / (reversed.length - 1)) * chartW)
    const y = padding.top + chartH - (s.nLevel / maxN) * chartH
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[280px]">
      {[...Array(maxN)].map((_, i) => {
        const y = padding.top + chartH - ((i + 1) / maxN) * chartH
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
            <text x={padding.left - 5} y={y + 3} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="end">{i + 1}</text>
          </g>
        )
      })}
      <polyline
        points={points}
        fill="none"
        stroke="#d4a843"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {reversed.map((s, i) => {
        const x = padding.left + (reversed.length === 1 ? chartW / 2 : (i / (reversed.length - 1)) * chartW)
        const y = padding.top + chartH - (s.nLevel / maxN) * chartH
        return <circle key={i} cx={x} cy={y} r={3} fill="#d4a843" />
      })}
      <text x={width / 2} y={height - 2} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle">Sessions</text>
    </svg>
  )
}

export default function StatsView({ records, onBack }: StatsViewProps) {
  const avgPos = records.sessions.length > 0
    ? Math.round(records.sessions.reduce((s, r) => s + r.positionAccuracy, 0) / records.sessions.length)
    : 0
  const avgCard = records.sessions.length > 0
    ? Math.round(records.sessions.reduce((s, r) => s + r.cardAccuracy, 0) / records.sessions.length)
    : 0

  return (
    <div className="flex flex-col items-center min-h-screen relative px-6 py-8">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 text-xl text-white/60 hover:text-white transition-colors p-2"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
        aria-label="Back"
      >
        &#8592;
      </button>

      <motion.h2
        className="text-2xl font-bold text-yellow-400 font-serif mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Statistics
      </motion.h2>

      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="text-white/50 text-sm">Best N-Back Level</p>
          <p className="text-4xl font-bold text-yellow-400">{records.bestN}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-white/70 text-sm mb-2 text-center">N-Level Progress</p>
          <LineChart sessions={records.sessions} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-white/50 text-xs mb-1">Avg Position</p>
            <p className="text-2xl font-bold text-white">{avgPos}%</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-white/50 text-xs mb-1">Avg Card</p>
            <p className="text-2xl font-bold text-white">{avgCard}%</p>
          </div>
        </div>

        <p className="text-white/30 text-xs text-center">
          Last {records.sessions.length} sessions
        </p>
      </div>
    </div>
  )
}
