'use client'

import { useEffect, useState } from 'react'

interface RoundWinnerOverlayProps {
  winnerName: string | null
  winnerTeam: 1 | 2 | 'tie'
  onComplete: () => void
}

export function RoundWinnerOverlay({ winnerName, winnerTeam, onComplete }: RoundWinnerOverlayProps) {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter')

  useEffect(() => {
    // Enter animation
    const enterTimer = setTimeout(() => setPhase('show'), 100)
    return () => clearTimeout(enterTimer)
  }, [])

  const handleContinue = () => {
    setPhase('exit')
    setTimeout(onComplete, 500)
  }

  const isTie = winnerTeam === 'tie'
  const isTeam1 = winnerTeam === 1
  const glowColor = isTie ? 'rgba(234,179,8,0.5)' : isTeam1 ? 'rgba(34,211,238,0.5)' : 'rgba(248,113,113,0.5)'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c1628] overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 rounded-full animate-pulse ${
              isTie ? 'bg-yellow-400/30' : isTeam1 ? 'bg-cyan-400/30' : 'bg-red-400/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Radial glow background */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
          phase === 'show' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-linear(circle at center, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Main content */}
      <div
        className={`relative text-center transform transition-all duration-700 ease-out flex flex-col items-center ${
          phase === 'enter'
            ? 'opacity-0 scale-50'
            : phase === 'show'
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-110'
        }`}
      >
        {/* Trophy icon */}
        <div 
          className={`text-8xl md:text-9xl mb-6 ${
            phase === 'show' ? 'animate-bounce' : ''
          }`}
        >
          {isTie ? '⚖️' : '🏆'}
        </div>

        {/* Winner text */}
        <h2 
          className="text-3xl md:text-5xl font-black text-white mb-4"
          style={{ textShadow: `0 0 30px ${glowColor}` }}
        >
          {isTie ? 'نهاية الجولة' : 'فاز'}
        </h2>
        
        <p 
          className={`text-5xl md:text-7xl font-black mb-6 ${
            isTie ? 'text-yellow-400' : isTeam1 ? 'text-cyan-400' : 'text-red-400'
          }`}
          style={{ textShadow: `0 0 40px ${glowColor}` }}
        >
          {isTie ? 'تعادل' : winnerName}
        </p>

        <p className="text-xl md:text-2xl text-white/70 mb-12">
          {isTie ? 'لا توجد نقاط لهذه الجولة' : 'بهذه الجولة!'}
        </p>

        <button
          onClick={handleContinue}
          className="px-10 py-4 bg-white text-black font-bold text-2xl rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-white/20"
        >
          الجولة التالية
        </button>

        {/* Decorative lines */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div 
            className={`h-1 transition-all duration-700 rounded-full ${
              isTie ? 'bg-linear-to-r from-transparent to-yellow-400' : isTeam1 ? 'bg-linear-to-r from-transparent to-cyan-400' : 'bg-linear-to-r from-transparent to-red-400'
            } ${phase === 'show' ? 'w-24' : 'w-0'}`}
          />
          <div className={`w-3 h-3 rounded-full ${isTie ? 'bg-yellow-400' : isTeam1 ? 'bg-cyan-400' : 'bg-red-400'} animate-pulse`} />
          <div 
            className={`h-1 transition-all duration-700 rounded-full ${
              isTie ? 'bg-linear-to-l from-transparent to-yellow-400' : isTeam1 ? 'bg-linear-to-l from-transparent to-cyan-400' : 'bg-linear-to-l from-transparent to-red-400'
            } ${phase === 'show' ? 'w-24' : 'w-0'}`}
          />
        </div>
      </div>
    </div>
  )
}
