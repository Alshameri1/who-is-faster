'use client'

import { CheckCircle2 } from 'lucide-react'
import type { GameSessionData } from '@/contexts/popup-context'

interface GameSummaryProps {
  session: GameSessionData
}

export function GameSummary({ session }: GameSummaryProps) {
  return (
    <div className="mt-4 rounded-xl border border-[#1e3a5f] bg-[#0c1628] p-4">
      {/* Teams row */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <span className="text-gray-300">{session.team1Data.name}</span>
          <span className="text-blue-500">({session.team1Data.players.length} متسابقين)</span>
        </div>

        <span className="text-gray-500">VS</span>

        <div className="flex items-center gap-2">
          <span className="text-gray-300">{session.team2Data.name}</span>
          <span className="text-red-500">({session.team2Data.players.length} متسابقين)</span>
          <CheckCircle2 className="h-4 w-4 text-green-400" />
        </div>
      </div>

      {/* Config row */}
      <div className="mt-3 flex justify-center gap-6 text-xs text-gray-400">
        <span>{session.rounds} جولات</span>
        <span className="text-gray-600">|</span>
        <span>{session.timePerPlayer} ثانية لكل متسابق</span>
      </div>
    </div>
  )
}