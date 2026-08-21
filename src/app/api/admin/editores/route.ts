import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { requireSuperAdmin } from '@/lib/authz'
import { ADMIN_TABS, parsePermissions, stringifyPermissions, type Permissions } from '@/lib/auth'

// GET /api/admin/editores — lista todos os utilizadores (apenas super-admin)
// NOTA: o admin principal (username='admin') NÃO aparece na lista — é gerido via código.
export async function GET(request: Request) {
  const { response } = await requireSuperAdmin(request)
  if (response) return response

  const users = await db.adminUser.findMany({
    where: { username: { not: 'admin' } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      username: true,
      nome: true,
      role: true,
      permissions: true,
      ativo: true,
      createdAt: true,
    },
  })

  // Não enviamos a password, e fazemos parse das permissões
  const safe = users.map((u) => ({
    ...u,
    permissions: parsePermissions(u.permissions),
  }))

  return NextResponse.json(safe)
}

// POST /api/admin/editores — cria novo editor (apenas super-admin)
export async function POST(request: Request) {
  const { response } = await requireSuperAdmin(request)
  if (response) return response

  try {
    const body = await request.json()
    const { username, password, nome, role, permissions, ativo } = body || {}

    if (!username || !password) {
      return NextResponse.json({ error: 'Nome de utilizador e palavra-passe são obrigatórios.' }, { status: 400 })
    }
    if (String(username).length < 3) {
      return NextResponse.json({ error: 'Nome de utilizador deve ter pelo menos 3 caracteres.' }, { status: 400 })
    }
    if (String(password).length < 6) {
      return NextResponse.json({ error: 'Palavra-passe deve ter pelo menos 6 caracteres.' }, { status: 400 })
    }

    // PROTECÇÃO: o username 'admin' é reservado para o administrador principal
    // (gerido via código, não via painel)
    if (String(username).toLowerCase() === 'admin') {
      return NextResponse.json(
        { error: 'O nome de utilizador "admin" é reservado para o administrador principal e não pode ser criado via painel.' },
        { status: 400 }
      )
    }

    // Verifica username único
    const existing = await db.adminUser.findUnique({ where: { username: String(username) } })
    if (existing) {
      return NextResponse.json({ error: 'Nome de utilizador já existe.' }, { status: 400 })
    }

    const finalRole = role === 'admin' ? 'admin' : 'editor'

    // Se for admin, todas as permissões ficam true; se for editor, usa as fornecidas
    let perms: Permissions = {}
    if (finalRole === 'admin') {
      for (const t of ADMIN_TABS) perms[t.key] = true
    } else {
      const provided = (permissions as Permissions | undefined) || {}
      for (const t of ADMIN_TABS) perms[t.key] = provided[t.key] === true
    }

    const user = await db.adminUser.create({
      data: {
        username: String(username),
        password: hashPassword(String(password)),
        nome: nome ? String(nome) : null,
        role: finalRole,
        permissions: stringifyPermissions(perms),
        ativo: ativo !== false,
      },
      select: { id: true, username: true, nome: true, role: true, permissions: true, ativo: true, createdAt: true },
    })

    return NextResponse.json({ ...user, permissions: parsePermissions(user.permissions) })
  } catch (error: any) {
    console.error('Erro ao criar editor:', error)
    return NextResponse.json({ error: 'Erro ao criar editor.' }, { status: 500 })
  }
}
