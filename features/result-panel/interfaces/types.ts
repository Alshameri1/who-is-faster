// ─── ResultPanel Types ────────────────────────────────────────────────────────

import type { GameSessionData } from '@/contexts/popup-context'

export interface ResultPanelClientProps {
  gameId: string
  initialSession: GameSessionData | null
}

export interface TeamScoreCardProps {
  teamData:  GameSessionData['team1Data'] | GameSessionData['team2Data']
  score:     number
  color:     'blue' | 'red'
  isActive:  boolean
}

export interface GameInfoBarProps {
  rounds:        number
  timePerPlayer: number
}