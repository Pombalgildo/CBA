import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createHash } from 'crypto'

// GET /api/interactions/status?itemType=news&itemId=10
// Devolve o número de likes e comentários aprovados para um item
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

  // Há 24 horas atrás — comentários pendentes mais antigos que isto contam como visíveis
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const [likes, comments] = await Promise.all([
    db.like.count({ where: { itemType, itemId: itemIdNum } }),
    db.comment.count({
      where: {
        itemType,
        itemId: itemIdNum,
        OR: [
          { estado: 'aprovado' },
          { estado: 'pendente', createdAt: { lt: twentyFourHoursAgo } },
        ],
      },
    }),
  ])

  // Verifica se o visitante actual já deu like
  const fingerprint = getFingerprint(request)
  const userLike = await db.like.findUnique({
    where: { itemType_itemId_fingerprint: { itemType, itemId: itemIdNum, fingerprint } },
  })

  return NextResponse.json({
    likes,
    comments,
    liked: !!userLike,
  })
}

// Helper: gera um fingerprint anonimizado a partir do IP + User-Agent
function getFingerprint(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown'
  const ua = request.headers.get('user-agent') || 'unknown'
  // Hash SHA-256 do IP + UA — não guardamos o IP original (privacidade)
  return createHash('sha256').update(`${ip}:${ua}`).digest('hex').slice(0, 32)
}
