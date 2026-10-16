import { relacaoLabel, type Acompanhante } from '../lib/rsvp'

export interface RsvpDoc {
  id: string
  nome: string
  presenca: 'sim' | 'nao'
  acompanhantes: Acompanhante[]
  recado: string
  email: string
  telefone: string
}

export function totais(rows: RsvpDoc[]) {
  const sim = rows.filter((r) => r.presenca === 'sim')
  const confirmados = sim.length
  const pessoas = sim.reduce((acc, r) => acc + 1 + r.acompanhantes.length, 0)
  return { confirmados, pessoas }
}

/** "Alice (8, Filho(a)); Pedro (34, Cônjuge / noivo(a))" */
export function fmtAcompanhantes(list: Acompanhante[]): string {
  return list.map((a) => `${a.nome} (${a.idade}, ${relacaoLabel(a.relacao)})`).join('; ')
}

function esc(v: string): string {
  const guarded = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v
  return /[",\n]/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded
}

export function toCsv(rows: RsvpDoc[]): string {
  const header = 'nome,presenca,acompanhantes,email,telefone,recado'
  const lines = rows.map((r) =>
    [
      esc(r.nome),
      r.presenca,
      esc(fmtAcompanhantes(r.acompanhantes)),
      esc(r.email),
      esc(r.telefone),
      esc(r.recado),
    ].join(','),
  )
  return [header, ...lines].join('\n')
}
