import { motion } from 'framer-motion'
import { MapPin, Phone, MessageCircle, Star, Clock } from 'lucide-react'
import { business } from '../data/business.js'
import SectionHeading from './SectionHeading.jsx'

export default function LocalTrust() {
  return (
    <section id="visit" className="section">
      <div className="container-narrow">
        <SectionHeading
          eyebrow="Visit us"
          title={<>Local, easy to find, <span className="gradient-text">easy to contact</span></>}
          lede="Whether you know exactly what you need or you want guidance before buying, the shop is here to help adult customers choose responsibly."
        />

        <div className="mt-10 grid lg:grid-cols-[1.2fr,1fr] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="glass-strong rounded-3xl p-6 md:p-8"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <Info icon={MapPin} label="Address">
                <p className="text-white">{business.address.line1}</p>
                <p className="text-slate-300">{business.address.city} {business.address.postcode}</p>
              </Info>
              <Info icon={Phone} label="Phone">
                <a href={business.phoneTel} className="text-white hover:text-electric-400">{business.phone}</a>
                <p className="text-slate-400 text-xs mt-0.5">Tap to call from mobile.</p>
              </Info>
              <Info icon={Star} label="Google rating">
                <p className="text-white">{business.rating}★ from {business.reviewCount} reviews</p>
                <p className="text-slate-400 text-xs mt-0.5">Reviews managed on Google Business Profile.</p>
              </Info>
              <Info icon={Clock} label="Right now">
                <p className="text-white">{business.todayClosedNote}</p>
                <p className="text-slate-400 text-xs mt-0.5">Confirm bank holiday hours by phone.</p>
              </Info>
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-2">
              <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="btn-primary">
                <MapPin size={14}/> Google Maps
              </a>
              <a href={business.phoneTel} className="btn-ghost">
                <Phone size={14}/> Call store
              </a>
              <a href={business.whatsapp} target="_blank" rel="noreferrer" className="btn-ghost">
                <MessageCircle size={14}/> WhatsApp
              </a>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-1">
              {business.hours.map((h) => (
                <div key={h.day} className="rounded-xl border border-white/5 bg-white/[0.03] p-2 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">{h.day.slice(0,3)}</p>
                  <p className="text-[11px] text-slate-200 mt-1">
                    {h.open === 'Closed' ? '—' : h.open}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              Opening hours are placeholders — confirm with the shop and update in <span className="font-mono text-slate-400">/data/business.js</span>.
            </p>
          </motion.div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative glass rounded-3xl overflow-hidden min-h-[320px]"
          >
            <div className="absolute inset-0 bg-graphite-900">
              {/* Stylised map placeholder — swap for an embedded iframe or Mapbox layer later. */}
              <svg viewBox="0 0 400 320" className="absolute inset-0 w-full h-full opacity-50">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1f2530" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <path d="M0 180 Q 100 140 220 200 T 400 180" stroke="#11c39a" strokeWidth="3" fill="none" opacity="0.5"/>
                <path d="M0 80 Q 120 60 240 120 T 400 80" stroke="#2f96ff" strokeWidth="3" fill="none" opacity="0.5"/>
              </svg>
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="glass-strong rounded-2xl p-5 text-center max-w-[260px]">
                <span className="grid mx-auto h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-electric-500 to-ember-500 text-graphite-950">
                  <MapPin size={18} />
                </span>
                <p className="mt-3 font-display text-white">{business.address.line1}</p>
                <p className="text-xs text-slate-400">{business.address.city} {business.address.postcode}</p>
                <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="btn-primary mt-4">
                  Open in Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Info({ icon: Icon, label, children }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-500/10 text-electric-400 ring-1 ring-electric-500/20">
          <Icon size={14} />
        </span>
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      </div>
      <div className="mt-2 text-sm">{children}</div>
    </div>
  )
}
