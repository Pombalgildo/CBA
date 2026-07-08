import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/fix-horarios — actualiza os horários para os valores correctos do escritório
export async function GET() {
  try {
    const updated = await db.siteSetting.upsert({
      where: { id: 'main' },
      update: {
        horarioCultos: 'Segunda a Sexta: 8h-15h',
        cultoDomingoEBD: '8h00',
        cultoDomingoAdoracao: '15h00',
        cultoQuartaEstudo: 'Fechado',
        cultoSextaOracao: 'Fechado',
      },
      create: {
        id: 'main',
        horarioCultos: 'Segunda a Sexta: 8h-15h',
        cultoDomingoEBD: '8h00',
        cultoDomingoAdoracao: '15h00',
        cultoQuartaEstudo: 'Fechado',
        cultoSextaOracao: 'Fechado',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Horários actualizados para funcionamento do escritório',
      values: {
        horarioCultos: updated.horarioCultos,
        abertura: updated.cultoDomingoEBD,
        encerramento: updated.cultoDomingoAdoracao,
        fimDeSemana: updated.cultoQuartaEstudo,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
