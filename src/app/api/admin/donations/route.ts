import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireTabAccess } from '@/lib/authz'

export async function GET(request: Request) {
  const { response } = await requireTabAccess(request, 'doacoes')
  if (response) return response
  const items = await db.donationProof.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(items)
}
