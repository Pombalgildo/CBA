import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ShareButton } from '@/components/public/ShareButton'
import { Reactions } from '@/components/public/Reactions'
import { ReactionsBar } from '@/components/public/ReactionsBar'

const SITE_URL = 'https://www.cbaangola.org'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum)) return {}

  const item = await db.publication.findUnique({ where: { id: idNum } })
  if (!item) return {}

  const url = `${SITE_URL}/publicacoes/${idNum}`
  const imageUrl = item.image
    ? `${SITE_URL}/api/og-image?url=${encodeURIComponent(item.image)}`
    : undefined

  return {
    title: `${item.title} | CBA`,
    description: item.excerpt,
    openGraph: {
      title: item.title,
      description: item.excerpt,
      url,
      siteName: 'Convenção Baptista de Angola',
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: item.title }] : [],
      type: 'article',
      locale: 'pt_PT',
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.excerpt,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function PaginaPublicacao({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum)) notFound()

  const item = await db.publication.findUnique({ where: { id: idNum } })
  if (!item) notFound()

  const shareUrl = `${SITE_URL}/publicacoes/${idNum}`

  return (
    <div className="min-h-screen bg-muted">
      {/* Header simples */}
      <header className="bg-primary border-b-4 border-accent/40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-cba.png" alt="C.B.A" className="h-10 md:h-12 w-auto object-contain" />
            <div className="hidden sm:block">
              <p className="text-white font-heading font-bold text-sm leading-tight">C.B.A</p>
              <p className="text-white/70 font-body text-[10px] uppercase tracking-wider leading-tight">Convenção Baptista de Angola</p>
            </div>
          </a>
          <a href="/#/publicacoes" className="bg-accent hover:bg-accent/90 text-primary font-body font-semibold text-xs uppercase tracking-wider rounded px-4 py-2 transition-colors">
            ← Ver mais publicações
          </a>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Categoria + data + autor */}
          <div className="p-6 md:p-8 pb-4">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="bg-accent text-primary text-xs font-body font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{item.category}</span>
              <span className="font-body text-xs text-muted-foreground">📅 {item.date}</span>
            </div>
            <h1 className="font-heading font-bold text-foreground text-2xl md:text-3xl leading-tight mb-4">{item.title}</h1>
            {item.author && (
              <p className="font-body text-sm text-muted-foreground mb-2">✍️ Por {item.author}</p>
            )}
            <div className="w-16 h-1 bg-secondary mb-6"></div>
          </div>

          {/* Imagem */}
          {item.image && (
            <div className="px-6 md:px-8 mb-6">
              <div className="rounded-xl overflow-hidden shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} className="w-full h-auto object-cover" />
              </div>
            </div>
          )}

          {/* Corpo */}
          <div className="px-6 md:px-8 pb-8">
            <div className="font-body text-foreground leading-relaxed text-base md:text-lg text-justify whitespace-pre-line">
              {item.content || item.excerpt}
            </div>

            {/* Vídeo opcional */}
            {item.videoUrl && (
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-heading font-bold text-foreground text-lg mb-4">🎬 Vídeo</h3>
                <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                  {item.videoUrl.includes('youtube') || item.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${item.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?]+)/)?.[1] || ''}`}
                      className="w-full h-full"
                      allowFullScreen
                      title={item.title}
                    />
                  ) : item.videoUrl.includes('vimeo') ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${item.videoUrl.match(/vimeo\.com\/(\d+)/)?.[1] || ''}`}
                      className="w-full h-full"
                      allowFullScreen
                      title={item.title}
                    />
                  ) : (
                    <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full flex items-center justify-center bg-primary text-white">
                      Ver vídeo →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Assinatura do autor */}
            {item.author && (
              <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-lg">
                  {item.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Escrito por</p>
                  <p className="font-heading font-bold text-foreground">{item.author}</p>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Barra unificada: partilha + like + comentar */}
        <div className="mt-8">
          <ReactionsBar
            itemType="publication"
            itemId={item.id}
            shareUrl={shareUrl}
            shareTitle={item.title}
            shareText={item.excerpt}
            shareImage={item.image}
          />
        </div>

        {/* Link de volta */}
        <div className="mt-6 text-center">
          <a href="/#/publicacoes" className="inline-flex items-center gap-2 text-secondary hover:underline font-body text-sm font-semibold">
            ← Ver todas as publicações
          </a>
        </div>
      </main>

      {/* Footer simples */}
      <footer className="bg-primary py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/70 font-body text-xs">
            © 2026 Convenção Baptista de Angola (C.B.A). Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
