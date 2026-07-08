#!/bin/bash
set -e
COMMIT_MSG="${1:-Update CBA website}"
STAGING="/tmp/cba-deploy-$(date +%s)"
REPO_URL="https://github.com/Pombalgildo/CBA.git"

# Token lido de variável de ambiente ou ficheiro local (não committed)
if [ -z "$GITHUB_TOKEN" ]; then
  if [ -f "$HOME/.cba-token" ]; then
    GITHUB_TOKEN=$(cat "$HOME/.cba-token")
  else
    echo "❌ Defina GITHUB_TOKEN ou crie ~/.cba-token"
    exit 1
  fi
fi
REPO_URL="https://Pombalgildo:${GITHUB_TOKEN}@github.com/Pombalgildo/CBA.git"

rm -rf "$STAGING"
mkdir -p "$STAGING"
cd /home/z/my-project
for item in src prisma public scripts package.json bun.lock next.config.ts tsconfig.json postcss.config.mjs tailwind.config.ts components.json eslint.config.mjs vercel.json .env.example .gitignore README.md; do
  if [ -e "$item" ]; then cp -r "$item" "$STAGING/"; fi
done
rm -f "$STAGING/public/cba-app.html" "$STAGING/public/GUIA-DEPLOY.md" "$STAGING/public/cba-site-vercel.zip" "$STAGING/public/init-database.sql"
rm -f "$STAGING/scripts/package-for-vercel.sh" "$STAGING/scripts/create-routes.sh" "$STAGING/scripts/seed-prod.ts" "$STAGING/scripts/deploy.sh"
rm -f "$STAGING/public/uploads/"*.png "$STAGING/public/uploads/"*.jpg
touch "$STAGING/public/uploads/.gitkeep"
cp prisma/schema.production.prisma "$STAGING/prisma/schema.prisma"
rm -f "$STAGING/prisma/schema.production.prisma"
if [ ! -d "$STAGING/src/app/api/upload" ]; then
  mkdir -p "$STAGING/src/app/api/upload"
  cat > "$STAGING/src/app/api/upload/route.ts" << 'UPLOADEOF'
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
UPLOADEOF
fi
cd "$STAGING"
git init 2>&1 | tail -1
git config user.email "deploy@cba-angola.org"
git config user.name "CBA Deploy"
git add .
git commit -m "$COMMIT_MSG" 2>&1 | tail -2
git branch -M main
git remote add origin "$REPO_URL"
git push -u origin main --force 2>&1 | tail -3
git remote remove origin
cd /tmp && rm -rf "$STAGING"
echo "✅ Deploy concluído!"
