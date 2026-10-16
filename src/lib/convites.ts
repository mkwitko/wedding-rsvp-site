export interface Convidado {
  id: string
  nome: string
  telefone: string
  enviado: boolean
}

export interface ConvidadoStatus extends Convidado {
  confirmou: boolean
}

export function parseLista(texto: string): { nome: string; telefone: string }[] {
  return texto
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => {
      const i = l.indexOf(',')
      if (i === -1) return { nome: l.trim(), telefone: '' }
      return { nome: l.slice(0, i).trim(), telefone: l.slice(i + 1).trim() }
    })
    .filter((c) => c.nome.length > 0)
}

export function waDigits(telefone: string): string {
  const d = telefone.replace(/\D/g, '')
  if (d.startsWith('55') && d.length >= 12) return d
  return '55' + d
}

export function waLink(telefone: string, msg: string): string {
  return `https://wa.me/${waDigits(telefone)}?text=${encodeURIComponent(msg)}`
}

/** Quebra "João e Maria" ou "João, Maria" em ['João','Maria']. */
export function nomesPartes(nome: string): string[] {
  return nome
    .split(/\s+e\s+|,/i)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Junta nomes para leitura: 1→"A", 2→"A e B", 3+→"A, B e C". */
export function juntarNomes(partes: string[]): string {
  if (partes.length <= 1) return partes[0] ?? ''
  return partes.slice(0, -1).join(', ') + ' e ' + partes[partes.length - 1]
}

/** Saudação com plural automático: "Querido(a) João" / "Queridos(as) João e Maria". */
export function saudacao(nome: string): string {
  const partes = nomesPartes(nome)
  const nomes = juntarNomes(partes)
  return partes.length > 1 ? `Queridos(as) ${nomes}` : `Querido(a) ${nomes}`
}

export function msgConvite(template: string, nome: string, link: string): string {
  return template
    .replaceAll('{saudacao}', saudacao(nome))
    .replaceAll('{nome}', juntarNomes(nomesPartes(nome)) || nome)
    .replaceAll('{link}', link)
}

export function statusConvidados(
  convidados: Convidado[],
  rsvps: { conviteId: string; presenca: 'sim' | 'nao' }[],
): ConvidadoStatus[] {
  const confirmados = new Set(
    rsvps.filter((r) => r.presenca === 'sim').map((r) => r.conviteId).filter(Boolean),
  )
  return convidados.map((c) => ({ ...c, confirmou: confirmados.has(c.id) }))
}
