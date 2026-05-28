'use client'

import { useState } from 'react'
import { usePopup } from '@/contexts/popup-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BookOpen, Settings, Dices, Timer, SkipForward, Trophy, Lightbulb, ArrowRight, PlayCircle, Clock } from 'lucide-react'

export function InfoModal() {
  const { activePopup, closePopup } = usePopup()
  const isOpen = activePopup === 'info'
  const [activeTab, setActiveTab] = useState<'hub' | 'blitz' | 'marathon'>('hub')

  // Common UI styles
  const cardHoverStyle = "transition-all duration-300 hover:scale-[1.01] hover:bg-[#0c1628]/85"

  const blitzSteps = [
    {
      title: 'المرحلة 1: الإعداد',
      desc: 'إدخال الأسماء وتحديد الوقت. يتم اختيار الإجابة محلياً أو على شاشة الحكم.',
      icon: Settings,
      borderColor: 'border-r-[#22b8cf]', iconColor: 'text-[#22b8cf]', iconBg: 'bg-[#22b8cf]/15',
    },
    {
      title: 'المرحلة 2: العجلة والمبارزة',
      desc: 'تحديد الفئة عشوائياً عبر العجلة واختيار متبارز من كل فريق.',
      icon: Dices,
      borderColor: 'border-r-purple-500', iconColor: 'text-purple-400', iconBg: 'bg-purple-500/15',
    },
    {
      title: 'المرحلة 3: تبادل الأدوار',
      desc: 'تظهر الصورة، يتحرك المؤقت، وبمجرد الإجابة أو التجاوز، ينتقل الدور فوراً للفريق الخصم!',
      icon: Timer,
      borderColor: 'border-r-blue-500', iconColor: 'text-blue-400', iconBg: 'bg-blue-500/15',
    },
    {
      title: 'المرحلة 4: التجاوز (Skip)',
      desc: 'يمكنك تجاوز الصورة مع خصم ثوانٍ من وقت فريقك وينتقل الدور للفريق الآخر.',
      icon: SkipForward,
      borderColor: 'border-r-amber-500', iconColor: 'text-amber-400', iconBg: 'bg-amber-500/15',
    },
    {
      title: 'المرحلة 5: نهاية الجولة',
      desc: 'أول فريق يصل وقته إلى صفر يخسر الجولة.',
      icon: Trophy,
      borderColor: 'border-r-emerald-500', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/15',
    },
  ]

  const marathonSteps = [
    {
      title: 'المرحلة 1: البداية القوية',
      desc: 'يبدأ المتسابق الأول وتظهر الصورة وعداد الوقت يستمر في النزول بلا توقف.',
      icon: PlayCircle,
      borderColor: 'border-r-blue-500', iconColor: 'text-blue-400', iconBg: 'bg-blue-500/15',
    },
    {
      title: 'المرحلة 2: تجميع النقاط',
      desc: 'المتسابق يستمر في الإجابة وحصد النقاط قدر الإمكان حتى ينتهي كامل وقته.',
      icon: Trophy,
      borderColor: 'border-r-emerald-500', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/15',
    },
    {
      title: 'المرحلة 3: عقوبة التجاوز',
      desc: 'في حال تعثر المتسابق، يمكنه تجاوز الصورة، لكنه سيفقد ثوانٍ ثمينة من وقته المتبقي.',
      icon: SkipForward,
      borderColor: 'border-r-amber-500', iconColor: 'text-amber-400', iconBg: 'bg-amber-500/15',
    },
    {
      title: 'المرحلة 4: انتقال الدور',
      desc: 'فقط عندما يصل وقت المتسابق الأول إلى الصفر، ينتقل الدور بالكامل للمتسابق الثاني.',
      icon: Timer,
      borderColor: 'border-r-purple-500', iconColor: 'text-purple-400', iconBg: 'bg-purple-500/15',
    },
    {
      title: 'المرحلة 5: إعلان الفائز',
      desc: 'عند انتهاء وقت المتسابق الثاني، يفوز بالجولة من حصد أكبر عدد من الإجابات الصحيحة.',
      icon: Clock,
      borderColor: 'border-r-yellow-500', iconColor: 'text-yellow-400', iconBg: 'bg-yellow-500/15',
    },
  ]

  const handleClose = () => {
    setActiveTab('hub')
    closePopup()
  }

  const renderSteps = (steps: typeof blitzSteps) => (
    <div className="mt-4 flex flex-col gap-3 animate-in slide-in-from-right-4 duration-300">
      {steps.map((step, idx) => (
        <div key={idx} className={`group flex items-start gap-3 rounded-2xl border border-white/5 bg-[#0c1628]/60 p-3 border-r-4 ${step.borderColor} ${cardHoverStyle}`}>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${step.iconBg} transition-all duration-300`}>
            <step.icon className={`h-5 w-5 ${step.iconColor} transition-transform duration-300 group-hover:rotate-12`} />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-bold text-white">{step.title}</h4>
            <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[85vh] overflow-hidden flex flex-col gap-5 border-[#1e3a5f] bg-[#0f1f35] text-white sm:max-w-xl p-6">
        
        {/* Header - Sticky */}
        <div className="border-b border-white/5 shrink-0 relative">
          {activeTab !== 'hub' && (
            <button 
              onClick={() => setActiveTab('hub')}
              className="absolute right-6 top-6 rounded-full bg-white/5 p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
          
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#e63946]/20">
            <BookOpen className="h-7 w-7 text-[#e63946]" />
          </div>
          <DialogTitle className="text-center text-2xl font-black text-white">
            {activeTab === 'hub' ? 'اختر الطور للتعرف على القوانين' : (activeTab === 'blitz' ? 'قوانين: التناوب السريع' : 'قوانين: الماراثون الزمني')}
          </DialogTitle>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-hidden relative">
          
          {activeTab === 'hub' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-300">
              {/* Blitz Option */}
              <button
                onClick={() => setActiveTab('blitz')}
                className="group text-right flex items-center gap-4 rounded-2xl border-2 border-blue-500/30 bg-blue-500/5 p-5 transition-all hover:border-blue-500 hover:bg-blue-500/10 active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <PlayCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">[شرح] طور التناوب السريع</h3>
                  <p className="text-xs text-gray-400">نظام تنافسي سريع بتبادل الأدوار الفوري بين كل إجابة.</p>
                </div>
              </button>

              {/* Marathon Option */}
              <button
                onClick={() => setActiveTab('marathon')}
                className="group text-right flex items-center gap-4 rounded-2xl border-2 border-purple-500/30 bg-purple-500/5 p-5 transition-all hover:border-purple-500 hover:bg-purple-500/10 active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">[شرح] طور الماراثون الزمني</h3>
                  <p className="text-xs text-gray-400">تحدي متواصل للاعب لجمع أكبر عدد من النقاط في وقته.</p>
                </div>
              </button>

              {/* General Note */}
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                <Lightbulb className="h-5 w-5 shrink-0 text-yellow-400" />
                <p className="text-xs text-yellow-100/80 leading-relaxed">
                  ملاحظة هامة: الصور واللاعبون يتم اختيارهم عشوائياً بنظام ذكي يمنع التكرار في كلا الطورين.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'blitz' && renderSteps(blitzSteps)}
          {activeTab === 'marathon' && renderSteps(marathonSteps)}
          
        </div>

        {/* Footer Actions - Sticky */}
        <div className="border-t border-white/5 bg-[#0f1f35] shrink-0">
          <button
            onClick={() => activeTab === 'hub' ? handleClose() : setActiveTab('hub')}
            className="w-full rounded-xl bg-[#e63946] py-3 font-bold text-white transition-all duration-300 hover:bg-[#d32836] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#e63946]/20 cursor-pointer"
          >
            {activeTab === 'hub' ? 'إغلاق' : 'حسناً، فهمت! (العودة القائمة)'}
          </button>
        </div>

      </DialogContent>
    </Dialog>
  )
}
