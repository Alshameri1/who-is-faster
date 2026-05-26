import type { Metadata } from 'next'
import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from 'sonner'
import NavigationLoader from '@/components/NavigationLoader'
import { Suspense } from 'react'

const ibm_plex_sans_arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['100', '200', '300','400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans-arabic',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'من الأسرع - تحدي السرعة',
  description: 'تحدي السرعة - من سيكون الأسرع؟',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${ibm_plex_sans_arabic.variable} font-sans antialiased`}>
        {children}
        <Suspense fallback={null}>
          <NavigationLoader />
        </Suspense>
        <Toaster
              position="top-center"
              dir="rtl"
              toastOptions={{
                  style: {
                      background: '#0f1f35',
                      border: '1px solid #1e3a5f',
                      color: '#fff',
                  },
              }}
          />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
