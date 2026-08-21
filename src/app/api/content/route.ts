import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/content — devolve todo o conteúdo público do site
export async function GET() {
  try {
    const [settings, news, publications, events, churches, ministries, donationCats, quemSomosSections, urgentNotices] = await Promise.all([
      db.siteSetting.findUnique({ where: { id: 'main' } }),
      db.newsItem.findMany({ orderBy: [{ ordem: 'asc' }, { id: 'desc' }] }),
      db.publication.findMany({ orderBy: [{ ordem: 'asc' }, { id: 'desc' }] }),
      db.event.findMany({ orderBy: [{ ordem: 'asc' }, { id: 'desc' }] }),
      db.church.findMany({ orderBy: [{ provincia: 'asc' }, { ordem: 'asc' }] }),
      db.ministry.findMany({ orderBy: [{ ordem: 'asc' }, { id: 'desc' }] }),
      db.donationCategory.findMany({ orderBy: [{ ordem: 'asc' }, { id: 'desc' }] }),
      db.quemSomosSection.findMany({ orderBy: [{ ordem: 'asc' }, { id: 'desc' }] }),
      db.urgentNotice.findMany({ where: { ativo: true }, orderBy: [{ ordem: 'asc' }, { id: 'desc' }] }),
    ])

    const eventsParsed = events.map(e => ({
      ...e,
      fotos: JSON.parse(e.fotos || '[]'),
    }))

    return NextResponse.json({
      settings,
      news,
      publications,
      events: eventsParsed,
      churches,
      ministries,
      donationCats,
      quemSomosSections,
      urgentNotices,
    })
  } catch (error) {
    console.error('Erro ao carregar conteúdo:', error)
    return NextResponse.json({ error: 'Erro ao carregar conteúdo' }, { status: 500 })
  }
}
