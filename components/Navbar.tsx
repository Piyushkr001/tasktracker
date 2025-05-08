'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ThemeSwitcher } from './ThemeSwitcher'
import { verifyTokenClient } from '@/lib/auth-client' // client-side token verifier

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsSignedIn(!!token && verifyTokenClient(token))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsSignedIn(false)
    router.push('/')
  }

  const handleLogin = () => {
    router.push('/sign-in?redirect_url=/dashboard')
  }

  const handleSignup = () => {
    router.push('/sign-up?redirect_url=/dashboard')
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-tr from-slate-500 via-zinc-400 to-neutral-700 dark:from-slate-900 dark:via-zinc-800 dark:to-neutral-900 border-b shadow-md px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          <Image src="/images/logo/logo.svg" alt="Logo" width={160} height={50} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
            >
              {link.label}
            </Link>
          ))}
          <ThemeSwitcher />
          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleLogin}>
                  Login
                </Button>
                <Button onClick={handleSignup}>Sign Up</Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 mt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <ThemeSwitcher />
          {isSignedIn ? (
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button variant="outline" className="w-full" onClick={handleLogin}>
                Login
              </Button>
              <Button className="w-full" onClick={handleSignup}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
