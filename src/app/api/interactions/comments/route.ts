import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createHash } from 'crypto'

// GET /api/interactions/comments?itemType=news&itemId=10
// Devolve os comentários visíveis publicamente de um item.
// São visíveis:
//   - Comentários com estado "aprovado"
//   - Comentários com estado "pendente" criados há mais de 24h (auto-aprovação)
export async function GET(request: Request) {
  const url = new URL(request.url)
  const itemType = url.searchParams.get('itemType')
  const itemId = url.searchParams.get('itemId')

  if (!itemType || !itemId) {
    return NextResponse.json({ error: 'itemType e itemId são obrigatórios' }, { status: 400 })
  }

  const validTypes = ['news', 'publication', 'notice']
  if (!validTypes.includes(itemType)) {
    return NextResponse.json({ error: 'itemType inválido' }, { status: 400 })
  }

  const itemIdNum = parseInt(itemId, 10)
  if (isNaN(itemIdNum)) {
    return NextResponse.json({ error: 'itemId inválido' }, { status: 400 })
  }

  // Há 24 horas atrás — comentários pendentes mais antigos que isto ficam visíveis
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const comments = await db.comment.findMany({
    where: {
      itemType,
      itemId: itemIdNum,
      OR: [
        { estado: 'aprovado' },
        // Pendentes há mais de 24h ficam visíveis automaticamente
        { estado: 'pendente', createdAt: { lt: twentyFourHoursAgo } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      nome: true,
      conteudo: true,
      resposta: true,
      respostaData: true,
      createdAt: true,
    },
  })

  return NextResponse.json(comments)
}

// POST /api/interactions/comments
// Body: { itemType, itemId, nome?, conteudo }
// Os comentários ficam "pendentes" até serem aprovados pelo admin
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { itemType, itemId, nome, conteudo } = body || {}

    if (!itemType || !itemId || !conteudo) {
      return NextResponse.json({ error: 'itemType, itemId e conteudo são obrigatórios' }, { status: 400 })
    }

    const validTypes = ['news', 'publication', 'notice']
    if (!validTypes.includes(itemType)) {
      return NextResponse.json({ error: 'itemType inválido' }, { status: 400 })
    }

    const itemIdNum = parseInt(itemId, 10)
    if (isNaN(itemIdNum)) {
      return NextResponse.json({ error: 'itemId inválido' }, { status: 400 })
    }

    // Validações anti-spam
    const conteudoStr = String(conteudo).trim()
    if (conteudoStr.length < 3) {
      return NextResponse.json({ error: 'Comentário demasiado curto (mínimo 3 caracteres)' }, { status: 400 })
    }
    if (conteudoStr.length > 1000) {
      return NextResponse.json({ error: 'Comentário demasiado longo (máximo 1000 caracteres)' }, { status: 400 })
    }

    const nomeStr = nome ? String(nome).trim().slice(0, 80) : null

    const fingerprint = getFingerprint(request)

    // Rate limiting: máximo 5 comentários pendentes por fingerprint em 10 minutos
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000)
    const recentComments = await db.comment.count({
      where: { fingerprint, createdAt: { gte: tenMinAgo } },
    })
    if (recentComments >= 5) {
      return NextResponse.json(
        { error: 'Muitos comentários enviados recentemente. Aguarde alguns minutos.' },
        { status: 429 }
      )
    }

    const comment = await db.comment.create({
      data: {
        itemType,
        itemId: itemIdNum,
        nome: nomeStr,
        conteudo: conteudoStr,
        estado: 'pendente',
        fingerprint,
      },
      select: {
        id: true,
        nome: true,
        conteudo: true,
        estado: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Comentário enviado! Será visível após aprovação do administrador.',
      comment,
    })
  } catch (error: any) {
    console.error('Erro ao criar comentário:', error)
    return NextResponse.json({ error: 'Erro ao enviar comentário' }, { status: 500 })
  }
}

function getFingerprint(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown'
  const ua = request.headers.get('user-agent') || 'unknown'
  return createHash('sha256').update(`${ip}:${ua}`).digest('hex').slice(0, 32)
}
