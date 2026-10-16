import { describe, it, expect, vi, beforeEach } from 'vitest'

const addDocMock = vi.fn((..._args: unknown[]) => Promise.resolve({ id: 'x' }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({})),
  addDoc: (...a: unknown[]) => addDocMock(...a),
  serverTimestamp: () => 'TS',
}))
vi.mock('../firebase', () => ({ db: {} }))

import { submitRsvp } from './rsvp'

describe('submitRsvp', () => {
  beforeEach(() => addDocMock.mockClear())

  it('envia payload com acompanhantes {nome, idade, relacao} e criadoEm', async () => {
    await submitRsvp({
      nome: 'João',
      presenca: 'sim',
      acompanhantes: [
        { nome: 'Maria', idade: 8, relacao: 'filho' },
        { nome: 'Pedro', idade: 34, relacao: 'conjuge' },
      ],
      recado: 'Vai ser lindo',
      email: '  alice@example.com ',
      telefone: '51999990000',
      conviteId: 'abc123',
    })
    expect(addDocMock).toHaveBeenCalledTimes(1)
    const payload = addDocMock.mock.calls[0][1]
    expect(payload).toMatchObject({
      nome: 'João',
      presenca: 'sim',
      acompanhantes: [
        { nome: 'Maria', idade: 8, relacao: 'filho' },
        { nome: 'Pedro', idade: 34, relacao: 'conjuge' },
      ],
      recado: 'Vai ser lindo',
      email: 'alice@example.com',
      telefone: '51999990000',
      conviteId: 'abc123',
      criadoEm: 'TS',
    })
  })

  it('rejeita nome vazio', async () => {
    await expect(
      submitRsvp({ nome: '  ', presenca: 'sim', acompanhantes: [], recado: '', email: '', telefone: '', conviteId: '' }),
    ).rejects.toThrow()
    expect(addDocMock).not.toHaveBeenCalled()
  })

  it('descarta acompanhantes sem nome e apara espaços', async () => {
    await submitRsvp({
      nome: 'Alice',
      presenca: 'sim',
      acompanhantes: [
        { nome: '  Bia  ', idade: 5, relacao: 'filho' },
        { nome: '', idade: 0, relacao: 'familiar' },
      ],
      recado: '',
      email: '',
      telefone: '',
      conviteId: '',
    })
    const payload = addDocMock.mock.calls[0][1] as { acompanhantes: unknown[] }
    expect(payload.acompanhantes).toEqual([{ nome: 'Bia', idade: 5, relacao: 'filho' }])
  })

  it('clampa idade inválida para 0', async () => {
    await submitRsvp({
      nome: 'Alice',
      presenca: 'sim',
      acompanhantes: [{ nome: 'Zé', idade: NaN, relacao: 'amigo' }],
      recado: '',
      email: '',
      telefone: '',
      conviteId: '',
    })
    const payload = addDocMock.mock.calls[0][1] as { acompanhantes: { idade: number }[] }
    expect(payload.acompanhantes[0].idade).toBe(0)
  })

  it('rejeita mais de 20 acompanhantes', async () => {
    const muitos = Array.from({ length: 21 }, (_, i) => ({ nome: `Pessoa ${i}`, idade: 20, relacao: 'amigo' }))
    await expect(
      submitRsvp({ nome: 'Alice', presenca: 'sim', acompanhantes: muitos, recado: '', email: '', telefone: '', conviteId: '' }),
    ).rejects.toThrow()
    expect(addDocMock).not.toHaveBeenCalled()
  })
})
