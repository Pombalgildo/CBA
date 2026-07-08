import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

function auth(request: Request) { return !!getTokenFromRequest(request) }

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json()
    const item = await db.publication.update({
      where: { id: Number(id) },
      data: {
        category: body.category,
        title: String(body.title || '').slice(0, 300),
        author: body.author || null,
        excerpt: String(body.excerpt || '').slice(0, 500),
        content: body.content || null,
        date: String(body.date || '').slice(0, 100),
        image: String(body.image || '').slice(0, 1000),
        videoUrl: body.videoUrl || null,
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao atualizar publicação:', error)
    return NextResponse.json({ error: 'Erro ao guardar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { id } = await params
    await db.publication.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao eliminar publicação:', error)
    return NextResponse.json({ error: 'Erro ao eliminar' }, { status: 500 })
  }
}
