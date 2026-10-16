import {
  collection,
  doc,
  writeBatch,
  getDocs,
  updateDoc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase'
import type { Convidado } from './convites'

export async function criarConvidados(items: { nome: string; telefone: string }[]): Promise<void> {
  const clean = items
    .map((i) => ({ nome: i.nome.trim().slice(0, 100), telefone: i.telefone.trim().slice(0, 40) }))
    .filter((i) => i.nome.length > 0)
  if (clean.length === 0) return
  const batch = writeBatch(db)
  for (const it of clean) {
    const ref = doc(collection(db, 'convidados'))
    batch.set(ref, {
      nome: it.nome,
      telefone: it.telefone,
      enviado: false,
      enviadoEm: null,
      criadoEm: serverTimestamp(),
    })
    batch.set(doc(db, 'convites', ref.id), { nome: it.nome })
  }
  await batch.commit()
}

export async function listarConvidados(): Promise<Convidado[]> {
  const q = query(collection(db, 'convidados'), orderBy('nome'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data() as { nome?: string; telefone?: string; enviado?: boolean }
    return {
      id: d.id,
      nome: data.nome ?? '',
      telefone: data.telefone ?? '',
      enviado: data.enviado ?? false,
    }
  })
}

export async function setEnviado(id: string, enviado: boolean): Promise<void> {
  await updateDoc(doc(db, 'convidados', id), {
    enviado,
    enviadoEm: enviado ? serverTimestamp() : null,
  })
}

export async function apagarConvidado(id: string): Promise<void> {
  const batch = writeBatch(db)
  batch.delete(doc(db, 'convidados', id))
  batch.delete(doc(db, 'convites', id))
  await batch.commit()
}
