// ─── PlayerCard ───────────────────────────────────────────────────────────────
// Reusable card for both teams — driven by `color` prop.

import { CARD_COLOR_CONFIG } from '../constants/constants'
import type { PlayerCardProps } from '../interfaces/types'

export function PlayerCard({
  teamName,
  displayName,
  isShuffling,
  isLocked,
  color,
  available,
  total,
}: PlayerCardProps) {
  const c = CARD_COLOR_CONFIG[color]

  return (
    <div
      className={[
        'relative flex-1 w-full max-w-xs transition-all duration-500',
        isLocked ? 'scale-105' : '',
      ].join(' ')}
    >
      <div
        className={[
          'bg-linear-to-br rounded-3xl p-6 text-center backdrop-blur-sm border-2',
          c.linear,
          c.border,
        ].join(' ')}
        style={{ boxShadow: isLocked ? c.glow : 'none' }}
      >
        {/* Team badge */}
        <div className={['absolute -top-3 right-4 px-4 py-1 rounded-full text-white text-sm font-bold', c.badge].join(' ')}>
          {teamName}
        </div>

        {/* Available counter */}
        <p className={['text-xs mt-1 mb-3', c.counter].join(' ')}>
          متبقي {available} / {total}
        </p>

        {/* Player name */}
        <div
          className={['text-4xl md:text-5xl font-black transition-all duration-150', c.nameColor].join(' ')}
          style={{ textShadow: c.nameShadow }}
        >
          {displayName || '---'}
        </div>
      </div>
    </div>
  )
}