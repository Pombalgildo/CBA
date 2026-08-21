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

  const item = await db.urgentNotice.findUnique({ where: { id: idNum } })
  if (!item) return {}

  const url = `${SITE_URL}/avisos/${idNum}`
  const imageUrl = item.imagem
    ? `${SITE_URL}/api/og-image?url=${encodeURIComponent(item.imagem)}`
    : undefined

  return {
    title: `${item.titulo} | CBA`,
    description: item.conteudo.slice(0, 200),
    openGraph: {
      title: item.titulo,
      description: item.conteudo.slice(0, 200),
      url,
      siteName: 'Convenção Baptista de Angola',
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: item.titulo }] : [],
      type: 'article',
      locale: 'pt_PT',
    },
    twitter: {
      card: 'summary_large_image',
      title: item.titulo,
      description: item.conteudo.slice(0, 200),
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function PaginaAviso({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum)) notFound()

  const item = await db.urgentNotice.findUnique({ where: { id: idNum } })
  if (!item) notFound()

  const shareUrl = `${SITE_URL}/avisos/${idNum}`

  return (
    <div className="min-h-screen bg-[#f0ece4]">
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
          <a href="/#/avisos" className="bg-accent hover:bg-accent/90 text-primary font-body font-semibold text-xs uppercase tracking-wider rounded px-4 py-2 transition-colors">
            ← Ver mais avisos
          </a>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <article className="bg-white rounded-xl shadow-md border-l-4 border-red-600 overflow-hidden">
          {/* Badge + data */}
          <div className="p-6 md:p-8 pb-4">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`${item.cor || 'bg-red-600'} text-white text-xs font-body font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>{item.tipo}</span>
              <span className="font-body text-xs text-muted-foreground">📅 {item.data}</span>
            </div>
            <h1 className="font-heading font-bold text-foreground text-2xl md:text-3xl leading-tight mb-4">{item.titulo}</h1>
            <div className="w-16 h-1 bg-secondary mb-6"></div>
          </div>

          {/* Imagem */}
          {item.imagem && (
            <div className="px-6 md:px-8 mb-6">
              <div className="rounded-xl overflow-hidden shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imagem} alt={item.titulo} className="w-full h-auto object-cover" />
              </div>
            </div>
          )}

          {/* Corpo */}
          <div className="px-6 md:px-8 pb-8">
            <div className="font-body text-foreground leading-relaxed text-base md:text-lg text-justify whitespace-pre-line">
              {item.conteudo}
            </div>

            {/* Link opcional */}
            {item.link && (
              <div className="mt-6">
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-body font-semibold text-sm rounded-lg px-5 py-3 transition-colors">
                  📎 Ver documento anexo →
                </a>
              </div>
            )}
          </div>
        </article>

        {/* Barra unificada: partilha + like + comentar */}
        <div className="mt-8">
          <ReactionsBar
            itemType="notice"
            itemId={item.id}
            shareUrl={shareUrl}
            shareTitle={item.titulo}
            shareText={item.conteudo.slice(0, 200)}
            shareImage={item.imagem || undefined}
          />
        </div>

        {/* Link de volta */}
        <div className="mt-6 text-center">
          <a href="/#/avisos" className="inline-flex items-center gap-2 text-secondary hover:underline font-body text-sm font-semibold">
            ← Ver todos os avisos
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
