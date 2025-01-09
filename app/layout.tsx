'use client';

import '@/app/globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from '@/app/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen bg-gradient-to-br from-teal-600 to-light-blue-600">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}