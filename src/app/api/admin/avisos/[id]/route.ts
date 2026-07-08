import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

function auth(request: Request) { return !!getTokenFromRequest(request) }

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json()
    const item = await db.urgentNotice.update({
      where: { id: Number(id) },
      data: {
        tipo: body.tipo,
        titulo: String(body.titulo || '').slice(0, 300),
        conteudo: String(body.conteudo || ''),
        data: String(body.data || '').slice(0, 100),
        cor: body.cor,
        imagem: body.imagem || null,
        link: body.link || null,
        ativo: body.ativo !== false,
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao actualizar aviso:', error)
    return NextResponse.json({ error: 'Erro ao guardar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { id } = await params
    await db.urgentNotice.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao eliminar aviso:', error)
    return NextResponse.json({ error: 'Erro ao eliminar' }, { status: 500 })
  }
}
