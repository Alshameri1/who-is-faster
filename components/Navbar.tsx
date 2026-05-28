'use client'

import Link from 'next/link'
import { Menu, Home, Settings, BookOpen, Zap } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'

interface NavbarProps {
  onMenuToggle?: () => void
}

interface NavItem {
  id: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  ariaLabel: string
  showLabel: boolean
  colorClass: string
}

const navItems: NavItem[] = [
  {
    id: 'home',
    href: '/',
    icon: Home,
    label: 'الرئيسية',
    ariaLabel: 'الذهاب إلى الصفحة الرئيسية للتحدي',
    showLabel: true,
    colorClass: 'text-blue-400',
  },
  {
    id: 'settings',
    href: '/?modal=settings',
    icon: Settings,
    label: 'الإعدادات',
    ariaLabel: 'عرض إعدادات التحدي في نافذة جديدة',
    showLabel: false,
    colorClass: 'text-yellow-400',
  },
  {
    id: 'info',
    href: '/?modal=info',
    icon: BookOpen,
    label: 'شرح التحدّي',
    ariaLabel: 'قراءة قواعد وقوانين التحدي في نافذة جديدة',
    showLabel: false,
    colorClass: 'text-red-400',
  },
]

export function Navbar({ onMenuToggle }: NavbarProps) {
  const pathname = usePathname()
  const isGamePage = pathname?.includes('/game/') && pathname?.includes('/play')

  const renderNavLink = (item: NavItem) => {
    const Icon = item.icon
    return (
      <Link
        key={item.id}
        href={item.href}
        aria-label={item.ariaLabel}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 hover:bg-slate-800 transition-colors duration-150 ease-in-out"
      >
        <Icon className={`h-4 w-4 ${item.colorClass}`} />
        {item.showLabel && <span className="hidden sm:inline">{item.label}</span>}
      </Link>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#0f1f35]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 text-white select-none">
      {/* Logo / Brand Name (Right aligned in RTL) */}
      <Link 
        href="/" 
        aria-label="الذهاب إلى الصفحة الرئيسية للتحدي" 
        className="flex items-center gap-2 hover:bg-slate-800 rounded-xl px-2 py-1 transition-colors duration-150 ease-in-out"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
          <Zap className="h-5 w-5 fill-blue-400" />
        </div>
        <span className="text-xl font-extrabold italic">
          <span className="text-red-500">من</span>{" "}
          <span className="text-blue-500">الأسرع؟</span>
        </span>
      </Link>

      {/* Action Controls (Left aligned in RTL) */}
      <div className="flex items-center gap-3">
        {isGamePage && onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="rounded-xl border border-white/20 bg-white/10 p-2.5 hover:bg-slate-800 transition-colors duration-150 ease-in-out cursor-pointer"
            aria-label="فتح قائمة الإيقاف المؤقت للعب"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>
        )}

        {!isGamePage && (
          <>
            {navItems.map(renderNavLink)}
          </>
        )}
      </div>
    </nav>
  )
}
