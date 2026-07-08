import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/donation — guarda um comprovativo de doação
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { categoria, metodo, nome, montante, observacao, ficheiro } = body

    if (!categoria || !metodo || !nome || !montante) {
      return NextResponse.json({ error: 'Categoria, método, nome e montante são obrigatórios' }, { status: 400 })
    }

    const donation = await db.donationProof.create({
      data: {
        categoria: String(categoria).slice(0, 100),
        metodo: String(metodo).slice(0, 100),
        nome: String(nome).slice(0, 200),
        montante: String(montante).slice(0, 100),
        observacao: observacao ? String(observacao).slice(0, 1000) : null,
        ficheiro: ficheiro ? String(ficheiro).slice(0, 500) : null,
      },
    })

    return NextResponse.json({ success: true, id: donation.id })
  } catch (error) {
    console.error('Erro ao guardar doação:', error)
    return NextResponse.json({ error: 'Erro ao enviar comprovativo' }, { status: 500 })
  }
}
