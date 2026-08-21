import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireSuperAdmin } from '@/lib/authz'

// GET /api/admin/comments?estado=pendente|aprovado|rejeitado|todos
// Lista comentários para moderação. Por defeito mostra apenas pendentes.
export async function GET(request: Request) {
  const { response } = await requireSuperAdmin(request)
  if (response) return response

  const url = new URL(request.url)
  const estado = url.searchParams.get('estado') || 'pendente'

  const where = estado === 'todos' ? {} : { estado }
  const comments = await db.comment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      itemType: true,
      itemId: true,
      nome: true,
      conteudo: true,
      estado: true,
      fingerprint: true,
      resposta: true,
      respostaData: true,
      createdAt: true,
    },
  })

  return NextResponse.json(comments)
}
