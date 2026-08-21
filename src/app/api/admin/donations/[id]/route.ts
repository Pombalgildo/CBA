import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireTabAccess } from '@/lib/authz'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireTabAccess(request, 'doacoes')
  if (response) return response
  try {
    const { id } = await params
    const body = await request.json()
    const item = await db.donationProof.update({
      where: { id: Number(id) },
      data: { confirmado: !!body.confirmado },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao atualizar doação:', error)
    return NextResponse.json({ error: 'Erro ao guardar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireTabAccess(request, 'doacoes')
  if (response) return response
  try {
    const { id } = await params
    await db.donationProof.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao eliminar doação:', error)
    return NextResponse.json({ error: 'Erro ao eliminar' }, { status: 500 })
  }
}
