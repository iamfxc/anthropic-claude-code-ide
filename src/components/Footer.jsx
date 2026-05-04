import { ShieldCheck, MapPin, Phone, MessageCircle } from 'lucide-react'
import { business } from '../data/business.js'

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/5 bg-graphite-950/80">
      <div className="container-narrow py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-electric-500 to-ember-500 text-graphite-950">
              <span className="font-display text-base font-bold">V</span>
            </span>
            <span className="font-display font-semibold text-white">Vape Shop Gravesend</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300/90">
            An adult-only (18+) local vape retailer on Parrock Street. Refillable kits, e-liquids,
            coils, tanks and accessories. Friendly product guidance from a 4.0★ rated store.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
            <ShieldCheck size={13} className="text-electric-400" />
            18+ only · Challenge 25 in-store
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-slate-400">Find us</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 text-electric-400" />
              <span>{business.address.line1}, {business.address.city} {business.address.postcode}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-electric-400" />
              <a href={business.phoneTel} className="hover:text-white">{business.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={15} className="text-electric-400" />
              <a href={business.whatsapp} target="_blank" rel="noreferrer" className="hover:text-white">
                WhatsApp the store
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-slate-400">Compliance</h4>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-400">
            <li>We only sell to customers aged 18+. Valid ID may be required in-store.</li>
            <li>Single-use disposable vapes are not sold.</li>
            <li>Product availability and prices must be confirmed with the store.</li>
            <li>This site does not make medical claims about vaping.</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-narrow py-5 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Vape Shop Gravesend · Serving adult customers in Gravesend and surrounding Kent areas.</p>
          <p className="text-slate-500">Concept site · placeholder data only.</p>
        </div>
      </div>
    </footer>
  )
}
