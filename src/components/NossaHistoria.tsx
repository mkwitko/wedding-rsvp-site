import { Baby } from 'lucide-react'
import { content } from '../content'
import { Section } from './Section'

export function NossaHistoria() {
  return (
    <Section eyebrow="como tudo começou" title="Nossa história" width="default">
      <div className="mx-auto mb-10 flex max-w-xl items-start justify-center gap-5 sm:gap-8">
        {content.historiaFotos.map((f, i) => (
          <figure key={i} className="flex-1">
            <div className="overflow-hidden rounded-2xl border border-gold/40 bg-navy-800/50 shadow-[0_12px_40px_-12px_rgba(4,10,28,0.7)]">
              {f.src ? (
                <img
                  src={f.src}
                  alt={f.alt}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div
                  className="grid aspect-square w-full place-items-center bg-gradient-to-br from-navy-800 to-navy-700"
                  aria-label={f.alt}
                >
                  <Baby className="size-10 text-gold/50" />
                </div>
              )}
            </div>
            <figcaption className="mt-3 font-script text-2xl text-gold-light">{f.legenda}</figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto max-w-2xl space-y-5 text-left text-[1.05rem] leading-relaxed text-champagne/90">
        {content.historia.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </Section>
  )
}
