'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { Trophy, RotateCcw, Home, ArrowLeft } from 'lucide-react'
import type { GameSessionData } from '@/contexts/popup-context'
import { Button } from '@/components/button'

interface GameOverScreenProps {
  viewType?: 'game-over' | 'round-end'
  sessionData: GameSessionData
  team1Score: number // Overall score for game-over, or round score for round-end
  team2Score: number // Overall score for game-over, or round score for round-end
  onPlayAgain?: () => void // For game-over
  onNextRound?: () => void // For round-end
  currentRound?: number // For round-end
  winnerTeam?: 1 | 2 | 'tie' // For round-end
}

function getRoundNameArabic(round: number): string {
  const ordinals: Record<number, string> = {
    1: 'الأولى',
    2: 'الثانية',
    3: 'الثالثة',
    4: 'الرابعة',
    5: 'الخامسة',
    6: 'السادسة',
    7: 'السابعة',
    8: 'الثامنة',
    9: 'التاسعة',
    10: 'العاشرة',
  }
  return ordinals[round] || `الـ ${round}`
}

function formatImagesArabic(count: number): string {
  if (count === 1) return 'صورة واحدة'
  if (count === 2) return 'صورتين'
  if (count >= 3 && count <= 10) return `${count} صور`
  return `${count} صورة`
}

