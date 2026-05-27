import { motion } from 'framer-motion'
import { Clock3, Smartphone, ShieldCheck, ShoppingBag, ArrowRight, BadgePercent } from 'lucide-react'
import { useStore } from '../store/StoreContext.jsx'
import SectionHeading from './SectionHeading.jsx'

const steps = [
  { icon: ShoppingBag, title: 'Reserve online', body: 'Add products to your collection basket and reserve in seconds — no payment online.' },
  { icon: Clock3, title: 'We prepare it', body: 'The team picks your items, typically ready in about an hour.' },
  { icon: Smartphone, title: 'Get a text', body: 'We send an SMS to your phone the moment your order is ready to collect.' },
  { icon: ShieldCheck, title: 'Collect with ID', body: 'Pop in, show valid photo ID (18+) and pay in-store. Done.' },
]

export default function ClickCollectPreview() {
  const { setBasketOpen, setAccountOpen, user } = useStore()

  return (
    <section id="click-collect" className="section">
      <div className="container-narrow">
        <SectionHeading
          align="center"
          eyebrow="New · Click & Collect"
          title={<>Reserve now, <span className="gradient-text">collect in about an hour</span></>}
          lede="Skip the wait. Reserve online, get a text when it's ready, and collect in-store with ID. Loyalty points on every collection."
        />

        <div className="mt-10 grid lg:grid-cols-[1.4fr,1fr] gap-6 items-stretch">
          {/* Steps */}
          <div className="grid sm:grid-cols-2 gap-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-electric-500/10 text-electric-400 ring-1 ring-electric-500/20">
                    <s.icon size={17} />
                  </span>
                  <span className="font-display text-sm text-slate-400">Step {i + 1}</span>
                </div>
                <h3 className="font-display text-base text-white mt-3">{s.title}</h3>
                <p className="text-[13px] text-slate-300/90 mt-1.5 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Phone mockup with SMS */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative glass-strong rounded-3xl p-6 flex flex-col"
          >
            <div className="mx-auto w-full max-w-[240px] rounded-[2rem] border border-white/10 bg-graphite-950/80 p-3 shadow-glass">
              <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/10" />
              <div className="rounded-2xl bg-graphite-800/80 p-3">
                <p className="text-[10px] text-slate-500 mb-1">SMS · Vape Shop Gravesend</p>
                <div className="rounded-xl rounded-tl-sm bg-gradient-to-br from-electric-500/20 to-ember-500/15 border border-white/10 p-3">
                  <p className="text-[12px] text-slate-100 leading-relaxed">
                    Your order <span className="font-semibold text-white">#VS1284</span> is ready to collect. Please bring valid photo ID (18+). 146 Parrock St, DA12 1EY.
                  </p>
                </div>
                <p className="mt-1 text-[10px] text-slate-600 text-right">now</p>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-2 text-[13px] text-slate-300">
                <BadgePercent size={15} className="text-ember-400" /> Earn loyalty points on every collection
              </div>
              <div className="flex items-center gap-2 text-[13px] text-slate-300">
                <ShieldCheck size={15} className="text-electric-400" /> 18+ only · ID required to collect
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={() => setBasketOpen(true)} className="btn-primary">
                <ShoppingBag size={15} /> Basket
              </button>
              <button onClick={() => setAccountOpen(true)} className="btn-ghost">
                {user ? 'My account' : 'Sign in'} <ArrowRight size={13} />
              </button>
            </div>
            <p className="mt-3 text-[10px] text-slate-600 text-center">
              Preview of upcoming Click &amp; Collect. Final availability and timings confirmed with the store.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
