import { useEffect, useState } from 'react'
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User,
} from 'firebase/auth'
import { app } from '../firebase'

const auth = getAuth(app)

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false) }), [])
  return { user, loading }
}

export function login(email: string, senha: string) {
  return signInWithEmailAndPassword(auth, email, senha).then(() => undefined)
}

export function logout() {
  return signOut(auth)
}