export function GameOverScreen({
  viewType = 'game-over',
  sessionData,
  team1Score,
  team2Score,
  onPlayAgain,
  onNextRound,
  currentRound,
  winnerTeam,
}: GameOverScreenProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  const isGameOver = viewType === 'game-over'
  const isRoundEnd = viewType === 'round-end'

  // Resolve winner
  const resolvedWinner = isRoundEnd ? (winnerTeam ?? 'tie') : (team1Score > team2Score ? 1 : 2)
  const isTie = resolvedWinner === 'tie'

  const winnerName = isTie
    ? 'تعادل'
    : resolvedWinner === 1
      ? sessionData.team1Data.name
      : sessionData.team2Data.name

  const glowColor = isTie
    ? 'rgba(234,179,8,0.5)'
    : resolvedWinner === 1
      ? 'rgba(34,211,238,0.5)'
      : 'rgba(248,113,113,0.5)'

  // Trigger confetti celebration
  const fireConfetti = useCallback(() => {
    const duration = 4000
    const animationEnd = Date.now() + duration
    const colors = isTie
      ? ['#fbbf24', '#f59e0b', '#d97706'] // Gold colors on tie
      : resolvedWinner === 1
        ? ['#22d3ee', '#06b6d4', '#0891b2'] // Cyan/Blue colors
        : ['#f87171', '#ef4444', '#dc2626'] // Red colors

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }

      const particleCount = 50 * (timeLeft / duration)

      // Shoot from left
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors,
        ticks: 60,
        gravity: 1.2,
        scalar: 1.2,
        drift: 0,
      })

      // Shoot from right
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors,
        ticks: 60,
        gravity: 1.2,
        scalar: 1.2,
        drift: 0,
      })
    }, 250)

    return () => clearInterval(interval)
  }, [resolvedWinner, isTie])

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true)
      fireConfetti()
    }, 100)

    return () => clearTimeout(timer)
  }, [fireConfetti])

  const handleGoHome = useCallback(() => {
    router.push('/')
  }, [router])

  // Resolve Round-End Announcements
  const scoreDiff = Math.abs(team1Score - team2Score)
  const currentRoundArabic = currentRound ? getRoundNameArabic(currentRound) : ''
  const nextRoundArabic = currentRound ? getRoundNameArabic(currentRound + 1) : ''
  const diffText = formatImagesArabic(scoreDiff)

  let roundAnnouncement = ''
  let upcomingAnnouncement = ''

  if (isRoundEnd) {
    if (isTie) {
      roundAnnouncement = `تعادلت الكفتان في الجولة ${currentRoundArabic} بمجموع ${team1Score} صورة لكل فريق!`
      upcomingAnnouncement = currentRound && currentRound >= sessionData.rounds
        ? 'استعد للجولة الحاسمة الفاصلة لكسر التعادل!'
        : `استعد للجولة القادمة (${nextRoundArabic}) لكسر التعادل!`
    } else {
      const teamColorText = resolvedWinner === 1 ? 'الأزرق' : 'الأحمر'
      roundAnnouncement = `الفريق ${teamColorText} (${winnerName}) يفوز بالجولة ${currentRoundArabic} بفارق ${diffText}!`
      upcomingAnnouncement = currentRound && currentRound >= sessionData.rounds
        ? 'استعد لمعرفة الفائز النهائي باللقب!'
        : `استعد للجولة القادمة (${nextRoundArabic})!`
    }
  }

  // Cards layout border highlights
  const border1 = isTie
    ? 'bg-cyan-500/5 border border-cyan-400/20 opacity-60'
    : resolvedWinner === 1
      ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]'
      : 'bg-cyan-500/5 border border-cyan-400/20 opacity-60'

  const border2 = isTie
    ? 'bg-red-500/5 border border-red-500/20 opacity-60'
    : resolvedWinner === 2
      ? 'bg-red-500/20 border-2 border-red-400 shadow-[0_0_30px_rgba(248,113,113,0.4)]'
      : 'bg-red-500/5 border border-red-400/20 opacity-60'

  // If tie and round-end, style both with yellow/golden hues
  const finalBorder1 = isRoundEnd && isTie 
    ? 'bg-yellow-500/20 border-2 border-yellow-500 shadow-[0_0_30px_rgba(251,191,36,0.3)]' 
    : border1
  const finalBorder2 = isRoundEnd && isTie 
    ? 'bg-yellow-500/20 border-2 border-yellow-500 shadow-[0_0_30px_rgba(251,191,36,0.3)]' 
    : border2

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c1628] overflow-hidden" dir="rtl">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          }}
        />
        
        {/* Floating particles */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-pulse ${
              isTie
                ? 'bg-yellow-400/40'
                : resolvedWinner === 1
                  ? 'bg-cyan-400/40'
                  : 'bg-red-400/40'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div
        className={`relative text-center px-6 transform transition-all duration-1000 ease-out max-w-2xl w-full ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        {/* Celebration badge */}
        <div className="mb-6">
          <span className={`inline-block px-6 py-2 rounded-full font-bold text-lg animate-pulse ${
            isTie
              ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
              : resolvedWinner === 1
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                : 'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}>
            {isGameOver ? 'انتهت المباراة' : isTie ? 'تعادل الجولة!' : 'نهاية الجولة'}
          </span>
        </div>

        {/* Trophy / Scale */}
        <div className="relative mb-8">
          <div 
            className={`text-8xl md:text-9xl mx-auto flex items-center justify-center`}
            style={{
              filter: `drop-shadow(0 0 30px ${glowColor})`,
            }}
          >
            {isTie ? '⚖️' : '🏆'}
          </div>
          {/* Animated rings */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
            <div 
              className={`w-40 h-40 md:w-48 md:h-48 rounded-full border-4 ${
                isTie
                  ? 'border-yellow-400/30'
                  : resolvedWinner === 1
                    ? 'border-cyan-400/30'
                    : 'border-red-400/30'
              } animate-ping`}
            />
          </div>
        </div>

        {/* Dynamic Typography / Announcements */}
        {isRoundEnd ? (
          <div className="mb-8 px-4">
            <h1 
              className="text-2xl md:text-3xl font-black text-white mb-3 leading-relaxed"
              style={{ textShadow: `0 0 20px ${glowColor}` }}
            >
              {roundAnnouncement}
            </h1>
            <p className="text-base md:text-lg text-yellow-400 font-bold animate-pulse">
              {upcomingAnnouncement}
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl text-white/80 mb-2">
              مبروك الفوز لـ
            </h1>
            <p 
              className={`text-5xl md:text-7xl font-black mb-8 ${
                resolvedWinner === 1 ? 'text-cyan-400' : 'text-red-400'
              }`}
              style={{ textShadow: `0 0 50px ${glowColor}` }}
            >
              {winnerName}
            </p>
          </>
        )}

        {/* Dynamic VS Combat Scoreboard */}
        <div className="flex items-center justify-center gap-6 md:gap-8 mb-10">
          {/* Team 2 Card (renders on the RIGHT visually under RTL) */}
          <div className={`text-center px-6 py-4 md:px-8 md:py-5 rounded-2xl transition-all duration-500 min-w-[120px] md:min-w-[150px] ${finalBorder2}`}>
            <p className="text-red-400 text-xs md:text-sm font-bold mb-1">{sessionData.team2Data.name}</p>
            <p className="text-4xl md:text-5xl font-black text-white">{team2Score}</p>
            <p className="text-[10px] md:text-xs text-white/50 mt-1">{isRoundEnd ? 'صور صحيحة' : 'جولات فوز'}</p>
          </div>
          
          {/* Premium VS Separator */}
          <div className="text-yellow-400 text-2xl md:text-3xl font-black italic tracking-wider animate-pulse">VS</div>

          {/* Team 1 Card (renders on the LEFT visually under RTL) */}
          <div className={`text-center px-6 py-4 md:px-8 md:py-5 rounded-2xl transition-all duration-500 min-w-[120px] md:min-w-[150px] ${finalBorder1}`}>
            <p className="text-cyan-400 text-xs md:text-sm font-bold mb-1">{sessionData.team1Data.name}</p>
            <p className="text-4xl md:text-5xl font-black text-white">{team1Score}</p>
            <p className="text-[10px] md:text-xs text-white/50 mt-1">{isRoundEnd ? 'صور صحيحة' : 'جولات فوز'}</p>
          </div>
        </div>

        {/* Dynamic Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isRoundEnd ? (
            <Button
              onClick={onNextRound}
              className={`flex items-center justify-center gap-3 px-12 py-4.5 rounded-full font-bold text-xl md:text-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl ${
                isTie
                  ? 'bg-linear-to-r from-yellow-500 to-amber-500 text-white shadow-yellow-500/30'
                  : resolvedWinner === 1
                    ? 'bg-linear-to-r from-cyan-500 to-cyan-400 text-white shadow-cyan-500/30'
                    : 'bg-linear-to-r from-red-500 to-red-400 text-white shadow-red-500/30'
              }`}
              icon={ArrowLeft}
              text="الجولة التالية"
            />
          ) : (
            <>
              <Button
                onClick={onPlayAgain}
                className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                  resolvedWinner === 1 
                    ? 'bg-linear-to-r from-cyan-500 to-cyan-400 text-white shadow-cyan-500/30'
                    : 'bg-linear-to-r from-red-500 to-red-400 text-white shadow-red-500/30'
                }`}
                icon={RotateCcw}
                text="إعادة اللعب"
              />
              
              <Button
                onClick={handleGoHome}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                icon={Home}
                text="الصفحة الرئيسية"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
