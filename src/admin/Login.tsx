import { useState } from 'react'
import { login } from './useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(false)

  async function handle(e: React.FormEvent) {
    e.preventDefault()
    setErro(false)
    try {
      await login(email, senha)
    } catch {
      setErro(true)
    }
  }

  return (
    <div className="grid min-h-[100svh] place-items-center bg-navy-900 px-6">
      <form
        onSubmit={handle}
        className="w-full max-w-sm space-y-5 rounded-3xl border border-gold/25 bg-navy-800/60 p-8 text-left"
      >
        <h1 className="text-center font-display text-2xl text-gold-light">Admin</h1>
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email</Label>
          <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-senha">Senha</Label>
          <Input
            id="admin-senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Entrar
        </Button>
        {erro && <p className="text-center text-sm text-destructive">Login inválido.</p>}
      </form>
    </div>
  )
}
