'use client'

import { useEffect, useState, useRef } from 'react'
import { Eye, EyeOff, Wifi, WifiOff, HelpCircle, Image as ImageIcon, Sparkles, Trophy, Users } from 'lucide-react'
import type { GameSessionData } from '@/contexts/popup-context'
import { getGameState, triggerGameAction } from '@/lib/redis-actions'
import { CATEGORY_IMAGES, DEFAULT_IMAGES } from '@/features/game/[id]/play/data/image'
import { ControlActionButtons } from '@/features/game/[id]/play/components/control-action-buttons'
import { Navbar } from '@/components/Navbar'

// Gather and deduplicate all game images
const ALL_IMAGES = Array.from(
  new Set([
    ...DEFAULT_IMAGES,
    ...Object.values(CATEGORY_IMAGES).flatMap((cat) => cat.map((item) => item.image)),
  ])
)

interface JudgePanelClientProps {
  gameId: string
}

export function JudgePanelClient({ gameId }: JudgePanelClientProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [revealAnswer, setRevealAnswer] = useState(true)
  const [gameData, setGameData] = useState<GameSessionData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Consolidated real-time scoring and turn states
  const [team1Score, setTeam1Score] = useState(0)
  const [team2Score, setTeam2Score] = useState(0)
  const [activeTurn, setActiveTurn] = useState<1 | 2>(1)
  const [currentRound, setCurrentRound] = useState(1)

  // Refs for direct DOM manipulation to bypass React virtual DOM overhead
  const answerTextRef = useRef<HTMLHeadingElement>(null)
  const answerHiddenRef = useRef<HTMLDivElement>(null)
  const answerBannerRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)
  const team1CardRef = useRef<HTMLDivElement>(null)
  const team2CardRef = useRef<HTMLDivElement>(null)
  const currentAnswerRef = useRef<string>('')

  // Strict browser caching & JS pre-decoding on initialization
  useEffect(() => {
    if (typeof window === 'undefined') return
    ALL_IMAGES.forEach((src) => {
      // Preload optimized version (w=640) matching the display width
      const optimizedSrc = `/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`
      const img = new window.Image()
      img.src = optimizedSrc
      img.decode().catch(() => {
        // Safe to ignore decode errors on background preloading
      })
    })
  }, [])

  // ── Load general game session info ──────────────────────────────────────────
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

  // ── Synchronous Direct DOM Updates Handler ──────────────────────────────
  const updateDOMState = (image: string, answer: string, teamId?: number) => {
    // 1. Update text Content natively (instant text swap)
    currentAnswerRef.current = answer || ''
    if (answerTextRef.current) {
      answerTextRef.current.textContent = answer || 'لا يوجد إجابة حالياً'
      
      // GPU scale/fade animation reset & trigger (Zero layout reflow)
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

    // 2. Update Image Stack natively (mount active image, unmount old one)
    if (imageContainerRef.current) {
      // Clear all child nodes completely to release GPU memory immediately
      imageContainerRef.current.innerHTML = ''
      
      let matched = false
      if (image) {
        // Only mount the single active image, resized down server-side
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
      
      // Update fallback viewport display
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

    // 3. Highlight active team and colors via CSS custom properties (GPU-accelerated)
    if (teamId === 1) {
      if (team1CardRef.current) {
        team1CardRef.current.style.setProperty('--scale', '1.04')
        team1CardRef.current.style.setProperty('--border-color', 'rgba(96, 165, 250, 0.5)')
        team1CardRef.current.style.setProperty('--box-shadow', '0 10px 25px -5px rgba(96, 165, 250, 0.25), 0 8px 10px -6px rgba(96, 165, 250, 0.25)')
        team1CardRef.current.style.setProperty('--opacity', '1')
      }
      if (team2CardRef.current) {
        team2CardRef.current.style.setProperty('--scale', '0.96')
        team2CardRef.current.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.05)')
        team2CardRef.current.style.setProperty('--box-shadow', 'none')
        team2CardRef.current.style.setProperty('--opacity', '0.5')
      }
      if (answerBannerRef.current) {
        answerBannerRef.current.style.setProperty('--team-border-color', 'rgba(59, 130, 246, 0.4)')
        answerBannerRef.current.style.setProperty('--team-bg-color', 'rgba(30, 58, 138, 0.2)')
      }
    } else if (teamId === 2) {
      if (team1CardRef.current) {
        team1CardRef.current.style.setProperty('--scale', '0.96')
        team1CardRef.current.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.05)')
        team1CardRef.current.style.setProperty('--box-shadow', 'none')
        team1CardRef.current.style.setProperty('--opacity', '0.5')
      }
      if (team2CardRef.current) {
        team2CardRef.current.style.setProperty('--scale', '1.04')
        team2CardRef.current.style.setProperty('--border-color', 'rgba(248, 113, 113, 0.5)')
        team2CardRef.current.style.setProperty('--box-shadow', '0 10px 25px -5px rgba(248, 113, 113, 0.25), 0 8px 10px -6px rgba(248, 113, 113, 0.25)')
        team2CardRef.current.style.setProperty('--opacity', '1')
      }
      if (answerBannerRef.current) {
        answerBannerRef.current.style.setProperty('--team-border-color', 'rgba(239, 68, 68, 0.4)')
        answerBannerRef.current.style.setProperty('--team-bg-color', 'rgba(127, 29, 29, 0.2)')
      }
    } else {
      // Default / reset state
      if (team1CardRef.current) {
        team1CardRef.current.style.setProperty('--scale', '1')
        team1CardRef.current.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.05)')
        team1CardRef.current.style.setProperty('--box-shadow', 'none')
        team1CardRef.current.style.setProperty('--opacity', '1')
      }
      if (team2CardRef.current) {
        team2CardRef.current.style.setProperty('--scale', '1')
        team2CardRef.current.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.05)')
        team2CardRef.current.style.setProperty('--box-shadow', 'none')
        team2CardRef.current.style.setProperty('--opacity', '1')
      }
      if (answerBannerRef.current) {
        answerBannerRef.current.style.setProperty('--team-border-color', 'rgba(16, 185, 129, 0.3)')
        answerBannerRef.current.style.setProperty('--team-bg-color', 'rgba(6, 78, 59, 0.2)')
      }
    }
  }

  // Toggle reveal answer manually (direct DOM + React state for button style)
  const toggleReveal = () => {
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
  }

  const handleSkip = () => {
    triggerGameAction(gameId, 'SKIP')
  }

  const handleCorrect = () => {
    triggerGameAction(gameId, 'CORRECT')
  }

  // ── Real-time SSE Sync ──────────────────────────────────────────────────────
  useEffect(() => {
    // 1. Initial State Fetch
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

    // 2. EventSource Subscription
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

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err)
      setIsConnected(false)
    }

    return () => {
      eventSource.close()
    }
  }, [gameId])

  return (
    <div dir="rtl" className="relative min-h-screen text-white pt-24 pb-12 px-4 md:px-8 overflow-x-hidden">
      {/* GPU-Accelerated Background Layers to avoid layout/repaint shifts */}
      <div 
        className="absolute inset-0 bg-linear-to-b from-[#0a1628] via-[#0b2447] to-[#0a1628] transition-opacity duration-700 ease-in-out pointer-events-none z-0"
        style={{ opacity: activeTurn === 1 ? 1 : 0 }}
      />
      <div 
        className="absolute inset-0 bg-linear-to-b from-[#0a1628] via-[#31111d] to-[#0a1628] transition-opacity duration-700 ease-in-out pointer-events-none z-0"
        style={{ opacity: activeTurn === 2 ? 1 : 0 }}
      />

      {/* Global Header Component */}
      <Navbar />

      <div className="relative z-10">
        {/* ── Top Bar ──────────────────────────────────────────────────────────── */}
        <header className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              </span>
              <span className="text-xs text-white/50 font-bold uppercase tracking-wider">لوحة التحكيم المباشرة</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black mt-1">
              <span className="text-[#e63946]">من </span>
              <span className="text-[#22b8cf]">الأسرع؟</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection Status Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              isConnected 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isConnected ? 'متصل باللعبة' : 'انقطع الاتصال'}</span>
            </div>

            <div className="text-xs text-white/40">
              معرف الجلسة: <span className="font-mono text-[#22b8cf]">{gameId}</span>
            </div>
          </div>
        </header>

        {/* ── Main Workspace Grid ──────────────────────────────────────────────── */}
        <main className="mx-auto max-w-5xl grid gap-8 md:grid-cols-3">
          {/* Left Side: Game Details */}
          <section className="md:col-span-1 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0f1f35]/60 p-5 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white/40 mb-4 flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Sparkles className="w-4 h-4 text-[#22b8cf]" />
                نقاط وحالة الفرق المنافسة
              </h3>
              
              {gameData ? (
                <div className="space-y-4">
                  {/* Team 1 Scoreboard Card */}
                  <div 
                    ref={team1CardRef}
                    className={[
                      "rounded-2xl border transition-all duration-300 ease-out overflow-hidden bg-blue-500/5",
                      activeTurn === 1 ? "ring-4 ring-blue-500/40" : ""
                    ].join(" ")}
                    style={{
                      transform: 'scale(var(--scale, 1))',
                      borderColor: 'var(--border-color, rgba(255, 255, 255, 0.05))',
                      boxShadow: 'var(--box-shadow, none)',
                      opacity: 'var(--opacity, 1)',
                      willChange: 'transform, opacity',
                    }}
                  >
                    <div className="bg-blue-500/20 px-4 py-2.5 flex items-center justify-between border-b border-blue-500/10">
                      <span className="text-sm font-bold text-blue-400">{gameData.team1Data.name}</span>
                      <Trophy className="h-4.5 w-4.5 text-blue-400" />
                    </div>
                    <div className="p-4">
                      <div className="text-center mb-3">
                        <span className="text-5xl font-extrabold text-white">{team1Score}</span>
                        <span className="mr-1.5 text-sm text-gray-400">نقطة</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Users className="h-3.5 w-3.5" />
                          <span>{gameData.team1Data.players.length} متسابقين</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {gameData.team1Data.players.map((player) => (
                            <span
                              key={player.id}
                              className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs text-blue-300"
                            >
                              {player.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team 2 Scoreboard Card */}
                  <div 
                    ref={team2CardRef}
                    className={[
                      "rounded-2xl border transition-all duration-300 ease-out overflow-hidden bg-red-500/5",
                      activeTurn === 2 ? "ring-4 ring-red-500/40" : ""
                    ].join(" ")}
                    style={{
                      transform: 'scale(var(--scale, 1))',
                      borderColor: 'var(--border-color, rgba(255, 255, 255, 0.05))',
                      boxShadow: 'var(--box-shadow, none)',
                      opacity: 'var(--opacity, 1)',
                      willChange: 'transform, opacity',
                    }}
                  >
                    <div className="bg-red-500/20 px-4 py-2.5 flex items-center justify-between border-b border-red-500/10">
                      <span className="text-sm font-bold text-red-400">{gameData.team2Data.name}</span>
                      <Trophy className="h-4.5 w-4.5 text-red-400" />
                    </div>
                    <div className="p-4">
                      <div className="text-center mb-3">
                        <span className="text-5xl font-extrabold text-white">{team2Score}</span>
                        <span className="mr-1.5 text-sm text-gray-400">نقطة</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Users className="h-3.5 w-3.5" />
                          <span>{gameData.team2Data.players.length} متسابقين</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {gameData.team2Data.players.map((player) => (
                            <span
                              key={player.id}
                              className="rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-xs text-red-300"
                            >
                              {player.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-center">
                    <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                      <span className="block text-[10px] text-white/40 uppercase font-bold">الجولة الحالية</span>
                      <span className="text-sm font-black text-white">{currentRound} / {gameData.rounds}</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                      <span className="block text-[10px] text-white/40 uppercase font-bold">زمن المتسابق</span>
                      <span className="text-sm font-black text-white">{gameData.timePerPlayer} ث</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-white/30 text-center py-4">
                  في انتظار تحميل معلومات اللعبة...
                </div>
              )}
            </div>

            {/* Quick Guide */}
            <div className="rounded-2xl border border-white/10 bg-[#0f1f35]/60 p-5 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white/40 mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-yellow-500" />
                دليل المحكّم السريع
              </h3>
              <ul className="text-xs text-white/60 space-y-2 leading-relaxed list-disc list-inside">
                <li>تظهر هذه الشاشة الصورة النشطة حالياً في اللعبة فوراً دون تأخير.</li>
                <li>انظر إلى الإجابة الصحيحة باللون الأخضر المضيء أدناه للحكم على إجابة المتسابق.</li>
                <li>يمكنك إخفاء الإجابة عن شاشتك إذا كان هناك أشخاص يراقبون شاشة التحكيم.</li>
              </ul>
            </div>
          </section>

          {/* Right Side: Active Image and Answer Display */}
          <section className="md:col-span-2 space-y-6">
            {/* Active Image */}
            <div className="rounded-3xl border border-white/10 bg-[#0f1f35]/60 p-4 backdrop-blur-md flex flex-col">
              <h2 className="text-sm font-bold text-white/50 mb-3 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                الصورة المعروضة حالياً في اللعبة
              </h2>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
                {/* Image Stack Viewport container */}
                <div ref={imageContainerRef} className="absolute inset-0 w-full h-full" />

                {/* Fallback when no image is active */}
                <div 
                  ref={fallbackRef}
                  className="text-center p-8 block"
                >
                  <span className="block text-3xl mb-2 animate-bounce">⏱️</span>
                  <p className="text-sm text-white/40">في انتظار بدء اللعب لعرض السؤال...</p>
                </div>
              </div>
            </div>

            {/* The Answer Banner */}
            <div 
              ref={answerBannerRef}
              className="rounded-3xl border transition-all duration-300 ease-out p-6 backdrop-blur-md relative overflow-hidden"
              style={{
                borderColor: 'var(--team-border-color, rgba(16, 185, 129, 0.3))',
                backgroundColor: 'var(--team-bg-color, rgba(6, 78, 59, 0.2))',
              }}
            >
              {/* Background Glow */}
              <div className="absolute -inset-10 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400/70 block mb-1">الإجابة الصحيحة المعتمدة</span>
                  <h3 
                    ref={answerTextRef}
                    className={`text-3xl md:text-4xl font-black text-emerald-300 drop-shadow-md will-change-[transform,opacity] ${revealAnswer ? 'block' : 'hidden'}`}
                  >
                    {currentAnswerRef.current || 'لا يوجد إجابة حالياً'}
                  </h3>
                  <div 
                    ref={answerHiddenRef}
                    className={`text-lg text-white/30 italic ${revealAnswer ? 'hidden' : 'block'}`}
                  >
                    الإجابة مخفية حالياً
                  </div>
                </div>

                <button
                  onClick={toggleReveal}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-300 ${
                    revealAnswer 
                      ? 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10' 
                      : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                  }`}
                >
                  {revealAnswer ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>إخفاء الإجابة</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>كشف الإجابة</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <ControlActionButtons
              onSkip={handleSkip}
              onCorrect={handleCorrect}
              isPaused={!isConnected}
              displayMode={gameData?.answerDisplayMode || 'judge'}
              role="judge"
            />
          </section>
        </main>

        {/* Footer */}
        <footer className="mx-auto max-w-5xl mt-12 text-center text-xs text-white/20 border-t border-white/5 pt-4">
          من الأسرع • جميع الحقوق محفوظة لغرفة التحكيم
        </footer>
      </div>
    </div>
  )
}
