"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

export function Navbar() {
  const { status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter();
  const isLoggedIn = status === "authenticated";

  function navigate(path : string) {
    router.push(path)
  }

  function handleAuthAction() {
    if (isLoggedIn) {
      signOut({ callbackUrl: "/" });
      return;
    }
    navigate('/login');
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Play className="size-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            muuzHub
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </a>
          <a href="#stats" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Community
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={handleAuthAction}>
            {isLoggedIn ? 'Logout' : 'Log in'}
          </Button>
          {
            !isLoggedIn && (
              <Button size="sm" className="font-semibold" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            )
          }
        </div>

        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="size-5 text-foreground" />
          ) : (
            <Menu className="size-5 text-foreground" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#features" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
              How It Works
            </a>
            <a href="#stats" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
              Community
            </a>
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleAuthAction}>
                {isLoggedIn ? 'Logout' : 'Log in'}
              </Button>
              {
                !isLoggedIn && (
                  <Button size="sm" className="font-semibold" onClick={() => navigate('/signup')}>
                    Get Started
                  </Button>
                )
              }
            </div>
          </div>
        </div>
      )}
    </header>
  )
}