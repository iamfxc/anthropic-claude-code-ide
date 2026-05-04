import { Sparkles, Phone } from 'lucide-react'
import { business } from '../data/business.js'

const badgeStyles = {
  'Best Seller': 'bg-electric-500/15 text-electric-400 ring-electric-500/30',
  'New': 'bg-ember-500/15 text-ember-400 ring-ember-500/30',
  'Staff Pick': 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  'Value Pick': 'bg-violet-500/15 text-violet-300 ring-violet-500/30',
  'Beginner Friendly': 'bg-electric-500/15 text-electric-400 ring-electric-500/30',
}

export default function ProductCard({ product, onAskAssistant, compact = false }) {
  const badgeClass = badgeStyles[product.badge] ?? 'bg-white/5 text-slate-300 ring-white/10'

  return (
    <article className={`glass rounded-2xl p-5 flex flex-col ${compact ? 'min-w-[270px] w-[270px]' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">{labelForCategory(product.category)}</p>
          <h3 className="font-display text-lg text-white leading-snug mt-0.5 truncate">{product.title}</h3>
        </div>
        {product.badge && (
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${badgeClass}`}>
            {product.badge}
          </span>
        )}
      </div>

      <p className="text-[13px] text-slate-300/90 mt-3 leading-relaxed line-clamp-3">{product.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {product.tags.slice(0, 3).map((t) => (
          <span key={t} className="chip text-[11px] py-0.5">{t}</span>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
        <div>
          <dt className="text-slate-500">Best for</dt>
          <dd className="text-slate-200 mt-0.5 line-clamp-2">{product.bestFor}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Price</dt>
          <dd className="text-slate-200 mt-0.5">Ask in-store</dd>
        </div>
      </dl>

      <p className="mt-3 text-[11px] text-slate-500">{product.availability}</p>

      <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => onAskAssistant?.(product.title)}
          className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium border border-electric-500/30 bg-electric-500/10 text-electric-400 hover:bg-electric-500/15 transition-colors"
        >
          <Sparkles size={13} /> Ask AI
        </button>
        <a
          href={business.phoneTel}
          className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
        >
          <Phone size={13} /> Call to check
        </a>
      </div>
    </article>
  )
}

function labelForCategory(id) {
  return ({
    'starter-kits': 'Starter Kit',
    'pod-systems': 'Pod System',
    'e-liquids': 'E-Liquid',
    'nic-salts': 'Nic Salt',
    'coils': 'Coils',
    'tanks': 'Tanks & Accessories',
    'chargers': 'Chargers & Batteries',
    'advanced': 'Advanced Device',
  })[id] ?? id
}
