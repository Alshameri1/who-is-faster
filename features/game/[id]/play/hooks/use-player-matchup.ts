'use client'
// ─── usePlayerMatchup Hook ────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import { SHUFFLE_DURATION_MS, SHUFFLE_INTERVAL_MS } from '../constants/constants'
import type { Player, Team } from '../interfaces/types'

interface UsePlayerMatchupProps {
  team1:            Team
  team2:            Team
  usedPlayersTeam1: string[]
  usedPlayersTeam2: string[]
  onComplete:       (p1: Player, p2: Player) => void
}

/** Returns players not yet used in the current cycle */
function getAvailable(all: Player[], usedIds: string[]): Player[] {
  const available = all.filter(p => !usedIds.includes(p.id))
  return available.length > 0 ? available : all
}

/** Pick a random item from an array */
export function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
export function formatTime(ms: number): string {
  const total   = Math.max(0, ms / 1000)
  const secs    = Math.floor(total)
  const tenths  = Math.floor((total - secs) * 10)
  return `${secs}.${tenths}`
}
 
export function timerState(ms: number, timerLimitSeconds: number = 30) {
  const secs = ms / 1000
  if (timerLimitSeconds < 30) {
    return { warning: secs <= 6, critical: secs <= 3 }
  } else {
    return { warning: secs <= 10, critical: secs <= 5 }
  }
}

export function usePlayerMatchup({
  team1,
  team2,
  usedPlayersTeam1,
  usedPlayersTeam2,
  onComplete,
}: UsePlayerMatchupProps) {
  const [isShuffling,      setIsShuffling]      = useState(true)
  const [displayName1,     setDisplayName1]     = useState('')
  const [displayName2,     setDisplayName2]     = useState('')
  const [selectedPlayer1,  setSelectedPlayer1]  = useState<Player | null>(null)
  const [selectedPlayer2,  setSelectedPlayer2]  = useState<Player | null>(null)
  const [isLocked,         setIsLocked]         = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef  = useRef<NodeJS.Timeout | null>(null)
  const mountedRef  = useRef(true)

  const availablePlayers1 = getAvailable(team1.players, usedPlayersTeam1)
  const availablePlayers2 = getAvailable(team2.players, usedPlayersTeam2)

  // Clear both timer refs
  const clearTimers = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (timeoutRef.current)  { clearTimeout(timeoutRef.current);   timeoutRef.current  = null }
  }, [])

  // ── Shuffle effect ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isShuffling) return
    mountedRef.current = true

    // Pre-select final winners from the available (anti-repeat) pool
    const finalPlayer1 = randomPick(availablePlayers1)
    const finalPlayer2 = randomPick(availablePlayers2)

    // Cycle random names every 50 ms (visual only — uses ALL players for variety)
    intervalRef.current = setInterval(() => {
      if (!mountedRef.current) return
      setDisplayName1(randomPick(team1.players).name)
      setDisplayName2(randomPick(team2.players).name)
    }, SHUFFLE_INTERVAL_MS)

    // Lock exactly after SHUFFLE_DURATION_MS
    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return
      clearTimers()
      setDisplayName1(finalPlayer1.name)
      setDisplayName2(finalPlayer2.name)
      setSelectedPlayer1(finalPlayer1)
      setSelectedPlayer2(finalPlayer2)
      setIsShuffling(false)
      setIsLocked(true)
    }, SHUFFLE_DURATION_MS)

    return () => { mountedRef.current = false; clearTimers() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once on mount

  // Unmount safety
  useEffect(() => () => { mountedRef.current = false; clearTimers() }, [clearTimers])

  const handleContinue = useCallback(() => {
    if (selectedPlayer1 && selectedPlayer2) {
      onComplete(selectedPlayer1, selectedPlayer2)
    }
  }, [selectedPlayer1, selectedPlayer2, onComplete])

  return {
    isShuffling,
    isLocked,
    displayName1,
    displayName2,
    availablePlayers1,
    availablePlayers2,
    handleContinue,
  }
}