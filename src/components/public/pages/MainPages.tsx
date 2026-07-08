'use client'
import { useState } from 'react'
import type { SiteContent, NewsItem, Publication, Ministry } from '@/lib/types'
import { NEWS_CATEGORIAS } from '@/lib/types'
import { VideoEmbed } from '../VideoEmbed'
import { OptimisedImage } from '../OptimisedImage'

export function HomePage({ content }: { content: SiteContent }) {
  const { settings, news, publications } = content
  const featured = news.find((n) => n.tipo === 'Notícia') || news[0]

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative w-full overflow-hidden flex items-center justify-center" style={{ minHeight: '560px', paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="absolute inset-0">
          <img src={settings?.heroImage} alt="Congregação" className="w-full h-full object-cover absolute inset-0" loading="eager" decoding="async" fetchpriority="high" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, hsl(150 34% 24% / 0.55), hsl(150 34% 24% / 0.4), hsl(150 34% 24% / 0.65))' }}></div>
        </div>
        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto py-16">
          <h1 className="font-heading font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight whitespace-pre-line">
            {settings?.heroTitle || 'Bem-vindo à\nConvenção Baptista de Angola'}
          </h1>
          <p className="mt-8 font-body text-white/90 text-sm sm:text-base md:text-lg uppercase tracking-[0.2em]">{settings?.heroSubtitle}</p>
          <a href="#/quem-somos">
            <button className="mt-10 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm sm:text-base uppercase tracking-wider px-8 py-6 rounded-full shadow-lg">Saiba Mais</button>
          </a>
        </div>
      </section>

      {/* Featured News */}
      {featured && (
        <section className="py-10 md:py-14 bg-[#f0ece4]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-secondary"></div>
              <span className="font-heading font-bold text-primary text-xs uppercase tracking-widest">Matéria em Destaque</span>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 flex flex-col md:flex-row">
              <div className="relative md:w-1/2 overflow-hidden">
                <OptimisedImage src={featured.imagem} alt={featured.titulo} className="w-full h-64 md:h-full object-cover" loading="eager" width={1000} />
                <div className="absolute top-4 left-4"><span className="bg-secondary text-white font-body font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full">Destaque</span></div>
              </div>
              <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                <h2 className="font-heading font-bold text-foreground text-xl md:text-2xl lg:text-3xl leading-tight mb-4">{featured.titulo}</h2>
                <p className="font-body text-muted-foreground text-sm md:text-base leading-relaxed mb-8">{featured.resumo}</p>
                <a href="#/noticias"><button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-body font-semibold text-sm uppercase tracking-wider px-6 py-3 rounded-lg w-fit">Ver Matéria Completa →</button></a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quadro de Avisos Urgentes */}
      {content.urgentNotices && content.urgentNotices.length > 0 && (
        <section className="py-10 md:py-14 bg-[#f0ece4]">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-red-600"></div>
              <span className="font-heading font-bold text-primary text-xs uppercase tracking-widest">🚨 Avisos Importantes</span>
            </div>
            <div className="space-y-4">
              {content.urgentNotices.map((aviso) => (
                <div key={aviso.id} className="bg-white rounded-xl shadow-md border-l-4 border-red-600 overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {aviso.imagem && (
                      <div className="sm:w-48 shrink-0">
                        <OptimisedImage src={aviso.imagem} alt={aviso.titulo} className="w-full h-48 sm:h-full object-cover" width={400} />
                      </div>
                    )}
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`${aviso.cor} text-white text-xs font-body font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>{aviso.tipo}</span>
                        <span className="font-body text-xs text-muted-foreground">📅 {aviso.data}</span>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-foreground mb-2">{aviso.titulo}</h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{aviso.conteudo}</p>
                      {aviso.link && (
                        <a href={aviso.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-sm font-body font-semibold text-secondary hover:gap-2 transition-all">
                          📎 Ver documento →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Publications */}
      {publications.length > 0 && (
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-muted">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-secondary mb-2">📖 Conteúdos Recentes</span>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">Publicações Recentes</h2>
              <p className="font-body text-muted-foreground text-sm">Acompanhe os últimos artigos, devocionais e estudos</p>
              <div className="w-16 h-1 bg-secondary mx-auto mt-4"></div>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {publications.slice(0, 4).map((p) => (
                <a
                  key={p.id}
                  href="#/publicacoes"
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group hover:-translate-y-1 duration-300 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                >
                  <div className="relative overflow-hidden h-44">
                    <OptimisedImage src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" width={400} />
                    <div className="absolute top-3 left-3">
                      <span className="bg-accent text-primary text-[10px] font-heading font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">{p.category}</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2 text-[11px] text-muted-foreground">
                      <span>📅 {p.date}</span>
                      {p.author && <span className="truncate">✍️ {p.author}</span>}
                    </div>
                    <h3 className="font-heading font-bold text-sm text-foreground mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">{p.title}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed flex-1 mb-3 line-clamp-2">{p.excerpt}</p>
                    <span className="inline-flex items-center gap-1 font-body text-xs font-semibold text-secondary group-hover:gap-2 transition-all">
                      Ler artigo →
                    </span>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-10">
              <a href="#/publicacoes" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-body font-semibold text-sm uppercase tracking-wider rounded-full px-8 py-3 transition-colors shadow-md">
                Ver todas as publicações →
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export function MinisteriosPage({ content }: { content: SiteContent }) {
  const { ministries } = content
  const [selecionado, setSelecionado] = useState<Ministry | null>(null)

  // Modal de detalhe do departamento
  if (selecionado) {
    const m = selecionado
    return (
      <div className="page-enter">
        <section className="bg-white pt-20 md:pt-24 pb-8 md:pb-10 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <button onClick={() => setSelecionado(null)} className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary mb-6 transition-colors">← Voltar aos Departamentos</button>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-accent text-primary text-xs font-body font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Departamento</span>
            </div>
            <h1 className="font-heading font-bold text-foreground text-2xl md:text-3xl leading-tight mb-4">{m.title}</h1>
            <div className="w-16 h-1 bg-secondary mb-6"></div>
          </div>
        </section>
        <section className="py-8 bg-muted">
          <div className="max-w-5xl mx-auto px-4">
            {m.image && (
              <div className="mb-6 rounded-xl overflow-hidden shadow-md">
                <OptimisedImage src={m.image} alt={m.title} className="w-full h-auto object-cover" loading="eager" width={900} />
              </div>
            )}
            <div className="bg-card rounded-xl border border-border p-6 md:p-10">
              <p className="font-body text-foreground leading-relaxed text-base whitespace-pre-line">{m.description}</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <section className="bg-white pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-secondary mb-2">🙏 Estrutura Organizacional</span>
          <h1 className="font-heading font-bold text-foreground text-3xl md:text-4xl mb-2">Departamentos</h1>
          <p className="font-body text-muted-foreground text-base">Conheça os Departamentos da Convenção Baptista de Angola</p>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4"></div>
        </div>
      </section>
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-muted">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((m: Ministry, idx: number) => {
              const icons = ['🌍', '📚', '🎓', '⛪', '🤝', '👭', '✨', '👥', '📢']
              const icon = icons[idx % icons.length]
              return (
                <div
                  key={m.id}
                  onClick={() => setSelecionado(m)}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group hover:-translate-y-1 duration-300 cursor-pointer"
                >
                  <div className="relative overflow-hidden h-40">
                    {m.image ? (
                      <OptimisedImage src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" width={600} />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-5xl text-gray-300">{icon}</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 text-foreground text-[10px] font-heading font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <span>{icon}</span> Departamento
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading font-bold text-sm text-foreground mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">{m.title}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed flex-1 mb-3 line-clamp-2">{m.description}</p>
                    <span className="inline-flex items-center gap-1 font-body text-xs font-semibold text-secondary group-hover:gap-2 transition-all">
                      Ver Mais →
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export function PublicacoesPage({ content }: { content: SiteContent }) {
  const { publications } = content
  const [selecionada, setSelecionada] = useState<Publication | null>(null)

  // Modal de leitura
  if (selecionada) {
    const p = selecionada
    return (
      <div className="page-enter">
        <section className="bg-white pt-20 md:pt-24 pb-8 md:pb-10 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <button onClick={() => setSelecionada(null)} className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary mb-6 transition-colors">← Voltar às Publicações</button>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-accent text-primary text-xs font-body font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{p.category}</span>
              <span className="font-body text-xs text-muted-foreground">📅 {p.date}</span>
            </div>
            <h1 className="font-heading font-bold text-foreground text-2xl md:text-3xl leading-tight mb-4">{p.title}</h1>
            {p.author && (
              <p className="font-body text-sm text-muted-foreground mb-2">✍️ Por {p.author}</p>
            )}
            <div className="w-16 h-1 bg-secondary mb-6"></div>
          </div>
        </section>
        <section className="py-8 bg-muted">
          <div className="max-w-5xl mx-auto px-4">
            {p.image && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-md">
                <OptimisedImage src={p.image} alt={p.title} className="w-full h-auto object-cover" loading="eager" width={900} />
              </div>
            )}
            <article className="bg-card rounded-xl border border-border p-6 md:p-12">
              <p className="font-body text-foreground leading-relaxed text-base md:text-lg text-justify whitespace-pre-line">{p.content || p.excerpt}</p>
              {p.videoUrl && (
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-heading font-bold text-foreground text-lg mb-4">🎬 Vídeo</h3>
                  <VideoEmbed url={p.videoUrl} />
                </div>
              )}
              {p.author && (
                <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-lg">
                    {p.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Escrito por</p>
                    <p className="font-heading font-bold text-foreground">{p.author}</p>
                  </div>
                </div>
              )}
            </article>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <section className="bg-white pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4"><span className="text-4xl">📖</span><h1 className="font-heading font-bold text-foreground text-3xl md:text-4xl">Publicações</h1></div>
          <p className="mt-3 font-body text-muted-foreground text-base">Artigos, devocionais e a nossa Revista da EBD</p>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publications.map((p: Publication) => (
              <div key={p.id} className="bg-card rounded-xl shadow-md border border-border/50 hover:shadow-lg transition-shadow h-full overflow-hidden flex flex-col">
                <OptimisedImage src={p.image} alt={p.title} className="w-full h-48 object-cover" width={600} />
                <div className="p-6 md:p-8 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center"><span className="text-secondary text-sm font-bold">{p.category.charAt(0)}</span></div>
                    <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent">{p.category}</span>
                    <span className="font-body text-xs text-muted-foreground ml-auto">{p.date}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{p.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1">{p.excerpt}</p>
                  {p.videoUrl && (
                    <div className="mt-3 mb-3">
                      <VideoEmbed url={p.videoUrl} />
                    </div>
                  )}
                  <button
                    onClick={() => setSelecionada(p)}
                    className="mt-4 border border-secondary text-secondary hover:bg-secondary hover:text-white font-body font-semibold text-xs uppercase tracking-wider rounded-full self-start px-5 py-2 transition-colors"
                  >
                    Ler Mais →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
