import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Phone, MapPin } from 'lucide-react'
import { welcome, quickPrompts, routeMessage } from '../data/assistant.js'
import { products } from '../data/products.js'
import { business } from '../data/business.js'

// Floating bubble + chat panel. The conversational logic is shared with the
// in-page assistant section by importing the same `routeMessage` from data.
export default function FloatingAssistant({ open, setOpen, seed, clearSeed }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: welcome.text },
  ])
  const [input, setInput] = useState('')
  const listRef = useRef(null)

  // Seed text from "Ask AI About This" buttons elsewhere in the page.
  useEffect(() => {
    if (seed && open) {
      send(seed)
      clearSeed?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  const send = (text) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed) return
    const { reply, suggest } = routeMessage(trimmed)
    const recs = (suggest ?? [])
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean)
    setMessages((m) => [
      ...m,
      { role: 'user', text: trimmed },
      { role: 'assistant', text: reply, recs },
    ])
    setInput('')
  }

  return (
    <>
      {/* Bubble */}
      <button
        aria-label="Open shop assistant"
        onClick={() => setOpen(true)}
        className={`fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold
          bg-gradient-to-r from-electric-500 to-ember-500 text-graphite-950 shadow-glow
          transition-transform hover:-translate-y-0.5 ${open ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <Sparkles size={16} />
        <span className="hidden sm:inline">Vape Guide</span>
        <span className="grid place-items-center text-[10px] font-bold rounded-full bg-graphite-950/30 px-1.5 py-0.5">AI</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="fixed bottom-5 right-5 z-50 w-[min(94vw,380px)] glass-strong rounded-3xl overflow-hidden flex flex-col"
            style={{ maxHeight: 'min(75vh, 640px)' }}
            role="dialog"
            aria-label="Vape Guide chat"
          >
            <div className="flex items-center justify-between gap-3 p-4 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-electric-500/15 text-electric-400 ring-1 ring-electric-500/30">
                  <Sparkles size={16} />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-white">Vape Guide</p>
                  <p className="text-[11px] text-slate-400">Mock assistant · 18+ only</p>
                </div>
              </div>
              <button
                aria-label="Close assistant"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <Bubble key={i} m={m} />
              ))}
            </div>

            <div className="px-4 pt-2 pb-3 border-t border-white/5">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {quickPrompts.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => send(q.id)}
                    className="chip hover:bg-white/10 transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <a href={business.phoneTel} className="btn-ghost py-2 text-xs"><Phone size={13}/> Call store</a>
                <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="btn-ghost py-2 text-xs"><MapPin size={13}/> Directions</a>
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); send() }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question…"
                  aria-label="Message"
                  className="flex-1 rounded-full border border-white/10 bg-graphite-900/70 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-electric-400 focus:outline-none"
                />
                <button type="submit" aria-label="Send" className="btn-primary py-2.5 px-3">
                  <Send size={15} />
                </button>
              </form>
              {/*
                FUTURE: replace `routeMessage` with a real API call.
                Example for Anthropic Claude (server-side proxy required):
                  const r = await fetch('/api/assistant', { method:'POST', body: JSON.stringify({ messages }) })
                  const { reply } = await r.json()
              */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Bubble({ m }) {
  const isUser = m.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-electric-500 to-ember-500 text-graphite-950 font-medium'
            : 'bg-graphite-900/70 border border-white/5 text-slate-200'
        }`}
      >
        <p>{m.text}</p>
        {!isUser && m.recs?.length ? (
          <div className="mt-2 grid gap-1.5">
            {m.recs.slice(0, 3).map((p) => (
              <div key={p.id} className="rounded-xl border border-white/10 bg-white/5 p-2">
                <p className="text-[12px] font-semibold text-white">{p.title}</p>
                <p className="text-[11px] text-slate-400">{p.bestFor}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
