import { describe, it, expect } from 'vitest'
import { diffParts } from './Countdown'

describe('diffParts', () => {
  it('quebra ms em dias/horas/min/seg', () => {
    const now = 0
    const target = ((1 * 24 * 60 * 60) + (2 * 60 * 60) + (3 * 60) + 4) * 1000
    expect(diffParts(target, now)).toEqual({ dias: 1, horas: 2, min: 3, seg: 4 })
  })
  it('zera quando alvo já passou', () => {
    expect(diffParts(0, 1000)).toEqual({ dias: 0, horas: 0, min: 0, seg: 0 })
  })
})
