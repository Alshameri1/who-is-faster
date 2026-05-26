'use client'
// ─── useGamePlay Hook ─────────────────────────────────────────────────────────
// Owns ALL game state & transition logic. GamePlayClient stays presentational.

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { GameSessionData } from '@/contexts/popup-context'
import type { GameState, GamePlayState, MatchedPlayer } from '../interfaces/types'
import { INITIAL_PLAY_STATE, STORAGE_KEY } from '../constants/constants'
import { publishGameState } from '@/lib/redis-actions'

export function useGamePlay(gameId: string) {
  const router = useRouter()

  const [gameState,   setGameState]   = useState<GameState>('LOADING')
  const [sessionData, setSessionData] = useState<GameSessionData | null>(null)
  const [playState,   setPlayState]   = useState<GamePlayState>(INITIAL_PLAY_STATE)
  const [roundWinner, setRoundWinner] = useState<1 | 2 | null>(null)
  const [error,       setError]       = useState<string | null>(null)

  // ── Init player pools once session loads ───────────────────────────────────
  useEffect(() => {
    if (!sessionData) return
    setPlayState(prev => ({
      ...prev,
      playerPoolTeam1: sessionData.team1Data.players.map(p => p.id),
      playerPoolTeam2: sessionData.team2Data.players.map(p => p.id),
    }))
  }, [sessionData])

  // ── Publish playState updates to Redis ─────────────────────────────────────
  useEffect(() => {
    if (!sessionData) return
    publishGameState(gameId, {
      currentRound: playState.currentRound,
      team1Score: playState.team1Score,
      team2Score: playState.team2Score,
      currentTeamTurn: playState.currentTeamTurn,
    })
  }, [
    gameId,
    sessionData,
    playState.currentRound,
    playState.team1Score,
    playState.team2Score,
    playState.currentTeamTurn,
  ])

  // ── Load session from localStorage ────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) { setError('لم يتم العثور على بيانات اللعبة'); return }

      const data: GameSessionData = JSON.parse(stored)
      if (data.gameId !== gameId) { setError('معرف اللعبة غير متطابق'); return }

      setSessionData(data)
      setGameState('ROUND_INTRO')
    } catch (err) {
      console.error('Failed to load game data:', err)
      setError('خطأ في تحميل بيانات اللعبة')
    }
  }, [gameId])

  // ── Anti-repeat helper: refill pool when all players used once ─────────────
  const refillIfNeeded = useCallback((
    usedPlayers: string[],
    allPlayers:  { id: string; name: string }[]
  ): { pool: string[]; used: string[] } => {
    const exhausted = allPlayers.length - usedPlayers.length <= 0
    return exhausted
      ? { pool: allPlayers.map(p => p.id), used: [] }   // reset cycle
      : { pool: allPlayers.map(p => p.id), used: usedPlayers }
  }, [])

  // ── Toggle team turn helper ───────────────────────────────────────────────
  const toggleTurn = (prev: GamePlayState): GamePlayState => ({
    ...prev,
    currentTeamTurn: prev.currentTeamTurn === 1 ? 2 : 1,
  })

  // ── Stage transitions ─────────────────────────────────────────────────────
  const handleRoundIntroComplete = useCallback(() => setGameState('WHEEL'), [])

  const handleWheelComplete = useCallback((category: string) => {
    setPlayState(prev => ({ ...prev, selectedCategory: category }))
    setGameState('MATCHUP')
  }, [])

  const handleMatchupComplete = useCallback((
    team1Player: MatchedPlayer,
    team2Player: MatchedPlayer,
  ) => {
    setPlayState(prev => ({
      ...prev,
      matchedPlayers: { team1Player, team2Player },
      usedPlayersTeam1: [...prev.usedPlayersTeam1, team1Player.id],
      usedPlayersTeam2: [...prev.usedPlayersTeam2, team2Player.id],
    }))
    setGameState('COUNTDOWN')
  }, [])

  const handleCountdownComplete = useCallback(() => setGameState('PLAYING'), [])

  // Stay in PLAYING, just switch turn (timer keeps running)
  const handleCorrectAnswer = useCallback(() => setPlayState(toggleTurn), [])

  const handleRoundEnd = useCallback((winningTeam: 1 | 2) => {
    setPlayState(prev => ({
      ...prev,
      team1Score: prev.team1Score + (winningTeam === 1 ? 1 : 0),
      team2Score: prev.team2Score + (winningTeam === 2 ? 1 : 0),
    }))
    setRoundWinner(winningTeam)
    setGameState('ROUND_RESULT')
  }, [])

  const handleRoundResultComplete = useCallback(() => {
    if (!sessionData) return

    // Tie-breaker just ended
    if (playState.isTieBreaker) { setGameState('GAME_OVER'); return }

    // All rounds done
    if (playState.currentRound >= sessionData.rounds) {
      setGameState(
        playState.team1Score === playState.team2Score ? 'TIE_BREAKER_INTRO' : 'GAME_OVER'
      )
      return
    }

    // Refill pools if needed, advance round
    const t1 = refillIfNeeded(playState.usedPlayersTeam1, sessionData.team1Data.players)
    const t2 = refillIfNeeded(playState.usedPlayersTeam2, sessionData.team2Data.players)

    setPlayState(prev => ({
      ...prev,
      currentRound:     prev.currentRound + 1,
      currentTeamTurn:  1,
      selectedCategory: null,
      matchedPlayers:   { team1Player: null, team2Player: null },
      playerPoolTeam1:  t1.pool,
      playerPoolTeam2:  t2.pool,
      usedPlayersTeam1: t1.used,
      usedPlayersTeam2: t2.used,
    }))
    setRoundWinner(null)
    setGameState('ROUND_INTRO')
  }, [sessionData, playState, refillIfNeeded])

  const handleTieBreakerIntroComplete = useCallback(() => {
    if (!sessionData) return
    setPlayState(prev => ({
      ...prev,
      currentRound:     prev.currentRound + 1,
      currentTeamTurn:  1,
      selectedCategory: null,
      matchedPlayers:   { team1Player: null, team2Player: null },
      isTieBreaker:     true,
    }))
    setRoundWinner(null)
    setGameState('WHEEL')
  }, [sessionData])

  const handlePlayAgain = useCallback(() => {
    if (!sessionData) return
    setPlayState({
      ...INITIAL_PLAY_STATE,
      playerPoolTeam1: sessionData.team1Data.players.map(p => p.id),
      playerPoolTeam2: sessionData.team2Data.players.map(p => p.id),
    })
    setRoundWinner(null)
    setGameState('ROUND_INTRO')
  }, [sessionData])

  const handleRestart = useCallback(() => handlePlayAgain(), [handlePlayAgain])

  const handleGoHome = useCallback(() => router.push('/'), [router])

  return {
    // state
    gameState, sessionData, playState, roundWinner, error,
    // handlers
    handleRoundIntroComplete,
    handleWheelComplete,
    handleMatchupComplete,
    handleCountdownComplete,
    handleCorrectAnswer,
    handleRoundEnd,
    handleRoundResultComplete,
    handleTieBreakerIntroComplete,
    handlePlayAgain,
    handleRestart,
    handleGoHome,
  }
}