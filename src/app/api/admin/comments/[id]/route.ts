import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireSuperAdmin } from '@/lib/authz'

// PUT /api/admin/comments/[id]
// Body pode conter:
//   { estado: "aprovado" | "rejeitado" | "pendente" }  — mudar estado
//   { resposta: "texto da resposta" }                   — adicionar resposta do admin
//   { resposta: null }                                   — remover resposta
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireSuperAdmin(request)
  if (response) return response

  try {
    const { id } = await params
    const idNum = parseInt(id, 10)
    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const existing = await db.comment.findUnique({ where: { id: idNum } })
    if (!existing) {
      return NextResponse.json({ error: 'Comentário não encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const { estado, resposta } = body || {}

    const data: any = {}
    if (estado !== undefined) {
      const validEstados = ['pendente', 'aprovado', 'rejeitado']
      if (!validEstados.includes(estado)) {
        return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
      }
      data.estado = estado
    }
    if (resposta !== undefined) {
      data.resposta = resposta ? String(resposta).slice(0, 2000) : null
      data.respostaData = resposta ? new Date() : null
    }

    const updated = await db.comment.update({
      where: { id: idNum },
      data,
      select: {
        id: true,
        itemType: true,
        itemId: true,
        nome: true,
        conteudo: true,
        estado: true,
        resposta: true,
        respostaData: true,
        createdAt: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Erro ao actualizar comentário:', error)
    return NextResponse.json({ error: 'Erro ao actualizar comentário' }, { status: 500 })
  }
}

// DELETE /api/admin/comments/[id] — elimina permanentemente
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireSuperAdmin(request)
  if (response) return response

  try {
    const { id } = await params
    const idNum = parseInt(id, 10)
    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const existing = await db.comment.findUnique({ where: { id: idNum } })
    if (!existing) {
      return NextResponse.json({ error: 'Comentário não encontrado' }, { status: 404 })
    }

    await db.comment.delete({ where: { id: idNum } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao eliminar comentário:', error)
    return NextResponse.json({ error: 'Erro ao eliminar comentário' }, { status: 500 })
  }
}
