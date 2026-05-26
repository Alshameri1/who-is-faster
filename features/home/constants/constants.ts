// ─── Constants & Config ───────────────────────────────────────────────────────

import type { Team, TeamColorConfig, TeamColor } from '../interfaces/types'

// ── Dropdown options ──────────────────────────────────────────────────────────
export const ROUND_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
export const TIME_OPTIONS   = [10, 15, 20, 30, 45, 60, 90, 120]

// ── Default form values ───────────────────────────────────────────────────────
export const DEFAULT_ROUNDS           = '3'
export const DEFAULT_TIME_PER_PLAYER  = '30'

// ── Color config map  (blue-500 / red-500 palette) ───────────────────────────
export const TEAM_COLOR_CONFIG: Record<TeamColor, TeamColorConfig> = {
  blue: {
    bg:           'bg-blue-500/10',
    border:       'border-blue-500/40',
    header:       'bg-blue-500/20',
    accent:       'text-blue-500',
    inputFocus:   'focus-visible:border-blue-500 focus-visible:ring-blue-500/30',
    dashedBorder: 'border-blue-500/40 text-blue-500 hover:bg-blue-500/10',
  },
  red: {
    bg:           'bg-red-500/10',
    border:       'border-red-500/40',
    header:       'bg-red-500/20',
    accent:       'text-red-500',
    inputFocus:   'focus-visible:border-red-500 focus-visible:ring-red-500/30',
    dashedBorder: 'border-red-500/40 text-red-500 hover:bg-red-500/10',
  },
}

// ── Initial teams factory ─────────────────────────────────────────────────────
export const createInitialTeams = (): Team[] => [
  { id: 'team-1', name: 'الفريق الأول',  isEditing: false, players: [], color: 'blue' },
  { id: 'team-2', name: 'الفريق الثاني', isEditing: false, players: [], color: 'red'  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
export const generatePlayerId = (): string =>
  `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const generateGameId = (): string =>
  typeof window !== 'undefined' && window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : `game-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`