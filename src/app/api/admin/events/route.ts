import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

function auth(request: Request) { return !!getTokenFromRequest(request) }

export async function GET(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const items = await db.event.findMany({ orderBy: [{ ordem: 'asc' }, { id: 'desc' }] })
  return NextResponse.json(items.map(e => ({ ...e, fotos: JSON.parse(e.fotos || '[]') })))
}

export async function POST(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const body = await request.json()
    const item = await db.event.create({
      data: {
        categoria: String(body.categoria || '').slice(0, 100),
        titulo: String(body.titulo || '').slice(0, 300),
        data: String(body.data || '').slice(0, 100),
        capa: String(body.capa || '').slice(0, 1000),
        fotos: JSON.stringify(body.fotos || []),
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json({ ...item, fotos: JSON.parse(item.fotos || '[]') })
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 })
  }
}
