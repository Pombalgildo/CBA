import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, createToken } from '@/lib/auth'

// POST /api/admin/login — autentica o administrador
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

    const token = createToken({ userId: user.id, username: user.username, nome: user.nome })
    return NextResponse.json({ token, user: { username: user.username, nome: user.nome } })
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro ao iniciar sessão' }, { status: 500 })
  }
}
