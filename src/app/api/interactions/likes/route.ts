import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createHash } from 'crypto'

// POST /api/interactions/likes
// Body: { itemType: "news"|"publication"|"notice", itemId: number, action: "like"|"unlike" }
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { itemType, itemId, action } = body || {}

    if (!itemType || !itemId || !action) {
      return NextResponse.json({ error: 'itemType, itemId e action são obrigatórios' }, { status: 400 })
    }

    const validTypes = ['news', 'publication', 'notice']
    if (!validTypes.includes(itemType)) {
      return NextResponse.json({ error: 'itemType inválido' }, { status: 400 })
    }

    const itemIdNum = parseInt(itemId, 10)
    if (isNaN(itemIdNum)) {
      return NextResponse.json({ error: 'itemId inválido' }, { status: 400 })
    }

    const fingerprint = getFingerprint(request)

    if (action === 'like') {
      // Tenta criar o like; se já existir (unique constraint), retorna o existente
      try {
        await db.like.create({
          data: { itemType, itemId: itemIdNum, fingerprint },
        })
      } catch (e: any) {
        // Se já existe (P2002), não é erro — apenas ignora
        if (e.code !== 'P2002') throw e
      }
    } else if (action === 'unlike') {
      await db.like.deleteMany({
        where: { itemType, itemId: itemIdNum, fingerprint },
      })
    } else {
      return NextResponse.json({ error: 'action deve ser "like" ou "unlike"' }, { status: 400 })
    }

    // Devolve o estado actualizado
    const likes = await db.like.count({ where: { itemType, itemId: itemIdNum } })
    const userLike = await db.like.findUnique({
      where: { itemType_itemId_fingerprint: { itemType, itemId: itemIdNum, fingerprint } },
    })

    return NextResponse.json({
      likes,
      liked: !!userLike,
    })
  } catch (error: any) {
    console.error('Erro em likes:', error)
    return NextResponse.json({ error: 'Erro ao processar like' }, { status: 500 })
  }
}

function getFingerprint(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown'
  const ua = request.headers.get('user-agent') || 'unknown'
  return createHash('sha256').update(`${ip}:${ua}`).digest('hex').slice(0, 32)
}
