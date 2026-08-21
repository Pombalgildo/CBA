import { NextResponse } from 'next/server'
import { getTokenFromRequest } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'
import { isSupabaseConfigured, uploadToSupabase } from '@/lib/supabase'
export async function POST(request: Request) {
  const url = new URL(request.url)
  const isPublic = url.searchParams.get('public') === '1'
  if (!isPublic && !getTokenFromRequest(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Nenhum ficheiro' }, { status: 400 })
    const allowedTypes = ['image/jpeg','image/png','image/webp','image/gif','image/jpg','application/pdf']
    if (!allowedTypes.includes(file.type)) return NextResponse.json({ error: 'Tipo não permitido' }, { status: 400 })
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Máx 10MB' }, { status: 400 })
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const safeExt = ['jpg','jpeg','png','webp','gif','pdf'].includes(ext) ? ext : 'bin'
    const filename = `${Date.now()}-${randomBytes(6).toString('hex')}.${safeExt}`
    if (isSupabaseConfigured()) {
      const buf = Buffer.from(await file.arrayBuffer())
      const publicUrl = await uploadToSupabase(buf, filename, file.type)
      return NextResponse.json({ success: true, url: publicUrl, filename: file.name, size: file.size })
    } else {
      const d = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(d, { recursive: true })
      await writeFile(path.join(d, filename), Buffer.from(await file.arrayBuffer()))
      return NextResponse.json({ success: true, url: `/uploads/${filename}`, filename: file.name, size: file.size })
    }
  } catch (error) { return NextResponse.json({ error: 'Erro' }, { status: 500 }) }
}
