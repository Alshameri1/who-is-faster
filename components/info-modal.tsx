'use client'

import { usePopup } from '@/contexts/popup-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BookOpen, Settings, Dices, Timer, SkipForward, Trophy, Lightbulb } from 'lucide-react'

export function InfoModal() {
  const { activePopup, closePopup } = usePopup()
  const isOpen = activePopup === 'info'

  const steps = [
    {
      title: 'المرحلة 1: الإعداد والتخصيص ⚙️',
      desc: 'يتم إدخال أسماء الفريقين واللاعبين، وتحديد خيارات اللعبة مثل (وقت المتسابق، وعدد الجولات). ثم اختيار مكان ظهور الإجابة (محلياً أو على شاشة الحكم).',
      icon: Settings,
      borderColor: 'border-r-[#22b8cf]',
      iconColor: 'text-[#22b8cf]',
      iconBg: 'bg-[#22b8cf]/15',
    },
    {
      title: 'المرحلة 2: العجلة والمبارزة 🎡',
      desc: 'تبدأ الجولة بلف عجلة الحظ لاختيار "فئة الصور" عشوائياً، ثم يقوم النظام باختيار متبارز عشوائي من كل فريق لبدء التحدي (دون تكرار اللاعبين حتى يشارك الجميع).',
      icon: Dices,
      borderColor: 'border-r-purple-500',
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/15',
    },
    {
      title: 'المرحلة 3: المواجهة وتبادل الأدوار ⏱️',
      desc: 'تظهر الصورة ويتحرك مؤقت الفريق الأزرق أولاً. يجب على المتسابق معرفة دلالة الصورة فوراً، وبمجرد الإجابة ينتقل الدور فوراً للفريق الثاني وهكذا بالتناوب.',
      icon: Timer,
      borderColor: 'border-r-blue-500',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
    },
    {
      title: 'المرحلة 4: خيار التجاوز (Skip) 🔄',
      desc: 'إذا تعثرت في صورة، يمكنك الضغط على "تجاوز" لتغيير الصورة فوراً، ولكن احذر! سيتم خصم جزء من وقتك الثمين (3 أو 5 ثوانٍ بحسب إعدادات الوقت).',
      icon: SkipForward,
      borderColor: 'border-r-amber-500',
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15',
    },
    {
      title: 'المرحلة 5: نهاية الجولة والفوز 🏆',
      desc: 'تنتهي الجولة عندما يصل مؤقت أي الفريقين إلى 0 ثانية. وتستمر اللعبة لعدد الجولات المحدد حتى يتم إعلان الفريق الفائز في النهاية!',
      icon: Trophy,
      borderColor: 'border-r-emerald-500',
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15',
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closePopup()}>
      <DialogContent 
        className="max-h-[85vh] overflow-y-auto border-[#1e3a5f] bg-[#0f1f35] text-white sm:max-w-xl scrollbar-blue p-6"
      >
        {/* Header */}
        <DialogHeader className="text-center sm:text-center pb-4 border-b border-white/5">
          <div className="mx-auto mb-2.5 flex h-14 w-14 items-center justify-center rounded-full bg-[#e63946]/20">
            <BookOpen className="h-7 w-7 text-[#e63946]" />
          </div>
          <DialogTitle className="text-2xl font-black text-white">
            طريقة اللعب 🎮
          </DialogTitle>
        </DialogHeader>
        
        {/* Step Cards Stack */}
        <div className="mt-6 flex flex-col gap-4">
          {steps.map((step, idx) => {
            const StepIcon = step.icon
            return (
              <div
                key={idx}
                className={`group flex items-start gap-4 rounded-2xl border border-white/5 bg-[#0c1628]/60 p-4 border-r-4 ${step.borderColor} transition-all duration-300 hover:border-white/10 hover:bg-[#0c1628]/85 hover:scale-[1.01]`}
              >
                {/* Icon Container */}
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${step.iconBg} transition-all duration-300`}>
                  <StepIcon className={`h-5 w-5 ${step.iconColor} transition-transform duration-300 group-hover:rotate-12`} />
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-base font-bold text-white leading-none">
                    {step.title}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            )
          })}

          {/* Important Note Card */}
          <div className="group flex items-start gap-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 border-r-4 border-r-yellow-400 transition-all duration-300 hover:bg-yellow-500/15 hover:scale-[1.01]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400/20 transition-all duration-300">
              <Lightbulb className="h-5 w-5 text-yellow-400 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-base font-bold text-yellow-400 leading-none">
                ملاحظة هامة 💡
              </h4>
              <p className="text-xs md:text-sm text-yellow-100/80 leading-relaxed">
                الصور واللاعبين يتم اختيارهم عشوائياً وبنظام ذكي يضمن عدم التكرار حتى تنتهي القائمة بالكامل.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-center pt-2 border-t border-white/5">
          <button
            onClick={closePopup}
            className="rounded-xl bg-[#e63946] px-10 py-3 font-bold text-white transition-all duration-300 hover:bg-[#d32836] hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-[#e63946]/20 cursor-pointer"
          >
            حسناً، فهمت!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
