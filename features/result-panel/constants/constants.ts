// ─── ResultPanel Constants ────────────────────────────────────────────────────

export const POLL_INTERVAL_MS = 2_000
export const STORAGE_KEY      = 'game_session_data'

export const TEAM_COLOR = {
  blue: {
    border:   'border-blue-500/40',
    bg:       'bg-blue-500/10',
    header:   'bg-blue-500/20',
    accent:   'text-blue-500',
    badge:    'bg-blue-500/20 text-blue-500',
  },
  red: {
    border:   'border-red-500/40',
    bg:       'bg-red-500/10',
    header:   'bg-red-500/20',
    accent:   'text-red-500',
    badge:    'bg-red-500/20 text-red-500',
  },
} as const