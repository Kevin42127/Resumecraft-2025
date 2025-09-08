import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './performance.css'

// 字體優化 - 預載入並設定顯示策略
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: 'ResumeCraft｜專業履歷製作平台',
  description: '專業的履歷製作網站，支援多模板切換、即時預覽、PDF 匯出。使用 Next.js 與 Material Design 打造。',
  keywords: '履歷, 簡歷, 履歷製作, 履歷模板, PDF 履歷, 求職履歷',
  authors: [{ name: 'ResumeCraft Team' }],
  creator: 'ResumeCraft',
  publisher: 'ResumeCraft',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://resumecraft.com'),
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://resumecraft.com',
    title: 'ResumeCraft｜Beta 測試中',
    description: '專業的履歷製作網站，支援多模板切換、即時預覽、PDF 匯出。',
    siteName: 'ResumeCraft',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ResumeCraft｜Beta 測試中',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumeCraft｜Beta 測試中',
    description: '專業的履歷製作網站，支援多模板切換、即時預覽、PDF 匯出。',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/images/logo/favicon.ico',
    shortcut: '/images/logo/favicon.ico',
    apple: '/images/logo/favicon.ico',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
