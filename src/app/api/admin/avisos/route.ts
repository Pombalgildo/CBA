import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

function auth(request: Request) { return !!getTokenFromRequest(request) }

export async function GET(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const items = await db.urgentNotice.findMany({ orderBy: [{ ordem: 'asc' }, { id: 'desc' }] })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const body = await request.json()
    const item = await db.urgentNotice.create({
      data: {
        tipo: body.tipo || 'Anúncio',
        titulo: String(body.titulo || '').slice(0, 300),
        conteudo: String(body.conteudo || ''),
        data: String(body.data || '').slice(0, 100),
        cor: body.cor || 'bg-red-600',
        imagem: body.imagem ? String(body.imagem).slice(0, 1000) : null,
        link: body.link ? String(body.link).slice(0, 1000) : null,
        ativo: body.ativo !== false,
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao criar aviso:', error)
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 })
  }
}
