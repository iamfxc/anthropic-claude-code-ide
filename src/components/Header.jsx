import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageCircle, Menu, X, ShieldCheck } from 'lucide-react'
import { business } from '../data/business.js'

const NAV = [
  { id: 'deals', label: 'Deals' },
  { id: 'products', label: 'Products' },
  { id: 'flavour-finder', label: 'Flavour Finder' },
  { id: 'assistant', label: 'AI Assistant' },
  { id: 'visit', label: 'Visit Us' },
  { id: 'faq', label: 'FAQ' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goto = (id) => {
    setOpen(false)
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? 'backdrop-blur-xl bg-graphite-950/70 border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="container-narrow flex items-center justify-between py-3 md:py-4">
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); goto('top') }}
          className="group flex items-center gap-2.5"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-electric-500 to-ember-500 text-graphite-950 shadow-glow">
            <span className="font-display text-base font-bold">V</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display font-semibold text-white text-[15px] md:text-base">Vape Shop Gravesend</span>
            <span className="hidden md:flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase text-slate-400">
              <ShieldCheck size={11} /> 18+ Adult Only
            </span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => goto(n.id)}
              className="px-3 py-2 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <a href={business.whatsapp} target="_blank" rel="noreferrer" className="btn-ghost py-2.5">
            <MessageCircle size={16} /> Message
          </a>
          <a href={business.phoneTel} className="btn-primary py-2.5">
            <Phone size={16} /> Call Store
          </a>
        </div>

        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="lg:hidden overflow-hidden border-t border-white/5 bg-graphite-950/90 backdrop-blur-xl"
          >
            <div className="container-narrow py-4 grid gap-1.5">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => goto(n.id)}
                  className="text-left rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5"
                >
                  {n.label}
                </button>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-3">
                <a href={business.whatsapp} target="_blank" rel="noreferrer" className="btn-ghost">
                  <MessageCircle size={16} /> Message
                </a>
                <a href={business.phoneTel} className="btn-primary">
                  <Phone size={16} /> Call
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
