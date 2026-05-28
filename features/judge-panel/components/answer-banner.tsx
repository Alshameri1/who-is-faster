// ─── features/judge-panel/components/answer-banner.tsx

import React from 'react'
import { Button } from '@/components/button'
import type { AnswerBannerProps } from '../interfaces/types'

export function AnswerBanner({
  answerBannerRef,
  answerTextRef,
  answerHiddenRef,
  revealAnswer,
  onToggleReveal,
  currentAnswerRef,
  revealButtonText,
  revealButtonIcon,
  revealButtonClasses
}: AnswerBannerProps) {
  const answerTextClasses = [
    'text-3xl md:text-4xl font-black text-emerald-300 drop-shadow-md will-change-[transform,opacity]',
    revealAnswer ? 'block' : 'hidden'
  ].join(' ')

  const answerHiddenClasses = [
    'text-lg text-white/30 italic',
    revealAnswer ? 'hidden' : 'block'
  ].join(' ')

  return (
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
            className={answerTextClasses}
          >
            {currentAnswerRef.current || 'لا يوجد إجابة حالياً'}
          </h3>
          <div
            ref={answerHiddenRef}
            className={answerHiddenClasses}
          >
            الإجابة مخفية حالياً
          </div>
        </div>

        <Button
          onClick={onToggleReveal}
          text={revealButtonText}
          icon={revealButtonIcon}
          className={revealButtonClasses}
        />
      </div>
    </div>
  )
}
