// ─── features/judge-panel/components/team-card.tsx

import React from 'react'
import { Trophy, Users } from 'lucide-react'
import { TEAM_COLOR } from '../constants/constants'
import type { TeamScoreCardProps } from '../interfaces/types'

export function TeamCard({ teamData, score, color, isActive, cardRef }: TeamScoreCardProps) {
  const c = TEAM_COLOR[color]

  const containerClasses = [
    'rounded-2xl border transition-all duration-300 ease-out overflow-hidden',
    c.cardBg,
    isActive ? ['ring-4', c.ring].join(' ') : ''
  ].join(' ')

  const headerClasses = [
    'px-4 py-2.5 flex items-center justify-between border-b',
    c.cardHeaderBg
  ].join(' ')

  const titleClasses = [
    'text-sm font-bold',
    c.text
  ].join(' ')

  const iconClasses = [
    'h-4.5 w-4.5',
    c.text
  ].join(' ')

  const badgeClasses = [
    'rounded-full px-2.5 py-0.5 text-xs',
    c.badge
  ].join(' ')

  return (
    <div
      ref={cardRef}
      className={containerClasses}
      style={{
        transform: 'scale(var(--scale, 1))',
        borderColor: 'var(--border-color, rgba(255, 255, 255, 0.05))',
        boxShadow: 'var(--box-shadow, none)',
        opacity: 'var(--opacity, 1)',
        willChange: 'transform, opacity',
      }}
    >
      <div className={headerClasses}>
        <span className={titleClasses}>{teamData.name}</span>
        <Trophy className={iconClasses} />
      </div>
      <div className="p-4">
        <div className="text-center mb-3">
          <span className="text-5xl font-extrabold text-white">{score}</span>
          <span className="mr-1.5 text-sm text-gray-400">نقطة</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Users className="h-3.5 w-3.5" />
            <span>{teamData.players.length} متسابقين</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {teamData.players.map((player) => (
              <span key={player.id} className={badgeClasses}>
                {player.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
