import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Verificar se já existe
    const existing = await db.quemSomosSection.findFirst({ where: { slug: 'visao-e-valores' } })
    if (existing) {
      return NextResponse.json({ success: true, message: 'Visão e Valores já existe', id: existing.id })
    }

    // Criar "Visão e Valores" com ordem 0 (antes do historial)
    const item = await db.quemSomosSection.create({
      data: {
        slug: 'visao-e-valores',
        label: 'Visão e Valores',
        icon: '🎯',
        title: 'Visão e Valores',
        preview: 'A Convenção Baptista de Angola tem uma visão clara de ser uma convenção missionária que proclama o Evangelho de Jesus Cristo a toda Angola e ao mundo. Os nossos valores fundamentais guiam todas as nossas acções e decisões: fidelidade às Escrituras Sagradas, compromisso com a missão evangelística, unidade na diversidade, excelência no serviço, transparência e integridade.',
        full: 'Visão: Ser uma convenção missionária que proclama o Evangelho de Jesus Cristo a toda Angola e ao mundo, formando discípulos e plantando igrejas em todas as províncias.\n\nMissão: Proclamar o Evangelho, formar líderes cristãos, promover a educação cristã e servir a comunidade em nome de Jesus Cristo.\n\nValores Fundamentais:\n• Fidelidade às Escrituras Sagradas\n• Compromisso com a missão evangelística\n• Unidade na diversidade\n• Excelência no serviço\n• Transparência e integridade',
        downloadLabel: 'Baixar Documento Completo',
        ordem: 0,
      },
    })

    // Actualizar a ordem dos outros itens (+1)
    await db.quemSomosSection.updateMany({
      where: { slug: { not: 'visao-e-valores' } },
      data: { ordem: { increment: 1 } },
    })

    return NextResponse.json({ success: true, message: 'Visão e Valores adicionado com ordem 0', id: item.id })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
