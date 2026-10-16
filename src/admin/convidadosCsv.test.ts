import { describe, it, expect } from 'vitest'
import { toCsvConvidados } from './convidadosCsv'
import type { ConvidadoStatus } from '@/lib/convites'

const rows: ConvidadoStatus[] = [
  { id: '1', nome: 'Alice', telefone: '51999990000', enviado: true, confirmou: true },
  { id: '2', nome: 'Zé, o Rei', telefone: '', enviado: false, confirmou: false },
]

describe('toCsvConvidados', () => {
  it('header + linhas, escapa vírgula, sim/não', () => {
    const csv = toCsvConvidados(rows)
    expect(csv.split('\n')[0]).toBe('nome,telefone,enviado,confirmou')
    expect(csv).toContain('Alice,51999990000,sim,sim')
    expect(csv).toContain('"Zé, o Rei",,nao,nao')
  })
})
