'use client'

import { ReactNode } from 'react'
import { Navbar } from '@/components/landing/navbar'

export default function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
    </div>
  )
}
