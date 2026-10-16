import type { ConvidadoStatus } from '@/lib/convites'

function esc(v: string): string {
  const g = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v
  return /[",\n]/.test(g) ? `"${g.replace(/"/g, '""')}"` : g
}

export function toCsvConvidados(rows: ConvidadoStatus[]): string {
  const header = 'nome,telefone,enviado,confirmou'
  const linhas = rows.map((r) =>
    [esc(r.nome), esc(r.telefone), r.enviado ? 'sim' : 'nao', r.confirmou ? 'sim' : 'nao'].join(','),
  )
  return [header, ...linhas].join('\n')
}
