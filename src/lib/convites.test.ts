import { describe, it, expect } from 'vitest'
import {
  parseLista,
  waDigits,
  waLink,
  msgConvite,
  statusConvidados,
  saudacao,
  juntarNomes,
} from './convites'

describe('juntarNomes', () => {
  it('1/2/3 nomes', () => {
    expect(juntarNomes(['A'])).toBe('A')
    expect(juntarNomes(['A', 'B'])).toBe('A e B')
    expect(juntarNomes(['A', 'B', 'C'])).toBe('A, B e C')
  })
})

describe('saudacao', () => {
  it('singular usa Querido(a)', () => {
    expect(saudacao('João')).toBe('Querido(a) João')
  })
  it('plural (e) usa Queridos(as)', () => {
    expect(saudacao('João e Maria')).toBe('Queridos(as) João e Maria')
  })
  it('plural (vírgula) normaliza junção', () => {
    expect(saudacao('João, Maria, Pedro')).toBe('Queridos(as) João, Maria e Pedro')
  })
})

describe('parseLista', () => {
  it('separa nome,telefone por linha e apara espaços', () => {
    expect(parseLista(' Alice , 51999990000 \nJoão,5188887777\n\n')).toEqual([
      { nome: 'Alice', telefone: '51999990000' },
      { nome: 'João', telefone: '5188887777' },
    ])
  })
  it('linha só com nome vira telefone vazio', () => {
    expect(parseLista('Maria')).toEqual([{ nome: 'Maria', telefone: '' }])
  })
})

describe('waDigits', () => {
  it('remove não-dígitos e prefixa 55', () => {
    expect(waDigits('(51) 99999-0000')).toBe('5551999990000')
  })
  it('não duplica DDI 55 já presente', () => {
    expect(waDigits('5551999990000')).toBe('5551999990000')
  })
})

describe('waLink', () => {
  it('monta url wa.me com texto encodado', () => {
    const url = waLink('51999990000', 'Oi & tchau')
    expect(url).toBe('https://wa.me/5551999990000?text=Oi%20%26%20tchau')
  })
})

describe('msgConvite', () => {
  it('substitui {nome} e {link}', () => {
    expect(msgConvite('Oi {nome}, veja {link}', 'Alice', 'http://x/c/1')).toBe('Oi Alice, veja http://x/c/1')
  })
  it('substitui {saudacao} com plural automático', () => {
    expect(msgConvite('{saudacao}, veja {link}', 'João e Maria', 'http://x/1')).toBe(
      'Queridos(as) João e Maria, veja http://x/1',
    )
  })
})

describe('statusConvidados', () => {
  it('marca confirmou só quando há rsvp presenca sim com o id', () => {
    const c = [
      { id: 'a', nome: 'Alice', telefone: '', enviado: true },
      { id: 'b', nome: 'Bia', telefone: '', enviado: false },
      { id: 'd', nome: 'Dan', telefone: '', enviado: false },
    ]
    const rsvps = [
      { conviteId: 'a', presenca: 'sim' as const },
      { conviteId: 'd', presenca: 'nao' as const },
    ]
    expect(statusConvidados(c, rsvps)).toEqual([
      { id: 'a', nome: 'Alice', telefone: '', enviado: true, confirmou: true },
      { id: 'b', nome: 'Bia', telefone: '', enviado: false, confirmou: false },
      { id: 'd', nome: 'Dan', telefone: '', enviado: false, confirmou: false },
    ])
  })
})
