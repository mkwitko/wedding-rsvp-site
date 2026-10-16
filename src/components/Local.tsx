import { MapPin, CalendarHeart } from 'lucide-react'
import { content } from '../content'
import { Section } from './Section'
import { Button } from '@/components/ui/button'

export function Local() {
  const { nome, cidade, endereco, mapsEmbed, mapsLink } = content.local
  return (
    <Section eyebrow="o grande dia" title="Onde & quando" width="wide">
      <div className="mx-auto mb-10 grid max-w-5xl gap-5 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-gold/25 bg-navy-800/50 px-7 py-6 text-left">
          <CalendarHeart className="size-9 shrink-0 text-gold-light" />
          <div>
            <p className="font-display text-2xl leading-tight text-cream sm:text-3xl">
              {content.dataLabel}
            </p>
            <p className="mt-1 text-base text-champagne/75">Cerimônia às {content.horaLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-gold/25 bg-navy-800/50 px-7 py-6 text-left">
          <MapPin className="size-9 shrink-0 text-gold-light" />
          <div>
            <p className="font-display text-2xl leading-tight text-cream sm:text-3xl">{nome}</p>
            <p className="mt-1 text-base text-champagne/75">{cidade}</p>
          </div>
        </div>
      </div>

      <p className="mb-8 text-lg text-champagne/90">{endereco}</p>

      <div className="mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl border border-gold/25 shadow-[0_16px_50px_-16px_rgba(4,10,28,0.7)]">
        <iframe
          title="Mapa do local"
          src={mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>

      <Button asChild variant="outline" className="mt-8">
        <a href={mapsLink} target="_blank" rel="noreferrer">
          <MapPin className="size-4" /> Abrir no Google Maps
        </a>
      </Button>
    </Section>
  )
}
