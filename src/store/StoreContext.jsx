import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { products, dealProductIds } from '../data/products.js'

// ─────────────────────────────────────────────────────────────────────────
// Front-end-only store for the Click & Collect + customer portal demo.
// Everything persists to localStorage; there is NO backend. When a real
// system is added:
//   - signIn()        -> auth provider (e.g. Shopify customer accounts)
//   - placeOrder()    -> create order via Shopify/admin API
//   - the order timer -> replaced by real fulfilment status + SMS gateway
//     (Twilio/MessageBird) firing the "ready to collect" text.
// Reservations are pay-on-collection only — no online payment — to stay a
// product-discovery/enquiry site rather than a checkout.
// ─────────────────────────────────────────────────────────────────────────

const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

const LS_USER = 'vsg-user-v1'
const LS_BASKET = 'vsg-basket-v1'
const LS_ORDERS = 'vsg-orders-v1'

// Demo-accelerated fulfilment clock (a real shop would quote ~1 hour).
const PREPARING_AT_MS = 6000
const READY_AT_MS = 22000

export const LOYALTY_TIERS = [
  { points: 100, reward: '£5 off your next visit' },
  { points: 250, reward: 'Free replacement coil pack' },
  { points: 500, reward: '£15 loyalty voucher' },
]

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* noop */ }
}

let orderSeq = Math.floor(1000 + Math.random() * 9000)
const nextOrderId = () => `VS${orderSeq++}`

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => load(LS_USER, null))
  const [basket, setBasket] = useState(() => load(LS_BASKET, []))
  const [orders, setOrders] = useState(() => load(LS_ORDERS, []))
  const [toasts, setToasts] = useState([])
  const [accountOpen, setAccountOpen] = useState(false)
  const [basketOpen, setBasketOpen] = useState(false)

  useEffect(() => save(LS_USER, user), [user])
  useEffect(() => save(LS_BASKET, basket), [basket])
  useEffect(() => save(LS_ORDERS, orders), [orders])

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, ...toast }])
    if (toast.duration !== 0) {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), toast.duration ?? 5000)
    }
  }, [])
  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const signIn = useCallback((profile) => {
    setUser((prev) => {
      const base = prev ?? {}
      return {
        name: profile.name?.trim() || base.name || 'Guest Customer',
        phone: profile.phone?.trim() || base.phone || '',
        email: profile.email?.trim() || base.email || '',
        points: base.points ?? 180,
        joinedAt: base.joinedAt ?? Date.now(),
      }
    })
    // Seed a couple of past orders so the portal looks established in the demo.
    setOrders((prev) => {
      if (prev.length) return prev
      const day = 86400000
      return [
        {
          id: nextOrderId(),
          items: [pick('pod-starter-01'), pick('coil-13')].filter(Boolean),
          phone: profile.phone ?? '',
          placedAt: Date.now() - 9 * day,
          status: 'collected',
        },
        {
          id: nextOrderId(),
          items: [pick('salts-09'), pick('eliquid-08')].filter(Boolean),
          phone: profile.phone ?? '',
          placedAt: Date.now() - 2 * day,
          status: 'collected',
        },
      ]
    })
    addToast({ kind: 'success', title: 'Signed in', body: 'Welcome back — your profile is ready.' })
  }, [addToast])

  const signOut = useCallback(() => {
    setUser(null)
    addToast({ kind: 'info', title: 'Signed out', body: 'You can sign back in any time.' })
  }, [addToast])

  const addToBasket = useCallback((product) => {
    setBasket((b) => (b.some((x) => x.id === product.id) ? b : [...b, basketItem(product)]))
    addToast({
      kind: 'success',
      title: 'Added to collection basket',
      body: `${product.title} — reserve to collect in ~1 hour.`,
      action: 'basket',
    })
  }, [addToast])

  const removeFromBasket = useCallback((id) => setBasket((b) => b.filter((x) => x.id !== id)), [])
  const clearBasket = useCallback(() => setBasket([]), [])

  const placeOrder = useCallback((phone) => {
    let created = null
    setBasket((b) => {
      if (!b.length) return b
      created = {
        id: nextOrderId(),
        items: b,
        phone,
        placedAt: Date.now(),
        status: 'received',
      }
      setOrders((o) => [created, ...o])
      return []
    })
    if (created) {
      // Award loyalty points for using Click & Collect.
      setUser((u) => (u ? { ...u, points: (u.points ?? 0) + 25 } : u))
    }
    return created
  }, [])

  const activeOrder = orders.find((o) => o.status !== 'collected') ?? null

  const recommendations = getRecommendations(orders)

  const value = {
    user, signIn, signOut,
    basket, addToBasket, removeFromBasket, clearBasket,
    orders, placeOrder, activeOrder,
    recommendations,
    toasts, addToast, dismissToast,
    accountOpen, setAccountOpen,
    basketOpen, setBasketOpen,
    timings: { PREPARING_AT_MS, READY_AT_MS },
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// Live order status derived from the demo fulfilment clock. Pure: returns the
// current { stage, progress }; the caller decides what to do on "ready".
export function useOrderStatus(order) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!order || order.status === 'collected') return
    const t = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(t)
  }, [order])

  if (!order) return { stage: 'none', progress: 0 }

  const elapsed = order.status === 'collected' ? READY_AT_MS : now - order.placedAt
  let stage = 'received'
  if (elapsed >= READY_AT_MS) stage = 'ready'
  else if (elapsed >= PREPARING_AT_MS) stage = 'preparing'
  const progress = Math.min(1, Math.max(0.04, elapsed / READY_AT_MS))

  return { stage, progress }
}

function pick(id) {
  const p = products.find((x) => x.id === id)
  return p ? basketItem(p) : null
}
function basketItem(p) {
  return { id: p.id, title: p.title, category: p.category }
}

function getRecommendations(orders) {
  const ordered = new Set(orders.flatMap((o) => o.items.map((i) => i.id)))
  const cats = new Set(orders.flatMap((o) => o.items.map((i) => i.category)))
  const byHistory = products.filter((p) => cats.has(p.category) && !ordered.has(p.id))
  const fallback = dealProductIds.map((id) => products.find((p) => p.id === id)).filter(Boolean)
  const seen = new Set()
  return [...byHistory, ...fallback]
    .filter((p) => p && !seen.has(p.id) && seen.add(p.id))
    .slice(0, 3)
}
