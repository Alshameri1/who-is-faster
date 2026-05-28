'use client'
// ─── useGameplayDashboard Hook ────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { GameSessionData } from '@/contexts/popup-context'
import type { GamePlayState } from '../interfaces/types'
import { randomPick } from './use-player-matchup'
import { CATEGORY_IMAGES, DEFAULT_IMAGES } from '../data/image'
import { publishGameState } from '@/lib/redis-actions'

interface ImageObject {
  image: string
  answer: string
}

export function useGameplayDashboard(
  sessionData:     GameSessionData,
  playState:       GamePlayState,
  onTurnToggle:    () => void,
  onRoundEnd:      (winner: 1 | 2 | 'tie', t1Score?: number, t2Score?: number) => void,
  isMenuOpen:      boolean,
  setIsMenuOpen:   (open: boolean) => void,
) {
  const initMs = sessionData.timePerPlayer * 1000

  const [team1TimeMs,       setTeam1TimeMs]       = useState(initMs)
  const [team2TimeMs,       setTeam2TimeMs]       = useState(initMs)
  const [isPaused,          setIsPaused]          = useState(false)
  const [preloadedImages,   setPreloadedImages]   = useState<ImageObject[]>([])
  const [currentIndex,      setCurrentIndex]      = useState(0)
  const [showAnswer,        setShowAnswer]        = useState(false)
  const [team1RoundScore, setTeam1RoundScore] = useState(0)
  const [team2RoundScore, setTeam2RoundScore] = useState(0)
  const [postTurnTeam,      setPostTurnTeam]      = useState<1 | 2 | null>(null)

  const currentImage = preloadedImages[currentIndex] || null

  const rafRef       = useRef<number | null>(null)
  const lastTickRef  = useRef<number>(Date.now())
  const endedRef     = useRef(false)

  const answerDisplayMode = sessionData.answerDisplayMode || 'local'

  // ── Preload Helper ─────────────────────────────────────────────────────────
  const preloadImage = useCallback((url: string) => {
    if (typeof window === 'undefined' || !url) return
    const optimizedUrl = `/_next/image?url=${encodeURIComponent(url)}&w=828&q=75`
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = optimizedUrl
    img.decode().catch(err => {
      console.warn('Failed to background-decode preloaded image:', err)
    })
  }, [])

  // ── Image pool ─────────────────────────────────────────────────────────────
  const categoryImages = useMemo(() => {
    const cat = playState.selectedCategory
    if (cat && CATEGORY_IMAGES[cat]) {
      return CATEGORY_IMAGES[cat]
    }
    return DEFAULT_IMAGES.map(img => ({ image: img, answer: '' }))
  }, [playState.selectedCategory])

  useEffect(() => {
    if (categoryImages.length === 0) return

    // Shuffle the images once on category load
    const shuffled = [...categoryImages].sort(() => Math.random() - 0.5)

    setPreloadedImages(shuffled)
    setCurrentIndex(0)
    setShowAnswer(false)

    // Eagerly preload all images to browser cache for zero-latency switching
    shuffled.forEach(img => {
      if (img.image) {
        preloadImage(img.image)
      }
    })
  }, [categoryImages, preloadImage])

  // Automatically publish currentImage to Redis whenever it changes
  useEffect(() => {
    if (currentImage) {
      publishGameState(sessionData.gameId, {
        imageId: currentImage.image,
        image: currentImage.image,
        answer: currentImage.answer,
        teamId: playState.currentTeamTurn,
        team1Score: team1RoundScore,
        team2Score: team2RoundScore,
      })
    }
  }, [currentImage, playState.currentTeamTurn, sessionData.gameId])

  const advanceImage = useCallback(() => {
    if (preloadedImages.length === 0) return
    setCurrentIndex(prev => (prev + 1) % preloadedImages.length)
    setShowAnswer(false)
  }, [preloadedImages.length])

  // ── Pause when menu opens ──────────────────────────────────────────────────
  useEffect(() => {
    setIsPaused(isMenuOpen)
  }, [isMenuOpen])

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false)
  }, [setIsMenuOpen])

  // ── Round-end detector ─────────────────────────────────────────────────────
  useEffect(() => {
    if (endedRef.current) return

    if (sessionData.gameMode === 'marathon') {
      if (playState.currentTeamTurn === 1 && team1TimeMs <= 0 && postTurnTeam === null) {
        setPostTurnTeam(1)
      } else if (playState.currentTeamTurn === 2 && team2TimeMs <= 0 && postTurnTeam === null) {
        setPostTurnTeam(2)
      }
    } else {
      // Blitz Mode
      if (team1TimeMs <= 0) { endedRef.current = true; onRoundEnd(2, team1RoundScore, team2RoundScore) }
      else if (team2TimeMs <= 0) { endedRef.current = true; onRoundEnd(1, team1RoundScore, team2RoundScore) }
    }
  }, [team1TimeMs, team2TimeMs, onRoundEnd, sessionData.gameMode, playState.currentTeamTurn, postTurnTeam])

  // ── RAF precision timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || endedRef.current) return

    const tick = () => {
      if (endedRef.current) return
      const now   = Date.now()
      const delta = now - lastTickRef.current
      lastTickRef.current = now

      if (playState.currentTeamTurn === 1) {
        setTeam1TimeMs(p => Math.max(0, p - delta))
      } else {
        setTeam2TimeMs(p => Math.max(0, p - delta))
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    lastTickRef.current = Date.now()
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isPaused, playState.currentTeamTurn])

  // ── Action handlers ────────────────────────────────────────────────────────
  const handleCorrect = useCallback(() => {
    if (postTurnTeam !== null) return
    advanceImage()
    if (playState.currentTeamTurn === 1) setTeam1RoundScore(p => p + 1)
    else setTeam2RoundScore(p => p + 1)

    if (sessionData.gameMode === 'blitz') {
      onTurnToggle()
    }
  }, [advanceImage, sessionData.gameMode, playState.currentTeamTurn, onTurnToggle, postTurnTeam])

  const handleSkip = useCallback(() => {
    if (postTurnTeam !== null) return
    const penaltyMs = sessionData.timePerPlayer < 30 ? 3000 : 5000
    if (playState.currentTeamTurn === 1) setTeam1TimeMs(p => Math.max(0, p - penaltyMs))
    else setTeam2TimeMs(p => Math.max(0, p - penaltyMs))
    advanceImage()
    if (sessionData.gameMode === 'blitz') {
      onTurnToggle()
    }
  }, [advanceImage, playState.currentTeamTurn, sessionData.timePerPlayer, sessionData.gameMode, onTurnToggle, postTurnTeam])

  const handlePostTurnComplete = useCallback(() => {
    if (postTurnTeam === 1) {
      setPostTurnTeam(null)
      onTurnToggle()
    } else if (postTurnTeam === 2) {
      setPostTurnTeam(null)
      endedRef.current = true
      let winner: 1 | 2 | 'tie' = 'tie'
      if (team1RoundScore > team2RoundScore) winner = 1
      else if (team2RoundScore > team1RoundScore) winner = 2
      onRoundEnd(winner, team1RoundScore, team2RoundScore)
    }
  }, [postTurnTeam, onTurnToggle, onRoundEnd, team1RoundScore, team2RoundScore])

  // ── Real-time SSE Sync (Listening for Judge Actions) ──────────────────────
  const handlersRef = useRef({ handleSkip, handleCorrect })
  useEffect(() => {
    handlersRef.current = { handleSkip, handleCorrect }
  }, [handleSkip, handleCorrect])

  const lastActionTimestamp = useRef<number>(0)
  
  useEffect(() => {
    const eventSource = new EventSource(`/api/game/${sessionData.gameId}/stream`)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data && data.event === 'GAME_ACTION') {
          if (data.timestamp <= lastActionTimestamp.current) return
          lastActionTimestamp.current = data.timestamp

          if (data.actionType === 'SKIP') {
            handlersRef.current.handleSkip()
          } else if (data.actionType === 'CORRECT') {
            handlersRef.current.handleCorrect()
          }
        }
      } catch (err) {
        console.error('Error parsing SSE payload:', err)
      }
    }

    return () => {
      eventSource.close()
    }
  }, [sessionData.gameId])

  return {
    team1TimeMs, team2TimeMs,
    isPaused, isMenuOpen,
    currentImage,
    preloadedImages,
    currentIndex,
    showAnswer,
    setShowAnswer,
    answerDisplayMode,
    setIsMenuOpen,
    handleMenuClose,
    handleCorrect,
    handleSkip,
    team1RoundScore,
    team2RoundScore,
    postTurnTeam,
    handlePostTurnComplete,
  }
}