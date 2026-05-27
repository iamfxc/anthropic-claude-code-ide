import { motion } from 'framer-motion'
import { Rocket, Boxes, ShoppingCart, Bot, BellRing } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'

const phases = [
  { n: 1, icon: Rocket,       title: 'Premium local website',         body: 'A polished site that builds trust, ranks locally and routes calls — exactly what you see today.' },
  { n: 2, icon: Boxes,        title: 'Product catalogue',             body: 'Bulk-import the long tail. Surface best sellers, hide the rest until you choose to feature them.' },
  { n: 3, icon: ShoppingCart, title: 'Shopify / ecommerce',           body: 'Switch on checkout for click & collect or local delivery. Same site, same look, real cart.' },
  { n: 4, icon: Bot,          title: 'AI product assistant',          body: 'Replace the mock guide with a real model trained on your product range and brand voice.' },
  { n: 5, icon: BellRing,     title: 'Offers, stock & retention',     body: 'Automated weekly offers, stock-back alerts and a simple loyalty programme for regulars.' },
]

export default function PhasePlan() {
  return (
    <section id="phases" className="section">
      <div className="container-narrow">
        <SectionHeading
          eyebrow="Roadmap"
          title={<>Start simple — then grow into a <span className="gradient-text">full ecommerce system</span></>}
          lede="A phased approach so the shop sees value from day one without a giant up-front commitment. Each phase stacks on the last."
        />

        <div className="mt-10 grid gap-3">
          {phases.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 flex items-start gap-4"
            >
              <div className="flex flex-col items-center gap-2 pt-1">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-electric-500 to-ember-500 text-graphite-950 font-bold">
                  {p.n}
                </span>
                {i < phases.length - 1 && <span className="w-px flex-1 bg-white/10 min-h-6 hidden sm:block" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-electric-400">Phase {p.n}</p>
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-slate-300">
                    <p.icon size={13} />
                  </span>
                </div>
                <h3 className="font-display text-lg text-white mt-1">{p.title}</h3>
                <p className="text-sm text-slate-300/90 mt-1.5 leading-relaxed">{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 glass-strong rounded-3xl p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-ember-400">For the owner</p>
          <h3 className="font-display text-2xl text-white mt-2">Your product volume isn't the problem. Your customers' clarity is.</h3>
          <p className="text-slate-300/90 mt-3 leading-relaxed">
            This site is designed so a small team can launch quickly with a curated front-of-shop,
            then grow into a full catalogue, ecommerce and AI assistant — without rebuilding from
            scratch each time.
          </p>
        </div>
      </div>
    </section>
  )
}
