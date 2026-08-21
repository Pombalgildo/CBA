import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/contact — guarda uma mensagem de contacto
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tipo, nome, email, mensagem } = body

    if (!nome || !email || !mensagem) {
      return NextResponse.json({ error: 'Nome, email e mensagem são obrigatórios' }, { status: 400 })
    }

    const msg = await db.contactMessage.create({
      data: {
        tipo: tipo || 'Dúvida',
        nome: String(nome).slice(0, 200),
        email: String(email).slice(0, 200),
        mensagem: String(mensagem).slice(0, 5000),
      },
    })

    return NextResponse.json({ success: true, id: msg.id })
  } catch (error) {
    console.error('Erro ao guardar mensagem:', error)
    return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 })
  }
}
