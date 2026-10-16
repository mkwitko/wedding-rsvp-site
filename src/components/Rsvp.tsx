import { useState } from 'react'
import { Plus, X, Check, CircleCheckBig } from 'lucide-react'
import { submitRsvp, RELACOES, type Acompanhante } from '../lib/rsvp'
import { Section } from './Section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { content } from '@/content'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const WHATSAPP_DISPLAY = '(51) 99468-2002'
const WHATSAPP_LINK = `https://wa.me/${content.doacao.whatsappAviso}`
const RECEIPT_KEY = 'rsvp-receipt'

interface Receipt {
  nome: string
  quando: string
}

function lerRecibo(): Receipt | null {
  try {
    const raw = localStorage.getItem(RECEIPT_KEY)
    return raw ? (JSON.parse(raw) as Receipt) : null
  } catch {
    return null
  }
}

function salvarRecibo(r: Receipt) {
  try {
    localStorage.setItem(RECEIPT_KEY, JSON.stringify(r))
  } catch {
    /* localStorage bloqueado */
  }
}

export function Rsvp({ initialNome = '', conviteId = '' }: { initialNome?: string; conviteId?: string }) {
  const [nome, setNome] = useState(initialNome)
  const [presenca, setPresenca] = useState<'sim' | 'nao'>('sim')
  const [acompanhantes, setAcompanhantes] = useState<Acompanhante[]>([])
  const [recado, setRecado] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [status, setStatus] = useState<'idle' | 'enviando' | 'ok' | 'erro'>('idle')
  const [recibo, setRecibo] = useState<Receipt | null>(() => lerRecibo())
  const [mostrarForm, setMostrarForm] = useState(false)

  const addAcompanhante = () =>
    setAcompanhantes((a) =>
      a.length < 20 ? [...a, { nome: '', idade: 0, relacao: 'familiar' }] : a,
    )
  const patchAcompanhante = (i: number, patch: Partial<Acompanhante>) =>
    setAcompanhantes((a) => a.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  const removeAcompanhante = (i: number) =>
    setAcompanhantes((a) => a.filter((_, j) => j !== i))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('enviando')
    try {
      await submitRsvp({
        nome,
        presenca,
        acompanhantes: presenca === 'sim' ? acompanhantes : [],
        recado,
        email,
        telefone,
        conviteId,
      })
      const r: Receipt = { nome: nome.trim(), quando: new Date().toISOString() }
      salvarRecibo(r)
      setRecibo(r)
      setStatus('ok')
      setNome(initialNome); setAcompanhantes([]); setRecado(''); setEmail(''); setTelefone(''); setPresenca('sim')
    } catch {
      setStatus('erro')
    }
  }

  if (status === 'ok') {
    return (
      <Section id="rsvp" eyebrow="até lá" title="Confirmação recebida 💛" width="narrow">
        <p className="mb-8 text-champagne/90">Obrigado! Sua resposta foi registrada com carinho.</p>
        <Button variant="outline" onClick={() => setStatus('idle')}>
          Enviar outra resposta
        </Button>
      </Section>
    )
  }

  // Recibo local: já confirmou neste dispositivo
  if (recibo && !mostrarForm) {
    const quando = (() => {
      try {
        return new Date(recibo.quando).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      } catch {
        return ''
      }
    })()
    return (
      <Section id="rsvp" eyebrow="presença" title="Confirme sua presença" width="narrow">
        <div className="mx-auto max-w-md rounded-3xl border border-gold/30 bg-navy-800/50 p-8 shadow-[0_16px_50px_-16px_rgba(4,10,28,0.7)]">
          <CircleCheckBig className="mx-auto mb-4 size-12 text-gold-light" />
          <p className="font-display text-2xl text-cream">Você já confirmou 💛</p>
          <p className="mt-2 text-champagne/80">
            {recibo.nome ? <>Em nome de <b className="text-gold-light">{recibo.nome}</b>. </> : null}
            {quando && <>Registrado em {quando}. </>}
          </p>
          <p className="mt-1 text-xs text-champagne/55">
            (confirmação salva neste dispositivo)
          </p>
          <Button variant="outline" className="mt-6" onClick={() => setMostrarForm(true)}>
            Confirmar novamente / editar
          </Button>
        </div>
      </Section>
    )
  }

  return (
    <Section id="rsvp" eyebrow="presença" title="Confirme sua presença" width="wide">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl space-y-7 rounded-3xl border border-gold/25 bg-navy-800/50 p-7 text-left text-lg shadow-[0_16px_50px_-16px_rgba(4,10,28,0.7)] sm:p-11"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rsvp-nome">Nome completo</Label>
            <Input
              id="rsvp-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              maxLength={100}
              placeholder="Seu nome"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rsvp-presenca">Você vai?</Label>
            <Select value={presenca} onValueChange={(v) => setPresenca(v as 'sim' | 'nao')}>
              <SelectTrigger id="rsvp-presenca" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim, estarei lá 🥂</SelectItem>
                <SelectItem value="nao">Não poderei ir</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rsvp-email">E-mail de contato (opcional)</Label>
            <Input
              id="rsvp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={200}
              placeholder="voce@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rsvp-telefone">Telefone / WhatsApp (opcional)</Label>
            <Input
              id="rsvp-telefone"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              maxLength={40}
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>

        {presenca === 'sim' && (
          <fieldset className="space-y-3 rounded-2xl border border-gold/20 bg-navy-900/40 p-5">
            <legend className="px-2 text-sm font-medium text-gold-light">Acompanhantes</legend>
            <p className="text-sm text-champagne/80">
              Para levar acompanhante, combine antes com a gente pelo{' '}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-gold-light underline underline-offset-2"
              >
                WhatsApp {WHATSAPP_DISPLAY}
              </a>{' '}
              — assim organizamos tudo direitinho pra festa 💛
            </p>
            {acompanhantes.map((a, i) => {
              const cap = 'mb-1 block text-xs uppercase tracking-wide text-champagne/55'
              return (
                <div key={i} className="rounded-xl border border-gold/15 bg-navy-800/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gold-light/80">
                      Acompanhante {i + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 px-2 text-champagne/60 hover:text-destructive"
                      aria-label={`Remover acompanhante ${i + 1}`}
                      onClick={() => removeAcompanhante(i)}
                    >
                      <X className="size-3.5" /> remover
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end">
                    <div className="sm:flex-[2]">
                      <span className={cap}>Nome</span>
                      <Input
                        value={a.nome}
                        placeholder="Nome do acompanhante"
                        maxLength={100}
                        aria-label={`Nome do acompanhante ${i + 1}`}
                        onChange={(e) => patchAcompanhante(i, { nome: e.target.value })}
                      />
                    </div>
                    <div className="w-24">
                      <span className={cap}>Idade</span>
                      <Input
                        type="number"
                        min={0}
                        max={120}
                        value={Number.isFinite(a.idade) ? a.idade : 0}
                        aria-label={`Idade do acompanhante ${i + 1}`}
                        onChange={(e) => patchAcompanhante(i, { idade: Number(e.target.value) })}
                      />
                    </div>
                    <div className="min-w-40 flex-1">
                      <span className={cap}>Relação</span>
                      <Select
                        value={a.relacao}
                        onValueChange={(v) => patchAcompanhante(i, { relacao: v })}
                      >
                        <SelectTrigger
                          aria-label={`Relação do acompanhante ${i + 1}`}
                          className="w-full"
                        >
                          <SelectValue placeholder="Relação" />
                        </SelectTrigger>
                        <SelectContent>
                          {RELACOES.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )
            })}
            {acompanhantes.length < 20 && (
              <Button type="button" variant="ghost" size="sm" onClick={addAcompanhante}>
                <Plus className="size-4" /> Adicionar acompanhante
              </Button>
            )}
          </fieldset>
        )}

        <div className="space-y-2">
          <Label htmlFor="rsvp-recado">Recado (opcional)</Label>
          <Textarea
            id="rsvp-recado"
            value={recado}
            maxLength={500}
            onChange={(e) => setRecado(e.target.value)}
            placeholder="Deixe um recadinho pros noivos…"
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={status === 'enviando'}>
          {status === 'enviando' ? (
            'Enviando…'
          ) : (
            <>
              <Check className="size-4" /> Confirmar presença
            </>
          )}
        </Button>
        {status === 'erro' && (
          <p className="text-center text-sm text-destructive">Não deu pra enviar. Tente de novo.</p>
        )}
      </form>
    </Section>
  )
}
