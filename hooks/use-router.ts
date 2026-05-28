import { useRouter as useNextRouter } from 'next/navigation'
import { triggerLoader } from '@/components/NavigationLoader'

/**
 * A custom wrapper around Next.js App Router's useRouter
 * Automatically triggers the global NavigationLoader on push/replace
 */
export function useRouter() {
  const router = useNextRouter()

  return {
    ...router,
    push: (href: string, options?: any) => {
      triggerLoader()
      router.push(href, options)
    },
    replace: (href: string, options?: any) => {
      triggerLoader()
      router.replace(href, options)
    }
  }
}
