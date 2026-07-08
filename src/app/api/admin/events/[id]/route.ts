import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

function auth(request: Request) { return !!getTokenFromRequest(request) }

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json()
    const item = await db.event.update({
      where: { id: Number(id) },
      data: {
        categoria: body.categoria,
        titulo: String(body.titulo || '').slice(0, 300),
        data: String(body.data || '').slice(0, 100),
        capa: String(body.capa || '').slice(0, 1000),
        fotos: JSON.stringify(body.fotos || []),
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json({ ...item, fotos: JSON.parse(item.fotos || '[]') })
  } catch (error) {
    console.error('Erro ao atualizar evento:', error)
    return NextResponse.json({ error: 'Erro ao guardar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { id } = await params
    await db.event.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao eliminar evento:', error)
    return NextResponse.json({ error: 'Erro ao eliminar' }, { status: 500 })
  }
}
