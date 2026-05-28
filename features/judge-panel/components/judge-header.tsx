// ─── features/judge-panel/components/judge-header.tsx

import React from 'react'
import type { JudgeHeaderProps } from '../interfaces/types'

export function JudgeHeader({
  isConnected,
  gameId,
  connectionStatusText,
  connectionStatusIcon: ConnectionStatusIcon,
  connectionBadgeClasses,
  connectionIndicatorPingClasses,
  connectionIndicatorDotClasses
}: JudgeHeaderProps) {
  return (
    <header className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className={connectionIndicatorPingClasses}></span>
            <span className={connectionIndicatorDotClasses}></span>
          </span>
          <span className="text-xs text-white/50 font-bold uppercase tracking-wider">لوحة التحكيم المباشرة</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black mt-1">
          <span className="text-red-500">من </span>
          <span className="text-blue-500">الأسرع؟</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className={connectionBadgeClasses}>
          <ConnectionStatusIcon className="w-3.5 h-3.5" />
          <span>{connectionStatusText}</span>
        </div>

        <div className="text-xs text-white/40">
          معرف الجلسة: <span className="font-mono text-blue-500">{gameId}</span>
        </div>
      </div>
    </header>
  )
}
