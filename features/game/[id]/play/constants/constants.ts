// ─── Game Play Constants ──────────────────────────────────────────────────────

import type { GamePlayState } from '../interfaces/types'

export const INITIAL_PLAY_STATE: GamePlayState = {
  currentRound:     1,
  team1Score:       0,
  team2Score:       0,
  currentTeamTurn:  1,
  selectedCategory: null,
  matchedPlayers: {
    team1Player: null,
    team2Player: null,
  },
  playerPoolTeam1:  [],
  playerPoolTeam2:  [],
  usedPlayersTeam1: [],
  usedPlayersTeam2: [],
  isTieBreaker:     false,
}

export const STORAGE_KEY = 'game_session_data'

export const SHUFFLE_DURATION_MS  = 5_000
 
/** How often the displayed name cycles during shuffle */
export const SHUFFLE_INTERVAL_MS  = 50
 
export const CARD_COLOR_CONFIG = {
  blue: {
    linear:   'from-blue-500/20 to-blue-600/10',
    border:     'border-blue-500/50',
    glow:       '0 0 40px rgba(59, 130, 246, 0.3)',
    nameColor:  'text-blue-400',
    nameShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
    badge:      'bg-blue-500',
    counter:    'text-blue-400/70',
  },
  red: {
    linear:   'from-red-500/20 to-red-600/10',
    border:     'border-red-500/50',
    glow:       '0 0 40px rgba(239, 68, 68, 0.3)',
    nameColor:  'text-red-400',
    nameShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
    badge:      'bg-red-500',
    counter:    'text-red-400/70',
  },
} as const

// ── Color config (blue-500 / red-500) ─────────────────────────────────────────
export const TEAM_COLOR = {
  blue: {
    activeBg:     'bg-blue-500/20 border-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.35)]',
    inactiveBg:   'bg-blue-500/5 border border-blue-500/20 opacity-50',
    name:         'text-blue-200',
    nameDim:      'text-blue-400/50',
    dot:          'bg-blue-500',
    dotDim:       'bg-blue-500/25',
    timerNormal:  'text-blue-300',
    player:       'text-blue-300 bg-blue-500/20',
    score:        'text-xs text-blue-300/70',
  },
  red: {
    activeBg:     'bg-red-500/20 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.35)]',
    inactiveBg:   'bg-red-500/5 border border-red-500/20 opacity-50',
    name:         'text-red-200',
    nameDim:      'text-red-400/50',
    dot:          'bg-red-500',
    dotDim:       'bg-red-500/25',
    timerNormal:  'text-red-300',
    player:       'text-red-300 bg-red-500/20',
    score:        'text-xs text-red-300/70',
  },
} as const
