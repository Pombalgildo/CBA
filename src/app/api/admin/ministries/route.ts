import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireTabAccess } from '@/lib/authz'

export async function GET(request: Request) {
  const { response } = await requireTabAccess(request, 'ministerios')
  if (response) return response
  const items = await db.ministry.findMany({ orderBy: [{ ordem: 'asc' }, { id: 'desc' }] })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const { response } = await requireTabAccess(request, 'ministerios')
  if (response) return response
  try {
    const body = await request.json()
    const item = await db.ministry.create({
      data: {
        title: String(body.title || '').slice(0, 300),
        description: String(body.description || '').slice(0, 1000),
        image: body.image ? String(body.image).slice(0, 1000) : null,
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao criar ministério:', error)
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 })
  }
}
