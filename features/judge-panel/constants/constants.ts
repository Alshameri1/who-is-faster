// ─── features/judge-panel/constants/constants.ts

import { Eye, EyeOff, Wifi, WifiOff } from 'lucide-react'

export const ALL_IMAGES_PRELOAD_WIDTH = 640

export const TEAM_COLOR = {
  blue: {
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/10',
    headerBg: 'bg-blue-500/20',
    text: 'text-blue-500',
    badge: 'bg-blue-500/10 border border-blue-500/20 text-blue-300',
    ring: 'ring-blue-500/40',
    glow: 'rgba(59, 130, 246, 0.5)',
    shadow: '0 10px 25px -5px rgba(59, 130, 246, 0.25), 0 8px 10px -6px rgba(59, 130, 246, 0.25)',
    bannerBorder: 'rgba(59, 130, 246, 0.4)',
    bannerBg: 'rgba(30, 58, 138, 0.2)',
    cardBg: 'bg-blue-500/5',
    cardHeaderBg: 'bg-blue-500/20 border-blue-500/10',
  },
  red: {
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
    headerBg: 'bg-red-500/20',
    text: 'text-red-500',
    badge: 'bg-red-500/10 border border-red-500/20 text-red-300',
    ring: 'ring-red-500/40',
    glow: 'rgba(239, 68, 68, 0.5)',
    shadow: '0 10px 25px -5px rgba(239, 68, 68, 0.25), 0 8px 10px -6px rgba(239, 68, 68, 0.25)',
    bannerBorder: 'rgba(239, 68, 68, 0.4)',
    bannerBg: 'rgba(127, 29, 29, 0.2)',
    cardBg: 'bg-red-500/5',
    cardHeaderBg: 'bg-red-500/20 border-red-500/10',
  },
} as const

// Card styling constants for DOM state updates
export const CARD_STYLE_ACTIVE = {
  scale: '1.04',
  opacity: '1',
} as const

export const CARD_STYLE_INACTIVE = {
  scale: '0.96',
  opacity: '0.5',
  borderColor: 'rgba(255, 255, 255, 0.05)',
  boxShadow: 'none',
} as const

export const CARD_STYLE_DEFAULT = {
  scale: '1',
  opacity: '1',
  borderColor: 'rgba(255, 255, 255, 0.05)',
  boxShadow: 'none',
} as const

export const BANNER_STYLE_DEFAULT = {
  borderColor: 'rgba(16, 185, 129, 0.3)',
  backgroundColor: 'rgba(6, 78, 59, 0.2)',
} as const

// Reveal button configuration state
export const REVEAL_BUTTON_CONFIG = {
  revealed: {
    text: 'إخفاء الإجابة',
    icon: EyeOff,
    classes: 'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-300 bg-white/5 border-white/10 text-white/80 hover:bg-white/10',
  },
  hidden: {
    text: 'كشف الإجابة',
    icon: Eye,
    classes: 'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-300 bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30',
  },
} as const

// SSE Connection state configurations
export const CONNECTION_CONFIG = {
  connected: {
    text: 'متصل باللعبة',
    icon: Wifi,
    badgeClasses: 'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    indicatorPingClasses: 'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400',
    indicatorDotClasses: 'relative inline-flex rounded-full h-3 w-3 bg-emerald-500',
  },
  disconnected: {
    text: 'انقطع الاتصال',
    icon: WifiOff,
    badgeClasses: 'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-rose-500/10 text-rose-400 border-rose-500/30',
    indicatorPingClasses: 'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-rose-400',
    indicatorDotClasses: 'relative inline-flex rounded-full h-3 w-3 bg-rose-500',
  },
} as const
