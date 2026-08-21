// Helpers de autorização para rotas admin
import { NextResponse } from 'next/server'
import { getTokenFromRequest, hasTabAccess, isSuperAdmin, parsePermissions, type Permissions } from './auth'
import { db } from './db'

// Verifica o token e devolve o payload, ou retorna 401
export function requireAuth(request: Request): Record<string, unknown> | NextResponse {
  const payload = getTokenFromRequest(request)
  if (!payload) {
    return NextResponse.json({ error: 'Não autorizado. Inicie sessão.' }, { status: 401 })
  }
  // Verifica se o utilizador ainda existe e está ativo
  return payload
}

// Versão async que valida contra a BD (utilizador existe e está ativo)
export async function requireValidUser(request: Request): Promise<{ payload: Record<string, unknown> | null; response?: NextResponse }> {
  const payload = getTokenFromRequest(request)
  if (!payload) {
    return { payload: null, response: NextResponse.json({ error: 'Não autorizado. Inicie sessão.' }, { status: 401 }) }
  }
  const userId = payload.userId as number | undefined
  if (!userId) {
    return { payload: null, response: NextResponse.json({ error: 'Token inválido.' }, { status: 401 }) }
  }
  const user = await db.adminUser.findUnique({ where: { id: userId } })
  if (!user || !user.ativo) {
    return { payload: null, response: NextResponse.json({ error: 'Utilizador desactivado ou inexistente.' }, { status: 403 }) }
  }
  // Atualiza permissões do payload com as mais recentes da BD
  const freshPayload: Record<string, unknown> = {
    ...payload,
    role: user.role,
    permissions: parsePermissions(user.permissions),
    nome: user.nome,
    username: user.username,
  }
  return { payload: freshPayload }
}

// Verifica acesso a uma aba específica; retorna 403 se não autorizado
export async function requireTabAccess(request: Request, tabKey: string): Promise<{ payload: Record<string, unknown> | null; response?: NextResponse }> {
  const { payload, response } = await requireValidUser(request)
  if (!payload) return { payload: null, response }
  if (!hasTabAccess(payload, tabKey)) {
    return {
      payload: null,
      response: NextResponse.json({ error: 'Sem permissão para aceder a esta secção.' }, { status: 403 }),
    }
  }
  return { payload }
}

// Verifica se é super-admin; retorna 403 caso contrário
export async function requireSuperAdmin(request: Request): Promise<{ payload: Record<string, unknown> | null; response?: NextResponse }> {
  const { payload, response } = await requireValidUser(request)
  if (!payload) return { payload: null, response }
  if (!isSuperAdmin(payload)) {
    return {
      payload: null,
      response: NextResponse.json({ error: 'Acesso restrito a administradores.' }, { status: 403 }),
    }
  }
  return { payload }
}

export function getPermissionsFromPayload(payload: Record<string, unknown> | null): Permissions {
  if (!payload) return {}
  return (payload.permissions as Permissions | undefined) || {}
}
