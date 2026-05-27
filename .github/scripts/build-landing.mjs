// Generates the "Studio Previews" landing page for the gh-pages root.
// Lists every published site (one subfolder each) as a card linking to its
// client-facing URL (the passcode gate, when one is configured).
//
// Usage: node build-landing.mjs <ghPagesDir> <site-config.json>

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ghDir = process.argv[2] ?? '.'
const configPath = process.argv[3]

let labels = {}
let gated = {}
if (configPath && existsSync(configPath)) {
  try {
    const cfg = JSON.parse(readFileSync(configPath, 'utf8'))
    for (const meta of Object.values(cfg.branches ?? {})) {
      if (meta?.slug) {
        labels[meta.slug] = meta.label ?? meta.slug
        gated[meta.slug] = Boolean(meta.passcode)
      }
    }
  } catch {
    // Lose nice labels but still render.
  }
}

const slugs = readdirSync(ghDir)
  .filter((name) => !name.startsWith('.') && name !== 'index.html')
  .filter((name) => {
    try { return statSync(join(ghDir, name)).isDirectory() } catch { return false }
  })
  .sort()

const titleCase = (s) =>
  s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  )

const lock = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 10V8a6 6 0 1 1 12 0v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="4" y="10" width="16" height="10" rx="2.5" stroke="currentColor" stroke-width="2"/></svg>`
const arrow = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`

const cards = slugs
  .map((slug) => {
    const label = esc(labels[slug] ?? titleCase(slug))
    const isGated = gated[slug]
    const badge = isGated
      ? `<span class="badge">${lock} Passcode protected</span>`
      : `<span class="badge open">Open preview</span>`
    return `      <a class="card" href="./${slug}/">
        <div class="card-main">
          <div class="name">${label}</div>
          <div class="url">/${slug}/</div>
          ${badge}
        </div>
        <span class="go">${arrow}</span>
      </a>`
  })
  .join('\n')

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<title>Studio Previews</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 64px 20px 96px;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: #07090d; color: #e2e8f0; line-height: 1.5;
    background-image:
      radial-gradient(ellipse 80% 40% at 50% -5%, rgba(47,150,255,.10), transparent 60%),
      radial-gradient(ellipse 50% 40% at 95% 15%, rgba(17,195,154,.08), transparent 60%); }
  .wrap { max-width: 760px; margin: 0 auto; }
  .brand { display: inline-flex; align-items: center; gap: 8px;
    font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: #5fb7ff; }
  .dot { width: 7px; height: 7px; border-radius: 999px;
    background: linear-gradient(90deg,#2f96ff,#11c39a); }
  h1 { font-size: 32px; margin: 14px 0 8px; color: #fff; letter-spacing: -.02em; }
  p.lede { color: #94a3b8; margin: 0 0 32px; max-width: 52ch; }
  .empty { padding: 28px; border: 1px dashed rgba(255,255,255,.1); border-radius: 16px;
    color: #94a3b8; text-align: center; }
  a.card { display: flex; align-items: center; justify-content: space-between; gap: 16px;
    text-decoration: none; color: inherit; padding: 18px 20px;
    border: 1px solid rgba(255,255,255,.08); border-radius: 16px;
    background: rgba(255,255,255,.03); margin: 12px 0;
    transition: background .18s, border-color .18s, transform .18s; }
  a.card:hover { background: rgba(255,255,255,.06); border-color: #5fb7ff; transform: translateY(-1px); }
  .name { font-weight: 600; color: #fff; font-size: 18px; }
  .url { color: #5fb7ff; font-size: 12px; margin-top: 3px;
    font-family: ui-monospace, "SF Mono", Menlo, monospace; }
  .badge { display: inline-flex; align-items: center; gap: 5px; margin-top: 10px;
    font-size: 11px; color: #cbd5e1; padding: 3px 9px; border-radius: 999px;
    border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.04); }
  .badge.open { color: #6ee7b7; }
  .go { color: #5fb7ff; flex: 0 0 auto; opacity: .8; }
  footer { margin-top: 40px; color: #475569; font-size: 12px; }
  footer code { color: #64748b; }
</style>
</head>
<body>
  <div class="wrap">
    <span class="brand"><span class="dot"></span>Studio Previews</span>
    <h1>Client site previews</h1>
    <p class="lede">Private, in-progress website previews prepared for client review. Each card opens a single project. Passcode-protected previews require the access code shared with that client.</p>
${cards || '    <div class="empty">No previews published yet.</div>'}
    <footer>Updated ${new Date().toISOString().slice(0, 10)} · auto-generated. Please share individual project links with the relevant client only.</footer>
  </div>
</body>
</html>
`

writeFileSync(join(ghDir, 'index.html'), html)
console.log(`Wrote Studio Previews landing with ${slugs.length} site(s):`, slugs.join(', '))
