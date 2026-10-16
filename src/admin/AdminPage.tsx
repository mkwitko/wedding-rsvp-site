import { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { Download, LogOut, Trash2 } from 'lucide-react'
import { db } from '../firebase'
import { useAuth, logout } from './useAuth'
import { Login } from './Login'
import { totais, toCsv, fmtAcompanhantes, type RsvpDoc } from './rsvpAdmin'
import type { Acompanhante } from '../lib/rsvp'
import { Button } from '@/components/ui/button'
import { Convidados } from './Convidados'

/** Old docs stored acompanhantes as string[]; normalize to the object shape. */
function normalizeAcompanhantes(raw: unknown): Acompanhante[] {
  if (!Array.isArray(raw)) return []
  return raw.map((a) =>
    typeof a === 'string'
      ? { nome: a, idade: 0, relacao: '' }
      : { nome: a?.nome ?? '', idade: a?.idade ?? 0, relacao: a?.relacao ?? '' },
  )
}

export function AdminPage() {
  const { user, loading } = useAuth()
  const [rows, setRows] = useState<RsvpDoc[]>([])
  const [carregando, setCarregando] = useState(false)
  const [aba, setAba] = useState<'confirmacoes' | 'convidados'>('confirmacoes')

  useEffect(() => {
    if (!user) return
    setCarregando(true)
    const q = query(collection(db, 'rsvps'), orderBy('criadoEm', 'desc'))
    getDocs(q)
      .then((snap) =>
        setRows(
          snap.docs.map((d) => {
            const data = d.data() as Partial<Omit<RsvpDoc, 'id'>> & { acompanhantes?: unknown }
            return {
              id: d.id,
              nome: data.nome ?? '',
              presenca: data.presenca ?? 'sim',
              recado: data.recado ?? '',
              email: data.email ?? '',
              telefone: data.telefone ?? '',
              acompanhantes: normalizeAcompanhantes(data.acompanhantes),
            } satisfies RsvpDoc
          }),
        ),
      )
      .finally(() => setCarregando(false))
  }, [user])

  if (loading) return <p className="p-6 text-cream">Carregando…</p>
  if (!user) return <Login />

  const { confirmados, pessoas } = totais(rows)

  async function remover(id: string) {
    if (!confirm('Apagar esta confirmação?')) return
    await deleteDoc(doc(db, 'rsvps', id))
    setRows((r) => r.filter((x) => x.id !== id))
  }

  function baixarCsv() {
    const blob = new Blob(['﻿' + toCsv(rows)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'confirmacoes.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const stats = [
    { n: confirmados, l: 'confirmados' },
    { n: pessoas, l: 'pessoas no total' },
    { n: rows.length, l: 'respostas' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-gold-light">Confirmações</h1>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={baixarCsv}>
            <Download className="size-4" /> Exportar CSV
          </Button>
          <Button size="sm" onClick={() => logout()}>
            <LogOut className="size-4" /> Sair
          </Button>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Button
          variant={aba === 'confirmacoes' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setAba('confirmacoes')}
        >
          Confirmações
        </Button>
        <Button
          variant={aba === 'convidados' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setAba('convidados')}
        >
          Convidados
        </Button>
      </div>

      {aba === 'confirmacoes' && (
        <>
          <div className="my-6 flex flex-wrap gap-4">
            {stats.map((s) => (
              <div key={s.l} className="rounded-2xl border border-gold/25 bg-navy-800/60 px-6 py-4">
                <b className="block font-display text-3xl text-gold-light">{s.n}</b>
                <span className="text-sm text-champagne/70">{s.l}</span>
              </div>
            ))}
          </div>

          {carregando ? (
            <p className="text-champagne/80">Carregando confirmações…</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gold/20">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="text-gold-light">
                    <th className="p-3">Nome</th>
                    <th className="p-3">Vai?</th>
                    <th className="p-3">Acompanhantes</th>
                    <th className="p-3">Contato</th>
                    <th className="p-3">Recado</th>
                    <th className="p-3" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-navy-700/70">
                      <td className="p-3 text-cream">{r.nome}</td>
                      <td className="p-3">{r.presenca === 'sim' ? 'Sim' : 'Não'}</td>
                      <td className="p-3">
                        {r.acompanhantes.length > 0 ? fmtAcompanhantes(r.acompanhantes) : '—'}
                      </td>
                      <td className="p-3 text-champagne/80">
                        {r.email && <div>{r.email}</div>}
                        {r.telefone && <div>{r.telefone}</div>}
                        {!r.email && !r.telefone && '—'}
                      </td>
                      <td className="p-3 text-champagne/80">{r.recado}</td>
                      <td className="p-3">
                        <button
                          className="inline-flex items-center gap-1 text-destructive hover:underline"
                          onClick={() => remover(r.id)}
                        >
                          <Trash2 className="size-3.5" /> apagar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {aba === 'convidados' && <Convidados />}
    </div>
  )
}
