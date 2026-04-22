'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, GraduationCap, Plane } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white font-sans selection:bg-navy/10 selection:text-navy ">
      {/* --- Desktop Branding Side --- */}
      <div className="hidden lg:flex w-[40%] bg-navy relative overflow-hidden flex-col justify-between p-10">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-blue-500 opacity-[0.12] blur-[140px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600 opacity-[0.08] blur-[120px]" />

          {/* Grainy Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
            style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

          {/* Modern Grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* Header / Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3.5 group">
          <div className="relative w-11 h-11 transition-all duration-500 group-hover:rotate-[15deg]">
            <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl border border-white/10" />
            <Image
              src="/logo.png"
              alt="Class Pilot Logo"
              fill
              className="object-contain relative p-1.5"
              priority
            />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-black text-white tracking-widest uppercase">
              Class <span className="text-yellow">Pilot</span>
            </span>

          </div>
        </Link>

        {/* Main Branding Content */}
        <div className="relative z-10 max-w-lg">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <Sparkles size={14} className="text-yellow animate-spin-slow" />
              <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">
                AI-Powered E-Classroom
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.05] tracking-tight">
              Focus on Teaching <span className="text-yellow">,</span> <br />
              <span className="text-slate-400">Automate Everything else.</span>
            </h1>

            <p className="text-sm text-slate-400 max-w-sm font-medium leading-relaxed">
              Join thousands of educators using Class Pilot to standardize classroom management and enhance student engagement.
            </p>
          </div>

          {/* Impact Indicators */}
          <div className="flex items-center gap-8 pt-10">
            <div className="group">
              <div className="text-2xl font-black text-white tracking-tighter group-hover:text-yellow transition-colors uppercase">v1.0</div>
              <div className="text-[9px] font-bold text-white/30 uppercase tracking-[.25em] mt-1">Platform Version</div>
            </div>
            <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="group">
              <div className="text-2xl font-black text-white tracking-tighter group-hover:text-yellow transition-colors uppercase">Early Access</div>
              <div className="text-[9px] font-bold text-white/30 uppercase tracking-[.25em] mt-1">Launch Phase</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-start gap-2 text-white/20 text-[8px] font-bold uppercase tracking-[.3em]">
          <div className="flex items-center gap-2 hover:text-white/40 transition-colors cursor-default">
            <GraduationCap size={14} />
            <span>EST. 2026</span>
          </div>
          <div className="h-3 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2 hover:text-white/40 transition-colors cursor-default">
            <Plane size={14} className="rotate-45" />
            <span>Next-Gen Platform</span>
          </div>
        </div>
      </div>

      {/* --- Form Side --- */}
      <div className="w-full lg:w-[60%] flex flex-col px-6 sm:p-3  relative bg-slate-50/30 overflow-y-auto min-h-screen lg:h-screen">
        <div className="max-w-xl w-full mx-auto my-auto space-y-4 py-4">
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex flex-col items-center gap-1.5 mb-2">
            <Link href="/" className="relative w-12 h-12">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </Link>
            <div className="text-center">
              <h2 className="text-lg font-black text-navy uppercase tracking-tight">
                Class <span className="text-blue-500">Pilot</span>
              </h2>
              <p className="text-[8px] font-bold text-navy/40 uppercase tracking-[.25em]">Automated E-Classroom</p>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-2xl font-black text-navy tracking-tight leading-none">
              {title}
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {description}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5">
            {children}
          </div>

          <p className="text-center text-[11px] text-slate-400 font-medium px-4">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-navy hover:underline underline-offset-4 font-bold">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-navy hover:underline underline-offset-4 font-bold">Privacy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
