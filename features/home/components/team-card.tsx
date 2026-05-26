'use client'
 
import { Check, X, Pencil, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/button'
import { PlayerInput } from './player-input'
import { TEAM_COLOR_CONFIG } from '../constants/constants'
import type { Team } from '../interfaces/types'
 
interface TeamCardProps {
  team:               Team
  editingTeamName:    string
  onEditingNameChange:(val: string) => void
  onStartEdit:        () => void
  onSaveName:         () => void
  onCancelEdit:       () => void
  onAddPlayer:        () => void
  onUpdatePlayer:     (playerId: string, name: string) => void
  onRemovePlayer:     (playerId: string) => void
}
 
export function TeamCard({
  team,
  editingTeamName,
  onEditingNameChange,
  onStartEdit,
  onSaveName,
  onCancelEdit,
  onAddPlayer,
  onUpdatePlayer,
  onRemovePlayer,
}: TeamCardProps) {
  const colors = TEAM_COLOR_CONFIG[team.color]
 
  return (
    <div className={[
      "rounded-xl border-2 overflow-hidden transition-all duration-300",
      colors.border,
      colors.bg,
    ].join(" ")}>
 
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className={["px-4 py-3", colors.header].join(" ")}>
        {team.isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editingTeamName}
              onChange={e => onEditingNameChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter")  onSaveName()
                if (e.key === "Escape") onCancelEdit()
              }}
              className={[
                "h-8 border-white/20 bg-white/10 text-white placeholder:text-white/50",
                colors.inputFocus,
              ].join(" ")}
              autoFocus
            />
            <button
              onClick={onSaveName}
              className="rounded-md bg-green-500/20 p-1.5 text-green-400 hover:bg-green-500/30"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={onCancelEdit}
              className="rounded-md bg-red-500/20 p-1.5 text-red-400 hover:bg-red-500/30"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h3 className={["text-lg font-bold", colors.accent].join(" ")}>
              {team.name}
            </h3>
            <button
              onClick={onStartEdit}
              className={["rounded-md p-1.5 hover:bg-white/10 transition-colors", colors.accent].join(" ")}
              title="تعديل الاسم"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
 
      {/* ── Players ─────────────────────────────────────────────────────── */}
      <div className="space-y-3 p-4">
        {team.players.map((player, index) => (
          <PlayerInput
            key={player.id}
            player={player}
            index={index}
            colors={colors}
            onChangeName={name => onUpdatePlayer(player.id, name)}
            onRemove={() => onRemovePlayer(player.id)}
          />
        ))}
 
        {/* Add player */}
        <Button
          onClick={onAddPlayer}
          text="إضافة متسابق"
          icon={Plus}
          className={[
            "rounded-lg border-2 border-dashed py-3 font-semibold w-full text-base! sm:text-lg!",
            "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
            colors.dashedBorder,
          ].join(" ")}
        />
      </div>
    </div>
  )
}