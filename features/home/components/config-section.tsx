// ─── ConfigSection ────────────────────────────────────────────────────────────
// Rounds + time-per-player selects. Fully reusable and stateless.

'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROUND_OPTIONS, TIME_OPTIONS } from '../constants/constants'

interface ConfigSectionProps {
  rounds:            string
  timePerPlayer:     string
  answerDisplayMode: 'local' | 'judge'
  onRoundsChange:    (val: string) => void
  onTimeChange:      (val: string) => void
  onAnswerDisplayModeChange: (val: 'local' | 'judge') => void
}

// ── Small helper to avoid repeating Select boilerplate ────────────────────────
interface LabeledSelectProps {
  label:       string
  value:       string
  onChange:    (val: string) => void
  options:     { value: string; label: string }[]
  placeholder: string
}

function LabeledSelect({ label, value, onChange, options, placeholder }: LabeledSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border-[#1e3a5f] bg-[#0f1f35] text-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="border-[#1e3a5f] bg-[#0f1f35] text-white">
          {options.map(opt => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="focus:bg-blue-500/20 focus:text-white"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export function ConfigSection({
  rounds,
  timePerPlayer,
  answerDisplayMode,
  onRoundsChange,
  onTimeChange,
  onAnswerDisplayModeChange
}: ConfigSectionProps) {
  const roundOptions = ROUND_OPTIONS.map(n => ({
    value: n.toString(),
    label: `${n} ${n === 1 ? "جولة" : "جولات"}`,
  }))

  const timeOptions = TIME_OPTIONS.map(s => ({
    value: s.toString(),
    label: `${s} ثانية`,
  }))

  const displayModeOptions = [
    { value: 'local', label: 'عرض الإجابة محلياً (في اللعبة)' },
    { value: 'judge', label: 'عرض الإجابة في شاشة المنظم / التحكيم' },
  ]

  return (
    <div className="mt-6 grid gap-4 rounded-xl border border-[#1e3a5f] bg-[#0c1628] p-4 sm:grid-cols-2">
      <LabeledSelect
        label="عدد الجولات"
        value={rounds}
        onChange={onRoundsChange}
        options={roundOptions}
        placeholder="اختر عدد الجولات"
      />
      <LabeledSelect
        label="الوقت لكل متسابق (ثانية)"
        value={timePerPlayer}
        onChange={onTimeChange}
        options={timeOptions}
        placeholder="اختر الوقت"
      />
    </div>
  )
}