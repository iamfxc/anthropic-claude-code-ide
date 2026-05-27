import { motion } from 'framer-motion'
import { Phone, Star, MapPin, ShieldCheck, Recycle, Sparkles, ArrowRight } from 'lucide-react'
import { business } from '../data/business.js'

const trust = [
  { icon: Star, label: `${business.rating}★ Google rating` },
  { icon: Sparkles, label: `${business.reviewCount} local reviews` },
  { icon: MapPin, label: 'Gravesend based' },
  { icon: ShieldCheck, label: '18+ only' },
  { icon: Recycle, label: 'Reusable products only' },
]

export default function Hero() {
  const goto = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="relative pt-10 md:pt-16 pb-12 md:pb-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[420px] w-[820px] rounded-full bg-electric-500/10 blur-3xl" />

      <div className="container-narrow relative grid lg:grid-cols-12 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="lg:col-span-7"
        >
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-ember-400 animate-pulse-soft" />
            Local · Adult-only · {business.address.city}
          </span>
          <h1 className="heading mt-4 text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
            Your local <span className="gradient-text">Vape Shop in Gravesend</span> — rebuilt for easier choices, better advice & faster product discovery.
          </h1>
          <p className="mt-5 text-base md:text-lg text-slate-300/90 leading-relaxed max-w-xl">
            Browse best sellers, explore refillable kits, compare flavours, check today's offers, and get guided by a friendly digital shop assistant before you visit us in-store.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {trust.map((t) => (
              <span key={t.label} className="chip">
                <t.icon size={13} className="text-electric-400" />
                {t.label}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button onClick={() => goto('flavour-finder')} className="btn-primary">
              <Sparkles size={16} /> Find My Best Match <ArrowRight size={14} />
            </button>
            <a href={business.phoneTel} className="btn-ghost">
              <Phone size={16} /> Call the Shop
            </a>
          </div>

          <p className="mt-5 text-xs text-slate-500 max-w-lg">
            Product availability, prices and age verification requirements must be confirmed directly with the store.
          </p>
        </motion.div>

        {/* Today's Hot Pick card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <HotPickCard />
        </motion.div>
      </div>
    </section>
  )
}

function HotPickCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-electric-500/15 via-transparent to-ember-500/15 blur-2xl" />
      <div className="relative glass-strong rounded-3xl p-6 md:p-7 animate-float-slow">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.18em] text-electric-400">Today's Hot Pick</span>
          <span className="chip text-[10px]">Beginner Friendly</span>
        </div>

        <div className="mt-4 grid grid-cols-[auto,1fr] gap-4 items-start">
          <DeviceVisual />
          <div>
            <h3 className="font-display text-xl text-white leading-tight">Refillable Pod Starter Kit</h3>
            <p className="text-xs text-slate-400 mt-1">Compact · USB-C · two refillable pods</p>
            <p className="text-[13px] text-slate-300 mt-3 leading-relaxed">
              A simple, draw-activated kit that's a popular first choice for adult switchers.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 text-center divide-x divide-white/5 rounded-2xl border border-white/5 bg-graphite-900/50 overflow-hidden">
          <Stat label="Best for" value="Switchers" />
          <Stat label="Level" value="Beginner" />
          <Stat label="Price" value="Ask in-store" />
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          <a href="#products" onClick={(e)=>{e.preventDefault();document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}} className="btn-primary flex-1">Ask About Availability</a>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="px-3 py-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-sm text-white mt-0.5">{value}</p>
    </div>
  )
}

// Lightweight inline SVG device visual — keeps the bundle small and tone mature.
function DeviceVisual() {
  return (
    <div className="relative w-[90px] h-[140px]">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-graphite-700 to-graphite-900 border border-white/10 shadow-glass" />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-white/10" />
      <div className="absolute top-7 left-1/2 -translate-x-1/2 w-14 h-20 rounded-xl bg-gradient-to-b from-graphite-600 to-graphite-800 border border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/30 to-ember-500/20" />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full bg-electric-400/70 animate-pulse-soft" />
    </div>
  )
}
