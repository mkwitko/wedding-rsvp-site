import { useEffect, useState } from 'react'
import { content } from '../content'
import { Section } from './Section'

export function diffParts(target: number, now: number) {
  let s = Math.max(0, Math.floor((target - now) / 1000))
  const dias = Math.floor(s / 86400); s -= dias * 86400
  const horas = Math.floor(s / 3600); s -= horas * 3600
  const min = Math.floor(s / 60); s -= min * 60
  return { dias, horas, min, seg: s }
}

export function Countdown() {
  const target = new Date(content.dataISO).getTime()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const { dias, horas, min, seg } = diffParts(target, now)
  const cells = [
    { n: dias, l: 'dias' },
    { n: horas, l: 'horas' },
    { n: min, l: 'minutos' },
    { n: seg, l: 'segundos' },
  ]
  return (
    <div id="contagem">
      <Section eyebrow="falta pouco" title="Contagem regressiva" width="wide">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {cells.map((c) => (
            <div
              key={c.l}
              className="min-w-[6rem] flex-1 rounded-2xl border border-gold/30 bg-navy-800/55 px-5 py-6 shadow-[0_8px_30px_-8px_rgba(4,10,28,0.6),inset_0_1px_0_rgba(230,201,118,0.12)] backdrop-blur-sm sm:min-w-[8rem]"
            >
              <span className="block font-display text-[clamp(2.6rem,7vw,4.5rem)] font-semibold leading-none text-gold-light drop-shadow-[0_0_22px_rgba(230,201,118,0.35)] tabular-nums">
                {String(c.n).padStart(2, '0')}
              </span>
              <span className="mt-2 block text-xs uppercase tracking-[0.25em] text-champagne/75 sm:text-sm">
                {c.l}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
