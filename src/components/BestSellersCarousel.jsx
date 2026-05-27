import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles, Phone, Star, GripHorizontal } from 'lucide-react'
import { products, dealProductIds } from '../data/products.js'
import { business } from '../data/business.js'
import SectionHeading from './SectionHeading.jsx'

const CATEGORY_LABEL = {
  'starter-kits': 'Starter Kit',
  'pod-systems': 'Pod System',
  'e-liquids': 'E-Liquid',
  'nic-salts': 'Nic Salt',
  coils: 'Coils',
  tanks: 'Tanks & Accessories',
  chargers: 'Chargers & Batteries',
  advanced: 'Advanced Device',
}

const BADGE_CLASS = {
  'Best Seller': 'from-electric-500 to-electric-600',
  New: 'from-ember-500 to-ember-600',
  'Staff Pick': 'from-amber-400 to-amber-500',
  'Value Pick': 'from-violet-500 to-violet-600',
}

// Advanced, drag-snapping carousel. Index-based with spring physics, a
// ResizeObserver for responsive step sizing, drag + buttons + dots + progress.
export default function BestSellersCarousel({ onAskAssistant }) {
  const featured = dealProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)

  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const x = useMotionValue(0)
  const [index, setIndex] = useState(0)
  const [step, setStep] = useState(320)
  const [maxIndex, setMaxIndex] = useState(0)

  const measure = useCallback(() => {
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!track || !viewport) return
    const card = track.querySelector('[data-card]')
    if (!card) return
    const cardW = card.getBoundingClientRect().width
    const gap = parseFloat(getComputedStyle(track).columnGap || '20') || 20
    const s = cardW + gap
    setStep(s)
    const perView = Math.max(1, Math.round(viewport.clientWidth / s))
    setMaxIndex(Math.max(0, featured.length - perView))
  }, [featured.length])

  useEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (viewportRef.current) ro.observe(viewportRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  // Snap to the active index whenever it (or layout) changes.
  useEffect(() => {
    const target = -Math.min(index, maxIndex) * step
    const controls = animate(x, target, { type: 'spring', stiffness: 280, damping: 32 })
    return controls.stop
  }, [index, step, maxIndex, x])

  const clamp = (i) => Math.max(0, Math.min(maxIndex, i))
  const go = (dir) => setIndex((i) => clamp(i + dir))

  const onDragEnd = (_e, info) => {
    const moved = -info.offset.x / step
    const velocityBias = -info.velocity.x > 400 ? 0.4 : -info.velocity.x < -400 ? -0.4 : 0
    setIndex((i) => clamp(i + Math.round(moved + velocityBias)))
  }

  return (
    <section id="deals" className="section relative">
      <div className="container-narrow">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeading
            eyebrow="Featured today"
            title={<>Today's <span className="gradient-text">Best Sellers</span> & Hot Picks</>}
            lede="A hand-picked front-of-shop, updated by the team. Drag to explore — the full catalogue can scale to thousands behind it."
          />
          <div className="hidden md:flex items-center gap-2">
            <button
              aria-label="Previous"
              onClick={() => go(-1)}
              disabled={index === 0}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              aria-label="Next"
              onClick={() => go(1)}
              disabled={index >= maxIndex}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div className="relative mt-8">
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10 bg-gradient-to-r from-graphite-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 z-10 bg-gradient-to-l from-graphite-950 to-transparent" />

          <div ref={viewportRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
            <motion.div
              ref={trackRef}
              className="flex gap-5 py-2"
              style={{ x }}
              drag="x"
              dragConstraints={{ left: -maxIndex * step, right: 0 }}
              dragElastic={0.14}
              onDragEnd={onDragEnd}
            >
              {featured.map((p, i) => (
                <CarouselCard
                  key={p.id}
                  product={p}
                  rank={i + 1}
                  onAskAssistant={onAskAssistant}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Controls: progress + dots + hint */}
        <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-7 bg-gradient-to-r from-electric-400 to-ember-400' : 'w-1.5 bg-white/15 hover:bg-white/30'
                }`}
              />
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <GripHorizontal size={14} /> Drag or swipe to browse
          </span>
        </div>
      </div>
    </section>
  )
}

function CarouselCard({ product, rank, onAskAssistant }) {
  const badge = product.badge
  const grad = BADGE_CLASS[badge] ?? 'from-slate-500 to-slate-600'
  return (
    <motion.article
      data-card
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="relative w-[82vw] sm:w-[330px] shrink-0 select-none"
    >
      {/* gradient ring */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-electric-500/30 via-transparent to-ember-500/30 opacity-0 hover:opacity-100 transition-opacity" />
      <div className="relative glass-strong rounded-3xl p-5 h-full flex flex-col">
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-slate-300">
            <span className="font-display font-bold text-electric-400">#{rank}</span> Best seller
          </span>
          {badge && (
            <span className={`rounded-full bg-gradient-to-r ${grad} px-2.5 py-1 text-[10px] font-bold text-graphite-950`}>
              {badge}
            </span>
          )}
        </div>

        {/* device visual */}
        <div className="mt-4 grid place-items-center">
          <DeviceArt seed={rank} />
        </div>

        <div className="mt-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            {CATEGORY_LABEL[product.category] ?? product.category}
          </p>
          <h3 className="font-display text-lg text-white leading-snug mt-0.5">{product.title}</h3>
          <div className="mt-1.5 flex items-center gap-1 text-amber-300">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} fill={i < 4 ? 'currentColor' : 'none'} className={i < 4 ? '' : 'text-white/20'} />
            ))}
            <span className="ml-1 text-[11px] text-slate-400">Popular pick</span>
          </div>
          <p className="text-[13px] text-slate-300/90 mt-2.5 leading-relaxed line-clamp-2">{product.bestFor}</p>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-white/5 bg-graphite-900/50 px-3 py-2">
          <span className="text-[11px] text-slate-500">Price</span>
          <span className="text-sm text-white">Ask in-store</span>
        </div>

        <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => onAskAssistant?.(product.title)}
            className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium border border-electric-500/30 bg-electric-500/10 text-electric-400 hover:bg-electric-500/15 transition-colors"
          >
            <Sparkles size={13} /> Ask AI
          </button>
          <a
            href={business.phoneTel}
            className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
          >
            <Phone size={13} /> Check stock
          </a>
        </div>
      </div>
    </motion.article>
  )
}

// Lightweight procedural device artwork — varies subtly per card.
function DeviceArt({ seed = 0 }) {
  const hueA = ['#2f96ff', '#11c39a', '#5fb7ff', '#34d4a8', '#7c9bff', '#22d3ee'][seed % 6]
  return (
    <div className="relative h-28 w-full grid place-items-center">
      <div className="absolute h-24 w-24 rounded-full blur-2xl opacity-40" style={{ background: hueA }} />
      <div className="relative w-16 h-24 rounded-2xl bg-gradient-to-b from-graphite-600 to-graphite-900 border border-white/10 overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-white/15" />
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-10 h-12 rounded-lg" style={{ background: `linear-gradient(180deg, ${hueA}55, transparent)` }} />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full animate-pulse-soft" style={{ background: hueA }} />
      </div>
    </div>
  )
}
