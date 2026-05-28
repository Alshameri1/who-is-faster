'use client'

import { useEffect, useState } from 'react'

interface RoundIntroProps {
  roundNumber: number
  totalRounds: number
  onComplete: () => void
}

export function RoundIntro({ roundNumber, totalRounds, onComplete }: RoundIntroProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const showTimer = setTimeout(() => setIsVisible(true), 100)

    // Start exit animation after 2 seconds
    const exitTimer = setTimeout(() => setIsExiting(true), 2000)

    // Complete after 2.5 seconds
    const completeTimer = setTimeout(() => onComplete(), 2500)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  // Convert number to Arabic numeral
  const arabicNumerals = ['0', "1", "2", '3', '4', '5', '6', '7', '8', '9']
  const toArabicNumeral = (num: number): string => {
    return num.toString().split('').map(d => arabicNumerals[parseInt(d)]).join('')
  }

  return (
    <div className="h-full flex items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div
        className={`text-center transform transition-all duration-700 ease-out ${
          isVisible && !isExiting
            ? 'opacity-100 scale-100'
            : isExiting
            ? 'opacity-0 scale-110'
            : 'opacity-0 scale-75'
        }`}
      >
        {/* Round indicator badge */}
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/60 text-sm font-medium">
            {toArabicNumeral(roundNumber)} من {toArabicNumeral(totalRounds)}
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-b from-white via-blue-200 to-blue-500 mb-4 drop-shadow-2xl">
          الجولة
        </h1>

        {/* Round number with special styling */}
        <div>
          <span className="text-[10rem] md:text-[14rem] font-black text-blue-500 leading-none">
            {toArabicNumeral(roundNumber)}
          </span>
        </div>
      </div>
    </div>
  )
}
