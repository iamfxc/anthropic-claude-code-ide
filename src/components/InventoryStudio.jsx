import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UploadCloud, FileSpreadsheet, Download, Sparkles, CheckCircle2,
  Boxes, Tags, Store, Clock, RefreshCw, Workflow, ArrowRight, Users,
} from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'

// Demo-only sample inventory (reusable products only — no disposables).
const SAMPLE_CSV = `Product Name,Category,Brand,Price,Nicotine,Flavour,Stock
Refillable Pod Starter Kit,Starter Kits,AeroPod,24.99,,,18
Compact Rechargeable Pod Device,Pod Systems,AeroPod,29.99,,,12
Pod-Mod Hybrid Kit,Pod Systems,Voltedge,39.99,,,7
Nic Salt - Apple & Pear 10ml,Nicotine Salts,SaltLab,3.99,10mg,Apple & Pear,40
Nic Salt - Menthol Mint 10ml,Nicotine Salts,SaltLab,3.99,20mg,Menthol Mint,36
Premium E-Liquid - Mixed Berries 50ml,E-Liquids,CloudCraft,12.99,3mg,Mixed Berries,22
Iced Menthol Shortfill 50ml,E-Liquids,CloudCraft,12.99,0mg,Iced Menthol,15
Replacement Coil Pack (5x),Replacement Coils,MeshPro,14.99,,,30
MTL Coil Pack - 1.0ohm,Replacement Coils,MeshPro,12.99,,,25
Replacement Sub-ohm Tank,Tanks & Accessories,Voltedge,19.99,,,9
USB-C Fast Charge Cable,Chargers & Batteries,PowerLine,5.99,,,50
Dual 18650 Smart Charger,Chargers & Batteries,PowerLine,21.99,,,8
Single-Battery Regulated Mod,Advanced Devices,Voltedge,44.99,,,6
Vanilla Custard Nic Salt 10ml,Nicotine Salts,SaltLab,3.99,6mg,Vanilla Custard,19`

