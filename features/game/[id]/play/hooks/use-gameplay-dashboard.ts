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
  onCorrectAnswer: () => void,
  onRoundEnd:      (winner: 1 | 2) => void,
) {
  const initMs = sessionData.timePerPlayer * 1000

  const [team1TimeMs,       setTeam1TimeMs]       = useState(initMs)
  const [team2TimeMs,       setTeam2TimeMs]       = useState(initMs)
  const [isPaused,          setIsPaused]          = useState(false)
  const [isMenuOpen,        setIsMenuOpen]        = useState(false)
  const [preloadedImages,   setPreloadedImages]   = useState<ImageObject[]>([])
  const [currentIndex,      setCurrentIndex]      = useState(0)
  const [showAnswer,        setShowAnswer]        = useState(false)

  const currentImage = preloadedImages[currentIndex] || null

  const rafRef       = useRef<number | null>(null)
  const lastTickRef  = useRef<number>(Date.now())
  const endedRef     = useRef(false)

  const answerDisplayMode = sessionData.answerDisplayMode || 'local'

  // ── Preload Helper ─────────────────────────────────────────────────────────
  const preloadImage = useCallback((url: string) => {
    if (typeof window === 'undefined' || !url) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
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
      })
    }
  }, [currentImage, playState.currentTeamTurn, sessionData.gameId])

  const advanceImage = useCallback(() => {
    if (preloadedImages.length === 0) return
    setCurrentIndex(prev => (prev + 1) % preloadedImages.length)
    setShowAnswer(false)
  }, [preloadedImages.length])

  // ── Pause when menu opens ──────────────────────────────────────────────────
  useEffect(() => { if (isMenuOpen) setIsPaused(true) }, [isMenuOpen])

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false)
    setIsPaused(false)
  }, [])

  // ── Round-end detector ─────────────────────────────────────────────────────
  useEffect(() => {
    if (team1TimeMs <= 0 && !endedRef.current) { endedRef.current = true; onRoundEnd(2) }
    if (team2TimeMs <= 0 && !endedRef.current) { endedRef.current = true; onRoundEnd(1) }
  }, [team1TimeMs, team2TimeMs, onRoundEnd])

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
    advanceImage()
    onCorrectAnswer()
  }, [advanceImage, onCorrectAnswer])

  const handleSkip = useCallback(() => {
    const penaltyMs = sessionData.timePerPlayer < 30 ? 3000 : 5000
    if (playState.currentTeamTurn === 1) setTeam1TimeMs(p => Math.max(0, p - penaltyMs))
    else setTeam2TimeMs(p => Math.max(0, p - penaltyMs))
    advanceImage()
  }, [advanceImage, playState.currentTeamTurn, sessionData.timePerPlayer])

  return {
    team1TimeMs, team2TimeMs,
    isPaused, isMenuOpen,
    currentImage,
    showAnswer,
    setShowAnswer,
    answerDisplayMode,
    setIsMenuOpen,
    handleMenuClose,
    handleCorrect,
    handleSkip,
  }
}