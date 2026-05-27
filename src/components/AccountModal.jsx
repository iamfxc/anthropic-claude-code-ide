import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, User, LogOut, Gift, Sparkles, Phone, Star, Package, ChevronRight, Award,
} from 'lucide-react'
import { useStore, LOYALTY_TIERS } from '../store/StoreContext.jsx'
import { business } from '../data/business.js'

const CATEGORY_LABEL = {
  'starter-kits': 'Starter Kit', 'pod-systems': 'Pod System', 'e-liquids': 'E-Liquid',
  'nic-salts': 'Nic Salt', coils: 'Coils', tanks: 'Tanks & Accessories',
  chargers: 'Chargers & Batteries', advanced: 'Advanced Device',
}

export default function AccountModal() {
  const {
    user, signIn, signOut, orders, recommendations, addToBasket,
    accountOpen, setAccountOpen, setBasketOpen,
  } = useStore()

  return (
    <AnimatePresence>
      {accountOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setAccountOpen(false)}
            className="fixed inset-0 z-[80] bg-graphite-950/75 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed left-1/2 top-1/2 z-[81] w-[min(94vw,520px)] max-h-[88vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 glass-strong rounded-3xl"
            role="dialog" aria-label="Customer account"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 p-4 border-b border-white/5 bg-graphite-800/80 backdrop-blur-xl rounded-t-3xl">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-electric-500/15 text-electric-400 ring-1 ring-electric-500/30">
                  <User size={16} />
                </span>
                <p className="text-sm font-semibold text-white">{user ? 'My account' : 'Sign in'}</p>
              </div>
              <button onClick={() => setAccountOpen(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-5">
              {user ? (
                <Profile
                  user={user} orders={orders} recommendations={recommendations}
                  onSignOut={signOut} addToBasket={addToBasket}
                  openBasket={() => { setAccountOpen(false); setBasketOpen(true) }}
                />
              ) : (
                <SignIn onSignIn={signIn} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function SignIn({ onSignIn }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const submit = (e) => {
    e.preventDefault()
    onSignIn(form)
  }
  return (
    <div>
      <p className="text-sm text-slate-300/90 leading-relaxed">
        Create a free profile to use Click & Collect, track orders, see tailored picks and earn loyalty rewards.
      </p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Your name" />
        <Field label="Mobile" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="07…" inputMode="tel" />
        <Field label="Email (optional)" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@email.com" type="email" />
        <button type="submit" className="btn-primary w-full">Create / sign in</button>
      </form>
      <button
        onClick={() => onSignIn({ name: 'Alex (demo)', phone: '07838 408518', email: 'demo@vapeshop.example' })}
        className="btn-ghost w-full mt-2"
      >
        <Sparkles size={15} /> Continue as demo customer
      </button>
      <p className="mt-3 text-[11px] text-slate-500">
        Demo only — no real account is created and no data leaves your device. A live version would use secure customer accounts. 18+ only.
      </p>
    </div>
  )
}

function Profile({ user, orders, recommendations, onSignOut, addToBasket, openBasket }) {
  const nextTier = LOYALTY_TIERS.find((t) => t.points > (user.points ?? 0)) ?? LOYALTY_TIERS[LOYALTY_TIERS.length - 1]
  const pct = Math.min(100, Math.round(((user.points ?? 0) / nextTier.points) * 100))

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="rounded-2xl bg-gradient-to-br from-electric-500/15 to-ember-500/10 border border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg text-white">{user.name}</p>
            {user.phone && <p className="text-[12px] text-slate-400 flex items-center gap-1"><Phone size={11} /> {user.phone}</p>}
          </div>
          <button onClick={onSignOut} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </div>

      {/* Loyalty */}
      <section>
        <div className="flex items-center gap-2">
          <Award size={15} className="text-amber-300" />
          <h3 className="text-sm font-semibold text-white">Loyalty</h3>
          <span className="ml-auto text-sm text-white font-display">{user.points ?? 0} pts</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/8 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-ember-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1.5 text-[12px] text-slate-400">
          {nextTier.points - (user.points ?? 0)} pts to <span className="text-white">{nextTier.reward}</span>
        </p>
        <div className="mt-3 grid gap-1.5">
          {LOYALTY_TIERS.map((t) => {
            const unlocked = (user.points ?? 0) >= t.points
            return (
              <div key={t.points} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[12px] ${unlocked ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-200' : 'border-white/8 bg-white/[0.02] text-slate-400'}`}>
                <Gift size={13} className={unlocked ? 'text-emerald-400' : 'text-slate-500'} />
                <span>{t.reward}</span>
                <span className="ml-auto">{t.points} pts</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Recent orders */}
      <section>
        <div className="flex items-center gap-2">
          <Package size={15} className="text-electric-400" />
          <h3 className="text-sm font-semibold text-white">Recent orders</h3>
        </div>
        {orders.length === 0 ? (
          <p className="mt-2 text-[13px] text-slate-400">No orders yet — reserve something with Click & Collect.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {orders.slice(0, 4).map((o) => (
              <li key={o.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] text-white font-medium">{o.id}</span>
                  <span className={`text-[11px] rounded-full px-2 py-0.5 ${o.status === 'collected' ? 'bg-white/8 text-slate-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                    {o.status === 'collected' ? 'Collected' : 'In progress'}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-slate-400 truncate">
                  {o.items.map((i) => i.title).join(', ')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recommendations */}
      <section>
        <div className="flex items-center gap-2">
          <Star size={15} className="text-ember-400" />
          <h3 className="text-sm font-semibold text-white">Recommended for you</h3>
        </div>
        <div className="mt-2 space-y-2">
          {recommendations.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-white truncate">{p.title}</p>
                <p className="text-[11px] text-slate-500">{CATEGORY_LABEL[p.category] ?? p.category}</p>
              </div>
              <button
                onClick={() => addToBasket(p)}
                className="shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium border border-electric-500/30 bg-electric-500/10 text-electric-400 hover:bg-electric-500/15"
              >
                Reserve <ChevronRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <button onClick={openBasket} className="btn-ghost w-full">View collection basket</button>
      <p className="text-[11px] text-slate-500 text-center">
        Questions? Call the shop on <a href={business.phoneTel} className="text-electric-400">{business.phone}</a>.
      </p>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', inputMode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-graphite-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-electric-400 focus:outline-none"
      />
    </label>
  )
}
