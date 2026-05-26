// ─── TeamTimerCard ────────────────────────────────────────────────────────────
// Reusable card — used for both teams via `color` prop (DRY).

import { Timer } from 'lucide-react'
import { TEAM_COLOR } from '../constants/constants'
import type { TeamTimerCardProps } from '../interfaces/types'
import { formatTime } from '../hooks/use-player-matchup'

export function TeamTimerCard({
  teamName,
  score,
  timer,
  isActive,
  player,
  color,
}: TeamTimerCardProps) {
  const c = TEAM_COLOR[color]

  const timerColor = timer.critical
    ? 'text-red-400'
    : timer.warning
      ? 'text-yellow-400'
      : c.timerNormal

  const timerBg = timer.critical
    ? 'bg-red-500/30 animate-pulse'
    : timer.warning
      ? 'bg-yellow-500/20'
      : 'bg-black/20'

  return (
    <div
      className={[
        'flex flex-row w-fit items-center justify-center gap-2 py-2 md:py-1 px-4 rounded-full transition-[opacity,transform,background-color,border-color,box-shadow] duration-300 ease-in-out',
        isActive ? c.activeBg : c.inactiveBg,
      ].join(' ')}
    >
      {/* Team name */}
      <span className={['text-xs md:text-xs font-bold', isActive ? c.name : c.nameDim].join(' ')}>
        {teamName}:
      </span>

      {/* Timer */}
      {/* <div className={['flex items-center gap-1.5 px-3 py-1.5 rounded-xl', timerBg].join(' ')}>
        <Timer className={['w-4 h-4 md:w-5 md:h-5', timerColor].join(' ')} />
        <span className={['text-2xl md:text-4xl font-black font-mono tabular-nums', timerColor].join(' ')}>
          {formatTime(timer.ms)}
        </span>
      </div> */}

      {/* Score */}
      <div className="flex items-baseline gap-1">
        <span className={['text-base md:text-lg font-black', isActive ? 'text-white' : 'text-white/50'].join(' ')}>
          {score}
        </span>
        <span className={isActive ? c.score : 'text-xs text-white/25'}>نقاط</span>
      </div>

      {/* Active player badge */}
      {isActive && player && (
        <span className={['text-xs px-2.5 py-0.5 rounded-full font-medium', c.player].join(' ')}>
          {player.name}
        </span>
      )}
    </div>
  )
}