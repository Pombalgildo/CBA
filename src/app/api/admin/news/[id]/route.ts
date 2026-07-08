import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

function auth(request: Request) {
  return !!getTokenFromRequest(request)
}

// PUT /api/admin/news/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json()
    const item = await db.newsItem.update({
      where: { id: Number(id) },
      data: {
        tipo: body.tipo,
        cor: body.cor,
        titulo: String(body.titulo || '').slice(0, 300),
        data: String(body.data || '').slice(0, 100),
        resumo: String(body.resumo || '').slice(0, 1000),
        conteudo: String(body.conteudo || '').slice(0, 10000),
        imagem: String(body.imagem || '').slice(0, 1000),
        videoUrl: body.videoUrl || null,
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error)
    return NextResponse.json({ error: 'Erro ao guardar' }, { status: 500 })
  }
}

// DELETE /api/admin/news/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { id } = await params
    await db.newsItem.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao eliminar notícia:', error)
    return NextResponse.json({ error: 'Erro ao eliminar' }, { status: 500 })
  }
}
