import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { PackageCheck, Clock3, CheckCircle2, MapPin } from 'lucide-react'
import { useStore, useOrderStatus } from '../store/StoreContext.jsx'
import { business } from '../data/business.js'

const STAGES = [
  { key: 'received', label: 'Order received', icon: PackageCheck },
  { key: 'preparing', label: 'Being prepared', icon: Clock3 },
  { key: 'ready', label: 'Ready to collect', icon: CheckCircle2 },
]
const order_of = { received: 0, preparing: 1, ready: 2 }

export default function OrderTracker({ order }) {
  const { addToast } = useStore()
  const status = useOrderStatus(order)
  const notifiedRef = useRef(false)

  // Fire the simulated "ready to collect" SMS once.
  useEffect(() => {
    if (status.stage === 'ready' && !notifiedRef.current) {
      notifiedRef.current = true
      addToast({
        kind: 'sms',
        to: order.phone || 'your phone',
        duration: 9000,
        body: `Vape Shop Gravesend: your order ${order.id} is ready to collect. Please bring valid photo ID (18+). 146 Parrock St, DA12 1EY.`,
      })
    }
  }, [status.stage, addToast, order])

  const activeIdx = order_of[status.stage] ?? 0

  return (
    <div className="rounded-2xl border border-white/10 bg-graphite-900/60 p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-electric-400">Collection order</p>
          <p className="font-display text-lg text-white mt-0.5">{order.id}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          status.stage === 'ready' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-electric-500/15 text-electric-300'
        }`}>
          {status.stage === 'ready' ? 'Ready now' : status.stage === 'preparing' ? 'Preparing' : 'Received'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-electric-500 to-ember-500"
          animate={{ width: `${status.progress * 100}%` }}
          transition={{ ease: 'easeOut', duration: 0.5 }}
        />
      </div>

      {/* Stages */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {STAGES.map((s, i) => {
          const done = i <= activeIdx
          const Icon = s.icon
          return (
            <div key={s.key} className="text-center">
              <span className={`mx-auto grid h-9 w-9 place-items-center rounded-full transition-colors ${
                done ? 'bg-gradient-to-br from-electric-500 to-ember-500 text-graphite-950' : 'bg-white/5 text-slate-500'
              }`}>
                <Icon size={16} />
              </span>
              <p className={`mt-1.5 text-[11px] ${done ? 'text-white' : 'text-slate-500'}`}>{s.label}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap text-[12px]">
        <span className="text-slate-400">
          {status.stage === 'ready'
            ? 'Collect in-store with valid ID (18+).'
            : `We'll text ${order.phone || 'your phone'} the moment it's ready.`}
        </span>
        {status.stage === 'ready' && (
          <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-electric-400 hover:text-electric-300 font-semibold">
            <MapPin size={13} /> Directions
          </a>
        )}
      </div>

      <p className="mt-3 text-[10px] text-slate-600">Demo: timeline is accelerated for preview. A live shop would quote about one hour.</p>
    </div>
  )
}
