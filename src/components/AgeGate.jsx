import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Ban, AlertTriangle } from 'lucide-react'

const STORAGE_KEY = 'vsg-age-confirmed-v1'

export default function AgeGate({ children }) {
  // null = unknown, true = confirmed adult, false = blocked under-18.
  const [status, setStatus] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw === 'yes') setStatus(true)
    } catch {
      // Private mode / storage disabled — treat as first visit.
    }
  }, [])

  const confirm = () => {
    try { localStorage.setItem(STORAGE_KEY, 'yes') } catch { /* noop */ }
    setStatus(true)
  }
  const block = () => setStatus(false)

  // Prevent scroll under the modal while it's blocking the page.
  useEffect(() => {
    if (status === true) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [status])

  return (
    <>
      {/* Render the site only after explicit confirmation. */}
      <div aria-hidden={status !== true} className={status === true ? '' : 'pointer-events-none select-none blur-sm'}>
        {children}
      </div>

      <AnimatePresence>
        {status !== true && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-graphite-950/85 backdrop-blur-md p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="age-gate-title"
          >
            <motion.div
              initial={{ y: 14, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 28 }}
              className="glass-strong relative w-full max-w-md rounded-3xl p-7 md:p-9"
            >
              <div className="absolute inset-x-0 -top-px h-px divider-glow" />
              {status === null && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="inline-grid h-11 w-11 place-items-center rounded-full bg-electric-500/15 text-electric-400 ring-1 ring-electric-500/30">
                      <ShieldCheck size={22} />
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-electric-400">Age verification</span>
                  </div>
                  <h2 id="age-gate-title" className="heading mt-5 text-3xl md:text-4xl">
                    Adults Only — <span className="gradient-text">18+</span>
                  </h2>
                  <p className="mt-3 text-slate-300/90 leading-relaxed">
                    This website is intended for customers aged 18 and over. Please confirm you are 18+ to continue.
                  </p>
                  <div className="mt-7 flex flex-col-reverse sm:flex-row gap-3">
                    <button onClick={block} className="btn-ghost flex-1">I am under 18</button>
                    <button onClick={confirm} className="btn-primary flex-1">I am 18 or over</button>
                  </div>
                  <p className="mt-5 text-[11px] leading-relaxed text-slate-400/80">
                    We only sell to customers aged 18+. Valid ID may be required in-store. Single-use disposable vapes are not sold.
                  </p>
                </>
              )}

              {status === false && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="inline-grid h-11 w-11 place-items-center rounded-full bg-red-500/15 text-red-400 ring-1 ring-red-500/30">
                      <Ban size={22} />
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-red-400">Access restricted</span>
                  </div>
                  <h2 className="heading mt-5 text-3xl">Access restricted</h2>
                  <p className="mt-3 text-slate-300/90 leading-relaxed">
                    This site is for adults aged 18+ only. Please close this window.
                  </p>
                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-300" />
                    <p>If you reached this page by mistake, you can leave at any time. We do not market vape products to under-18s.</p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
