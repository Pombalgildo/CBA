import { NextResponse } from 'next/server'
import { requireValidUser } from '@/lib/authz'
import { parsePermissions } from '@/lib/auth'

// GET /api/admin/me — devolve os dados do utilizador autenticado (role + permissões)
export async function GET(request: Request) {
  const { payload, response } = await requireValidUser(request)
  if (response) return response

  return NextResponse.json({
    id: payload?.userId,
    username: payload?.username,
    nome: payload?.nome,
    role: payload?.role,
    permissions: parsePermissions(JSON.stringify(payload?.permissions || {})),
  })
}
