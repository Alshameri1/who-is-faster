// ─── features/judge-panel/interfaces/types.ts

import type { GameSessionData } from '@/contexts/popup-context'
import type React from 'react'
import { LucideIcon } from 'lucide-react'

export interface LiveGameState {
  image?: string
  answer?: string
  currentRound?: number
  team1Score?: number
  team2Score?: number
  currentTeamTurn?: 1 | 2
}

export interface JudgePanelClientProps {
  gameId: string
}

export interface JudgePanelProps {
  gameId: string
}

export interface TeamData {
  id: string
  name: string
  players: { id: string; name: string }[]
}

export interface TeamScoreCardProps {
  teamData: TeamData
  score: number
  color: 'blue' | 'red'
  isActive: boolean
  cardRef: React.RefObject<HTMLDivElement | null>
}

export interface ActiveQuestionProps {
  imageContainerRef: React.RefObject<HTMLDivElement | null>
  fallbackRef: React.RefObject<HTMLDivElement | null>
}

export interface AnswerBannerProps {
  answerBannerRef: React.RefObject<HTMLDivElement | null>
  answerTextRef: React.RefObject<HTMLHeadingElement | null>
  answerHiddenRef: React.RefObject<HTMLDivElement | null>
  revealAnswer: boolean
  onToggleReveal: () => void
  currentAnswerRef: React.RefObject<string>
  revealButtonText: string
  revealButtonIcon: LucideIcon
  revealButtonClasses: string
}

export interface JudgeHeaderProps {
  isConnected: boolean
  gameId: string
  connectionStatusText: string
  connectionStatusIcon: LucideIcon
  connectionBadgeClasses: string
  connectionIndicatorPingClasses: string
  connectionIndicatorDotClasses: string
}

export interface UseJudgePanelReturn {
  isConnected: boolean
  revealAnswer: boolean
  gameData: GameSessionData | null
  error: string | null
  team1Score: number
  team2Score: number
  activeTurn: 1 | 2
  currentRound: number
  answerTextRef: React.RefObject<HTMLHeadingElement | null>
  answerHiddenRef: React.RefObject<HTMLDivElement | null>
  answerBannerRef: React.RefObject<HTMLDivElement | null>
  imageContainerRef: React.RefObject<HTMLDivElement | null>
  fallbackRef: React.RefObject<HTMLDivElement | null>
  team1CardRef: React.RefObject<HTMLDivElement | null>
  team2CardRef: React.RefObject<HTMLDivElement | null>
  currentAnswerRef: React.RefObject<string>
  toggleReveal: () => void
  handleSkip: () => void
  handleCorrect: () => void
  revealButtonText: string
  revealButtonIcon: LucideIcon
  revealButtonClasses: string
  activeTurnBgStyle1: React.CSSProperties
  activeTurnBgStyle2: React.CSSProperties
  connectionStatusText: string
  connectionStatusIcon: LucideIcon
  connectionBadgeClasses: string
  connectionIndicatorPingClasses: string
  connectionIndicatorDotClasses: string
}
