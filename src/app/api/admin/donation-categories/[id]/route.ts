import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

function auth(request: Request) { return !!getTokenFromRequest(request) }

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json()
    const item = await db.donationCategory.update({
      where: { id: Number(id) },
      data: {
        label: body.label,
        emoji: body.emoji,
        descricao: String(body.descricao || '').slice(0, 1000),
        versiculo: String(body.versiculo || '').slice(0, 1000),
        gradient: body.gradient,
        barGrad: body.barGrad,
        iconSvg: body.iconSvg,
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao atualizar categoria de doação:', error)
    return NextResponse.json({ error: 'Erro ao guardar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { id } = await params
    await db.donationCategory.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao eliminar categoria de doação:', error)
    return NextResponse.json({ error: 'Erro ao eliminar' }, { status: 500 })
  }
}
