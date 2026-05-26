'use client'
// ─── ResultPanelClient ────────────────────────────────────────────────────────
// Purely presentational — all logic lives in useResultPanel.

import { Zap, WifiOff } from 'lucide-react'
import { useResultPanel }  from './hooks/useResultPanel'
import { TeamScoreCard }   from './components/teamCard'
import { GameInfoBar }     from './components/game-info-bar'
import type { ResultPanelClientProps } from './interfaces/types'

export function ResultPanelClient({ gameId, initialSession }: ResultPanelClientProps) {
  const { gameData, error, isLoading, liveState } = useResultPanel(gameId, initialSession)

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a1628]">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="mt-4 text-lg text-gray-400">جارٍ تحميل بيانات اللعبة...</p>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !gameData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a1628] p-6">
        <div className="mx-auto max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <WifiOff className="mx-auto h-16 w-16 text-red-400" />
          <h1 className="mt-4 text-2xl font-bold text-white">خطأ في الاتصال</h1>
          <p className="mt-2 text-gray-400">{error ?? 'لم يتم العثور على بيانات اللعبة'}</p>
          <p className="mt-4 text-sm text-gray-500">
            تأكد من أنك في نفس المتصفح الذي تم إنشاء اللعبة فيه
          </p>
          <p className="mt-2 font-mono text-xs text-gray-600" dir="ltr">
            Game ID: {gameId}
          </p>
        </div>
      </div>
    )
  }

  const activeTurn = liveState?.currentTeamTurn ?? 1
  const panelBorderGlow = activeTurn === 1
    ? 'border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.15)] bg-blue-950/5'
    : 'border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] bg-red-950/5'

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen p-6 overflow-x-hidden">
      {/* GPU-Accelerated Background Layers to avoid layout/repaint shifts */}
      <div 
        className="absolute inset-0 bg-linear-to-b from-[#0a1628] via-[#0b2447] to-[#0a1628] transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{ opacity: activeTurn === 1 ? 1 : 0 }}
      />
      <div 
        className="absolute inset-0 bg-linear-to-b from-[#0a1628] via-[#31111d] to-[#0a1628] transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{ opacity: activeTurn === 2 ? 1 : 0 }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-2 text-sm text-blue-500">
            <Zap className="h-4 w-4" />
            <span>لوحة النتائج المباشرة</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            <span className="text-red-500">من </span>
            <span className="text-blue-500">الأسرع؟</span>
          </h1>
        </header>

        {/* Scoreboard Wrapper Panel */}
        <div className={['mx-auto mt-10 max-w-4xl rounded-3xl border p-6 backdrop-blur-md transition-all duration-500', panelBorderGlow].join(' ')}>
          <div className="grid gap-6 md:grid-cols-2">
            <TeamScoreCard
              teamData={gameData.team1Data}
              score={liveState.team1Score ?? 0}
              color="blue"
              isActive={activeTurn === 1}
            />
            <TeamScoreCard
              teamData={gameData.team2Data}
              score={liveState.team2Score ?? 0}
              color="red"
              isActive={activeTurn === 2}
            />
          </div>

          {/* Display Center Answer */}
          <div className="mt-8 text-center border-t border-white/10 pt-8">
            <span className="text-xs font-bold text-gray-400 block mb-2 uppercase tracking-wider">الإجابة الصحيحة المعتمدة</span>
            <div className={[
              'inline-block rounded-2xl border-2 px-8 py-5 backdrop-blur-sm transition-all duration-500 min-w-[280px]',
              activeTurn === 1 ? 'border-blue-500/30 bg-blue-500/5' : 'border-red-500/30 bg-red-500/5'
            ].join(' ')}>
              <h2 className="text-3xl md:text-4xl font-black text-emerald-400 drop-shadow-md">
                {liveState.answer ? `الإجابة: ${liveState.answer}` : 'في انتظار السؤال...'}
              </h2>
            </div>
          </div>

          {/* Game info */}
          <div className="mt-8">
            <GameInfoBar
              rounds={gameData.rounds}
              timePerPlayer={gameData.timePerPlayer}
            />
          </div>

          {/* Game ID footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              معرف اللعبة:{' '}
              <span className="font-mono text-blue-500" dir="ltr">{gameId}</span>
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}