import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, createToken, parsePermissions } from '@/lib/auth'

// POST /api/admin/login — autentica o administrador ou editor
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    if (!username || !password) {
      return NextResponse.json({ error: 'Nome de utilizador e palavra-passe são obrigatórios' }, { status: 400 })
    }

    const user = await db.adminUser.findUnique({ where: { username: String(username) } })
    if (!user || !verifyPassword(String(password), user.password)) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    // Verifica se a conta está activa
    if (!user.ativo) {
      return NextResponse.json({ error: 'A sua conta foi desactivada. Contacte o administrador.' }, { status: 403 })
    }

    // Inclui role e permissões no token
    const permissions = parsePermissions(user.permissions)
    const token = createToken({
      userId: user.id,
      username: user.username,
      nome: user.nome,
      role: user.role,
      permissions,
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        nome: user.nome,
        role: user.role,
        permissions,
      },
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro ao iniciar sessão' }, { status: 500 })
  }
}
