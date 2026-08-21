import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireTabAccess } from '@/lib/authz'

// GET /api/admin/settings — devolve as definições do site
export async function GET(request: Request) {
  const { response } = await requireTabAccess(request, 'definicoes')
  if (response) return response
  const settings = await db.siteSetting.findUnique({ where: { id: 'main' } })
  return NextResponse.json(settings)
}

// PUT /api/admin/settings — atualiza as definições do site
export async function PUT(request: Request) {
  const { response } = await requireTabAccess(request, 'definicoes')
  if (response) return response
  try {
    const body = await request.json()
    const allowed = [
      'siteTitle','siteShortName','heroTitle','heroSubtitle','heroImage','logoUrl',
      'fundacao','reconhecimento','tema','divisa','endereco','telefone','email',
      'horarioCultos','iban','copyright','liveTitle','liveUrl'
    ]
    const data: Record<string, string | boolean> = {}
    for (const k of allowed) {
      if (typeof body[k] === 'string') data[k] = body[k].slice(0, 2000)
    }
    // liveActive é um boolean
    if (typeof body.liveActive === 'boolean') data.liveActive = body.liveActive
    const updated = await db.siteSetting.upsert({
      where: { id: 'main' },
      update: data,
      create: { id: 'main', ...data },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar definições:', error)
    return NextResponse.json({ error: 'Erro ao guardar' }, { status: 500 })
  }
}
