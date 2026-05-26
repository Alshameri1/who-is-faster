// ─── GameInfoBar ──────────────────────────────────────────────────────────────

import { Zap, Clock } from 'lucide-react'
import type { GameInfoBarProps } from '../interfaces/types'

export function GameInfoBar({ rounds, timePerPlayer }: GameInfoBarProps) {
  return (
    <div className="mt-8 rounded-xl border border-[#1e3a5f] bg-[#0c1628] p-6">
      <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <span>{rounds} جولات</span>
        </div>
        <div className="h-6 w-px bg-[#1e3a5f]" />
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <span>{timePerPlayer} ثانية لكل متسابق</span>
        </div>
      </div>
    </div>
  )
}