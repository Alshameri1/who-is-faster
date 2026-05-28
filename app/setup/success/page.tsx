'use client'

import { PartyPopper } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { usePostSetup } from '@/features/home/hooks/use-post-setup'
import { GameSummary } from '@/features/home/components/game-summary'
import { QrSection } from '@/features/home/components/qr-section'
import { ActionButtons } from '@/features/home/components/action-buttons'

export default function SetupSuccessPage() {
  const {
    gameSession,
    resultPanelUrl,
    showLocalResults,
    handleClose,
    handleOpenInNewTab,
    handleCopyLink,
    handlePlayLocally,
    handleToggleLocalResults,
  } = usePostSetup()

  if (!gameSession) {
    return (
      <div className="min-h-screen bg-[#0c1628] text-white">
        <Navbar />
        <main className="max-w-lg mx-auto px-4 pt-32 pb-12 flex flex-col items-center justify-center text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4" />
          <p className="text-gray-400">جاري تحميل بيانات اللعبة المحفوظة...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0c1628] text-white">
      {/* Persistent Glassmorphic Navbar */}
      <Navbar />

      <main className="max-w-lg mx-auto px-4 pt-24 pb-12">
        {/* Beautiful Glassmorphic Success Container */}
        <div className="border border-[#1e3a5f] bg-[#0f1f35]/90 backdrop-blur-sm text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 relative">
          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400">
              <PartyPopper className="h-8 w-8 text-green-400 animate-bounce" />
            </div>
            <h1 className="text-2xl font-black text-white">تم حفظ اللعبة بنجاح!</h1>
            <p className="mt-2 text-sm text-gray-400">
              يمكنك الآن ربط لوحة المنظم أو شاشة النتائج
            </p>
          </div>

          {/* Game Summary Component */}
          <div className="bg-[#0c1628]/60 rounded-2xl p-4 border border-[#1e3a5f]/40">
            <GameSummary session={gameSession} />
          </div>

          {/* QR Code Section */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <QrSection url={resultPanelUrl} />
          </div>

          {/* Action Buttons */}
          <ActionButtons
            resultPanelUrl={resultPanelUrl}
            showLocalResults={showLocalResults}
            onOpenInNewTab={handleOpenInNewTab}
            onCopyLink={handleCopyLink}
            onPlayLocally={handlePlayLocally}
            onToggleLocalResults={handleToggleLocalResults}
          />

          {/* Footer Info */}
          <div className="mt-2 border-t border-[#1e3a5f]/40 pt-4 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
              <span>معرف اللعبة:</span>
              <span className="font-mono text-blue-400 select-all" dir="ltr">
                {gameSession.gameId}
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
