import { describe, it, expect } from 'vitest'
import { crc16, buildPixPayload } from './pix'

describe('crc16', () => {
  it('calcula CRC16-CCITT-FALSE conhecido', () => {
    // '123456789' => 0x29B1 no CRC16/CCITT-FALSE
    expect(crc16('123456789')).toBe('29B1')
  })
})

describe('buildPixPayload', () => {
  it('inclui a chave e termina com o campo CRC (6304 + 4 hex)', () => {
    const p = buildPixPayload({ chave: 'pix@example.com', nome: 'COUPLE NAME', cidade: 'CITY' })
    expect(p).toContain('pix@example.com')
    expect(p).toMatch(/6304[0-9A-F]{4}$/)
  })

  it('CRC no fim confere com crc16 do restante', () => {
    const p = buildPixPayload({ chave: 'pix@example.com', nome: 'COUPLE NAME', cidade: 'CITY' })
    const semCrc = p.slice(0, -4)
    expect(p.slice(-4)).toBe(crc16(semCrc))
  })

  it('normaliza acentos em nome/cidade (José -> JOSE)', () => {
    const p = buildPixPayload({ chave: 'x@y.com', nome: 'José', cidade: 'Florianópolis' })
    expect(p).toContain('JOSE')
    expect(p).toContain('FLORIANOPOLIS')
    expect(p).not.toMatch(/José|Florianópolis/)
  })

  it('inclui valor formatado quando fornecido', () => {
    const p = buildPixPayload({ chave: 'x@y.com', nome: 'A', cidade: 'B', valor: 50 })
    expect(p).toContain('540550.00')
  })

  it('ignora valor NaN', () => {
    const pWithNaN = buildPixPayload({ chave: 'x@y.com', nome: 'A', cidade: 'B', valor: NaN })
    const pWithValue = buildPixPayload({ chave: 'x@y.com', nome: 'A', cidade: 'B', valor: 50 })
    expect(pWithNaN.length).toBeLessThan(pWithValue.length)
  })
})
