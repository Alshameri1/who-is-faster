'use client'
// ─── GameplayDashboard ────────────────────────────────────────────────────────
// Purely presentational — all logic lives in useGameplayDashboard.

import { Check, SkipForward, Menu } from 'lucide-react'
import { Button }              from '@/components/button'
import { PauseMenu }           from '../components/pause-menu'
import { DashboardHeader }     from '../components/dashboard-header'
import { useGameplayDashboard } from '../hooks/use-gameplay-dashboard'
import type { GameplayDashboardProps } from '../interfaces/types'
import Image from 'next/image'

export function GameplayDashboard({
  sessionData,
  playState,
  onCorrectAnswer,
  onRoundEnd,
  onRestart,
  isTieBreaker = false,
}: GameplayDashboardProps) {
  const {
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
  } = useGameplayDashboard(sessionData, playState, onCorrectAnswer, onRoundEnd)

  return (
    <div dir="rtl" className="flex h-screen flex-col overflow-hidden bg-[#0c1628]">

      {/* ── Hamburger ───────────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="absolute top-3 right-4 z-50 rounded-xl border border-white/20 bg-white/10 p-2 transition-all hover:bg-white/20"
        aria-label="قائمة الإيقاف"
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      <PauseMenu
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
        onRestart={onRestart}
        gameId={sessionData.gameId}
      />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <DashboardHeader
        sessionData={sessionData}
        playState={playState}
        team1TimeMs={team1TimeMs}
        team2TimeMs={team2TimeMs}
        isTieBreaker={isTieBreaker}
      />

      {/* ── Main content (image) ─────────────────────────────────────────────
           Shared horizontal padding with footer keeps widths identical.       */}
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-2 md:px-6 md:py-3">

        {/* Shared width wrapper — image + footer are siblings of this */}
        <div className="flex w-full flex-col gap-3 h-full">
          {/* Category badge */}
          {playState.selectedCategory && (
            <div className="shrink-0 text-center">
              <span className="inline-block rounded-full border border-purple-400/50 bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300 md:text-sm">
                {playState.selectedCategory}
              </span>
            </div>
          )}
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
                  ? 'جولة فاصلة'
                  : `الجولة ${playState.currentRound} / ${sessionData.rounds}`}
              </span>
            </div>
          </div>

          {/* ── Footer buttons — same width as image via shared wrapper ─────── */}
          <div className="shrink-0 pb-3 md:pb-4">
            <div className="flex items-stretch gap-2 md:gap-3 w-full">

              {/* Skip — 20% */}
              <Button
                onClick={handleSkip}
                text="تجاوز"
                icon={SkipForward}
                className={[
                  'w-[20%] rounded-xl border border-gray-500/50',
                  'bg-linear-to-b from-gray-600 to-gray-700',
                  'py-3 text-sm font-bold text-white md:py-4 md:text-base',
                  'transition-all hover:from-gray-500 hover:to-gray-600',
                  'hover:scale-[1.02] active:scale-[0.98]',
                  isPaused ? 'cursor-not-allowed opacity-50' : '',
                ].join(' ')}
              />

              {/* Correct — 80% */}
              <Button
                onClick={handleCorrect}
                text="إجابة صحيحة"
                icon={Check}
                className={[
                  'w-[80%] rounded-xl',
                  'bg-linear-to-b from-green-500 to-emerald-600',
                  'py-3 text-base font-bold text-white md:py-4 md:text-xl',
                  'shadow-lg shadow-green-500/30',
                  'transition-all hover:from-green-400 hover:to-emerald-500',
                  'hover:scale-[1.02] active:scale-[0.98]',
                  isPaused ? 'cursor-not-allowed opacity-50' : '',
                ].join(' ')}
              />

            </div>
          </div>

        </div>
      </main>

    </div>
  )
}