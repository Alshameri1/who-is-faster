'use client'

import { Users, AlertCircle } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { TeamCard } from '@/features/home/components/team-card'
import { ConfigSection } from '@/features/home/components/config-section'
import { useSetupForm } from '@/features/home/hooks/use-setup-form'
import { Button } from '@/components/button'

export default function SetupPage() {
  const form = useSetupForm()

  return (
    <div className="min-h-screen bg-[#0c1628] text-white">
      {/* Persistent Glassmorphic Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">إعداد التحدّي الجديد</h1>
          <p className="text-gray-400 mt-2 text-sm">أدخل أسماء الفرق والمتسابقين وحدد خيارات الجولات والوقت</p>
        </div>

        {/* Setup Form Grid: Side-by-side on desktop */}
        <div className="flex flex-col gap-6">
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

        {/* Settings / Configuration */}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-300 mb-3 px-1">خيارات اللعب</h3>
          <ConfigSection
            rounds={form.rounds}
            timePerPlayer={form.timePerPlayer}
            answerDisplayMode={form.answerDisplayMode}
            onRoundsChange={form.setRounds}
            onTimeChange={form.setTimePerPlayer}
            onAnswerDisplayModeChange={form.setAnswerDisplayMode}
          />
        </div>

        {/* Submit Action */}
        <div className="mt-6">
          <Button
            onClick={form.handleContinue}
            text="متابعة وحفظ اللعبة"
            isFullWidth
            isPending={form.isPending && !form.showModeSelection}
            className={[
              "group relative overflow-hidden rounded-2xl",
              "bg-blue-600 hover:bg-blue-700",
              "px-8 py-4.5 text-xl font-bold text-white",
              "shadow-lg shadow-blue-500/20 hover:shadow-indigo-500/30",
              "transition-all duration-300 ease-out",
              "hover:scale-[1.01] active:scale-[0.99]",
            ].join(" ")}
          />
        </div>
      </main>

      {/* Mode Selection Popup Overlay */}
      {form.showModeSelection && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0c1628] p-6 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col gap-5">
            <h2 className="text-center text-3xl font-black text-white">اختر طور اللعب</h2>
            <p className="text-center text-gray-400">اختر الطريقة التي تفضلها للتحدي</p>
            
            <div className="grid gap-4 md:grid-cols-2">
              {/* Blitz Mode */}
              <button
                onClick={() => form.finalizeSetup('blitz')}
                disabled={form.isPending}
                className="group relative flex flex-col items-center gap-4 rounded-2xl border-2 border-blue-500/30 bg-blue-500/5 p-6 text-center transition-all hover:border-blue-500 hover:bg-blue-500/10 active:scale-[0.98]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 transition-transform group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-white">طور التناوب السريع</h3>
                  <p className="text-sm text-gray-400">
                    يتبادل الفريقان الأدوار فوراً بعد كل إجابة صحيحة أو تجاوز. السرعة والبديهة هما مفتاح الفوز هنا!
                  </p>
                </div>
              </button>

              {/* Marathon Mode */}
              <button
                onClick={() => form.finalizeSetup('marathon')}
                disabled={form.isPending}
                className="group relative flex flex-col items-center gap-4 rounded-2xl border-2 border-purple-500/30 bg-purple-500/5 p-6 text-center transition-all hover:border-purple-500 hover:bg-purple-500/10 active:scale-[0.98]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 transition-transform group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-white">طور الماراثون الزمني</h3>
                  <p className="text-sm text-gray-400">
                    يلعب المتسابق بشكل متواصل حتى ينتهي كامل وقته ليحصد أكبر عدد من النقاط قبل انتقال الدور.
                  </p>
                </div>
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => form.setShowModeSelection(false)}
                disabled={form.isPending}
                className="rounded-xl px-6 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                رجوع وتعديل الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
