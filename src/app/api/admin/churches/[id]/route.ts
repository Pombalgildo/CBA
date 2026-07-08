import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

function auth(request: Request) { return !!getTokenFromRequest(request) }

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json()
    const item = await db.church.update({
      where: { id: Number(id) },
      data: {
        provincia: body.provincia,
        nome: String(body.nome || '').slice(0, 300),
        morada: body.morada || null,
        telefone: body.telefone || null,
        pastor: body.pastor || null,
        email: body.email || null,
        gps: body.gps || null,
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao atualizar igreja:', error)
    return NextResponse.json({ error: 'Erro ao guardar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { id } = await params
    await db.church.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao eliminar igreja:', error)
    return NextResponse.json({ error: 'Erro ao eliminar' }, { status: 500 })
  }
}
