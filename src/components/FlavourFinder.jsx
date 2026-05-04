import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Wand2, RotateCcw, Phone, ArrowRight } from 'lucide-react'
import { products } from '../data/products.js'
import {
  flavourFamilies,
  nicStrengths,
  experienceLevels,
  desiredFeels,
} from '../data/flavours.js'
import { business } from '../data/business.js'
import SectionHeading from './SectionHeading.jsx'

const initial = { flavour: null, nic: null, level: null, feel: null }

export default function FlavourFinder({ onAskAssistant }) {
  const [pick, setPick] = useState(initial)
  const ready = pick.flavour && pick.nic && pick.level && pick.feel

  const recs = useMemo(() => {
    if (!ready) return []
    const scored = products
      .map((p) => {
        let s = 0
        if ((p.flavourFamily ?? []).includes(pick.flavour)) s += 4
        if ((p.nicStrength ?? []).includes(pick.nic)) s += 2
        if (pick.level === 'New' && p.level === 'Beginner') s += 3
        if (pick.level === 'Returning' && p.level === 'Intermediate') s += 2
        if (pick.level === 'Experienced' && p.level === 'Advanced') s += 3
        if (pick.feel === 'Smooth' && (p.use ?? []).includes('Smooth Throat Hit')) s += 2
        if (pick.feel === 'Strong hit' && (p.use ?? []).includes('Cloud Preference')) s += 2
        if (pick.feel === 'Long-lasting' && (p.use ?? []).includes('Long Battery')) s += 2
        if (pick.feel === 'Budget-friendly' && p.budget === '£') s += 2
        return { p, s }
      })
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map(({ p }) => p)
    return scored
  }, [pick, ready])

  const reset = () => setPick(initial)

  return (
    <section id="flavour-finder" className="section">
      <div className="container-narrow">
        <SectionHeading
          eyebrow="Personal guidance"
          title={<>Find Your <span className="gradient-text">Flavour Match</span></>}
          lede="Tell us a bit about what you like. We'll point to a starting place — the team confirms what's currently in stock."
        />

        <div className="mt-10 grid lg:grid-cols-[1fr,1fr] gap-6 items-start">
          {/* Question card */}
          <div className="glass-strong rounded-3xl p-6 md:p-7">
            <Question
              label="Which flavour family appeals?"
              options={flavourFamilies.map((f) => f.id)}
              value={pick.flavour}
              onPick={(v) => setPick({ ...pick, flavour: v })}
            />
            <Question
              label="Nicotine preference"
              options={nicStrengths}
              value={pick.nic}
              onPick={(v) => setPick({ ...pick, nic: v })}
            />
            <Question
              label="Experience"
              options={experienceLevels}
              value={pick.level}
              onPick={(v) => setPick({ ...pick, level: v })}
            />
            <Question
              label="Desired feel"
              options={desiredFeels}
              value={pick.feel}
              onPick={(v) => setPick({ ...pick, feel: v })}
            />

            <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
              <button onClick={reset} className="btn-ghost py-2.5">
                <RotateCcw size={14} /> Reset
              </button>
              <p className="text-xs text-slate-500">
                {ready ? 'Recommendations updated below.' : 'Pick one option in each row.'}
              </p>
            </div>
          </div>

          {/* Result card */}
          <div className="glass rounded-3xl p-6 md:p-7 lg:sticky lg:top-24">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-ember-500/15 text-ember-400 ring-1 ring-ember-500/30">
                <Wand2 size={16} />
              </span>
              <p className="font-display text-lg text-white">Your matches</p>
            </div>

            <AnimatePresence mode="wait">
              {!ready ? (
                <motion.p
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-sm text-slate-300/90 leading-relaxed"
                >
                  Choose your flavour family, nicotine, experience and desired feel. Three suggestions
                  will appear here based on the in-store range.
                </motion.p>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="mt-4 text-sm text-slate-300/90 leading-relaxed">
                    Based on what you picked, you may prefer{' '}
                    <span className="text-white">smoother nic salts</span>,{' '}
                    <span className="text-white">{pick.flavour.toLowerCase()} blends</span> or related
                    profiles. Call the store to check what's currently available.
                  </p>

                  <div className="mt-4 grid gap-3">
                    {recs.length === 0 && (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                        No exact match in our listed sample — the store carries a wider range, please call to check.
                      </div>
                    )}
                    {recs.map((p) => (
                      <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{p.title}</p>
                            <p className="text-[12px] text-slate-400 mt-0.5">{p.bestFor}</p>
                          </div>
                          <button
                            onClick={() => onAskAssistant?.(p.title)}
                            className="shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium border border-electric-500/30 bg-electric-500/10 text-electric-400 hover:bg-electric-500/15"
                          >
                            <Sparkles size={12} /> Ask AI
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row gap-2">
                    <a href={business.phoneTel} className="btn-primary flex-1">
                      <Phone size={14} /> Call to confirm stock
                    </a>
                    <a href="#products" className="btn-ghost flex-1">
                      Browse all products <ArrowRight size={13} />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-5 text-[11px] text-slate-500">
              Suggestions are guidance only and not medical or quitting-cessation advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Question({ label, options, value, onPick }) {
  return (
    <div className="mt-5 first:mt-0">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = value === o
          return (
            <button
              key={o}
              onClick={() => onPick(o)}
              className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                active
                  ? 'bg-gradient-to-r from-electric-500 to-ember-500 border-transparent text-graphite-950 font-semibold'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}
