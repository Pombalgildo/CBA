import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

function auth(request: Request) { return !!getTokenFromRequest(request) }

export async function GET(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const items = await db.church.findMany({ orderBy: [{ provincia: 'asc' }, { ordem: 'asc' }] })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const body = await request.json()
    const item = await db.church.create({
      data: {
        provincia: String(body.provincia || '').slice(0, 100),
        nome: String(body.nome || '').slice(0, 300),
        morada: body.morada ? String(body.morada).slice(0, 500) : null,
        telefone: body.telefone ? String(body.telefone).slice(0, 100) : null,
        pastor: body.pastor ? String(body.pastor).slice(0, 200) : null,
        email: body.email ? String(body.email).slice(0, 200) : null,
        gps: body.gps ? String(body.gps).slice(0, 100) : null,
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao criar igreja:', error)
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 })
  }
}
