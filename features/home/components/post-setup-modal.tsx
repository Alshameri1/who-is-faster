'use client'

import { PartyPopper } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { usePopup } from '@/contexts/popup-context'
import { usePostSetup }   from '../hooks/use-post-setup'
import { GameSummary }    from './game-summary'
import { QrSection }      from './qr-section'
import { ActionButtons }  from './action-buttons'

export function PostSetupModal() {
  const { activePopup } = usePopup()
  const isOpen = activePopup === 'post-setup'

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

  if (!gameSession) return null

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) handleClose() }}>
      <DialogContent
        className="border-[#1e3a5f] bg-[#0f1f35] text-white sm:max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden scrollbar-blue px-8 border-none"
        showCloseButton
      >
          {/* ── Header ────────────────────────────────────────────────────── */}
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <PartyPopper className="h-8 w-8 text-green-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              تم حفظ اللعبة!
            </DialogTitle>
            <p className="mt-2 text-gray-400">
              يمكنك الآن ربط لوحة المنظم أو شاشة النتائج
            </p>
          </DialogHeader>

          {/* ── Game Summary ───────────────────────────────────────────────── */}
          <GameSummary session={gameSession} />

          {/* ── QR Code ───────────────────────────────────────────────────── */}
          <QrSection url={resultPanelUrl} />

          {/* ── Action Buttons (flex-col) ──────────────────────────────────── */}
          <ActionButtons
            resultPanelUrl={resultPanelUrl}
            showLocalResults={showLocalResults}
            onOpenInNewTab={handleOpenInNewTab}
            onCopyLink={handleCopyLink}
            onPlayLocally={handlePlayLocally}
            onToggleLocalResults={handleToggleLocalResults}
          />

          {/* ── Footer ────────────────────────────────────────────────────── */}
          <div className="mt-6 border-t border-[#1e3a5f] pt-4 text-center">
            <p className="text-xs text-gray-500">
              معرف اللعبة:{' '}
              <span className="font-mono text-blue-500" dir="ltr">
                {gameSession.gameId}
              </span>
            </p>
          </div>

      </DialogContent>
    </Dialog>
  )
}