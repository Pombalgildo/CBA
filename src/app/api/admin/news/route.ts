import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

function auth(request: Request) {
  return !!getTokenFromRequest(request)
}

// GET /api/admin/news
export async function GET(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const items = await db.newsItem.findMany({ orderBy: [{ ordem: 'asc' }, { id: 'desc' }] })
  return NextResponse.json(items)
}

// POST /api/admin/news
export async function POST(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const body = await request.json()
    const item = await db.newsItem.create({
      data: {
        tipo: body.tipo || 'Notícia',
        cor: body.cor || 'bg-primary',
        titulo: String(body.titulo || '').slice(0, 300),
        data: String(body.data || '').slice(0, 100),
        resumo: String(body.resumo || '').slice(0, 1000),
        conteudo: String(body.conteudo || '').slice(0, 10000),
        imagem: String(body.imagem || '').slice(0, 1000),
        videoUrl: body.videoUrl ? String(body.videoUrl).slice(0, 500) : null,
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao criar notícia:', error)
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 })
  }
}
