// Shared eyebrow / title / lede heading block used across page sections.
export default function SectionHeading({ eyebrow, title, lede, align = 'left' }) {
  const center = align === 'center'
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <span className="text-xs uppercase tracking-[0.2em] text-electric-400">{eyebrow}</span>
      )}
      <h2 className="heading mt-3 text-3xl md:text-4xl leading-tight">{title}</h2>
      {lede && <p className="mt-3 text-slate-300/90 leading-relaxed">{lede}</p>}
    </div>
  )
}
