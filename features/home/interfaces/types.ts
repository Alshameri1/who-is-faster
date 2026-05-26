// ─── Types ────────────────────────────────────────────────────────────────────

export interface Player {
  id: string
  name: string
  error?: string
}

export interface Team {
  id: string
  name: string
  isEditing: boolean
  players: Player[]
  color: TeamColor
}

export type TeamColor = 'blue' | 'red'

export interface TeamColorConfig {
  bg: string
  border: string
  header: string
  accent: string
  inputFocus: string
  dashedBorder: string
}