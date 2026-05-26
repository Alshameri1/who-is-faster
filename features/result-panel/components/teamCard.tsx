// ─── TeamScoreCard ────────────────────────────────────────────────────────────
// Reusable card for both teams — driven by `color` prop (DRY).

import { Trophy, Users } from 'lucide-react'
import { TEAM_COLOR }    from '../constants/constants'
import type { TeamScoreCardProps } from '../interfaces/types'

export function TeamScoreCard({ teamData, score, color, isActive }: TeamScoreCardProps) {
  const c = TEAM_COLOR[color]
  const activeRing = color === 'blue' ? 'ring-4 ring-blue-500/40' : 'ring-4 ring-red-500/40'

  return (
    <div className={[
      'overflow-hidden rounded-2xl border-2 transition-[opacity,transform,box-shadow] duration-300 ease-in-out',
      c.border,
      c.bg,
      isActive ? `opacity-100 scale-[1.02] ${activeRing} shadow-lg` : 'opacity-40 scale-[0.98] ring-0'
    ].join(' ')}>

      {/* Header */}
      <div className={['flex items-center justify-between px-6 py-4', c.header].join(' ')}>
        <h2 className={['text-xl font-bold', c.accent].join(' ')}>{teamData.name}</h2>
        <Trophy className={['h-6 w-6', c.accent].join(' ')} />
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Score */}
        <div className="mb-4 text-center">
          <span className="text-6xl font-bold text-white">{score}</span>
          <span className="mr-2 text-2xl text-gray-400">نقطة</span>
        </div>

        {/* Players */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="h-4 w-4" />
            <span>{teamData.players.length} متسابقين</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {teamData.players.map(player => (
              <span
                key={player.id}
                className={['rounded-full px-3 py-1 text-sm', c.badge].join(' ')}
              >
                {player.name}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}