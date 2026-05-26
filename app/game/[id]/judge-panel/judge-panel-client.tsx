'use client'

import { useEffect, useState } from 'react'
import { Eye, EyeOff, Wifi, WifiOff, HelpCircle, Image as ImageIcon, Sparkles } from 'lucide-react'
import Image from 'next/image'
import type { GameSessionData } from '@/contexts/popup-context'
import { getGameState } from '@/lib/redis-actions'

interface JudgePanelClientProps {
  gameId: string
}

interface ImageState {
  image: string
  answer: string
}

export function JudgePanelClient({ gameId }: JudgePanelClientProps) {
  const [gameState, setGameState] = useState<ImageState | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [revealAnswer, setRevealAnswer] = useState(true)
  const [gameData, setGameData] = useState<GameSessionData | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  // ── Real-time SSE Sync ──────────────────────────────────────────────────────
  useEffect(() => {
    // 1. Initial State Fetch
    const fetchInitial = async () => {
      try {
        const state = await getGameState(gameId)
        if (state) {
          setGameState(state)
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
          setGameState(prev => {
            if (!prev) {
              return {
                image: newImg || '',
                answer: newAns || '',
              }
            }
            return {
              image: newImg !== undefined ? newImg : prev.image,
              answer: newAns !== undefined ? newAns : prev.answer,
            }
          })
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
    <div dir="rtl" className="min-h-screen bg-linear-to-b from-[#0a1628] via-[#0f1f35] to-[#0a1628] text-white p-4 md:p-8">
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
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white/40 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#22b8cf]" />
              معلومات التحدي الحالية
            </h3>
            
            {gameData ? (
              <div className="space-y-4">
                <div>
                  <span className="block text-xs text-white/40">الفريق الأول</span>
                  <span className="text-base font-bold text-blue-400">{gameData.team1Data.name}</span>
                </div>
                <div>
                  <span className="block text-xs text-white/40">الفريق الثاني</span>
                  <span className="text-base font-bold text-red-400">{gameData.team2Data.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                  <div>
                    <span className="block text-xs text-white/40">عدد الجولات</span>
                    <span className="text-sm font-bold">{gameData.rounds}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-white/40">وقت المتسابق</span>
                    <span className="text-sm font-bold">{gameData.timePerPlayer} ثانية</span>
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
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
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
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md flex flex-col">
            <h2 className="text-sm font-bold text-white/50 mb-3 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-purple-400" />
              الصورة المعروضة حالياً في اللعبة
            </h2>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
              {gameState?.image ? (
                <Image 
                  src={gameState.image} 
                  alt="السؤال الحالي" 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="text-center p-8">
                  <span className="block text-3xl mb-2 animate-bounce">⏱️</span>
                  <p className="text-sm text-white/40">في انتظار بدء اللعب لعرض السؤال...</p>
                </div>
              )}
            </div>
          </div>

          {/* The Answer Banner */}
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-6 backdrop-blur-md relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -inset-10 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400/70 block mb-1">الإجابة الصحيحة المعتمدة</span>
                {revealAnswer ? (
                  <h3 className="text-3xl md:text-4xl font-black text-emerald-300 drop-shadow-md">
                    {gameState?.answer || 'لا يوجد إجابة حالياً'}
                  </h3>
                ) : (
                  <div className="text-lg text-white/30 italic">الإجابة مخفية حالياً</div>
                )}
              </div>

              <button
                onClick={() => setRevealAnswer(prev => !prev)}
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
        </section>
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-5xl mt-12 text-center text-xs text-white/20 border-t border-white/5 pt-4">
        من الأسرع • جميع الحقوق محفوظة لغرفة التحكيم
      </footer>
    </div>
  )
}
