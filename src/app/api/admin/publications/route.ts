import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

function auth(request: Request) { return !!getTokenFromRequest(request) }

export async function GET(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const items = await db.publication.findMany({ orderBy: [{ ordem: 'asc' }, { id: 'desc' }] })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const body = await request.json()
    const item = await db.publication.create({
      data: {
        category: String(body.category || '').slice(0, 100),
        title: String(body.title || '').slice(0, 300),
        author: body.author ? String(body.author).slice(0, 200) : null,
        excerpt: String(body.excerpt || '').slice(0, 500),
        content: body.content ? String(body.content) : null,
        date: String(body.date || '').slice(0, 100),
        image: String(body.image || '').slice(0, 1000),
        videoUrl: body.videoUrl ? String(body.videoUrl).slice(0, 500) : null,
        ordem: Number(body.ordem) || 0,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao criar publicação:', error)
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 })
  }
}
