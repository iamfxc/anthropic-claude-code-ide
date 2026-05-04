// Mock "Vape Guide" assistant. This is a deterministic intent router, not a
// real LLM. When a real model is wired in (OpenAI, Claude, etc.) keep the same
// shape — { intents, fallback, welcome } — and replace `routeMessage` with an
// API call in /components/AIAssistant.jsx.

export const welcome = {
  text: "Hi, I'm your digital shop assistant. Tell me what you're looking for — a starter kit, a smoother flavour, replacement coils, or help choosing what to ask for in-store.",
}

export const quickPrompts = [
  { id: 'new', label: "I'm new to vaping" },
  { id: 'liquid', label: 'I need e-liquid' },
  { id: 'coils', label: 'I need replacement coils' },
  { id: 'smooth', label: 'I want a smooth flavour' },
  { id: 'deals', label: 'What deals are available?' },
  { id: 'contact', label: 'How do I contact the shop?' },
]

const intents = [
  {
    id: 'new',
    keywords: ['new', 'beginner', 'first', 'switch', 'starter', 'start'],
    reply:
      "No problem. For new adult customers, the easiest place to start is usually a refillable pod system or starter kit. I can help you compare simple options, but the store will confirm what's suitable and currently available when you call or visit.",
    suggest: ['pod-starter-01', 'starter-kit-04', 'pod-system-02'],
  },
  {
    id: 'liquid',
    keywords: ['liquid', 'e-liquid', 'eliquid', 'juice', 'flavour', 'flavor'],
    reply:
      "Great. For e-liquids, the main choices are flavour family (fruity, menthol, dessert, tobacco), bottle size, and nicotine strength. If you're using a pod system, nic salts are usually smoother. Tell me which family you prefer or try the Flavour Finder.",
    suggest: ['eliquid-06', 'salts-09', 'eliquid-08'],
  },
  {
    id: 'coils',
    keywords: ['coil', 'coils', 'burnt', 'burnt taste', 'replace'],
    reply:
      "Coils are best chosen by your device name. Tell me the kit you're using and I can point to the right family — or call the shop with the device name and we'll match it for you.",
    suggest: ['coil-13', 'coil-14', 'coil-15'],
  },
  {
    id: 'smooth',
    keywords: ['smooth', 'soft', 'mild', 'gentle', 'easy'],
    reply:
      "If you're after a smoother feel, nic salts on a refillable pod usually deliver that. Menthol and fruit blends tend to feel cleaner; dessert flavours feel rounder. The store can confirm what's currently available.",
    suggest: ['salts-09', 'salts-12', 'pod-system-02'],
  },
  {
    id: 'deals',
    keywords: ['deal', 'deals', 'offer', 'offers', 'discount', 'sale'],
    reply:
      "Today's online deal section shows featured products, but stock and prices need to be confirmed directly with the shop. Would you like to call now?",
    suggest: ['pod-starter-01', 'eliquid-06', 'tank-17'],
  },
  {
    id: 'contact',
    keywords: ['contact', 'call', 'phone', 'visit', 'hours', 'open', 'where'],
    reply:
      "We're at 146 Parrock St, Gravesend DA12 1EY. The shop opens 9 am Monday — call 07838 408518 during opening hours. You can also tap Directions for Google Maps.",
    suggest: [],
  },
  {
    id: 'advanced',
    keywords: ['mod', 'sub-ohm', 'rda', 'rta', 'advanced', 'cloud', 'wattage'],
    reply:
      "For advanced setups, mods and sub-ohm tanks live under Advanced Devices. The exact in-store range changes — best to call ahead with the brand or tank model you're after.",
    suggest: ['advanced-21', 'advanced-22', 'advanced-24'],
  },
  {
    id: 'safety',
    keywords: ['age', '18', 'id', 'identification', 'challenge'],
    reply:
      "We only sell to customers aged 18+. Valid ID may be required in-store under Challenge 25. Single-use disposable vapes are not sold.",
    suggest: [],
  },
  {
    id: 'price',
    keywords: ['price', 'cost', 'how much', 'cheap', 'budget'],
    reply:
      "Prices and offers change, so I won't quote a number — please confirm with the store. As a guide, starter kits sit at the £ end and advanced setups closer to £££.",
    suggest: ['starter-kit-04', 'pod-system-02', 'advanced-21'],
  },
]

const fallback = {
  reply:
    "I can help with starter kits, refillable pods, e-liquids, nic salts, coils, tanks, chargers and accessories. Pick one of the quick options below, or rephrase what you're looking for.",
  suggest: [],
}

export function routeMessage(text) {
  const lower = text.trim().toLowerCase()
  if (!lower) return fallback
  // First exact-id match (used by quick-prompt buttons).
  const direct = intents.find((i) => i.id === lower)
  if (direct) return { reply: direct.reply, suggest: direct.suggest }
  // Then keyword scan.
  const match = intents.find((i) => i.keywords.some((k) => lower.includes(k)))
  return match ? { reply: match.reply, suggest: match.suggest } : fallback
}
