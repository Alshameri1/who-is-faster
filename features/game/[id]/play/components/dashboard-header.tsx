// ─── DashboardHeader ──────────────────────────────────────────────────────────
// Layout: [Team-2 card] | [Active-turn indicator] | [Team-1 card]
//         ──────────── TimerStrip (full width) ────────────────

import { TeamTimerCard } from './team-timer-card'
import { TimerStrip }    from './timer-strip'
import type { GameSessionData } from '@/contexts/popup-context'
import type { GamePlayState, TimerState } from '../interfaces/types'
import { timerState } from '../hooks/use-player-matchup'

interface DashboardHeaderProps {
  sessionData:  GameSessionData
  playState:    GamePlayState
  team1TimeMs:  number
  team2TimeMs:  number
  isTieBreaker: boolean
  team1RoundScore: number
  team2RoundScore: number
}

export function DashboardHeader({
  sessionData,
  playState,
  team1TimeMs,
  team2TimeMs,
  isTieBreaker,
  team1RoundScore,
  team2RoundScore,
}: DashboardHeaderProps) {
  const turn = playState.currentTeamTurn

  const limitSecs = sessionData.timePerPlayer
  const t1: TimerState = { ms: team1TimeMs, ...timerState(team1TimeMs, limitSecs) }
  const t2: TimerState = { ms: team2TimeMs, ...timerState(team2TimeMs, limitSecs) }

  const activeName = turn === 1
    ? sessionData.team1Data.name
    : sessionData.team2Data.name

  return (
    <header className="shrink-0 border-b border-gray-700 px-4 py-3 md:px-6 md:py-4 flex flex-col gap-5">

      {/* ── Tie-breaker banner ─────────────────────────────────────────────── */}
      {isTieBreaker && (
        <div className="mb-2 flex justify-center">
          <div className="animate-pulse rounded-full border border-yellow-500 bg-yellow-500/10 px-4 py-1">
            <span className="text-sm font-bold text-yellow-400">الجولة الحاسمة الفاصلة</span>
          </div>
        </div>
      )}

      {/* ── 3-column layout ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-center">

        {/* Team 2 (40%) */}
        <div className="flex w-[40%] items-center justify-center">
          <TeamTimerCard
            teamName={sessionData.team2Data.name}
            score={playState.team2Score}
            timer={t2}
            isActive={turn === 2}
            player={playState.matchedPlayers.team2Player}
            color="red"
          />
        </div>

        {/* Center: active turn indicator and round scores (20%) */}
        <div className="flex w-[20%] items-center justify-center gap-4">
          {/* Team 2 (Red) Round Score - Right side of screen visually in RTL */}
          <div className="flex items-center justify-center">
            <span 
              className="text-2xl md:text-3xl font-black text-red-400" 
              style={{ textShadow: '0 0 15px rgba(248,113,113,0.6)' }}
            >
              {team2RoundScore}
            </span>
          </div>

          {/* Active Turn Pill */}
          <div
            className={[
              'flex min-w-24 flex-row items-center justify-center gap-2',
              'rounded-2xl border-2 px-4 py-2 font-bold shadow-md',
              'transition-all duration-500 scale-105',
              turn === 1
                ? 'border-blue-400/80 bg-blue-600/40 text-white shadow-blue-500/50'
                : 'border-red-400/80 bg-red-600/40 text-white shadow-red-500/50',
            ].join(' ')}
          >
            <span className="text-[10px] font-normal uppercase tracking-wider text-white/80 md:text-xs">
              دور:
            </span>
            <span className="max-w-28 truncate text-center text-xs leading-tight md:text-sm">
              {activeName}
            </span>
          </div>

          {/* Team 1 (Blue) Round Score - Left side of screen visually in RTL */}
          <div className="flex items-center justify-center">
            <span 
              className="text-2xl md:text-3xl font-black text-cyan-400" 
              style={{ textShadow: '0 0 15px rgba(34,211,238,0.6)' }}
            >
              {team1RoundScore}
            </span>
          </div>
        </div>

        {/* Team 1 (40%) */}
        <div className="flex w-[40%] items-center justify-center">
          <TeamTimerCard
            teamName={sessionData.team1Data.name}
            score={playState.team1Score}
            timer={t1}
            isActive={turn === 1}
            player={playState.matchedPlayers.team1Player}
            color="blue"
          />
        </div>

      </div>

      {/* ── Timer strip (full width, glued below cards) ────────────────────── */}
      <div className="px-1">
        <TimerStrip
          team1TimeMs={team1TimeMs}
          team2TimeMs={team2TimeMs}
          maxTimeMs={sessionData.timePerPlayer * 1000}
          currentTeamTurn={turn}
        />
      </div>

    </header>
  )
}