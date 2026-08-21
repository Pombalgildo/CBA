import { NextResponse } from 'next/server'

// GET /api/image?url=...&w=...&q=...
// Proxy que redimensiona e optimiza imagens externas
// Reduz o tamanho do download e melhora o tempo de carregamento
export async function GET(request: Request) {
  const url = new URL(request.url)
  const imageUrl = url.searchParams.get('url')
  const width = parseInt(url.searchParams.get('w') || '800')
  const quality = parseInt(url.searchParams.get('q') || '75')

  if (!imageUrl) {
    return NextResponse.json({ error: 'URL não fornecido' }, { status: 400 })
  }

  // Validar que a URL é de um domínio permitido
  const allowedDomains = [
    'images.unsplash.com',
    'media.base44.com',
    'img.youtube.com',
    'supabase.co',
    'supabase.in',
  ]

  let parsedUrl: URL
  try {
    parsedUrl = new URL(imageUrl)
  } catch {
    return NextResponse.json({ error: 'URL inválido' }, { status: 400 })
  }

  // Permitir URLs relativas (/uploads/...)
  if (parsedUrl.pathname.startsWith('/uploads/') || parsedUrl.pathname.startsWith('/api/')) {
    // Redirecionar para a imagem local
    return NextResponse.redirect(new URL(imageUrl, request.url))
  }

  const isAllowed = allowedDomains.some(d => parsedUrl.hostname.includes(d))
  if (!isAllowed) {
    return NextResponse.redirect(parsedUrl)
  }

  try {
    // Para Unsplash, adicionar parâmetros de optimização
    let optimisedUrl = imageUrl
    if (parsedUrl.hostname === 'images.unsplash.com') {
      // Unsplash suporta parâmetros de redimensionamento na URL
      const sep = imageUrl.includes('?') ? '&' : '?'
      optimisedUrl = `${imageUrl}${sep}w=${width}&q=${quality}&auto=format&fit=crop`
    }

    // Fazer fetch da imagem
    const res = await fetch(optimisedUrl, {
      headers: { 'User-Agent': 'CBA-ImageProxy/1.0' },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao buscar imagem' }, { status: res.status })
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buffer = await res.arrayBuffer()

    // Devolver a imagem com cache agressivo (1 ano)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CDN-Cache-Control': 'public, max-age=31536000',
        'Vercel-CDN-Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error: any) {
    console.error('Erro no proxy de imagem:', error)
    return NextResponse.json({ error: 'Erro ao processar imagem' }, { status: 500 })
  }
}
