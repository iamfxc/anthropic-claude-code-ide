// Generates a top-level index.html for the gh-pages branch.
// Lists every subfolder (one per site preview) as a card link.
//
// Inputs:
//   argv[2] = path to gh-pages working tree (the current directory by default)
//   argv[3] = path to .github/site-config.json (optional, for nicer labels)
//
// Output: writes <ghPagesDir>/index.html

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ghDir = process.argv[2] ?? '.'
const configPath = process.argv[3]

let labels = {}
if (configPath && existsSync(configPath)) {
  try {
    const cfg = JSON.parse(readFileSync(configPath, 'utf8'))
    for (const meta of Object.values(cfg.branches ?? {})) {
      if (meta?.slug) labels[meta.slug] = meta.label ?? meta.slug
    }
  } catch {
    // Silent fall-through; we just lose the nice labels.
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

const cards = slugs
  .map((slug) => {
    const label = labels[slug] ?? titleCase(slug)
    return `      <a class="card" href="./${slug}/">
        <div class="name">${escape(label)}</div>
        <div class="url">./${slug}/</div>
      </a>`
  })
  .join('\n')

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Site previews</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 56px 20px 80px; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: #07090d; color: #e2e8f0; line-height: 1.5; }
  .wrap { max-width: 720px; margin: 0 auto; }
  h1 { font-size: 30px; margin: 0 0 6px; color: #fff; letter-spacing: -0.01em; }
  p.lede { color: #94a3b8; margin: 0 0 28px; }
  .empty { padding: 28px; border: 1px dashed rgba(255,255,255,.1); border-radius: 16px; color: #94a3b8; text-align: center; }
  a.card { display: block; text-decoration: none; color: inherit; padding: 18px 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 14px; background: rgba(255,255,255,.03); margin: 10px 0; transition: background .18s, border-color .18s, transform .18s; }
  a.card:hover { background: rgba(255,255,255,.06); border-color: #5fb7ff; transform: translateY(-1px); }
  .name { font-weight: 600; color: #fff; font-size: 18px; }
  .url { color: #5fb7ff; font-size: 12px; margin-top: 4px; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
  footer { margin-top: 28px; color: #475569; font-size: 12px; text-align: center; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>Site previews</h1>
    <p class="lede">Live previews of in-progress client sites in this repo. Each card opens a single-page site for an owner to review.</p>
${cards || '    <div class="empty">No previews published yet.</div>'}
    <footer>Updated ${new Date().toISOString().slice(0, 10)} · auto-generated from <code>gh-pages</code>.</footer>
  </div>
</body>
</html>
`

writeFileSync(join(ghDir, 'index.html'), html)
console.log(`Wrote landing index with ${slugs.length} site(s):`, slugs.join(', '))

function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  )
}
