import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'المفتش - نظام إدارة التفتيش',
  description: 'نظام إدارة التفتيش والمتابعة',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
