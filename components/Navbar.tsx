'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, LogOut, LogIn, UserPlus, LayoutDashboard, Home, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRouter, usePathname } from 'next/navigation'
import { ThemeSwitcher } from './ThemeSwitcher'
import { verifyTokenClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/profile', icon: User },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsSignedIn(!!token && verifyTokenClient(token))
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    // Clear server-side HttpOnly cookie
    await fetch('/api/users/logout', { method: 'POST' }).catch(() => {})
    // Clear client-side token and non-HttpOnly cookie
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; max-age=0'
    setIsSignedIn(false)
    router.push('/')
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/70 dark:border-zinc-800/70 shadow-sm shadow-zinc-200/50 dark:shadow-zinc-900/50'
          : 'bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md border-b border-transparent'
      )}
    >
      {/* Subtle top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image src="/images/logo/logo.svg" alt="Logo" width={220} height={220} className='h-20 w-auto dark:hidden' />
            <Image src="/images/logo/logo_dark.svg" alt="Logo" width={220} height={220} className='h-20 w-auto hidden dark:block' />
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* ── Desktop Right: Theme + Auth ── */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeSwitcher />

            <Separator orientation="vertical" className="h-5 mx-1 bg-zinc-200 dark:bg-zinc-700" />

            {isSignedIn ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors rounded-lg px-3"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/sign-in?redirect_url=/dashboard')}
                  className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg px-3 transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push('/sign-up')}
                  className="flex items-center gap-1.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 border-0 px-4 transition-all active:scale-95"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* ── Mobile: Theme + Hamburger ── */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeSwitcher />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen
                ? <X className="h-5 w-5" />
                : <Menu className="h-5 w-5" />
              }
            </Button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-zinc-200/70 dark:border-zinc-800/70 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-4 py-4 space-y-1">

          {/* Mobile nav links */}
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            {isSignedIn ? (
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 justify-center text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 justify-center rounded-xl border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  onClick={() => router.push('/sign-in?redirect_url=/dashboard')}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
                <Button
                  className="w-full flex items-center gap-2 justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-md shadow-indigo-500/20 border-0 transition-all"
                  onClick={() => router.push('/sign-up')}
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
