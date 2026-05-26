'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePopup } from '@/contexts/popup-context'
import { toast } from 'sonner'

export function usePostSetup(onAnswerDisplayModeChange?: (mode: 'local' | 'judge') => void) {
  const { closePopup, gameSession, setGameSession } = usePopup()

  const [resultPanelUrl, setResultPanelUrl] = useState('')
  const [gamePlayUrl,    setGamePlayUrl]    = useState('')
  const [showLocalResults, setShowLocalResults] = useState(false)

  // Build URLs client-side only (avoids SSR hydration mismatch)
  useEffect(() => {
    if (typeof window !== 'undefined' && gameSession?.gameId) {
      const base = window.location.origin
      setResultPanelUrl(`${base}/game/${gameSession.gameId}/result-panel`)
      setGamePlayUrl(`${base}/game/${gameSession.gameId}/play`)
    }
  }, [gameSession?.gameId])

  const handleClose = useCallback(() => {
    closePopup()
    setShowLocalResults(false)
  }, [closePopup])

  const handleOpenInNewTab = useCallback(() => {
    if (!resultPanelUrl) return
    window.open(resultPanelUrl, '_blank', 'noopener,noreferrer')
    toast.success('تم فتح لوحة التحكم', {
      description: 'تم فتح لوحة النتائج في نافذة جديدة',
      duration: 3000,
    })
  }, [resultPanelUrl])

  const handleCopyLink = useCallback(async () => {
    if (!resultPanelUrl) return
    try {
      await navigator.clipboard.writeText(resultPanelUrl)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = resultPanelUrl
      el.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    toast.success('تم نسخ الرابط بنجاح!', {
      description: 'يمكنك الآن مشاركته مع الآخرين',
      duration: 3000,
    })
  }, [resultPanelUrl])

  const handlePlayLocally = useCallback(() => {
    if (!gamePlayUrl) return
    window.location.href = gamePlayUrl
  }, [closePopup, gamePlayUrl])

  const handleToggleLocalResults = useCallback(() => {
    if (!gameSession) return
    const updatedSession = { ...gameSession, answerDisplayMode: 'local' as const }
    try {
      localStorage.setItem('game_session_data', JSON.stringify(updatedSession))
      setGameSession(updatedSession)
      onAnswerDisplayModeChange?.('local')
      toast.info('وضع النتائج المباشرة', {
        description: 'سيتم عرض النتائج مباشرة أثناء اللعب',
        duration: 3000,
      })
    } catch (e) {
      console.error(e)
    }

    if (gamePlayUrl) {
      window.location.href = gamePlayUrl
    }
  }, [gameSession, gamePlayUrl, setGameSession, onAnswerDisplayModeChange])

  return {
    gameSession,
    resultPanelUrl,
    showLocalResults,
    handleClose,
    handleOpenInNewTab,
    handleCopyLink,
    handlePlayLocally,
    handleToggleLocalResults,
  }
}