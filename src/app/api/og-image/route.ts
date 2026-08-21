import { NextResponse } from 'next/server'
import sharp from 'sharp'

// GET /api/og-image?url=<URL externa>
// Faz proxy de imagens externas (ex: Supabase Storage) e REDIMENSIONA para
// exactamente 1200x630 (o tamanho recomendado pelo Facebook/WhatsApp para
// previews de partilha). Isto garante que:
//   1. A imagem tem cache headers adequados (Supabase devolve no-cache)
//   2. As dimensões correspondem ao og:image:width=1200 e og:image:height=630
//   3. O WhatsApp mostra a imagem em tamanho completo no preview
export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Parâmetro url é obrigatório' }, { status: 400 })
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return NextResponse.json({ error: 'URL inválido' }, { status: 400 })
  }

  try {
    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'CBA-OG-Proxy/1.0' },
      next: { revalidate: 300 },
    })

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Imagem não encontrada no upstream' }, { status: 502 })
    }

    const buffer = Buffer.from(await upstream.arrayBuffer())

    // Redimensiona para 1200x630 com crop inteligente (cover)
    // Isto garante dimensões exactas para o og:image:width/height
    const resized = await sharp(buffer)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'attention', // detecta a área de interesse (rosto/objecto principal)
        withoutEnlargement: false, // permite ampliar imagens pequenas
      })
      .jpeg({
        quality: 85,
        progressive: true,
        mozjpeg: true,
      })
      .toBuffer()

    return new NextResponse(resized, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CDN-Cache-Control': 'public, max-age=31536000',
        'Vercel-CDN-Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error: any) {
    console.error('Erro no proxy OG image:', error)
    return NextResponse.json({ error: 'Erro ao processar imagem' }, { status: 500 })
  }
}
