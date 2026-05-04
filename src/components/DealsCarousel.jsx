import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { products, dealProductIds } from '../data/products.js'
import ProductCard from './ProductCard.jsx'
import SectionHeading from './SectionHeading.jsx'

export default function DealsCarousel({ onAskAssistant }) {
  const scroller = useRef(null)
  const featured = dealProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)

  const scroll = (dir) => {
    const el = scroller.current
    if (!el) return
    const card = el.querySelector('article')
    const step = (card?.offsetWidth ?? 280) + 16
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <section id="deals" className="section">
      <div className="container-narrow">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeading
            eyebrow="Featured today"
            title={
              <>
                Today's <span className="gradient-text">Hot Deals</span> & Best Sellers
              </>
            }
            lede="A short list of in-store favourites, kept fresh manually so the team can highlight what's worth a visit. The rest of the catalogue can be added later in bulk."
          />
          <div className="hidden md:flex items-center gap-2">
            <button aria-label="Scroll left" onClick={() => scroll(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10">
              <ChevronLeft size={16} />
            </button>
            <button aria-label="Scroll right" onClick={() => scroll(1)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <motion.div
          ref={scroller}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 flex gap-4 overflow-x-auto scrollbar-hidden snap-x snap-mandatory pb-2 -mx-4 px-4"
        >
          {featured.map((p) => (
            <div key={p.id} className="snap-start">
              <ProductCard product={p} onAskAssistant={onAskAssistant} compact />
            </div>
          ))}
          <div className="snap-start min-w-[270px] w-[270px] grid place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
            <div>
              <span className="grid mx-auto h-10 w-10 place-items-center rounded-full bg-ember-500/15 text-ember-400 ring-1 ring-ember-500/30">
                <Flame size={16} />
              </span>
              <p className="mt-3 text-sm text-slate-200">More deals updated weekly</p>
              <p className="text-xs text-slate-500 mt-1">Confirm current offers in-store.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
