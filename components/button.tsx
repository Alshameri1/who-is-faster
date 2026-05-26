import { LucideIcon } from 'lucide-react'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string
    icon?: LucideIcon
    isFullWidth?: boolean
    iconClassName?: string
}

export function Button({ text, icon: Icon, isFullWidth = false, iconClassName = "", className, ...props}: ButtonProps) {

    return (
        <button
            {...props}
            className={`
                group relative overflow-hidden rounded-xl px-6 py-3.5 font-bold text-white shadow-lg 
                transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]
                cursor-pointer
                ${isFullWidth ? 'w-full text-xl sm:text-2xl py-4' : 'text-lg sm:text-xl'}
                ${className}
            `}
        >
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <span className="relative flex items-center justify-center gap-3">
                {text && text}
                {Icon && <Icon className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 ${iconClassName}`} />}
            </span>
        </button>
    )
}