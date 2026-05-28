import { Check, SkipForward } from 'lucide-react'
import { Button } from '@/components/button'

interface ControlActionButtonsProps {
  onSkip: () => void
  onCorrect: () => void
  isPaused?: boolean
  displayMode: 'local' | 'judge'
  role: 'player' | 'judge'
}

export function ControlActionButtons({
  onSkip,
  onCorrect,
  isPaused = false,
  displayMode,
  role,
}: ControlActionButtonsProps) {
  // Scenario A: remote judge (displayMode='judge')
  // - Judge sees both
  // - Player sees only Skip
  // Scenario B: local play (displayMode='local')
  // - Both see both

  const showCorrect = displayMode === 'local' || role === 'judge'

  return (
    <div className="flex items-stretch gap-2 md:gap-3 w-full">
      {/* Skip button — takes 100% width if Correct is hidden, else 20% */}
      <Button
        onClick={onSkip}
        text="تجاوز"
        icon={SkipForward}
        className={[
          showCorrect ? 'w-[20%]' : 'w-full',
          'rounded-xl border border-gray-500/50',
          'bg-linear-to-b from-gray-600 to-gray-700',
          'py-3 text-sm font-bold text-white md:py-4 md:text-base',
          'transition-all hover:from-gray-500 hover:to-gray-600',
          'hover:scale-[1.02] active:scale-[0.98]',
          isPaused ? 'cursor-not-allowed opacity-50' : '',
        ].join(' ')}
      />

      {/* Correct button — 80% */}
      {showCorrect && (
        <Button
          onClick={onCorrect}
          text="إجابة صحيحة"
          icon={Check}
          className={[
            'w-[80%] rounded-xl',
            'bg-linear-to-b from-green-500 to-emerald-600',
            'py-3 text-base font-bold text-white md:py-4 md:text-xl',
            'shadow-lg shadow-green-500/30',
            'transition-all hover:from-green-400 hover:to-emerald-500',
            'hover:scale-[1.02] active:scale-[0.98]',
            isPaused ? 'cursor-not-allowed opacity-50' : '',
          ].join(' ')}
        />
      )}
    </div>
  )
}
