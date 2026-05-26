import { ResultPanelClient } from '@/features/result-panel/page'
import { getGameSessionAction } from '@/lib/redis-actions'
import { Metadata } from 'next'
import { ErrorBoundary } from '@/components/error-boundary'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `لوحة النتائج - ${id}`,
    description: 'شاشة عرض نتائج التحدي في الوقت الفعلي',
  }
}

export default async function ResultPanelPage({ params }: Props) {
  const { id } = await params
  
  // Cache-first session fetch on server
  const initialSession = await getGameSessionAction(id)
  
  return (
    <ErrorBoundary>
      <ResultPanelClient gameId={id} initialSession={initialSession} />
    </ErrorBoundary>
  )
}
