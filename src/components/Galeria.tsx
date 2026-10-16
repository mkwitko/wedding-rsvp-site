import { Heart, Camera, Sparkle, Star } from 'lucide-react'
import { content } from '../content'
import { Section } from './Section'

const PLACEHOLDER_ICONS = [Heart, Camera, Star, Sparkle, Heart, Camera]
const PLACEHOLDER_SPANS = [
  'row-span-2',
  '',
  '',
  'row-span-2',
  '',
  '',
]

export function Galeria() {
  const fotos = content.galeria
  const hasPhotos = fotos.length > 0

  return (
    <Section eyebrow="momentos" title="Galeria" width="wide">
      {!hasPhotos && (
        <p className="mx-auto mb-8 max-w-md text-champagne/80">
          Em breve, nossas fotos favoritas aqui. Por enquanto, um cantinho reservado com carinho ✨
        </p>
      )}
      <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {hasPhotos
          ? fotos.map((item, i) => (
              <img
                key={i}
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full rounded-2xl border border-navy-700 object-cover transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_14px_40px_-12px_rgba(4,10,28,0.6),0_0_20px_rgba(201,162,75,0.25)]"
              />
            ))
          : PLACEHOLDER_ICONS.map((Icon, i) => (
              <div
                key={i}
                aria-hidden="true"
                className={`group grid place-items-center rounded-2xl border border-gold/20 bg-gradient-to-br from-navy-800 to-navy-700 transition-all duration-300 hover:border-gold/50 ${PLACEHOLDER_SPANS[i]}`}
              >
                <Icon className="size-8 text-gold/50 transition-all duration-300 group-hover:scale-110 group-hover:text-gold-light" />
              </div>
            ))}
      </div>
    </Section>
  )
}
