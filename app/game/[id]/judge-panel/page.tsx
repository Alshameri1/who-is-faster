// ─── app/game/[id]/judge-panel/page.tsx

import { Metadata } from 'next'
import { JudgePanel } from '@/features/judge-panel/components'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `لوحة التحكيم - ${id}`,
    description: 'شاشة عرض الإجابات للمحكم في الوقت الفعلي',
  }
}

export default async function JudgePanelPage({ params }: Props) {
  const { id } = await params
  return <JudgePanel gameId={id} />
}
