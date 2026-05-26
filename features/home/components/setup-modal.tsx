'use client'

import { Users } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/button'
import { usePopup } from '@/contexts/popup-context'
import { useSetupForm } from '../hooks/use-setup-form'
import { TeamCard } from './team-card'
import { ConfigSection } from './config-section'

export function SetupModal() {
  const { activePopup, closePopup } = usePopup()
  const isOpen = activePopup === "setup"

  const form = useSetupForm()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closePopup()
      // Reset after close animation
      setTimeout(form.resetForm, 300)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto scrollbar-blue border-[#1e3a5f] bg-[#0f1f35] text-white sm:max-w-3xl"
        showCloseButton
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20">
            <Users className="h-7 w-7 text-blue-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            إعداد التحدّي
          </DialogTitle>
        </DialogHeader>

        {/* ── Teams (flex-col) ─────────────────────────────────────────────── */}
        <div className="mt-6 flex flex-col gap-4">
          {form.teams.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              editingTeamName={form.editingTeamName}
              onEditingNameChange={form.setEditingTeamName}
              onStartEdit={() => form.startEditingTeamName(team.id)}
              onSaveName={() => form.saveTeamName(team.id)}
              onCancelEdit={() => form.cancelEditingTeamName(team.id)}
              onAddPlayer={() => form.addPlayer(team.id)}
              onUpdatePlayer={(playerId, name) => form.updatePlayerName(team.id, playerId, name)}
              onRemovePlayer={playerId => form.removePlayer(team.id, playerId)}
            />
          ))}
        </div>

        {/* ── Config ──────────────────────────────────────────────────────── */}
        <ConfigSection
          rounds={form.rounds}
          timePerPlayer={form.timePerPlayer}
          answerDisplayMode={form.answerDisplayMode}
          onRoundsChange={form.setRounds}
          onTimeChange={form.setTimePerPlayer}
          onAnswerDisplayModeChange={form.setAnswerDisplayMode}
        />

        {/* ── Continue ────────────────────────────────────────────────────── */}
        <div className="mt-6">
          <Button
            onClick={form.handleContinue}
            text="متابعة"
            isFullWidth
            className={[
              "group relative overflow-hidden rounded-xl",
              "bg-blue-500 hover:bg-blue-600",
              "px-8 py-4 text-xl font-bold text-white",
              "shadow-lg shadow-blue-500/30",
              "transition-all duration-300 ease-out",
              "hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40",
              "active:scale-[0.98]",
            ].join(" ")}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}