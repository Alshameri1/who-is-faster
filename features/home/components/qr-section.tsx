'use client'

import { QRCodeSVG } from 'qrcode.react'

interface QrSectionProps {
  url: string
}

export function QrSection({ url }: QrSectionProps) {
  return (
    <div className="mt-6 flex flex-col items-center">
      <p className="mb-3 text-sm text-gray-400">امسح للوصول إلى لوحة النتائج</p>

      <div className="rounded-xl border-2 border-blue-500/30 bg-white p-4">
        {url ? (
          <QRCodeSVG
            value={url}
            size={200}
            level="H"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#0f1f35"
          />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        )}
      </div>

      <p className="mt-3 max-w-xs truncate text-center text-xs text-gray-500" dir="ltr">
        {url || 'جارٍ إنشاء الرابط...'}
      </p>
    </div>
  )
}