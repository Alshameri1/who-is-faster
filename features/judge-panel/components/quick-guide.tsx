// ─── features/judge-panel/components/quick-guide.tsx

import React from 'react'
import { HelpCircle } from 'lucide-react'

export function QuickGuide() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1f35]/60 p-5 backdrop-blur-md">
      <h3 className="text-sm font-bold text-white/40 mb-3 flex items-center gap-1.5">
        <HelpCircle className="w-4 h-4 text-yellow-500" />
        دليل المحكّم السريع
      </h3>
      <ul className="text-xs text-white/60 space-y-2 leading-relaxed list-disc list-inside">
        <li>تظهر هذه الشاشة الصورة النشطة حالياً في اللعبة فوراً دون تأخير.</li>
        <li>انظر إلى الإجابة الصحيحة باللون الأخضر المضيء أدناه للحكم على إجابة المتسابق.</li>
        <li>يمكنك إخفاء الإجابة عن شاشتك إذا كان هناك أشخاص يراقبون شاشة التحكيم.</li>
      </ul>
    </div>
  )
}
