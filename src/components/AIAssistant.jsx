import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Send, Phone, MapPin, Bot } from 'lucide-react'
import { welcome, quickPrompts, routeMessage } from '../data/assistant.js'
import { products } from '../data/products.js'
import { business } from '../data/business.js'
import SectionHeading from './SectionHeading.jsx'

// Full inline AI Assistant section. Mirrors the floating widget but always
// visible inside the page so the owner can demo the experience to customers.
export default function AIAssistant() {
  const [messages, setMessages] = useState([{ role: 'assistant', text: welcome.text }])
  const [input, setInput] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

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
    <section id="assistant" className="section">
      <div className="container-narrow">
        <SectionHeading
          eyebrow="Vape Guide"
          title={<>Talk to your <span className="gradient-text">digital shop assistant</span></>}
          lede="A friendly, calm guide that explains products, points to flavours and helps adult customers know what to ask for in-store. This is a front-end mock — designed so a real LLM can be plugged in later."
        />

        <div className="mt-10 grid lg:grid-cols-[1.2fr,1fr] gap-6">
          {/* Chat panel */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="glass-strong rounded-3xl overflow-hidden flex flex-col min-h-[520px]"
          >
            <div className="flex items-center gap-3 p-4 border-b border-white/5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-electric-500/15 text-electric-400 ring-1 ring-electric-500/30">
                <Bot size={18} />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-white">Vape Guide</p>
                <p className="text-[11px] text-slate-400">Friendly · calm · adult-only · not medical advice</p>
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[420px]">
              {messages.map((m, i) => (
                <Bubble key={i} m={m} />
              ))}
            </div>

            <div className="px-4 pt-2 pb-3 border-t border-white/5">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {quickPrompts.map((q) => (
                  <button key={q.id} onClick={() => send(q.id)} className="chip hover:bg-white/10 transition-colors">
                    {q.label}
                  </button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about kits, e-liquids, coils, flavours…"
                  aria-label="Ask Vape Guide"
                  className="flex-1 rounded-full border border-white/10 bg-graphite-900/70 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-electric-400 focus:outline-none"
                />
                <button type="submit" className="btn-primary py-2.5 px-3" aria-label="Send">
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>

          {/* Side panel */}
          <div className="grid gap-4 content-start">
            <div className="glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-electric-400">How it helps</p>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-200">
                <Bullet>Choosing beginner-friendly products</Bullet>
                <Bullet>Explaining categories without jargon</Bullet>
                <Bullet>Finding flavour profiles</Bullet>
                <Bullet>Understanding coils and pods</Bullet>
                <Bullet>Knowing what to ask for in-store</Bullet>
                <Bullet>Pointing to the shop for live stock</Bullet>
              </ul>
            </div>
            <div className="glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-ember-400">Built for the future</p>
              <p className="mt-2 text-sm text-slate-300/90 leading-relaxed">
                Today this is a deterministic mock with predefined responses. The conversation surface
                is wired so a real model (OpenAI, Anthropic) can be added without redesigning the UI.
              </p>
              <p className="mt-3 text-[11px] text-slate-500">
                {/* See FloatingAssistant.jsx for the comment block describing the integration point. */}
                Integration point: <span className="font-mono text-slate-400">routeMessage()</span> in <span className="font-mono">/data/assistant.js</span>.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href={business.phoneTel} className="btn-primary"><Phone size={14}/> Call store</a>
              <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="btn-ghost"><MapPin size={14}/> Directions</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Bullet({ children }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-electric-400 shrink-0" />
      <span>{children}</span>
    </li>
  )
}

function Bubble({ m }) {
  const isUser = m.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
        isUser
          ? 'bg-gradient-to-br from-electric-500 to-ember-500 text-graphite-950 font-medium'
          : 'bg-graphite-900/70 border border-white/5 text-slate-200'
      }`}>
        <p className="flex items-start gap-1.5">
          {!isUser && <Sparkles size={12} className="mt-1 shrink-0 text-electric-400" />}
          <span>{m.text}</span>
        </p>
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
