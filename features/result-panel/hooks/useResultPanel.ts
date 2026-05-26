'use client'
// ─── useResultPanel Hook ──────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import type { GameSessionData } from '@/contexts/popup-context'
import { getGameState, getGameSessionAction } from '@/lib/redis-actions'

export interface LiveGameState {
  image?: string
  answer?: string
  currentRound?: number
  team1Score?: number
  team2Score?: number
  currentTeamTurn?: 1 | 2
}

export function useResultPanel(gameId: string, initialSession?: GameSessionData | null) {
  const [gameData,   setGameData]   = useState<GameSessionData | null>(initialSession || null)
  const [error,      setError]      = useState<string | null>(null)
  const [isLoading,  setIsLoading]  = useState(!initialSession)
  const [liveState,  setLiveState]  = useState<LiveGameState>({
    image: '',
    answer: '',
    currentRound: 1,
    team1Score: 0,
    team2Score: 0,
    currentTeamTurn: 1,
  })

  // ── Load general game session info from cache/server ─────────────────────────
  useEffect(() => {
    if (gameData) {
      setIsLoading(false)
      return
    }

    const load = async () => {
      try {
        const data = await getGameSessionAction(gameId)
        if (!data) {
          setError('لم يتم العثور على بيانات اللعبة')
          setIsLoading(false)
          return
        }
        setGameData(data)
        setIsLoading(false)
      } catch {
        setError('خطأ في تحميل بيانات اللعبة')
        setIsLoading(false)
      }
    }

    load()
  }, [gameId, gameData])

  // ── Real-time SSE Sync ──────────────────────────────────────────────────────
  useEffect(() => {
    // 1. Initial State Fetch
    const fetchInitial = async () => {
      try {
        const state = await getGameState(gameId)
        if (state) {
          setLiveState(prev => ({ ...prev, ...state }))
        }
      } catch (err) {
        console.error('Failed to fetch initial state from Redis:', err)
      }
    }
    fetchInitial()

    // 2. EventSource Subscription
    const eventSource = new EventSource(`/api/game/${gameId}/stream`)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data) {
          const delta: LiveGameState = {}
          const newImg = data.imageId || data.image
          if (newImg !== undefined) delta.image = newImg
          if (data.answer !== undefined) delta.answer = data.answer
          if (data.teamId !== undefined) delta.currentTeamTurn = data.teamId as 1 | 2
          if (data.currentTeamTurn !== undefined) delta.currentTeamTurn = data.currentTeamTurn as 1 | 2
          if (data.currentRound !== undefined) delta.currentRound = data.currentRound
          if (data.team1Score !== undefined) delta.team1Score = data.team1Score
          if (data.team2Score !== undefined) delta.team2Score = data.team2Score
          
          setLiveState(prev => ({ ...prev, ...delta }))
        }
      } catch (err) {
        console.error('Error parsing SSE payload:', err)
      }
    }

    return () => {
      eventSource.close()
    }
  }, [gameId])

  return { gameData, error, isLoading, liveState }
}