import { ReactNode } from 'react'
import { Navbar } from '@/components/landing/navbar'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession();
  if (!session) {
    return redirect("/login");
  }
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
