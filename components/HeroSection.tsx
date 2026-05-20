'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, Zap, Shield, BarChart3, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

const FEATURES = [
  { icon: Zap, label: 'Lightning Fast' },
  { icon: Shield, label: 'Secure by Default' },
  { icon: BarChart3, label: 'Real-time Analytics' },
]

const STATS = [
  { value: '10k+', label: 'Active Users' },
  { value: '50k+', label: 'Tasks Completed' },
  { value: '99.9%', label: 'Uptime' },
]

const HeroSection: FC = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center px-4 md:px-12 py-20">
      
      {/* ─── Background Gradient Mesh ─── */}
      {/* Light mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950 transition-colors duration-500" />

      {/* Decorative glowing orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-400/20 dark:bg-indigo-600/15 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-400/20 dark:bg-purple-700/15 blur-[120px] animate-pulse" style={{ animationDuration: '5s' }} />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-pink-300/15 dark:bg-pink-700/10 blur-[100px] animate-pulse" style={{ animationDuration: '7s' }} />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* ─── Main Content ─── */}
      <div className="relative z-10 max-w-7xl w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

        {/* ── Left: Text Block ── */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">

          {/* Badge pill */}
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide uppercase shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-indigo-400" />
            </span>
            Now live — TaskTracker v2.0
          </Badge>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight text-zinc-900 dark:text-white">
              Manage Tasks.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Ship Faster.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-lg font-light leading-relaxed">
              TaskTracker gives your team a single source of truth — beautifully organised projects, real-time task updates, and instant collaboration.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
            <Link href="/sign-in?redirect_url=/dashboard" passHref>
              <Button
                size="lg"
                className="group relative w-full sm:w-auto px-8 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 dark:from-indigo-500 dark:to-purple-500 text-white shadow-xl shadow-indigo-500/25 dark:shadow-indigo-700/30 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all duration-200 border-0"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/learn-more" passHref>
              <Button
                variant="outline"
                size="lg"
                className="group w-full sm:w-auto px-8 py-3 text-base font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 backdrop-blur-sm shadow-sm active:scale-[0.98] transition-all duration-200"
              >
                See how it works
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 shadow-sm backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                {label}
              </div>
            ))}
          </div>

          {/* Social proof row */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex -space-x-2">
              {['A', 'B', 'C', 'D'].map((l) => (
                <div
                  key={l}
                  className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-900 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white"
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Trusted by <span className="font-semibold text-zinc-700 dark:text-zinc-200">10,000+</span> developers
            </p>
          </div>
        </div>

        {/* ── Right: Visual Card Stack ── */}
        <div className="flex-1 relative flex justify-center items-center w-full max-w-xl lg:max-w-none">
          
          {/* Main card */}
          <div className="relative w-full max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-700/60 rounded-3xl shadow-2xl shadow-zinc-200/50 dark:shadow-zinc-900/80 p-6 space-y-5">
            
            {/* Card header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Sprint Overview</p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">May 2025 · Week 3</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                On Track
              </Badge>
            </div>

            {/* Progress bars */}
            <div className="space-y-3">
              {[
                { label: 'Frontend', pct: 82, color: 'from-indigo-500 to-indigo-400' },
                { label: 'API Integration', pct: 65, color: 'from-purple-500 to-purple-400' },
                { label: 'Database', pct: 91, color: 'from-pink-500 to-rose-400' },
              ].map(({ label, pct, color }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Task list */}
            <div className="space-y-2 pt-1">
              {[
                { task: 'Design auth flow', done: true },
                { task: 'Set up Neon DB schema', done: true },
                { task: 'Build dashboard layout', done: false },
              ].map(({ task, done }) => (
                <div key={task} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 ${done ? 'text-indigo-500 dark:text-indigo-400' : 'text-zinc-300 dark:text-zinc-600'}`}
                  />
                  <span className={done ? 'text-zinc-500 dark:text-zinc-400 line-through' : 'text-zinc-700 dark:text-zinc-200 font-medium'}>
                    {task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating stat cards */}
          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 px-4 py-3 flex items-center gap-3 backdrop-blur-sm">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shadow">
              ✓
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">24 Tasks Done</p>
              <p className="text-[11px] text-zinc-400">↑ 12% this week</p>
            </div>
          </div>

          <div className="absolute -top-6 -right-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 px-4 py-3 backdrop-blur-sm">
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wide">Team Velocity</p>
            <p className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              98 pts
            </p>
          </div>
        </div>
      </div>

      {/* ─── Stats Bar ─── */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-100 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-4 sm:gap-0">
          {STATS.map(({ value, label }, i) => (
            <div key={label} className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {value}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{label}</p>
              </div>
              {i < STATS.length - 1 && (
                <div className="hidden sm:block h-8 w-px bg-zinc-200 dark:bg-zinc-700" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
