'use client'
// ─── GameplayDashboard ────────────────────────────────────────────────────────
// Purely presentational — all logic lives in useGameplayDashboard.

import { Button }              from '@/components/button'
import { ControlActionButtons } from '../components/control-action-buttons'
import { DashboardHeader }     from '../components/dashboard-header'
import { useGameplayDashboard } from '../hooks/use-gameplay-dashboard'
import type { GameplayDashboardProps } from '../interfaces/types'
import Image from 'next/image'

export function GameplayDashboard({
  sessionData,
  playState,
  onRoundEnd,
  onRestart,
  isTieBreaker = false,
  isMenuOpen,
  setIsMenuOpen,
  onTurnToggle,
}: GameplayDashboardProps) {
  const {
    team1TimeMs, team2TimeMs,
    isPaused,
    currentImage,
    preloadedImages,
    currentIndex,
    showAnswer,
    setShowAnswer,
    answerDisplayMode,
    handleCorrect,
    handleSkip,
    team1RoundScore,
    team2RoundScore,
    postTurnTeam,
    handlePostTurnComplete,
  } = useGameplayDashboard(sessionData, playState, onTurnToggle, onRoundEnd, isMenuOpen, setIsMenuOpen)

  return (
    <div dir="rtl" className="flex h-full flex-col overflow-hidden bg-[#0c1628]">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <DashboardHeader
        sessionData={sessionData}
        playState={playState}
        team1TimeMs={team1TimeMs}
        team2TimeMs={team2TimeMs}
        isTieBreaker={isTieBreaker}
        team1RoundScore={team1RoundScore}
        team2RoundScore={team2RoundScore}
      />

      {/* ── Main content (image) ─────────────────────────────────────────────
           Shared horizontal padding with footer keeps widths identical.       */}
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-2 md:px-6 md:py-3">

        {/* Shared width wrapper — image + footer are siblings of this */}
        <div className="flex w-full flex-col gap-3 h-full">
          {/* Category badge */}
          <div className="shrink-0 flex items-center justify-center gap-3">
            {playState.selectedCategory && (
              <span className="inline-block rounded-full border border-purple-400/50 bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300 md:text-sm">
                {playState.selectedCategory}
              </span>
            )}
          </div>
          {/* Image — fills remaining space */}
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border-2 border-white/20 bg-white/5 md:rounded-3xl flex items-center justify-center">
            {preloadedImages.map((img, idx) => {
              const prevIndex = (currentIndex - 1 + preloadedImages.length) % preloadedImages.length
              const nextIndex = (currentIndex + 1) % preloadedImages.length

              // Only mount the Previous, Current, and Next images in the DOM for Safari memory sanity
              const shouldMount = idx === currentIndex || idx === prevIndex || idx === nextIndex
              if (!shouldMount) return null

              const isActive = idx === currentIndex
              return (
                <div
                  key={img.image + '-' + idx}
                  className={[
                    'absolute inset-0 w-full h-full transition-[opacity,visibility] duration-0',
                    isActive ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                  ].join(' ')}
                >
                  {img.image && (
                    <Image
                      src={img.image}
                      alt={`تحدي ${idx}`}
                      fill
                      priority={isActive || idx === nextIndex}
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-contain p-2"
                    />
                  )}
                </div>
              )
            })}

            {/* Local Answer Toggle & Text Overlay */}
            {answerDisplayMode === 'local' && currentImage?.answer && (
              <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 items-start">
                <button
                  onClick={() => setShowAnswer(prev => !prev)}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2 text-xs font-bold text-white/90 backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-105 active:scale-95 md:text-sm shadow-lg cursor-pointer"
                >
                  {showAnswer ? '🙈 إخفاء الإجابة' : '👁️ عرض الإجابة'}
                </button>
                {showAnswer && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/90 px-4 py-2.5 text-sm font-black text-emerald-300 backdrop-blur-sm md:text-lg shadow-xl animate-in slide-in-from-top-2 duration-300">
                    {currentImage.answer}
                  </div>
                )}
              </div>
            )}

            {/* Paused overlay */}
            {isPaused && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <span className="animate-pulse text-2xl font-bold text-yellow-400">اللعبة متوقفة مؤقتاً</span>
              </div>
            )}

            {/* Corner accents */}
            {(['top-3 right-3 border-t-2 border-r-2 rounded-tr-lg',
               'top-3 left-3 border-t-2 border-l-2 rounded-tl-lg',
               'bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg',
               'bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg'] as const
            ).map(cls => (
              <div key={cls} className={`absolute w-6 h-6 border-white/30 pointer-events-none ${cls}`} />
            ))}

            {/* Round badge */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                {isTieBreaker
                  ? 'جولة حاسمة'
                  : `الجولة ${playState.currentRound} / ${sessionData.rounds}`}
              </span>
            </div>

            {/* Mid-Game Image Counter for Marathon */}
            {sessionData.gameMode === 'marathon' && postTurnTeam === null && (
              <div className="absolute top-4 right-4 z-40 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl p-3 md:p-4 shadow-2xl">
                  <span className="text-xs md:text-sm text-yellow-400 font-bold mb-1">النقاط</span>
                  <span className="text-3xl md:text-5xl font-black text-white" style={{ textShadow: '0 0 20px rgba(234,179,8,0.5)' }}>
                    {playState.currentTeamTurn === 1 ? team1RoundScore : team2RoundScore}
                  </span>
                </div>
              </div>
            )}

            {/* Post-Turn Summary Overlay */}
            {postTurnTeam !== null && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                <div className="text-center transform animate-in zoom-in-50 duration-500 delay-150">
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-2">انتهى الوقت!</h2>
                  <p className="text-xl md:text-2xl text-gray-300 mb-8">
                    مجموع الإجابات الصحيحة:
                  </p>
                  <div className={`text-7xl md:text-9xl font-black mb-12 ${postTurnTeam === 1 ? 'text-cyan-400' : 'text-red-400'}`} style={{ textShadow: `0 0 40px ${postTurnTeam === 1 ? 'rgba(34,211,238,0.5)' : 'rgba(248,113,113,0.5)'}` }}>
                    {postTurnTeam === 1 ? team1RoundScore : team2RoundScore}
                  </div>
                  <button 
                    onClick={handlePostTurnComplete}
                    className="px-8 py-4 bg-white text-black font-bold text-xl md:text-2xl rounded-full hover:scale-105 active:scale-95 transition-transform shadow-2xl shadow-white/20"
                  >
                    متابعة
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer buttons — same width as image via shared wrapper ─────── */}
          <div className="shrink-0 pb-3 md:pb-4">
            <ControlActionButtons
              onSkip={handleSkip}
              onCorrect={handleCorrect}
              isPaused={isPaused}
              displayMode={answerDisplayMode}
              role="player"
            />
          </div>

        </div>
      </main>

    </div>
  )
}