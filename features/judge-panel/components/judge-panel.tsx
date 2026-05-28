// ─── features/judge-panel/components/judge-panel.tsx

'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import { useJudgePanel } from '../hooks/use-judge-panel'
import { JudgeHeader } from './judge-header'
import { TeamCard } from './team-card'
import { ActiveQuestion } from './active-question'
import { AnswerBanner } from './answer-banner'
import { QuickGuide } from './quick-guide'
import { JudgeFooter } from './judge-footer'
import { ControlActionButtons } from '@/features/game/[id]/play/components/control-action-buttons'
import { Navbar } from '@/components/Navbar'
import type { JudgePanelProps } from '../interfaces/types'

export function JudgePanel({ gameId }: JudgePanelProps) {
  const {
    isConnected,
    revealAnswer,
    gameData,
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
    connectionBadgeClasses,
    connectionIndicatorPingClasses,
    connectionIndicatorDotClasses,
  } = useJudgePanel(gameId)

  return (
    <div dir="rtl" className="relative min-h-screen text-white pt-24 pb-12 px-4 md:px-8 overflow-x-hidden">
      {/* GPU-Accelerated Background Layers to avoid layout/repaint shifts */}
      <div 
        className="absolute inset-0 bg-linear-to-b from-[#0a1628] via-[#0b2447] to-[#0a1628] transition-opacity duration-700 ease-in-out pointer-events-none z-0"
        style={activeTurnBgStyle1}
      />
      <div 
        className="absolute inset-0 bg-linear-to-b from-[#0a1628] via-[#31111d] to-[#0a1628] transition-opacity duration-700 ease-in-out pointer-events-none z-0"
        style={activeTurnBgStyle2}
      />

      {/* Global Header Component */}
      <Navbar />

      <div className="relative z-10">
        {/* Top Bar / Header */}
        <JudgeHeader
          isConnected={isConnected}
          gameId={gameId}
          connectionStatusText={connectionStatusText}
          connectionStatusIcon={connectionStatusIcon}
          connectionBadgeClasses={connectionBadgeClasses}
          connectionIndicatorPingClasses={connectionIndicatorPingClasses}
          connectionIndicatorDotClasses={connectionIndicatorDotClasses}
        />

        {/* Main Workspace Grid */}
        <main className="mx-auto max-w-5xl grid gap-8 md:grid-cols-3">
          {/* Left Side: Game Details */}
          <section className="md:col-span-1 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0f1f35]/60 p-5 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white/40 mb-4 flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                نقاط وحالة الفرق المنافسة
              </h3>
              
              {gameData ? (
                <div className="flex flex-col gap-4">
                  {/* Team 1 and Team 2 scoreboards in flex-col gap-4 */}
                  <TeamCard
                    cardRef={team1CardRef}
                    teamData={gameData.team1Data}
                    score={team1Score}
                    color="blue"
                    isActive={activeTurn === 1}
                  />

                  <TeamCard
                    cardRef={team2CardRef}
                    teamData={gameData.team2Data}
                    score={team2Score}
                    color="red"
                    isActive={activeTurn === 2}
                  />

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
            <QuickGuide />
          </section>

          {/* Right Side: Active Image and Answer Display */}
          <section className="md:col-span-2 space-y-6">
            {/* Active Image */}
            <ActiveQuestion
              imageContainerRef={imageContainerRef}
              fallbackRef={fallbackRef}
            />

            {/* The Answer Banner */}
            <AnswerBanner
              answerBannerRef={answerBannerRef}
              answerTextRef={answerTextRef}
              answerHiddenRef={answerHiddenRef}
              revealAnswer={revealAnswer}
              onToggleReveal={toggleReveal}
              currentAnswerRef={currentAnswerRef}
              revealButtonText={revealButtonText}
              revealButtonIcon={revealButtonIcon}
              revealButtonClasses={revealButtonClasses}
            />

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
        <JudgeFooter />
      </div>
    </div>
  )
}
