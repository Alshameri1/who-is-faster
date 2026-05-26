// ─── PlayerInput ──────────────────────────────────────────────────────────────
// A single player row: index label + name field + delete button.

'use client'

import { Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/button'
import type { Player, TeamColorConfig } from '../interfaces/types'

interface PlayerInputProps {
  player:       Player
  index:        number
  colors:       TeamColorConfig
  onChangeName: (name: string) => void
  onRemove:     () => void
}

export function PlayerInput({ player, index, colors, onChangeName, onRemove }: PlayerInputProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="w-6 text-center text-sm text-gray-400">{index + 1}</span>

        <Input
          value={player.name}
          onChange={e => onChangeName(e.target.value)}
          placeholder="اسم المتسابق"
          className={[
            "flex-1 border-white/20 bg-white/5 text-white placeholder:text-gray-500 py-6 text-lg font-medium",
            colors.inputFocus,
            player.error ? "border-red-500 ring-2 ring-red-500/30" : "",
          ].join(" ")}
        />

        <Button
          onClick={onRemove}
          icon={Trash2}
          className={`${colors.header} p-1 hover:scale-105 active:scale-95`}
        />
      </div>

      {player.error && (
        <p className="mr-8 text-sm text-red-400">{player.error}</p>
      )}
    </div>
  )
}