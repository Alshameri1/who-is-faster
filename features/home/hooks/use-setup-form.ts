// ─── useSetupForm Hook ────────────────────────────────────────────────────────
// Owns ALL state & business logic so the modal stays purely presentational.

'use client'

import { useState, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import { usePopup, type GameSessionData } from '@/contexts/popup-context'
import {
  createInitialTeams,
  generatePlayerId,
  generateGameId,
  DEFAULT_ROUNDS,
  DEFAULT_TIME_PER_PLAYER,
} from '../constants/constants'
import { saveGameSession } from '@/lib/redis-actions'
import type { Team } from '../interfaces/types'

export function useSetupForm() {
  const { closePopup, openPopup, setGameSession } = usePopup()

  // ── Form state ──────────────────────────────────────────────────────────────
  const [teams,             setTeams]             = useState<Team[]>(createInitialTeams)
  const [rounds,            setRounds]            = useState(DEFAULT_ROUNDS)
  const [timePerPlayer,     setTimePerPlayer]     = useState(DEFAULT_TIME_PER_PLAYER)
  const [answerDisplayMode, setAnswerDisplayMode] = useState<'local' | 'judge'>('local')
  const [editingTeamName,   setEditingTeamName]   = useState('')

  // ── Reset (called on modal close) ──────────────────────────────────────────
  const resetForm = useCallback(() => {
    setTeams(createInitialTeams())
    setRounds(DEFAULT_ROUNDS)
    setTimePerPlayer(DEFAULT_TIME_PER_PLAYER)
    setAnswerDisplayMode('local')
    setEditingTeamName('')
  }, [])

  // ── Team name editing ───────────────────────────────────────────────────────
  const startEditingTeamName = useCallback((teamId: string) => {
    setTeams(prev => {
      const team = prev.find(t => t.id === teamId)
      if (team) setEditingTeamName(team.name)
      return prev.map(t => ({ ...t, isEditing: t.id === teamId }))
    })
  }, [])

  const saveTeamName = useCallback((teamId: string) => {
    if (editingTeamName.trim()) {
      setTeams(prev =>
        prev.map(t =>
          t.id === teamId ? { ...t, name: editingTeamName.trim(), isEditing: false } : t
        )
      )
    }
    setEditingTeamName('')
  }, [editingTeamName])

  const cancelEditingTeamName = useCallback((teamId: string) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, isEditing: false } : t))
    setEditingTeamName('')
  }, [])

  // ── Player CRUD ─────────────────────────────────────────────────────────────
  const addPlayer = useCallback((teamId: string) => {
    setTeams(prev =>
      prev.map(t =>
        t.id === teamId
          ? { ...t, players: [...t.players, { id: generatePlayerId(), name: '' }] }
          : t
      )
    )
  }, [])

  const updatePlayerName = useCallback((teamId: string, playerId: string, name: string) => {
    setTeams(prev =>
      prev.map(t =>
        t.id === teamId
          ? { ...t, players: t.players.map(p => p.id === playerId ? { ...p, name, error: undefined } : p) }
          : t
      )
    )
  }, [])

  const removePlayer = useCallback((teamId: string, playerId: string) => {
    setTeams(prev =>
      prev.map(t =>
        t.id === teamId ? { ...t, players: t.players.filter(p => p.id !== playerId) } : t
      )
    )
  }, [])

  // ── All names (for duplicate detection, exposed if needed) ─────────────────
  const allPlayerNames = useMemo(
    () => teams.flatMap(t => t.players.map(p => p.name.trim().toLowerCase())).filter(Boolean),
    [teams]
  )

  // ── Validation helpers ─────────────────────────────────────────────────────
  const markDuplicates = (duplicates: Map<string, { teamId: string; playerId: string }[]>) => {
    setTeams(prev =>
      prev.map(team => ({
        ...team,
        players: team.players.map(player => ({
          ...player,
          error: duplicates.has(player.name.trim().toLowerCase()) ? 'اسم مكرر' : undefined,
        })),
      }))
    )
  }

  const markEmptyNames = () => {
    setTeams(prev =>
      prev.map(team => ({
        ...team,
        players: team.players.map(player => ({
          ...player,
          error: !player.name.trim() ? 'الاسم مطلوب' : undefined,
        })),
      }))
    )
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleContinue = useCallback(async () => {
    // 1. Collect name occurrences
    const nameOccurrences = new Map<string, { teamId: string; playerId: string }[]>()

    teams.forEach(team =>
      team.players.forEach(player => {
        const key = player.name.trim().toLowerCase()
        if (!key) return
        if (!nameOccurrences.has(key)) nameOccurrences.set(key, [])
        nameOccurrences.get(key)!.push({ teamId: team.id, playerId: player.id })
      })
    )

    // 2. Duplicate check
    const duplicates = new Map(
      [...nameOccurrences.entries()].filter(([, v]) => v.length > 1)
    )
    if (duplicates.size > 0) {
      markDuplicates(duplicates)
      toast.error('تحذير: أسماء مكررة!', {
        description: 'يرجى التأكد من عدم تكرار أسماء المتسابقين',
        duration: 5000,
      })
      return
    }

    // 3. Empty name check
    if (teams.some(t => t.players.some(p => !p.name.trim()))) {
      markEmptyNames()
      toast.error('خطأ: حقول فارغة!', {
        description: 'يرجى ملء جميع أسماء المتسابقين',
        duration: 4000,
      })
      return
    }

    // 4. At-least-one-player check
    if (teams.some(t => t.players.length === 0)) {
      toast.error('خطأ: فرق فارغة!', {
        description: 'يرجى إضافة متسابق واحد على الأقل لكل فريق',
        duration: 4000,
      })
      return
    }

    // 5. Build session
    const gameSessionData: GameSessionData = {
      gameId: generateGameId(),
      team1Data: {
        id:      teams[0].id,
        name:    teams[0].name,
        players: teams[0].players.map(p => ({ id: p.id, name: p.name.trim() })),
      },
      team2Data: {
        id:      teams[1].id,
        name:    teams[1].name,
        players: teams[1].players.map(p => ({ id: p.id, name: p.name.trim() })),
      },
      rounds:        parseInt(rounds),
      timePerPlayer: parseInt(timePerPlayer),
      isOrganizerView: true,
      answerDisplayMode,
      createdAt: new Date().toISOString(),
    }

    // 6. Persist
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('game_session_data', JSON.stringify(gameSessionData))
      }
      await saveGameSession(gameSessionData)
    } catch {
      toast.error('خطأ في حفظ البيانات', { description: 'تعذر حفظ بيانات اللعبة', duration: 4000 })
      return
    }

    setGameSession(gameSessionData)

    toast.success('تم إعداد اللعبة بنجاح!', {
      description: `${teams[0].players.length + teams[1].players.length} متسابقين - ${rounds} جولات`,
      duration: 3000,
    })

    closePopup()
    setTimeout(() => openPopup('post-setup'), 150)
  }, [teams, rounds, timePerPlayer, answerDisplayMode, closePopup, openPopup, setGameSession])

  return {
    // state
    teams, rounds, timePerPlayer, answerDisplayMode, editingTeamName,
    allPlayerNames,
    // setters (for selects)
    setRounds, setTimePerPlayer, setAnswerDisplayMode, setEditingTeamName,
    // handlers
    startEditingTeamName, saveTeamName, cancelEditingTeamName,
    addPlayer, updatePlayerName, removePlayer,
    handleContinue, resetForm,
  }
}