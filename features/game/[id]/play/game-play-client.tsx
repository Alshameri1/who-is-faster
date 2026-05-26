'use client'

import { useEffect } from 'react'
import { useGamePlay }            from './hooks/use-game-play'
import { Loading as LoadingScreen }          from '@/app/_loading'
import { Error as ErrorScreen }            from '@/app/_error'
import { RoundIntro }             from './stages/round-intro'
import { FortuneWheel }           from './stages/fortune-wheel'
import { PlayerMatchup }          from './stages/player-matchup'
import { Countdown }              from './stages/countdown'
import { GameplayDashboard }      from './stages/gameplay-dashboard'
import { RoundWinnerOverlay }     from './components/round-winner-overlay'
import { GameOverScreen }         from './components/game-over-screen'
import { TieBreakerIntro }        from './components/tie-breaker-intro'
import type { GamePlayClientProps } from './interfaces/types'
import { CATEGORY_IMAGES, DEFAULT_IMAGES } from './data/image'

// Gather and deduplicate all game images
const ALL_IMAGES = Array.from(
  new Set([
    ...DEFAULT_IMAGES,
    ...Object.values(CATEGORY_IMAGES).flatMap((cat) => cat.map((item) => item.image)),
  ])
)

export function GamePlayClient({ gameId }: GamePlayClientProps) {
  const game = useGamePlay(gameId)

  // Strict browser caching & JS pre-decoding on initialization
  useEffect(() => {
    if (typeof window === 'undefined') return
    ALL_IMAGES.forEach((src) => {
      const optimizedSrc = `/_next/image?url=${encodeURIComponent(src)}&w=828&q=75`
      const img = new Image()
      img.src = optimizedSrc
      img.decode().catch(() => {
        // Safe to ignore decode errors on background preloading
      })
    })
  }, [])

  // ── Loading ────────────────────────────────────────────────────────────────
  if (game.gameState === 'LOADING') return <LoadingScreen />

  // ── Error ──────────────────────────────────────────────────────────────────
  if (game.error) return <ErrorScreen message={game.error} onGoHome={game.handleGoHome} />

  if (!game.sessionData) return null

  const { sessionData: sd, playState: ps } = game

  // ── Full-screen states (no wrapper needed) ─────────────────────────────────
  if (game.gameState === 'GAME_OVER') {
    return (
      <GameOverScreen
        sessionData={sd}
        team1Score={ps.team1Score}
        team2Score={ps.team2Score}
        onPlayAgain={game.handlePlayAgain}
      />
    )
  }

  if (game.gameState === 'TIE_BREAKER_INTRO') {
    return <TieBreakerIntro onComplete={game.handleTieBreakerIntroComplete} />
  }

  if (game.gameState === 'ROUND_RESULT' && game.roundWinner) {
    const winnerName = game.roundWinner === 1 ? sd.team1Data.name : sd.team2Data.name
    return (
      <RoundWinnerOverlay
        winnerName={winnerName}
        winnerTeam={game.roundWinner}
        onComplete={game.handleRoundResultComplete}
      />
    )
  }

  // ── Main stage wrapper ─────────────────────────────────────────────────────
  return (
    <div className="h-screen overflow-hidden bg-[#0c1628]">

      {game.gameState === 'ROUND_INTRO' && (
        <RoundIntro
          roundNumber={ps.currentRound}
          totalRounds={ps.isTieBreaker ? ps.currentRound : sd.rounds}
          onComplete={game.handleRoundIntroComplete}
        />
      )}

      {game.gameState === 'WHEEL' && (
        <FortuneWheel onComplete={game.handleWheelComplete} />
      )}

      {game.gameState === 'MATCHUP' && (
        <PlayerMatchup
          team1={sd.team1Data}
          team2={sd.team2Data}
          usedPlayersTeam1={ps.usedPlayersTeam1}
          usedPlayersTeam2={ps.usedPlayersTeam2}
          onComplete={game.handleMatchupComplete}
        />
      )}

      {game.gameState === 'COUNTDOWN' && (
        <Countdown onComplete={game.handleCountdownComplete} />
      )}

      {game.gameState === 'PLAYING' && (
        <GameplayDashboard
          sessionData={sd}
          playState={ps}
          onCorrectAnswer={game.handleCorrectAnswer}
          onRoundEnd={game.handleRoundEnd}
          onRestart={game.handleRestart}
          isTieBreaker={ps.isTieBreaker}
        />
      )}

    </div>
  )
}