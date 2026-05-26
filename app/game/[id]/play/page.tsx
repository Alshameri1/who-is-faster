import type { Metadata } from 'next'
import { GamePlayClient } from '../../../../features/game/[id]/play/game-play-client'
import { redis } from '@/lib/redis'
import { ErrorBoundary } from '@/components/error-boundary'

export const metadata: Metadata = {
  title: 'من الأسرع - اللعب',
  description: 'ابدأ التحدي الآن!',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function GamePlayPage({ params }: PageProps) {
  const { id } = await params
  redis.set('aHEMD', 'ahedm')
  return (
    <ErrorBoundary>
      <GamePlayClient gameId={id} />
    </ErrorBoundary>
  )
}
