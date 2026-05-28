'use client'
// ─── PlayerMatchup ────────────────────────────────────────────────────────────
// Purely presentational — all logic lives in usePlayerMatchup.

import { Button }           from '@/components/button'
import { usePlayerMatchup } from '../hooks/use-player-matchup'
import { PlayerCard }       from '../components/player-card'
import { VsBadge }          from '../components/vs-badge'
import type { PlayerMatchupProps } from '../interfaces/types'

export function PlayerMatchup({
  team1,
  team2,
  usedPlayersTeam1,
  usedPlayersTeam2,
  onComplete,
}: PlayerMatchupProps) {
  const {
    isShuffling,
    isLocked,
    displayName1,
    displayName2,
    availablePlayers1,
    availablePlayers2,
    handleContinue,
  } = usePlayerMatchup({ team1, team2, usedPlayersTeam1, usedPlayersTeam2, onComplete })

  return (
    <div dir="rtl" className="flex h-full flex-col items-center justify-center overflow-hidden p-4">

      {/* ── Title ─────────────────────────────────────────────────────────── */}
      <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">المواجهة</h2>
      <p className="mb-10 text-white/60 md:mb-12">من سيواجه من؟</p>

      {/* ── Cards ─────────────────────────────────────────────────────────── */}
      <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-6 md:flex-row md:gap-12">
        <PlayerCard
          teamName={team2.name}
          displayName={displayName2}
          isShuffling={isShuffling}
          isLocked={isLocked}
          color="red"
          available={availablePlayers2.length}
          total={team2.players.length}
        />

        <VsBadge isShuffling={isShuffling} isLocked={isLocked} />

        <PlayerCard
          teamName={team1.name}
          displayName={displayName1}
          isShuffling={isShuffling}
          isLocked={isLocked}
          color="blue"
          available={availablePlayers1.length}
          total={team1.players.length}
        />
      </div>

      {/* ── Continue (visible only after lock) ────────────────────────────── */}
      <div
        className={[
          'mt-8 transition-all duration-500 md:mt-12',
          isLocked ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        ].join(' ')}
      >
        <Button
          onClick={handleContinue}
          text="متابعة"
          isFullWidth
          className={[
            'rounded-2xl bg-linear-to-r from-green-500 to-emerald-500',
            'px-10 py-4 text-xl font-bold text-white',
            'transition-all duration-300',
            'hover:scale-105 hover:shadow-lg hover:shadow-green-500/30',
            'active:scale-95',
            !isLocked ? 'cursor-not-allowed opacity-50' : '',
          ].join(' ')}
        />
      </div>
    </div>
  )
}