// Minimal but correct CSV parser (handles quoted fields & escaped quotes).
function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    const next = text[i + 1]
    if (inQuotes) {
      if (c === '"' && next === '"') { field += '"'; i++ }
      else if (c === '"') inQuotes = false
      else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\r') { /* ignore */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else field += c
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

function toObjects(rows) {
  if (rows.length < 2) return []
  const headers = rows[0].map((h) => h.trim())
  return rows.slice(1).map((r) => {
    const o = {}
    headers.forEach((h, i) => (o[h] = (r[i] ?? '').trim()))
    return o
  })
}

const scaleCards = [
  { icon: Store, title: 'Shopify-ready structure', body: 'Columns map straight to a Shopify catalogue, so switching on checkout later is a flip, not a rebuild.' },
  { icon: Tags, title: 'Auto category & tags', body: 'Products route into the right category and pick up tags automatically on import.' },
  { icon: RefreshCw, title: 'Re-upload any time', body: 'Changed prices or stock? Upload a fresh CSV and the catalogue updates — no developer needed.' },
  { icon: Sparkles, title: 'AI-assisted descriptions', body: 'Generate clean product descriptions from a name or barcode (future add-on).' },
]

const steps = [
  { n: 1, t: 'Export your list', d: 'From your till, supplier sheet or stock take.' },
  { n: 2, t: 'Drop in the CSV', d: 'Drag the file in — columns map automatically.' },
  { n: 3, t: 'Auto-organised', d: 'Grouped by category, brand, flavour & nicotine.' },
  { n: 4, t: 'Feature the best', d: 'Pin a few best sellers to the front of shop.' },
  { n: 5, t: 'Live for customers', d: 'Clean, fast browsing — no overwhelm.' },
]

export default function InventoryStudio() {
  const [status, setStatus] = useState('idle') // idle | parsing | done
  const [items, setItems] = useState([])
  const [fileName, setFileName] = useState('')
  const [importMs, setImportMs] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const ingest = useCallback((text, name) => {
    setError('')
    setStatus('parsing')
    setFileName(name)
    const t0 = performance.now()
    // Small artificial delay so the "processing" animation reads as real work.
    setTimeout(() => {
      try {
        const objs = toObjects(parseCSV(text))
        if (!objs.length) {
          setError('No rows found. Check the file has a header row and at least one product.')
          setStatus('idle')
          return
        }
        const elapsed = Math.max(0.3, (performance.now() - t0) / 1000)
        setItems(objs)
        setImportMs(elapsed)
        setStatus('done')
      } catch {
        setError('Could not read that file. Try the sample or the template below.')
        setStatus('idle')
      }
    }, 700)
  }, [])

  const onFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => ingest(String(e.target?.result ?? ''), file.name)
    reader.onerror = () => setError('Could not read that file.')
    reader.readAsText(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV.split('\n').slice(0, 1).join('\n') + '\n'], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vape-shop-inventory-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setStatus('idle')
    setItems([])
    setFileName('')
    setError('')
  }

  const categories = [...new Set(items.map((i) => i.Category).filter(Boolean))]
  const brands = [...new Set(items.map((i) => i.Brand).filter(Boolean))]

  return (
    <section id="inventory" className="section">
      <div className="container-narrow">
        <SectionHeading
          eyebrow="Your back office"
          title={<>Upload your whole shop in minutes — <span className="gradient-text">you stay in control</span></>}
          lede="The biggest worry is getting hundreds of products online. Here's the answer: a spreadsheet in, a clean catalogue out. You and your staff manage it directly — no developer, no waiting, no extra fees."
        />

        {/* Faux app window */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-graphite-900/70 overflow-hidden shadow-glass">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-graphite-800/60">
            <span className="h-3 w-3 rounded-full bg-red-400/70" />
            <span className="h-3 w-3 rounded-full bg-amber-400/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
            <span className="ml-3 text-xs text-slate-400 font-mono">inventory-studio · store manager</span>
            <span className="ml-auto chip text-[10px]">Live demo</span>
          </div>

          <div className="p-5 md:p-7">
            <AnimatePresence mode="wait">
              {status !== 'done' ? (
                <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <label
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    className={`relative grid place-items-center text-center rounded-2xl border-2 border-dashed p-10 md:p-14 cursor-pointer transition-colors ${
                      dragOver ? 'border-electric-400 bg-electric-500/5' : 'border-white/12 hover:border-white/25 bg-white/[0.02]'
                    }`}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".csv,text/csv"
                      className="sr-only"
                      onChange={(e) => onFile(e.target.files?.[0])}
                    />
                    <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-electric-500/10 text-electric-400 ring-1 ring-electric-500/25 ${status === 'parsing' ? 'animate-pulse' : ''}`}>
                      {status === 'parsing' ? <RefreshCw size={24} className="animate-spin" /> : <UploadCloud size={24} />}
                    </span>
                    <p className="mt-4 font-display text-lg text-white">
                      {status === 'parsing' ? 'Importing your products…' : 'Drag your product CSV here'}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {status === 'parsing' ? 'Mapping columns and grouping by category' : 'or tap to browse — .csv from any till or spreadsheet'}
                    </p>
                  </label>

                  {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <button onClick={() => ingest(SAMPLE_CSV, 'sample-inventory.csv')} className="btn-primary py-2.5">
                      <Sparkles size={15} /> Try it with sample data
                    </button>
                    <button onClick={downloadTemplate} className="btn-ghost py-2.5">
                      <Download size={15} /> Download CSV template
                    </button>
                    <button onClick={() => inputRef.current?.click()} className="btn-ghost py-2.5">
                      <FileSpreadsheet size={15} /> Choose a file
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {/* Stat row */}
                  <div className="flex items-center gap-2 text-emerald-300 text-sm">
                    <CheckCircle2 size={18} /> Imported <span className="font-semibold">{fileName}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Stat icon={Boxes} value={items.length} label="Products" />
                    <Stat icon={Tags} value={categories.length} label="Categories" />
                    <Stat icon={Store} value={brands.length} label="Brands" />
                    <Stat icon={Clock} value={`${importMs.toFixed(1)}s`} label="Import time" />
                  </div>

                  {/* Auto-detected categories */}
                  <div className="mt-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Auto-grouped into</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {categories.map((c) => (
                        <span key={c} className="chip text-[11px]">{c}</span>
                      ))}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="mt-5 overflow-hidden rounded-2xl border border-white/8">
                    <div className="max-h-72 overflow-y-auto">
                      <table className="w-full text-left text-[13px]">
                        <thead className="sticky top-0 bg-graphite-800/90 backdrop-blur text-slate-400">
                          <tr>
                            <th className="px-4 py-2.5 font-medium">Product</th>
                            <th className="px-4 py-2.5 font-medium hidden sm:table-cell">Category</th>
                            <th className="px-4 py-2.5 font-medium hidden md:table-cell">Brand</th>
                            <th className="px-4 py-2.5 font-medium text-right">Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((it, i) => (
                            <motion.tr
                              key={i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: Math.min(i * 0.02, 0.4) }}
                              className="border-t border-white/5 hover:bg-white/[0.03]"
                            >
                              <td className="px-4 py-2.5 text-white">{it['Product Name'] ?? Object.values(it)[0]}</td>
                              <td className="px-4 py-2.5 text-slate-300 hidden sm:table-cell">{it.Category}</td>
                              <td className="px-4 py-2.5 text-slate-400 hidden md:table-cell">{it.Brand}</td>
                              <td className="px-4 py-2.5 text-right">
                                <StockPill n={Number(it.Stock)} />
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={reset} className="btn-ghost py-2.5">
                      <UploadCloud size={15} /> Import another file
                    </button>
                    <span className="inline-flex items-center gap-2 text-xs text-slate-500 px-2">
                      {/* FUTURE: POST parsed rows to Shopify Admin API / inventory service here. */}
                      Demo only — in the live system this writes straight to your catalogue.
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Reassurance for owner + staff */}
        <div className="mt-6 grid md:grid-cols-[1.1fr,1fr] gap-3">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-center gap-2 text-emerald-300">
              <Users size={18} />
              <p className="font-display text-base text-white">Run by you and your staff — not by invoices</p>
            </div>
            <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px] text-slate-200">
              {[
                'Add or update stock yourself in minutes',
                'No fee to change a price or add a line',
                'Bulk edit in a spreadsheet you already know',
                'Re-upload any time stock changes',
                'No technical knowledge required',
                'Never wait on a developer again',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {scaleCards.map((c) => (
              <div key={c.title} className="glass rounded-2xl p-4">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-ember-500/10 text-ember-400 ring-1 ring-ember-500/20">
                  <c.icon size={16} />
                </span>
                <h4 className="text-sm font-semibold text-white mt-3">{c.title}</h4>
                <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <div className="mt-6 glass-strong rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-electric-500/15 text-electric-400 ring-1 ring-electric-500/30">
              <Workflow size={16} />
            </span>
            <h3 className="font-display text-xl text-white">Five steps, not a five-week project</h3>
          </div>
          <ol className="grid gap-3 md:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.n} className="relative rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full text-xs font-bold bg-gradient-to-br from-electric-500 to-ember-500 text-graphite-950">{s.n}</span>
                  <p className="font-semibold text-white text-sm">{s.t}</p>
                </div>
                <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">{s.d}</p>
                {i < steps.length - 1 && (
                  <ArrowRight size={14} className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-electric-400">
        <Icon size={15} />
        <span className="text-[11px] uppercase tracking-wider text-slate-500">{label}</span>
      </div>
      <p className="mt-1.5 font-display text-2xl text-white">{value}</p>
    </div>
  )
}

function StockPill({ n }) {
  if (!Number.isFinite(n)) return <span className="text-slate-500">—</span>
  const tone = n === 0 ? 'text-red-300 bg-red-500/10' : n < 10 ? 'text-amber-300 bg-amber-500/10' : 'text-emerald-300 bg-emerald-500/10'
  return <span className={`rounded-full px-2 py-0.5 text-[11px] ${tone}`}>{n === 0 ? 'Out' : `${n} in`}</span>
}
