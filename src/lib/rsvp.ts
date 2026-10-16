import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export interface Acompanhante {
  nome: string
  idade: number
  relacao: string
}

export interface RsvpInput {
  nome: string
  presenca: 'sim' | 'nao'
  acompanhantes: Acompanhante[]
  recado: string
  email: string
  telefone: string
  conviteId: string
}

export const RELACOES: { value: string; label: string }[] = [
  { value: 'filho', label: 'Filho(a)' },
  { value: 'conjuge', label: 'Cônjuge / noivo(a)' },
  { value: 'familiar', label: 'Familiar' },
  { value: 'amigo', label: 'Amigo(a)' },
  { value: 'outro', label: 'Outro' },
]

export function relacaoLabel(v: string): string {
  return RELACOES.find((r) => r.value === v)?.label ?? v
}

export async function submitRsvp(data: RsvpInput): Promise<void> {
  const nome = data.nome.trim()
  if (nome.length < 1 || nome.length > 100) throw new Error('Nome inválido')
  if (data.presenca !== 'sim' && data.presenca !== 'nao') throw new Error('Presença inválida')
  const acompanhantes: Acompanhante[] = data.acompanhantes
    .map((a) => {
      const idade = Math.trunc(a.idade)
      return {
        nome: a.nome.trim().slice(0, 100),
        idade: Number.isFinite(idade) && idade >= 0 && idade <= 120 ? idade : 0,
        relacao: a.relacao.trim().slice(0, 40),
      }
    })
    .filter((a) => a.nome.length > 0)
  if (acompanhantes.length > 20) throw new Error('Máximo de 20 acompanhantes')
  const recado = data.recado.slice(0, 500)
  const email = data.email.trim().slice(0, 200)
  const telefone = data.telefone.trim().slice(0, 40)
  await addDoc(collection(db, 'rsvps'), {
    nome,
    presenca: data.presenca,
    acompanhantes,
    recado,
    email,
    telefone,
    conviteId: data.conviteId.trim().slice(0, 40),
    criadoEm: serverTimestamp(),
  })
}
