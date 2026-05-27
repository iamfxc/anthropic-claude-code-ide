import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Clock3, ShieldCheck, Store } from 'lucide-react'
import { useStore } from '../store/StoreContext.jsx'
import OrderTracker from './OrderTracker.jsx'

const CATEGORY_LABEL = {
  'starter-kits': 'Starter Kit', 'pod-systems': 'Pod System', 'e-liquids': 'E-Liquid',
  'nic-salts': 'Nic Salt', coils: 'Coils', tanks: 'Tanks & Accessories',
  chargers: 'Chargers & Batteries', advanced: 'Advanced Device',
}

export default function CollectionDrawer() {
  const {
    basket, removeFromBasket, placeOrder, basketOpen, setBasketOpen,
    activeOrder, user,
  } = useStore()

  const [phone, setPhone] = useState('')
  useEffect(() => { if (user?.phone) setPhone(user.phone) }, [user])

  const canReserve = basket.length > 0 && /\d{7,}/.test(phone.replace(/\s/g, ''))

  const reserve = () => {
    if (!canReserve) return
    placeOrder(phone.trim())
  }

  return (
    <AnimatePresence>
      {basketOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setBasketOpen(false)}
            className="fixed inset-0 z-[80] bg-graphite-950/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 bottom-0 z-[81] w-[min(94vw,440px)] bg-graphite-900/95 backdrop-blur-2xl border-l border-white/10 flex flex-col"
            role="dialog" aria-label="Collection basket"
          >
            <header className="flex items-center justify-between gap-3 p-4 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-electric-500/15 text-electric-400 ring-1 ring-electric-500/30">
                  <ShoppingBag size={16} />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-white">Click & Collect</p>
                  <p className="text-[11px] text-slate-400">Reserve now · pay & collect in-store</p>
                </div>
              </div>
              <button onClick={() => setBasketOpen(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white">
                <X size={16} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Active order tracker */}
              {activeOrder && <OrderTracker order={activeOrder} />}

              {/* Basket items */}
              {basket.length === 0 && !activeOrder ? (
                <EmptyState />
              ) : basket.length > 0 ? (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                    Reserve list ({basket.length})
                  </p>
                  <ul className="space-y-2">
                    {basket.map((it) => (
                      <li key={it.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-graphite-600 to-graphite-800 text-electric-400">
                          <Store size={15} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-white truncate">{it.title}</p>
                          <p className="text-[11px] text-slate-500">{CATEGORY_LABEL[it.category] ?? it.category} · Pay on collection</p>
                        </div>
                        <button onClick={() => removeFromBasket(it.id)} aria-label="Remove" className="text-slate-500 hover:text-red-300">
                          <Trash2 size={15} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* Reserve footer */}
            {basket.length > 0 && (
              <footer className="border-t border-white/5 p-4 space-y-3">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Mobile for ready-to-collect text</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="tel"
                    placeholder="07…"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-graphite-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-electric-400 focus:outline-none"
                  />
                </label>
                <button onClick={reserve} disabled={!canReserve} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
                  <Clock3 size={15} /> Reserve · ready in ~1 hour
                </button>
                <div className="flex items-start gap-2 text-[11px] text-slate-500">
                  <ShieldCheck size={13} className="mt-0.5 shrink-0 text-electric-400" />
                  <p>18+ only. Bring valid photo ID to collect (Challenge 25). Prices and availability are confirmed in-store — no payment is taken online.</p>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function EmptyState() {
  return (
    <div className="grid place-items-center text-center py-12">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-slate-500">
        <ShoppingBag size={20} />
      </span>
      <p className="mt-3 font-display text-white">Your collection basket is empty</p>
      <p className="mt-1 text-sm text-slate-400 max-w-[260px]">
        Add products with “Reserve for collection”, then pick them up in-store in about an hour.
      </p>
    </div>
  )
}
