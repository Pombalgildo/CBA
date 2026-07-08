import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

function auth(request: Request) { return !!getTokenFromRequest(request) }

export async function GET(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const items = await db.quemSomosSection.findMany({ orderBy: [{ ordem: 'asc' }, { id: 'desc' }] })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const body = await request.json()
    const item = await db.quemSomosSection.create({
      data: {
        slug: String(body.slug || '').slice(0, 100),
        label: String(body.label || '').slice(0, 200),
        icon: String(body.icon || '').slice(0, 20),
        title: String(body.title || '').slice(0, 300),
        preview: String(body.preview || ''),
        full: body.full ? String(body.full) : null,
        downloadLabel: String(body.downloadLabel || 'Baixar Documento Completo').slice(0, 200),
        documentoUrl: body.documentoUrl ? String(body.documentoUrl).slice(0, 1000) : null,
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao criar secção:', error)
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 })
  }
}
