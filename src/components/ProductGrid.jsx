import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, X, Info } from 'lucide-react'
import { products } from '../data/products.js'
import { categories } from '../data/categories.js'
import { flavourFamilies, nicStrengths, useCases, budgets } from '../data/flavours.js'
import ProductCard from './ProductCard.jsx'
import SectionHeading from './SectionHeading.jsx'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export default function ProductGrid({ categoryFilter, setCategoryFilter, onAskAssistant }) {
  const [filters, setFilters] = useState({
    level: null,
    category: null,
    flavour: null,
    nic: null,
    budget: null,
    use: null,
  })

  // Sync external category-pick into the local filter state.
  useEffect(() => {
    if (categoryFilter) setFilters((f) => ({ ...f, category: categoryFilter }))
  }, [categoryFilter])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.level && p.level !== filters.level) return false
      if (filters.category && p.category !== filters.category) return false
      if (filters.flavour && !(p.flavourFamily ?? []).includes(filters.flavour)) return false
      if (filters.nic && !(p.nicStrength ?? []).includes(filters.nic)) return false
      if (filters.budget && p.budget !== filters.budget) return false
      if (filters.use && !(p.use ?? []).includes(filters.use)) return false
      return true
    })
  }, [filters])

  const clearAll = () => {
    setFilters({ level: null, category: null, flavour: null, nic: null, budget: null, use: null })
    setCategoryFilter?.(null)
  }
  const activeCount = Object.values(filters).filter(Boolean).length

  return (
    <section id="products" className="section">
      <div className="container-narrow">
        <SectionHeading
          eyebrow="Browse"
          title={<>Product Discovery</>}
          lede="Filter by level, category, flavour, nicotine and budget. The grid is built to scale to hundreds of products without overwhelming the customer."
        />

        <div className="mt-8 grid lg:grid-cols-[280px,1fr] gap-6">
          <FilterPanel filters={filters} setFilters={setFilters} clearAll={clearAll} activeCount={activeCount} />

          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <p className="text-sm text-slate-400">
                Showing <span className="text-white font-semibold">{filtered.length}</span> of {products.length} listed products
              </p>
              {activeCount > 0 && (
                <button onClick={clearAll} className="text-xs text-electric-400 hover:text-white inline-flex items-center gap-1">
                  <X size={12} /> Clear filters
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 mb-5 flex items-start gap-3">
              <Info size={16} className="mt-0.5 shrink-0 text-electric-400" />
              <p className="text-[13px] text-slate-300/90 leading-relaxed">
                Not every in-store product is listed online yet. This page is designed to help adult
                customers discover the right category before visiting or calling.
              </p>
            </div>

            {filtered.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <motion.div
                layout
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              >
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ProductCard product={p} onAskAssistant={onAskAssistant} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function EmptyState({ onClear }) {
  return (
    <div className="glass rounded-2xl p-8 text-center">
      <p className="font-display text-lg text-white">Nothing matches those filters yet</p>
      <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
        The in-store range is wider than what's listed here. Clear the filters or call the shop for
        live availability.
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <button onClick={onClear} className="btn-ghost">Clear filters</button>
      </div>
    </div>
  )
}

function FilterPanel({ filters, setFilters, clearAll, activeCount }) {
  const update = (key, value) => setFilters((f) => ({ ...f, [key]: f[key] === value ? null : value }))

  return (
    <aside className="lg:sticky lg:top-24 self-start glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-500/10 text-electric-400 ring-1 ring-electric-500/20">
            <Filter size={14} />
          </span>
          <p className="font-display text-base text-white">Filters</p>
        </div>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs text-slate-400 hover:text-white">Reset</button>
        )}
      </div>

      <FilterGroup label="Experience level" options={LEVELS} value={filters.level} onPick={(v) => update('level', v)} />
      <FilterGroup label="Category" options={categories.map((c) => ({ id: c.id, label: c.name }))} value={filters.category} onPick={(v) => update('category', v)} />
      <FilterGroup label="Flavour family" options={flavourFamilies.map((f) => f.id)} value={filters.flavour} onPick={(v) => update('flavour', v)} />
      <FilterGroup label="Nicotine strength" options={nicStrengths.filter((n) => n !== 'Not sure')} value={filters.nic} onPick={(v) => update('nic', v)} />
      <FilterGroup label="Budget" options={budgets} value={filters.budget} onPick={(v) => update('budget', v)} />
      <FilterGroup label="Best use" options={useCases} value={filters.use} onPick={(v) => update('use', v)} />
    </aside>
  )
}

function FilterGroup({ label, options, value, onPick }) {
  return (
    <div className="mt-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((o) => {
          const id = typeof o === 'string' ? o : o.id
          const text = typeof o === 'string' ? o : o.label
          const active = value === id
          return (
            <button
              key={id}
              onClick={() => onPick(id)}
              className={`rounded-full px-2.5 py-1 text-xs border transition-colors ${
                active
                  ? 'bg-electric-500/20 border-electric-500/40 text-electric-300'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
