import { motion } from 'framer-motion'
import {
  FileSpreadsheet, Tags, Star, EyeOff, Megaphone, RefreshCw,
  Bot, ShoppingBag, Workflow, ArrowRight,
} from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'

const cards = [
  { icon: FileSpreadsheet, title: 'Bulk product import via CSV', body: 'Upload thousands of SKUs in a single spreadsheet — name, brand, category, tags, price.' },
  { icon: ShoppingBag, title: 'Shopify-ready structure', body: 'Product cards already match a Shopify schema, so a real catalogue can swap straight in.' },
  { icon: Tags, title: 'Category & tag mapping', body: 'Auto-route products into the right category and badge them as Best Seller / New / Staff Pick.' },
  { icon: Star, title: 'Best sellers first', body: 'Highlight the top 10–20 products so customers see them before scrolling the long tail.' },
  { icon: EyeOff, title: 'Hidden full catalogue', body: 'List the whole range internally, but only surface what you choose to feature publicly.' },
  { icon: Megaphone, title: 'Manual featured deals', body: 'Pin a small set of weekly offers without rebuilding the site.' },
  { icon: RefreshCw, title: 'Future stock syncing', body: 'Stock levels can be wired from till software or Shopify so the site reflects reality.' },
  { icon: Bot, title: 'AI-assisted descriptions', body: 'Generate short, on-brand product descriptions from a name or barcode.' },
]

const steps = [
  { n: 1, t: 'Export product list', d: 'From your till, supplier sheet or stock take.' },
  { n: 2, t: 'Upload CSV', d: 'Drop the file in — fields auto-map to the catalogue.' },
  { n: 3, t: 'Auto-group', d: 'By category, flavour family, brand and nicotine.' },
  { n: 4, t: 'Feature best sellers', d: 'A handful of products sit at the top of the page.' },
  { n: 5, t: 'Customers browse cleanly', d: 'No overwhelm — just the right picks, fast.' },
]

export default function ScalingSection() {
  return (
    <section id="scale" className="section">
      <div className="container-narrow">
        <SectionHeading
          eyebrow="Built to scale"
          title={<>Built for hundreds of products — <span className="gradient-text">without overwhelming the customer</span></>}
          lede="You don't need to upload everything on day one. Start with a polished hero, a category map and a featured set. Add the long tail in bulk when you're ready."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ember-500/10 text-ember-400 ring-1 ring-ember-500/20">
                <c.icon size={18} />
              </span>
              <h3 className="font-display text-base text-white mt-4">{c.title}</h3>
              <p className="text-[13px] text-slate-300/90 mt-1.5 leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Workflow */}
        <div className="mt-12 glass-strong rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-electric-500/15 text-electric-400 ring-1 ring-electric-500/30">
              <Workflow size={16} />
            </span>
            <h3 className="font-display text-xl text-white">A 5-step workflow, not a 5-month project</h3>
          </div>

          <ol className="grid gap-3 md:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.n} className="relative rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full text-xs font-bold bg-gradient-to-br from-electric-500 to-ember-500 text-graphite-950">
                    {s.n}
                  </span>
                  <p className="font-semibold text-white text-sm">{s.t}</p>
                </div>
                <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">{s.d}</p>
                {i < steps.length - 1 && (
                  <ArrowRight size={14} className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                )}
              </li>
            ))}
          </ol>

          <p className="mt-6 text-[12px] text-slate-500">
            {/* FUTURE: replace with a real CSV upload + Shopify Admin API integration. */}
            Volume is not the problem. Surfacing the right products at the right time is.
          </p>
        </div>
      </div>
    </section>
  )
}
