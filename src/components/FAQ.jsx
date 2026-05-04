import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { faqs } from '../data/faqs.js'
import SectionHeading from './SectionHeading.jsx'

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="section">
      <div className="container-narrow">
        <SectionHeading
          eyebrow="Frequently asked"
          title={<>Questions adult customers <span className="gradient-text">actually ask</span></>}
          lede="Compliant, plain-English answers — written for new customers, regulars and the curious alike."
        />

        <div className="mt-10 grid gap-3 max-w-3xl">
          {faqs.map((f, i) => (
            <FaqItem key={f.q} item={f} index={i} isOpen={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqItem({ item, index, isOpen, onToggle }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
        aria-controls={`faq-${index}-panel`}
      >
        <span className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-500/10 text-electric-400 ring-1 ring-electric-500/20 shrink-0">
            <HelpCircle size={14} />
          </span>
          <span className="font-medium text-white">{item.q}</span>
        </span>
        <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-${index}-panel`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-slate-300/90 leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
