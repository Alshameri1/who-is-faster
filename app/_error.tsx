// ─── ErrorScreen ──────────────────────────────────────────────────────────────
'use client'
import { Button } from '@/components/button'

interface ErrorScreenProps {
  message:   string
  onGoHome:  () => void
}

export function Error({ message, onGoHome }: ErrorScreenProps) {
  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-[#0c1628] p-4">
      <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <div className="mb-4 text-6xl text-red-400">!</div>
        <h2 className="mb-2 text-xl font-bold text-white">خطأ</h2>
        <p className="mb-6 text-white/70">{message}</p>
        <Button
          onClick={onGoHome}
          text="العودة للرئيسية"
          isFullWidth
          className="rounded-xl bg-blue-500 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-600"
        />
      </div>
    </div>
  )
}