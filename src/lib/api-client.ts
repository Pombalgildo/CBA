// Cliente API para o frontend
import type { SiteContent, SiteSettings } from './types'

const API_BASE = '/api'

export async function fetchContent(): Promise<SiteContent> {
  const res = await fetch(`${API_BASE}/content`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Erro ao carregar conteúdo')
  return res.json()
}

export async function submitContact(data: { tipo: string; nome: string; email: string; mensagem: string }): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao enviar mensagem')
  return res.json()
}

export async function submitDonation(data: {
  categoria: string
  metodo: string
  nome: string
  montante: string
  observacao?: string
  ficheiro?: string
}): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/donation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao enviar comprovativo')
  return res.json()
}

// --- Admin ---
const ADMIN_TOKEN_KEY = 'cba_admin_token'

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

export async function adminLogin(username: string, password: string): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro ao iniciar sessão' }))
    throw new Error(err.error)
  }
  return res.json()
}

function adminHeaders(): HeadersInit {
  const token = getAdminToken()
  return token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' }
}

export async function adminList(resource: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/admin/${resource}`, { headers: adminHeaders() })
  if (res.status === 401) throw new Error('Não autorizado')
  if (!res.ok) throw new Error('Erro ao carregar')
  return res.json()
}

export async function adminCreate(resource: string, data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/${resource}`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  })
  if (res.status === 401) throw new Error('Não autorizado')
  if (!res.ok) throw new Error('Erro ao criar')
  return res.json()
}

export async function adminUpdate(resource: string, id: number, data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/${resource}/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  })
  if (res.status === 401) throw new Error('Não autorizado')
  if (!res.ok) throw new Error('Erro ao guardar')
  return res.json()
}

export async function adminDelete(resource: string, id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/${resource}/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  })
  if (res.status === 401) throw new Error('Não autorizado')
  if (!res.ok) throw new Error('Erro ao eliminar')
  return res.json()
}

export async function adminPatch(resource: string, id: number, data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/${resource}/${id}`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  })
  if (res.status === 401) throw new Error('Não autorizado')
  if (!res.ok) throw new Error('Erro ao guardar')
  return res.json()
}

export async function getSettings(): Promise<SiteSettings | null> {
  const res = await fetch(`${API_BASE}/content`, { cache: 'no-store' })
  if (!res.ok) return null
  const data = await res.json()
  return data.settings
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  })
  if (res.status === 401) throw new Error('Não autorizado')
  if (!res.ok) throw new Error('Erro ao guardar')
  return res.json()
}
