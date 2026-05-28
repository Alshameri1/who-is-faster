// ─── features/judge-panel/components/active-question.tsx

import React from 'react'
import { ImageIcon } from 'lucide-react'
import type { ActiveQuestionProps } from '../interfaces/types'

export function ActiveQuestion({ imageContainerRef, fallbackRef }: ActiveQuestionProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0f1f35]/60 p-4 backdrop-blur-md flex flex-col">
      <h2 className="text-sm font-bold text-white/50 mb-3 flex items-center gap-1.5">
        <ImageIcon className="w-4 h-4 text-purple-400" />
        الصورة المعروضة حالياً في اللعبة
      </h2>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
        <div ref={imageContainerRef} className="absolute inset-0 w-full h-full" />

        <div ref={fallbackRef} className="text-center p-8 block">
          <span className="block text-3xl mb-2 animate-bounce">⏱️</span>
          <p className="text-sm text-white/40">في انتظار بدء اللعب لعرض السؤال...</p>
        </div>
      </div>
    </div>
  )
}
