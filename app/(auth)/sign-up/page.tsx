'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import Script from 'next/script'
import { Eye, EyeOff } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', country: '' })
  const [showPassword, setShowPassword] = useState(false)
  const googleBtnRef = useRef<HTMLDivElement>(null)

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  // ── Already logged in guard ───────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      toast.success('You are already signed in.', {
        duration: 3000,
      })
      router.replace('/dashboard')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setAuthToken = (token: string) => {
    localStorage.setItem('token', token)
    // Also set a cookie so Next.js middleware can read it server-side
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
  }

  const handleGoogleLogin = async (response: any) => {
    try {
      const res = await axios.post('/api/users/google-login', { idToken: response.credential })
      setAuthToken(res.data.token)
      toast.success('Signup successful')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Google signup failed')
    }
  }

  useEffect(() => {
    if (!clientId) return

    const initializeGoogle = () => {
      const g = (window as any).google
      if (g) {
        g.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleLogin,
        })
        if (googleBtnRef.current) {
          g.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: googleBtnRef.current.clientWidth || 360,
          })
        }
      }
    }

    if ((window as any).google) {
      initializeGoogle()
    } else {
      const checkInterval = setInterval(() => {
        if ((window as any).google) {
          initializeGoogle()
          clearInterval(checkInterval)
        }
      }, 100)
      return () => clearInterval(checkInterval)
    }
  }, [clientId])

  const handleGoogleFallbackClick = () => {
    toast.error('Google Client ID is not configured. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env file.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/users/signup', form)
      toast.success('Account created!')
      router.push('/sign-in?redirect_url=/dashboard')
    } catch {
      toast.error('Signup failed')
    }
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-zinc-50 dark:bg-zinc-950 font-sans">
        
        {/* Left Side Panel - Features & Visuals */}
        <div className="hidden lg:flex lg:col-span-5 relative overflow-hidden bg-zinc-950 border-r border-zinc-800 flex-col justify-between p-12 text-white">
          {/* Animated/Glowing Blur Background Blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-600/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-purple-500/25 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-[40%] left-[20%] w-[200px] h-[200px] rounded-full bg-pink-500/10 blur-[80px] animate-pulse" style={{ animationDuration: '6s' }} />

          {/* Header */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              TaskTracker
            </span>
          </div>

          {/* Center Copy */}
          <div className="relative z-10 my-auto space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent">
              Join TaskTracker. <br />
              Organize everything.
            </h1>
            <p className="text-zinc-400 text-lg max-w-md font-light leading-relaxed">
              Create a free account in seconds and unlock features built for modern development teams.
            </p>

            {/* Micro Feature Bullet Points */}
            <div className="space-y-4 pt-6">
              {[
                { title: 'Create & Manage Projects', desc: 'Separate boards for different repositories and features.' },
                { title: 'Track Task Statuses', desc: 'Easily transition tasks between Todo, In-Progress, and Done.' },
                { title: 'Neon Database Tech', desc: 'Secure serverless storage with instant queries and high availability.' }
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-3 items-start group">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-indigo-400 group-hover:border-indigo-500 group-hover:text-indigo-300 transition-colors">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{feature.title}</h4>
                    <p className="text-xs text-zinc-400 font-light">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Card */}
          <div className="relative z-10 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-5 rounded-2xl shadow-2xl">
            <p className="text-sm text-zinc-300 italic">
              "TaskTracker has completely transformed how our team keeps track of tasks. Moving to this from our legacy tools was seamless."
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                JD
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">Jane Doe</p>
                <p className="text-[10px] text-zinc-400">Lead Project Manager</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Panel - The Auth Form */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center px-6 py-12 md:px-12 relative overflow-hidden bg-white dark:bg-zinc-950">
          {/* Subtle responsive background elements */}
          <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-indigo-500/10 blur-[80px]" />
          <div className="lg:hidden absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-purple-500/10 blur-[80px]" />

          {/* Header for Mobile only */}
          <div className="lg:hidden flex items-center gap-2 mb-8 absolute top-8 left-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              TaskTracker
            </span>
          </div>

          <div className="w-full max-w-md space-y-6 relative z-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Create an account
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Fill in the details below to register your team profile.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Full Name</Label>
                  <Input 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="John Doe"
                    className="w-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="country" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Country</Label>
                  <Input 
                    name="country" 
                    value={form.country} 
                    onChange={handleChange} 
                    required 
                    placeholder="United States"
                    className="w-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Email Address</Label>
                <Input 
                  name="email" 
                  type="email"
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="name@example.com"
                  className="w-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    required 
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-2.5 mt-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-lg shadow-lg hover:shadow-zinc-500/10 active:scale-[0.99] transition-all cursor-pointer flex justify-center items-center"
              >
                Sign Up
              </Button>

              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                </div>
                <span className="relative bg-white dark:bg-zinc-950 px-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                  Or continue with
                </span>
              </div>

              {clientId ? (
                <div className="w-full flex justify-center min-h-[44px] relative">
                  <div ref={googleBtnRef} className="w-full flex justify-center transition-opacity hover:opacity-95" />
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleFallbackClick}
                  className="w-full py-2.5 flex items-center justify-center gap-2.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#4285F4"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              )}

              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6 pt-2">
                Already have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push('/sign-in')}
                  className="p-0 h-auto font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  Sign In
                </Button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
