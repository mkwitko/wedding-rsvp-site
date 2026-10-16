import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export async function lerFotoConvite(): Promise<string> {
  const snap = await getDoc(doc(db, 'config', 'site'))
  const data = snap.data() as { fotoConviteUrl?: string } | undefined
  return data?.fotoConviteUrl ?? ''
}

export async function salvarFotoConvite(url: string): Promise<void> {
  await setDoc(doc(db, 'config', 'site'), { fotoConviteUrl: url.trim() }, { merge: true })
}
