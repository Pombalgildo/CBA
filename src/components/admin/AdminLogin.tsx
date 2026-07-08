'use client'
import { useState } from 'react'
import { adminLogin, setAdminToken } from '@/lib/api-client'

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const { token } = await adminLogin(username, password)
      setAdminToken(token)
      onSuccess()
    } catch (err: any) {
      setErro(err.message || 'Erro ao iniciar sessão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl">🔐</div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Painel Administrativo</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Convenção Baptista de Angola</p>
        </div>
        {erro && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm font-body">{erro}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="font-body text-sm font-semibold block mb-1.5 text-foreground">Nome de Utilizador</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="admin"
              autoFocus
            />
          </div>
          <div>
            <label className="font-body text-sm font-semibold block mb-1.5 text-foreground">Palavra-passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-body font-bold text-sm uppercase tracking-wider rounded-lg py-3 disabled:opacity-50"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="#/" className="font-body text-xs text-muted-foreground hover:text-primary">← Voltar ao site</a>
        </div>
      </div>
    </div>
  )
}
