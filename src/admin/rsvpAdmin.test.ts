import { describe, it, expect } from 'vitest'
import { totais, toCsv, fmtAcompanhantes, type RsvpDoc } from './rsvpAdmin'

const rows: RsvpDoc[] = [
  {
    id: '1',
    nome: 'Alice',
    presenca: 'sim',
    acompanhantes: [
      { nome: 'Carlos', idade: 34, relacao: 'conjuge' },
      { nome: 'Duda', idade: 6, relacao: 'filho' },
    ],
    recado: 'oi',
    email: 'alice@example.com',
    telefone: '51999990000',
  },
  { id: '2', nome: 'Zé', presenca: 'nao', acompanhantes: [], recado: '', email: '', telefone: '' },
  { id: '3', nome: 'Bia', presenca: 'sim', acompanhantes: [], recado: 'a,b', email: '', telefone: '' },
]

describe('totais', () => {
  it('conta confirmados e soma pessoas (confirmado + acompanhantes)', () => {
    // sim: Alice(1+2)=3, Bia(1+0)=1 => pessoas 4; confirmados 2
    expect(totais(rows)).toEqual({ confirmados: 2, pessoas: 4 })
  })
})

describe('fmtAcompanhantes', () => {
  it('formata nome, idade e rótulo da relação', () => {
    expect(fmtAcompanhantes(rows[0].acompanhantes)).toBe(
      'Carlos (34, Cônjuge / noivo(a)); Duda (6, Filho(a))',
    )
  })
})

describe('toCsv', () => {
  it('gera header + linhas, formata acompanhantes/contato e escapa vírgulas', () => {
    const csv = toCsv(rows)
    expect(csv.split('\n')[0]).toBe('nome,presenca,acompanhantes,email,telefone,recado')
    expect(csv).toContain('"Carlos (34, Cônjuge / noivo(a)); Duda (6, Filho(a))"')
    expect(csv).toContain('alice@example.com')
    expect(csv).toContain('51999990000')
    expect(csv).toContain('"a,b"')
  })

  it('protege contra CSV formula injection', () => {
    const rows: RsvpDoc[] = [
      { id: '1', nome: '=SOMA(A1)', presenca: 'sim', acompanhantes: [], recado: '', email: '', telefone: '' },
    ]
    const csv = toCsv(rows)
    expect(csv).toContain("'=SOMA(A1)")
  })
})
