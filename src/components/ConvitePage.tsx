import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { CalendarHeart, MapPin, ArrowRight } from 'lucide-react'
import { db } from '@/firebase'
import { content } from '../content'
import { juntarNomes, nomesPartes } from '../lib/convites'
import { Rsvp } from './Rsvp'
import { Presentes } from './Presentes'
import { Starfield } from './Starfield'
import { Moon } from './Moon'

export function ConvitePage() {
  const { id = '' } = useParams()
  const [estado, setEstado] = useState<'carregando' | 'ok' | 'nao'>('carregando')
  const [nome, setNome] = useState('')

  useEffect(() => {
    let vivo = true
    getDoc(doc(db, 'convites', id))
      .then((snap) => {
        if (!vivo) return
        if (snap.exists()) {
          setNome((snap.data() as { nome?: string }).nome ?? '')
          setEstado('ok')
        } else {
          setEstado('nao')
        }
      })
      .catch(() => vivo && setEstado('nao'))
    return () => {
      vivo = false
    }
  }, [id])

  const nomesFmt = juntarNomes(nomesPartes(nome)) || nome
  const { local, dataLabel, horaLabel } = content

  return (
    <div className="ceu relative min-h-[100svh]">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <Starfield />
        <Moon />
      </div>
      <main className="relative z-[1]">
        {estado === 'carregando' && (
          <p className="grid min-h-[100svh] place-items-center text-champagne/80">Carregando…</p>
        )}

        {estado === 'nao' && (
          <div className="grid min-h-[100svh] place-items-center px-6 text-center">
            <div>
              <p className="font-display text-3xl text-gold-light">Convite não encontrado</p>
              <p className="mt-3 text-champagne/80">
                Confira o link ou acesse{' '}
                <a href="/" className="text-gold-light underline underline-offset-2">
                  o site do casamento
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {estado === 'ok' && (
          <>
            <header className="grid min-h-[100svh] place-items-center px-6 py-16 text-center">
              <div>
                <p className="font-script text-[clamp(1.8rem,6vw,3rem)] text-gold-light">Olá, {nomesFmt}</p>
                <h1 className="mt-4 font-display text-[clamp(2.4rem,8vw,4.5rem)] font-semibold text-cream">
                  {content.casal.noiva} <span className="font-script text-gold">&amp;</span> {content.casal.noivo}
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-champagne/85">{content.convite.textoConvite}</p>

                {/* infos: quando & onde */}
                <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-gold/25 bg-navy-800/50 px-5 py-4 text-left">
                    <CalendarHeart className="size-7 shrink-0 text-gold-light" />
                    <div>
                      <p className="font-display text-lg text-cream">{dataLabel}</p>
                      <p className="text-sm text-champagne/70">Cerimônia às {horaLabel}</p>
                    </div>
                  </div>
                  <a
                    href={local.mapsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-gold/25 bg-navy-800/50 px-5 py-4 text-left transition-colors hover:border-gold/60"
                  >
                    <MapPin className="size-7 shrink-0 text-gold-light" />
                    <div>
                      <p className="font-display text-lg text-cream">{local.nome}</p>
                      <p className="text-sm text-champagne/70">{local.cidade} · ver no mapa</p>
                    </div>
                  </a>
                </div>

                <a
                  href="#rsvp"
                  className="mt-9 inline-flex h-13 items-center rounded-full bg-gradient-to-br from-gold to-gold-light px-9 text-base font-semibold text-navy-950 shadow-[0_8px_36px_-8px_rgba(201,162,75,0.6)]"
                >
                  Confirmar presença
                </a>
                <div className="mt-5">
                  <a
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-gold-light/90 underline-offset-2 hover:underline"
                  >
                    Ver o site completo <ArrowRight className="size-4" />
                  </a>
                </div>
              </div>
            </header>
            <Rsvp initialNome={nomesFmt} conviteId={id} />
            <Presentes />
          </>
        )}
      </main>
    </div>
  )
}
