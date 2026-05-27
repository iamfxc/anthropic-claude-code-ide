import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Info, MessageSquare, X } from 'lucide-react'
import { useStore } from '../store/StoreContext.jsx'

// Bottom-center toasts. "sms" toasts render as a phone-message bubble to
// demonstrate the ready-to-collect text notification.
export default function Toaster() {
  const { toasts, dismissToast, setBasketOpen } = useStore()

  return (
    <div className="fixed inset-x-0 bottom-24 z-[90] flex flex-col items-center gap-2 px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="pointer-events-auto w-full max-w-sm"
          >
            {t.kind === 'sms' ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-graphite-800/95 backdrop-blur-xl shadow-glass overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-emerald-500/10">
                  <MessageSquare size={14} className="text-emerald-300" />
                  <span className="text-xs font-medium text-emerald-200">SMS · to {t.to}</span>
                  <button onClick={() => dismissToast(t.id)} className="ml-auto text-slate-400 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
                <p className="px-4 py-3 text-sm text-slate-100 leading-relaxed">{t.body}</p>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-graphite-800/95 backdrop-blur-xl shadow-glass px-4 py-3">
                <span className={`mt-0.5 ${t.kind === 'success' ? 'text-emerald-400' : 'text-electric-400'}`}>
                  {t.kind === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
                </span>
                <div className="min-w-0">
                  {t.title && <p className="text-sm font-semibold text-white">{t.title}</p>}
                  {t.body && <p className="text-[13px] text-slate-300 leading-relaxed">{t.body}</p>}
                  {t.action === 'basket' && (
                    <button
                      onClick={() => { setBasketOpen(true); dismissToast(t.id) }}
                      className="mt-1.5 text-xs font-semibold text-electric-400 hover:text-electric-300"
                    >
                      Open collection basket →
                    </button>
                  )}
                </div>
                <button onClick={() => dismissToast(t.id)} className="ml-1 text-slate-500 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
