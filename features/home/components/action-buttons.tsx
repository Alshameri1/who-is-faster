'use client'

import { ExternalLink, Copy, Play, BarChart3 } from 'lucide-react'
import { Button } from '@/components/button'

interface ActionButtonsProps {
  resultPanelUrl:           string
  showLocalResults:         boolean
  onOpenInNewTab:           () => void
  onCopyLink:               () => void
  onPlayLocally:            () => void
  onToggleLocalResults:     () => void
}

export function ActionButtons({
  resultPanelUrl,
  showLocalResults,
  onOpenInNewTab,
  onCopyLink,
  onPlayLocally,
  onToggleLocalResults,
}: ActionButtonsProps) {
  const isUrlReady = Boolean(resultPanelUrl)

  // 1. الكلاسات المشتركة لجميع الأزرار الملونة
  const baseButtonStyles = 'group rounded-xl px-4 py-3 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-base! sm:text-lg!'
  const filledButtonStyles = `${baseButtonStyles} text-white shadow-lg`
  const disabledStyles = !isUrlReady ? 'cursor-not-allowed opacity-50' : ''

  // 2. مصفوفة تحتوي على بيانات الأزرار الثلاثة الأولى المتشابهة في الهيكل
  const primaryButtons = [
    {
      text: "الانتقال إلى لوحة التحكم",
      icon: ExternalLink,
      onClick: onOpenInNewTab,
      iconClass: "transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
      bgClass: "bg-blue-500 shadow-blue-500/20 hover:bg-blue-600 hover:shadow-blue-500/30",
      checkUrl: true,
    },
    {
      text: "نسخ الرابط",
      icon: Copy,
      onClick: onCopyLink,
      iconClass: "transition-transform group-hover:scale-110",
      bgClass: "bg-amber-500 shadow-amber-500/20 hover:bg-amber-600 hover:shadow-amber-500/30",
      checkUrl: true,
    },
    {
      text: "تابع اللعب هنا",
      icon: Play,
      onClick: onPlayLocally,
      iconClass: "transition-transform group-hover:translate-x-0.5",
      bgClass: "bg-red-500 shadow-red-500/20 hover:bg-red-600 hover:shadow-red-500/30",
      checkUrl: false,
    },
  ]

  return (
    <div className="mt-6 flex flex-col gap-3">
      {/* رندرة الأزرار الأساسية عبر الـ Loop */}
      {primaryButtons.map((btn, index) => (
        <Button
          key={index}
          onClick={btn.onClick}
          text={btn.text}
          icon={btn.icon}
          iconClassName={btn.iconClass}
          className={[
            filledButtonStyles,
            btn.bgClass,
            btn.checkUrl ? disabledStyles : ''
          ].join(' ').trim()}
        />
      ))}

      {/* زر تبديل النتائج (تم فصله لأن استايله وشروطه مختلفة تماماً عن البقية) */}
      <Button
        onClick={onToggleLocalResults}
        text={showLocalResults ? 'إخفاء النتيجة المباشرة' : 'إظهار النتيجة في صفحة اللعب'}
        icon={BarChart3}
        iconClassName="transition-transform group-hover:scale-110"
        className={[
          baseButtonStyles,
          showLocalResults
            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600'
            : 'border-2 border-[#1e3a5f] bg-[#0c1628] text-gray-300 hover:border-blue-500/50 hover:text-white',
        ].join(' ')}
      />
    </div>
  )
}