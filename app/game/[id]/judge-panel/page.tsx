import { Metadata } from 'next'
import { JudgePanelClient } from './judge-panel-client'

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
  return <JudgePanelClient gameId={id} />
}
