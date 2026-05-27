import { useEffect, useRef, useState } from 'react'
import { motion, animate, useInView } from 'framer-motion'
import { Zap, Bot, SlidersHorizontal, Smartphone, Database, ShieldCheck } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'

const stats = [
  { to: 0.05, decimals: 2, suffix: 's', label: 'Instant filtering', sub: 'No page reloads — results update live as you tap.' },
  { to: 24, decimals: 0, suffix: '/7', label: 'AI shop assistant', sub: 'Guides customers any time, even when the shop is closed.' },
  { to: 1000, decimals: 0, suffix: '+', label: 'Products it can hold', sub: 'Architected to scale far beyond a basic storefront.' },
  { to: 100, decimals: 0, suffix: '%', label: 'Mobile-first', sub: 'App-like feel on the phone, where customers actually are.' },
]

const features = [
  { icon: Zap, title: 'Real-time, no-reload UX', body: 'Filters, search and the flavour finder update instantly — the snappy feel of a custom app, not a page-by-page template.' },
  { icon: Bot, title: 'Built-in AI guidance', body: 'A conversational assistant most shops simply don’t have. Future-ready to connect to a live AI model.' },
  { icon: SlidersHorizontal, title: 'Discovery by need', body: 'Browse by experience, flavour, nicotine, budget and use-case — guiding customers the way your staff would in person.' },
  { icon: Database, title: 'Bulk-ready catalogue', body: 'CSV import and a Shopify-shaped data model, so hundreds of lines go up in minutes, not weeks.' },
  { icon: Smartphone, title: 'Engineered, not dragged-and-dropped', body: 'Hand-built in React with smooth motion and a bespoke design — it won’t look like every other vape site.' },
  { icon: ShieldCheck, title: 'Compliance baked in', body: '18+ age gate, responsible copy and no disposables — the trust signals a serious retailer needs.' },
]

export default function Differentiators() {
  return (
    <section id="why" className="section">
      <div className="container-narrow">
        <SectionHeading
          align="center"
          eyebrow="Why this isn't a template"
          title={<>The difference between a storefront and a <span className="gradient-text">digital shop assistant</span></>}
          lede="This is a custom-engineered experience designed to win trust, guide customers and grow with your stock — the kind of polish a generic drag-and-drop builder can't reach."
        />

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              className="glass rounded-2xl p-5 text-center"
            >
              <div className="font-display text-3xl md:text-4xl gradient-text">
                <Counter to={s.to} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-sm font-semibold text-white">{s.label}</p>
              <p className="mt-1 text-[12px] text-slate-400 leading-relaxed">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.05 }}
              className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-white/10 to-white/0 hover:from-electric-500/40 hover:to-ember-500/30 transition-colors"
            >
              <div className="h-full rounded-2xl bg-graphite-800/70 backdrop-blur-xl p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-electric-500/10 text-electric-400 ring-1 ring-electric-500/20 group-hover:scale-105 transition-transform">
                  <f.icon size={18} />
                </span>
                <h3 className="font-display text-base text-white mt-4">{f.title}</h3>
                <p className="text-[13px] text-slate-300/90 mt-1.5 leading-relaxed">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Counter({ to, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setVal(v),
    })
    return controls.stop
  }, [inView, to])
  return (
    <span ref={ref}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}
