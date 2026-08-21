import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireTabAccess } from '@/lib/authz'

export async function GET(request: Request) {
  const { response } = await requireTabAccess(request, 'mensagens')
  if (response) return response
  const items = await db.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(items)
}
