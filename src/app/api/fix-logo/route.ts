import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const updated = await db.siteSetting.upsert({
      where: { id: 'main' },
      update: { logoUrl: '/logo-cba.png' },
      create: { id: 'main', logoUrl: '/logo-cba.png' },
    })
    return NextResponse.json({ success: true, logoUrl: updated.logoUrl })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
