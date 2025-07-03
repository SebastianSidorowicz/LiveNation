import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LiveNation',
  description: 'Sistema de tickets y eventos de LiveNation',
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
