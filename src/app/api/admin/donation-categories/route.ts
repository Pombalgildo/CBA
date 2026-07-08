import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

function auth(request: Request) { return !!getTokenFromRequest(request) }

export async function GET(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const items = await db.donationCategory.findMany({ orderBy: [{ ordem: 'asc' }, { id: 'desc' }] })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const body = await request.json()
    const item = await db.donationCategory.create({
      data: {
        label: String(body.label || '').slice(0, 100),
        emoji: String(body.emoji || '').slice(0, 20),
        descricao: String(body.descricao || '').slice(0, 1000),
        versiculo: String(body.versiculo || '').slice(0, 1000),
        gradient: String(body.gradient || '').slice(0, 200),
        barGrad: String(body.barGrad || '').slice(0, 200),
        iconSvg: String(body.iconSvg || '').slice(0, 2000),
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao criar categoria de doação:', error)
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 })
  }
}
