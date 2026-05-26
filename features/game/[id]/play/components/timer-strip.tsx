import { formatTime, timerState } from '../hooks/use-player-matchup'

interface TimerStripProps {
  team1TimeMs: number
  team2TimeMs: number
  maxTimeMs: number
  currentTeamTurn: 1 | 2
}

interface TimerBarProps {
  progress: number
  active: boolean
  reverse?: boolean
  critical: boolean
  className: string
}

function TimerBar({
  progress,
  active,
  reverse = false,
  critical,
  className,
}: TimerBarProps) {
  return (
    <div
      className={[
        'relative h-2.5 flex-1 overflow-hidden bg-white/10',
        reverse ? 'rounded-r-full' : 'rounded-l-full',
      ].join(' ')}
    >
      <div
        className={[
          'absolute inset-0 origin-center',
          'transition-transform duration-100 ease-linear',
          className,
          active ? 'opacity-100' : 'opacity-40',
          critical ? 'animate-pulse' : '',
        ].join(' ')}
        style={{
          transform: `scaleX(${progress / 100})`,
          transformOrigin: reverse ? 'right' : 'left',
        }}
      />
    </div>
  )
}

export function TimerStrip({
  team1TimeMs,
  team2TimeMs,
  maxTimeMs,
  currentTeamTurn,
}: TimerStripProps) {
  const t1Pct = Math.max(0, Math.min(100, (team1TimeMs / maxTimeMs) * 100))
  const t2Pct = Math.max(0, Math.min(100, (team2TimeMs / maxTimeMs) * 100))

  const limitSecs = maxTimeMs / 1000
  const t1 = timerState(team1TimeMs, limitSecs)
  const t2 = timerState(team2TimeMs, limitSecs)

  const barColor = (
    isCritical: boolean,
    isWarning: boolean,
    baseColor: string
  ) =>
    isCritical
      ? 'bg-red-500'
      : isWarning
      ? 'bg-yellow-400'
      : baseColor

  const textColor = (
    isCritical: boolean,
    isWarning: boolean,
    baseColor: string
  ) =>
    isCritical
      ? 'text-red-400'
      : isWarning
      ? 'text-yellow-400'
      : baseColor

  const t1Bar = barColor(t1.critical, t1.warning, 'bg-blue-500')
  const t2Bar = barColor(t2.critical, t2.warning, 'bg-red-500')

  const t1Text = textColor(t1.critical, t1.warning, 'text-blue-400')
  const t2Text = textColor(t2.critical, t2.warning, 'text-red-400')

  return (
    <div className="flex w-full items-center gap-0">

      {/* Team 2 */}
      <TimerBar
        progress={t2Pct}
        active={currentTeamTurn === 2}
        reverse
        critical={t2.critical}
        className={t2Bar}
      />

      {/* Center */}
      <div className="flex shrink-0 items-center gap-2.5 px-3">

        <span
          className={[
            'text-lg font-black tabular-nums leading-none',
            t2Text,
            currentTeamTurn !== 2 ? 'opacity-40' : '',
          ].join(' ')}
        >
          {formatTime(team2TimeMs)}
        </span>

        <span className="text-white/20 text-xs">|</span>

        <span
          className={[
            'text-lg font-black tabular-nums leading-none',
            t1Text,
            currentTeamTurn !== 1 ? 'opacity-40' : '',
          ].join(' ')}
        >
          {formatTime(team1TimeMs)}
        </span>

      </div>

      {/* Team 1 */}
      <TimerBar
        progress={t1Pct}
        active={currentTeamTurn === 1}
        critical={t1.critical}
        className={t1Bar}
      />

    </div>
  )
}