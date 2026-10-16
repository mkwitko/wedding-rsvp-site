import { content } from '../content'
import { Rings } from './Rings'

const RISE = 'motion-safe:[animation:rise-in_1s_cubic-bezier(0.2,0.7,0.2,1)_both] opacity-0 motion-reduce:opacity-100'

export function Hero() {
  const { casal, dataLabel, horaLabel, local } = content
  return (
    <header
      id="topo"
      className="relative grid min-h-[100svh] place-items-center overflow-hidden [background:radial-gradient(ellipse_at_50%_28%,rgba(20,48,107,0.55),transparent_68%)]"
    >
      <Rings />
      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] [background:radial-gradient(ellipse_at_50%_45%,transparent_45%,rgba(4,10,26,0.45)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-[3] px-6 text-center">
        <p
          className={`${RISE} [animation-delay:0.15s] font-script text-gold-light text-[clamp(1.9rem,6vw,3.1rem)] leading-none drop-shadow-[0_0_22px_rgba(230,201,118,0.4)]`}
        >
          Vamos nos casar
        </p>

        <h1 className="names-shimmer my-2 font-display text-[clamp(3.2rem,11vw,7rem)] font-semibold tracking-[0.02em]">
          {casal.noiva} <span className="px-[0.08em] font-script text-gold [-webkit-text-fill-color:var(--gold)]">&amp;</span> {casal.noivo}
        </h1>

        <p
          className={`${RISE} [animation-delay:0.85s] mt-3 text-champagne text-[clamp(1rem,2.4vw,1.35rem)] font-medium uppercase tracking-[0.28em]`}
        >
          Sábado, {dataLabel}
        </p>
        <p
          className={`${RISE} [animation-delay:1s] mt-1 text-gold-light/90 text-[clamp(1rem,2.2vw,1.25rem)] tracking-[0.12em]`}
        >
          Cerimônia às {horaLabel}
        </p>
        <p
          className={`${RISE} [animation-delay:1.1s] mt-4 text-champagne/85 text-[clamp(0.95rem,2vw,1.15rem)]`}
        >
          {local.nome} · {local.cidade}
        </p>

        <a
          href="#rsvp"
          className={`${RISE} [animation-delay:1.3s] mt-9 inline-flex h-13 items-center rounded-full bg-gradient-to-br from-gold to-gold-light px-9 text-base font-semibold text-navy-950 shadow-[0_8px_36px_-8px_rgba(201,162,75,0.6)] transition-transform hover:-translate-y-0.5`}
        >
          Confirmar presença
        </a>
      </div>

      <a
        href="#contagem"
        aria-label="Rolar para baixo"
        className="absolute bottom-7 left-1/2 z-[3] -translate-x-1/2 text-3xl leading-none text-gold-light/80 motion-safe:[animation:bob_2.2s_ease-in-out_infinite]"
      >
        ⌄
      </a>
    </header>
  )
}
