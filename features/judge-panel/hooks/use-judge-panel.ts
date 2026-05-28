// ─── features/judge-panel/hooks/use-judge-panel.ts

import { useState, useEffect, useRef, useCallback } from 'react'
import type { GameSessionData } from '@/contexts/popup-context'
import { getGameState, triggerGameAction } from '@/lib/redis-actions'
import { CATEGORY_IMAGES, DEFAULT_IMAGES } from '@/features/game/[id]/play/data/image'
import type { UseJudgePanelReturn } from '../interfaces/types'
import { 
  TEAM_COLOR, 
  CARD_STYLE_ACTIVE, 
  CARD_STYLE_INACTIVE, 
  CARD_STYLE_DEFAULT, 
  BANNER_STYLE_DEFAULT, 
  REVEAL_BUTTON_CONFIG, 
  CONNECTION_CONFIG 
} from '../constants/constants'

const ALL_IMAGES = Array.from(
  new Set([
    ...DEFAULT_IMAGES,
    ...Object.values(CATEGORY_IMAGES).flatMap((cat) => cat.map((item) => item.image)),
  ])
)

export function useJudgePanel(gameId: string): UseJudgePanelReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [revealAnswer, setRevealAnswer] = useState(true)
  const [gameData, setGameData] = useState<GameSessionData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [team1Score, setTeam1Score] = useState(0)
  const [team2Score, setTeam2Score] = useState(0)
  const [activeTurn, setActiveTurn] = useState<1 | 2>(1)
  const [currentRound, setCurrentRound] = useState(1)

  const answerTextRef = useRef<HTMLHeadingElement>(null)
  const answerHiddenRef = useRef<HTMLDivElement>(null)
  const answerBannerRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)
  const team1CardRef = useRef<HTMLDivElement>(null)
  const team2CardRef = useRef<HTMLDivElement>(null)
  const currentAnswerRef = useRef<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    ALL_IMAGES.forEach((src) => {
      const optimizedSrc = `/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`
      const img = new window.Image()
      img.src = optimizedSrc
      img.decode().catch(() => {})
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem('game_session_data')
      if (stored) {
        const parsed = JSON.parse(stored) as GameSessionData
        if (parsed.gameId === gameId) {
          setGameData(parsed)
        }
      }
    } catch (e) {
      console.error('Failed to load local game data:', e)
    }
  }, [gameId])

  const updateDOMState = useCallback((image: string, answer: string, teamId?: number) => {
    currentAnswerRef.current = answer || ''
    if (answerTextRef.current) {
      answerTextRef.current.textContent = answer || 'لا يوجد إجابة حالياً'
      answerTextRef.current.style.transition = 'none'
      answerTextRef.current.style.transform = 'scale(0.96)'
      answerTextRef.current.style.opacity = '0.3'
      requestAnimationFrame(() => {
        if (answerTextRef.current) {
          answerTextRef.current.style.transition = 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease-out'
          answerTextRef.current.style.transform = 'scale(1)'
          answerTextRef.current.style.opacity = '1'
        }
      })
    }

    if (imageContainerRef.current) {
      imageContainerRef.current.innerHTML = ''
      let matched = false
      if (image) {
        const wrapper = document.createElement('div')
        wrapper.className = 'absolute inset-0 w-full h-full opacity-100 visible'
        const img = document.createElement('img')
        img.src = `/_next/image?url=${encodeURIComponent(image)}&w=640&q=75`
        img.alt = 'السؤال الحالي'
        img.className = 'object-contain p-2 w-full h-full absolute inset-0'
        wrapper.appendChild(img)
        imageContainerRef.current.appendChild(wrapper)
        matched = true
      }
      if (fallbackRef.current) {
        if (matched && image) {
          fallbackRef.current.classList.remove('block')
          fallbackRef.current.classList.add('hidden')
        } else {
          fallbackRef.current.classList.remove('hidden')
          fallbackRef.current.classList.add('block')
        }
      }
    }

    if (teamId === 1) {
      if (team1CardRef.current) {
        team1CardRef.current.style.setProperty('--scale', CARD_STYLE_ACTIVE.scale)
        team1CardRef.current.style.setProperty('--border-color', TEAM_COLOR.blue.glow)
        team1CardRef.current.style.setProperty('--box-shadow', TEAM_COLOR.blue.shadow)
        team1CardRef.current.style.setProperty('--opacity', CARD_STYLE_ACTIVE.opacity)
      }
      if (team2CardRef.current) {
        team2CardRef.current.style.setProperty('--scale', CARD_STYLE_INACTIVE.scale)
        team2CardRef.current.style.setProperty('--border-color', CARD_STYLE_INACTIVE.borderColor)
        team2CardRef.current.style.setProperty('--box-shadow', CARD_STYLE_INACTIVE.boxShadow)
        team2CardRef.current.style.setProperty('--opacity', CARD_STYLE_INACTIVE.opacity)
      }
      if (answerBannerRef.current) {
        answerBannerRef.current.style.setProperty('--team-border-color', TEAM_COLOR.blue.bannerBorder)
        answerBannerRef.current.style.setProperty('--team-bg-color', TEAM_COLOR.blue.bannerBg)
      }
    } else if (teamId === 2) {
      if (team1CardRef.current) {
        team1CardRef.current.style.setProperty('--scale', CARD_STYLE_INACTIVE.scale)
        team1CardRef.current.style.setProperty('--border-color', CARD_STYLE_INACTIVE.borderColor)
        team1CardRef.current.style.setProperty('--box-shadow', CARD_STYLE_INACTIVE.boxShadow)
        team1CardRef.current.style.setProperty('--opacity', CARD_STYLE_INACTIVE.opacity)
      }
      if (team2CardRef.current) {
        team2CardRef.current.style.setProperty('--scale', CARD_STYLE_ACTIVE.scale)
        team2CardRef.current.style.setProperty('--border-color', TEAM_COLOR.red.glow)
        team2CardRef.current.style.setProperty('--box-shadow', TEAM_COLOR.red.shadow)
        team2CardRef.current.style.setProperty('--opacity', CARD_STYLE_ACTIVE.opacity)
      }
      if (answerBannerRef.current) {
        answerBannerRef.current.style.setProperty('--team-border-color', TEAM_COLOR.red.bannerBorder)
        answerBannerRef.current.style.setProperty('--team-bg-color', TEAM_COLOR.red.bannerBg)
      }
    } else {
      if (team1CardRef.current) {
        team1CardRef.current.style.setProperty('--scale', CARD_STYLE_DEFAULT.scale)
        team1CardRef.current.style.setProperty('--border-color', CARD_STYLE_DEFAULT.borderColor)
        team1CardRef.current.style.setProperty('--box-shadow', CARD_STYLE_DEFAULT.boxShadow)
        team1CardRef.current.style.setProperty('--opacity', CARD_STYLE_DEFAULT.opacity)
      }
      if (team2CardRef.current) {
        team2CardRef.current.style.setProperty('--scale', CARD_STYLE_DEFAULT.scale)
        team2CardRef.current.style.setProperty('--border-color', CARD_STYLE_DEFAULT.borderColor)
        team2CardRef.current.style.setProperty('--box-shadow', CARD_STYLE_DEFAULT.boxShadow)
        team2CardRef.current.style.setProperty('--opacity', CARD_STYLE_DEFAULT.opacity)
      }
      if (answerBannerRef.current) {
        answerBannerRef.current.style.setProperty('--team-border-color', BANNER_STYLE_DEFAULT.borderColor)
        answerBannerRef.current.style.setProperty('--team-bg-color', BANNER_STYLE_DEFAULT.backgroundColor)
      }
    }
  }, [])

  const toggleReveal = useCallback(() => {
    setRevealAnswer(prev => {
      const next = !prev
      if (answerTextRef.current && answerHiddenRef.current) {
        if (next) {
          answerTextRef.current.classList.remove('hidden')
          answerTextRef.current.classList.add('block')
          answerHiddenRef.current.classList.remove('block')
          answerHiddenRef.current.classList.add('hidden')
        } else {
          answerTextRef.current.classList.remove('block')
          answerTextRef.current.classList.add('hidden')
          answerHiddenRef.current.classList.remove('hidden')
          answerHiddenRef.current.classList.add('block')
        }
      }
      return next
    })
  }, [])

  const handleSkip = useCallback(() => {
    triggerGameAction(gameId, 'SKIP')
  }, [gameId])

  const handleCorrect = useCallback(() => {
    triggerGameAction(gameId, 'CORRECT')
  }, [gameId])

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const state = await getGameState(gameId)
        if (state) {
          if (state.team1Score !== undefined) setTeam1Score(state.team1Score)
          if (state.team2Score !== undefined) setTeam2Score(state.team2Score)
          if (state.teamId !== undefined) setActiveTurn(state.teamId as 1 | 2)
          if (state.currentRound !== undefined) setCurrentRound(state.currentRound)
          updateDOMState(state.image || '', state.answer || '', state.teamId)
        }
      } catch (err) {
        console.error('Failed to fetch initial state from Redis:', err)
      }
    }
    fetchInitial()

    const eventSource = new EventSource(`/api/game/${gameId}/stream`)
    eventSource.onopen = () => {
      setIsConnected(true)
      setError(null)
    }
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data) {
          const newImg = data.imageId || data.image
          const newAns = data.answer
          const teamId = data.teamId || data.currentTeamTurn
          if (data.team1Score !== undefined) setTeam1Score(data.team1Score)
          if (data.team2Score !== undefined) setTeam2Score(data.team2Score)
          if (teamId !== undefined) setActiveTurn(teamId as 1 | 2)
          if (data.currentRound !== undefined) setCurrentRound(data.currentRound)
          updateDOMState(newImg || '', newAns || '', teamId)
        }
      } catch (err) {
        console.error('Error parsing SSE payload:', err)
      }
    }
    eventSource.onerror = () => {
      setIsConnected(false)
    }
    return () => {
      eventSource.close()
    }
  }, [gameId, updateDOMState])

  const revealCfg = revealAnswer ? REVEAL_BUTTON_CONFIG.revealed : REVEAL_BUTTON_CONFIG.hidden
  const revealButtonText = revealCfg.text
  const revealButtonIcon = revealCfg.icon
  const revealButtonClasses = revealCfg.classes

  const activeTurnBgStyle1 = { opacity: activeTurn === 1 ? 1 : 0 }
  const activeTurnBgStyle2 = { opacity: activeTurn === 2 ? 1 : 0 }

  const connCfg = isConnected ? CONNECTION_CONFIG.connected : CONNECTION_CONFIG.disconnected
  const connectionStatusText = connCfg.text
  const connectionStatusIcon = connCfg.icon
  const connectionIndicatorPingClasses = connCfg.indicatorPingClasses
  const connectionIndicatorDotClasses = connCfg.indicatorDotClasses
  const connectionBadgeClasses = connCfg.badgeClasses

  return {
    isConnected,
    revealAnswer,
    gameData,
    error,
    team1Score,
    team2Score,
    activeTurn,
    currentRound,
    answerTextRef,
    answerHiddenRef,
    answerBannerRef,
    imageContainerRef,
    fallbackRef,
    team1CardRef,
    team2CardRef,
    currentAnswerRef,
    toggleReveal,
    handleSkip,
    handleCorrect,
    revealButtonText,
    revealButtonIcon,
    revealButtonClasses,
    activeTurnBgStyle1,
    activeTurnBgStyle2,
    connectionStatusText,
    connectionStatusIcon,
    connectionIndicatorPingClasses,
    connectionIndicatorDotClasses,
    connectionBadgeClasses,
  }
}
