// ─── VsBadge ──────────────────────────────────────────────────────────────────

interface VsBadgeProps {
  isShuffling: boolean
  isLocked:    boolean
}

export function VsBadge({ isShuffling, isLocked }: VsBadgeProps) {
  return (
    <div className="relative">
      <div
        className={[
          'w-16 h-16 md:w-20 md:h-20 rounded-full',
          'bg-linear-to-br from-yellow-400 to-orange-500',
          'flex items-center justify-center',
          'text-xl md:text-2xl font-black text-white shadow-xl',
          'transition-all duration-500',
          isLocked ? 'scale-110' : 'animate-pulse',
        ].join(' ')}
        style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.4)' }}
      >
        VS
      </div>

      {/* Ping ring — only while shuffling */}
      {isShuffling && (
        <div className="absolute inset-0 rounded-full border-4 border-yellow-400/50 animate-ping" />
      )}
    </div>
  )
}