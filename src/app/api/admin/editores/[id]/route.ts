import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { requireSuperAdmin } from '@/lib/authz'
import { ADMIN_TABS, parsePermissions, stringifyPermissions, type Permissions } from '@/lib/auth'

// PUT /api/admin/editores/[id] — actualiza editor (apenas super-admin)
// Body: { nome?, password?, role?, permissions?, ativo? }
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireSuperAdmin(request)
  if (response) return response

  try {
    const { id } = await params
    const idNum = parseInt(id, 10)
    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })
    }

    const existing = await db.adminUser.findUnique({ where: { id: idNum } })
    if (!existing) {
      return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 })
    }

    // PROTECÇÃO: o admin principal (username='admin') NÃO pode ser editado via painel.
    // É gerido exclusivamente via código (rotas /api/reset-admin e /api/admin/migrate-editors).
    if (existing.username === 'admin') {
      return NextResponse.json(
        { error: 'O administrador principal não pode ser editado via painel. É gerido directamente via código.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { nome, password, role, permissions, ativo } = body || {}

    const data: any = {}
    if (nome !== undefined) data.nome = nome ? String(nome) : null
    if (password) {
      if (String(password).length < 6) {
        return NextResponse.json({ error: 'Palavra-passe deve ter pelo menos 6 caracteres.' }, { status: 400 })
      }
      data.password = hashPassword(String(password))
    }
    if (role !== undefined) {
      data.role = role === 'admin' ? 'admin' : 'editor'
      // Se mudou para admin, todas as permissões true
      if (data.role === 'admin') {
        const allTrue: Permissions = {}
        for (const t of ADMIN_TABS) allTrue[t.key] = true
        data.permissions = stringifyPermissions(allTrue)
      }
    }
    // Se for editor e vieram permissões, actualizar
    const finalRole = data.role || existing.role
    if (finalRole === 'editor' && permissions !== undefined) {
      const provided = (permissions as Permissions | undefined) || {}
      const perms: Permissions = {}
      for (const t of ADMIN_TABS) perms[t.key] = provided[t.key] === true
      data.permissions = stringifyPermissions(perms)
    }
    if (ativo !== undefined) data.ativo = ativo === true || ativo === 'true'

    const updated = await db.adminUser.update({
      where: { id: idNum },
      data,
      select: { id: true, username: true, nome: true, role: true, permissions: true, ativo: true, createdAt: true },
    })

    return NextResponse.json({ ...updated, permissions: parsePermissions(updated.permissions) })
  } catch (error: any) {
    console.error('Erro ao actualizar editor:', error)
    return NextResponse.json({ error: 'Erro ao actualizar editor.' }, { status: 500 })
  }
}

// DELETE /api/admin/editores/[id] — elimina editor (apenas super-admin)
// Não permite eliminar a si próprio nem o admin principal (id=1 ou username="admin")
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response, payload } = await requireSuperAdmin(request)
  if (response) return response

  try {
    const { id } = await params
    const idNum = parseInt(id, 10)
    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })
    }

    const existing = await db.adminUser.findUnique({ where: { id: idNum } })
    if (!existing) {
      return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 })
    }

    // Não permitir eliminar o admin principal
    if (existing.username === 'admin') {
      return NextResponse.json({ error: 'Não é possível eliminar o administrador principal.' }, { status: 400 })
    }

    // Não permitir eliminar a si próprio
    const currentUserId = payload?.userId as number | undefined
    if (currentUserId === idNum) {
      return NextResponse.json({ error: 'Não é possível eliminar a sua própria conta.' }, { status: 400 })
    }

    await db.adminUser.delete({ where: { id: idNum } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao eliminar editor:', error)
    return NextResponse.json({ error: 'Erro ao eliminar editor.' }, { status: 500 })
  }
}
