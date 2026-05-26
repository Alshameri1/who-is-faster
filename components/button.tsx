import { LucideIcon } from 'lucide-react'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string
    icon?: LucideIcon
    isFullWidth?: boolean
    iconClassName?: string
    isPending?: boolean
}

export function Button({ 
    text, 
    icon: Icon, 
    isFullWidth = false, 
    iconClassName = "", 
    className, 
    isPending = false,
    disabled,
    ...props
}: ButtonProps) {

    return (
        <button
            {...props}
            disabled={disabled || isPending}
            className={`
                group relative overflow-hidden rounded-xl px-6 py-3.5 font-bold text-white shadow-lg 
                transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]
                cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:scale-100
                ${isFullWidth ? 'w-full text-xl sm:text-2xl py-4' : 'text-lg sm:text-xl'}
                ${className}
            `}
        >
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <span className="relative flex items-center justify-center gap-3">
                {isPending && (
                    <svg className="animate-spin h-5 w-5 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {isPending || text && (
                    <span>
                        {isPending ? 'جاري الإعداد...' : text}
                    </span>
                )}
                {!isPending && Icon && <Icon className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 ${iconClassName}`} />}
            </span>
        </button>
    )
}