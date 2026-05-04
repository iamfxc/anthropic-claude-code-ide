import { motion } from 'framer-motion'
import {
  Sparkles, Layers, Droplets, Beaker, Cog, Package, BatteryCharging, Cpu,
  ArrowRight,
} from 'lucide-react'
import { categories } from '../data/categories.js'
import SectionHeading from './SectionHeading.jsx'

// Map id -> icon component. Avoids importing all of lucide-react via `* as Icons`.
const ICONS = {
  Sparkles, Layers, Droplets, Beaker, Cog, Package, BatteryCharging, Cpu,
}

export default function CategoryHub({ onPickCategory }) {
  return (
    <section id="categories" className="section">
      <div className="container-narrow">
        <SectionHeading
          eyebrow="Discover"
          title={<>Shop by <span className="gradient-text">What You Need</span></>}
          lede="Categories are organised so adult customers can find the right thing fast — without scrolling a thousand SKUs."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => {
            const Icon = ICONS[c.icon] ?? Package
            return (
              <motion.button
                key={c.id}
                onClick={() => onPickCategory?.(c.id)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.04 }}
                className="group glass rounded-2xl p-5 text-left hover:bg-white/[0.07] transition-colors"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-electric-500/10 text-electric-400 ring-1 ring-electric-500/20 group-hover:bg-electric-500/15 transition-colors">
                  <Icon size={18} />
                </span>
                <h3 className="font-display text-lg text-white mt-4">{c.name}</h3>
                <p className="text-[13px] text-slate-300/90 mt-1.5 leading-relaxed">{c.description}</p>
                <p className="text-[12px] text-slate-400 mt-3">{c.bestFor}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs text-electric-400 font-semibold group-hover:gap-2 transition-all">
                  Explore Category <ArrowRight size={12} />
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
