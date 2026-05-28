'use client'

import { Settings, BookOpen, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PopupType, usePopup } from '@/contexts/popup-context'
import { Button } from '@/components/button'

export default function ButtonsSection() {
    const { openPopup } = usePopup()
    const router = useRouter()
    
    function handleClick (e: React.MouseEvent<HTMLButtonElement>, type: PopupType) {
        e.stopPropagation()
        if (type === 'setup') {
            router.push('/setup')
        } else {
            openPopup(type)
        }
    }
    
    return (
        <div className="flex w-full max-w-lg flex-col items-center gap-4 px-4 relative top-50">
            <Button 
                text="إبدأ التحدّي"
                icon={ArrowLeft}
                isFullWidth={true}
                onClick={(e) => handleClick(e, 'setup')} 
                iconClassName="group-hover:-translate-x-1"
                className="bg-blue-500 hover:bg-blue-600 shadow-blue-500/30 hover:shadow-blue-600/40"
            />
    
            <div className="flex w-full gap-4">
                <Button 
                    text="الإعدادات"
                    icon={Settings}
                    onClick={(e) => handleClick(e, 'settings')}
                    iconClassName="group-hover:rotate-90"
                    className="bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/30 hover:shadow-yellow-600/40 w-full"
                />
    
                <Button 
                    text="شرح التحدّي"
                    icon={BookOpen}
                    onClick={(e) => handleClick(e, 'info')}
                    iconClassName="group-hover:scale-110"
                    className="bg-red-500 hover:bg-red-600 shadow-red-500/30 hover:red-600/40 w-full"
                />
            </div>
        </div>
    )
}