// ─── Game Play Types ──────────────────────────────────────────────────────────
import type { GameSessionData } from '@/contexts/popup-context'

export type GameState =
  | 'LOADING'
  | 'ROUND_INTRO'
  | 'WHEEL'
  | 'MATCHUP'
  | 'COUNTDOWN'
  | 'PLAYING'
  | 'ROUND_RESULT'
  | 'TIE_BREAKER_INTRO'
  | 'GAME_OVER'

export interface MatchedPlayer {
  id:   string
  name: string
}

export interface MatchedPlayers {
  team1Player: MatchedPlayer | null
  team2Player: MatchedPlayer | null
}

export interface GamePlayState {
  currentRound:      number
  team1Score:        number
  team2Score:        number
  currentTeamTurn:   1 | 2
  selectedCategory:  string | null
  matchedPlayers:    MatchedPlayers
  // Anti-repeat player pools
  playerPoolTeam1:   string[]
  playerPoolTeam2:   string[]
  usedPlayersTeam1:  string[]
  usedPlayersTeam2:  string[]
  isTieBreaker:      boolean
  lastRoundScores?:  { team1: number; team2: number }
}

export interface GamePlayClientProps {
  gameId: string
}

export interface Player {
  id:   string
  name: string
}
 
export interface Team {
  id:      string
  name:    string
  players: Player[]
}
 
export type CardColor = 'blue' | 'red'
 
export interface PlayerMatchupProps {
  team1:             Team
  team2:             Team
  usedPlayersTeam1:  string[]
  usedPlayersTeam2:  string[]
  onComplete: (
    team1Player: Player,
    team2Player: Player,
  ) => void
}
 
export interface PlayerCardProps {
  teamName:    string
  displayName: string
  isShuffling: boolean
  isLocked:    boolean
  color:       CardColor
  available:   number
  total:       number
}
 
export interface GameplayDashboardProps {
  sessionData:     GameSessionData
  playState:       GamePlayState
  onTurnToggle:    () => void
  onRoundEnd:      (winningTeam: 1 | 2 | 'tie', team1RoundScore?: number, team2RoundScore?: number) => void
  onRestart:       () => void
  isTieBreaker?:   boolean
  isMenuOpen:      boolean
  setIsMenuOpen:   (open: boolean) => void
}
 
export interface TimerState {
  ms:       number
  warning:  boolean   // <= 10s
  critical: boolean   // <= 5s
}
 
export interface TeamTimerCardProps {
  teamName:   string
  score:      number
  timer:      TimerState
  isActive:   boolean
  player:     { id: string; name: string } | null
  color:      'blue' | 'red'
}
 