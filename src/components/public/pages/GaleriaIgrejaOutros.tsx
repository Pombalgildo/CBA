'use client'
import { useState } from 'react'
import type { SiteContent, EventItem, Church } from '@/lib/types'
import { EVENTO_CAT_COLORS, PROVINCIAS_LIST, getProvinciaEmoji, QUEM_SOMOS_SECTIONS, QUEM_SOMOS_CONTENT } from '@/lib/types'
import { OptimisedImage } from '../OptimisedImage'

export function GaleriaPage({ content }: { content: SiteContent }) {
  const { events } = content
  const [eventoId, setEventoId] = useState<number | null>(null)
  const [fotoIdx, setFotoIdx] = useState<number | null>(null)

  if (eventoId !== null) {
    const ev = events.find((e) => e.id === eventoId)
    if (!ev) return null

    if (fotoIdx !== null) {
      const foto = ev.fotos[fotoIdx]
      return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setFotoIdx(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white z-10" onClick={() => setFotoIdx(null)}>✕</button>
          <button className="absolute left-3 text-white/70 hover:text-white z-10 p-2 text-3xl" onClick={(e) => { e.stopPropagation(); setFotoIdx((fotoIdx - 1 + ev.fotos.length) % ev.fotos.length) }}>‹</button>
          <button className="absolute right-3 text-white/70 hover:text-white z-10 p-2 text-3xl" onClick={(e) => { e.stopPropagation(); setFotoIdx((fotoIdx + 1) % ev.fotos.length) }}>›</button>
          <div className="max-w-3xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <OptimisedImage src={foto.url} alt={foto.legenda} className="w-full rounded-xl object-contain" width={1200} />
            <div className="mt-4 text-center">
              <p className="font-body text-white/90 text-sm">{foto.legenda}</p>
              <p className="font-body text-white/40 text-xs mt-1">{fotoIdx + 1} / {ev.fotos.length}</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="page-enter max-w-5xl mx-auto px-4 py-8 pt-24">
        <button onClick={() => setEventoId(null)} className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors mb-6">← Voltar à galeria</button>
        <div className="mb-6">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${EVENTO_CAT_COLORS[ev.categoria] || 'bg-muted text-muted-foreground'}`}>{ev.categoria}</span>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mt-2">{ev.titulo}</h2>
          <p className="font-body text-sm text-muted-foreground mt-1">{ev.data} · {ev.fotos.length} fotografias</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {ev.fotos.map((foto, idx) => (
            <div key={idx} onClick={() => setFotoIdx(idx)} className="group cursor-pointer rounded-lg overflow-hidden relative" style={{ aspectRatio: '1' }}>
              <OptimisedImage src={foto.url} alt={foto.legenda} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" width={300} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end"><p className="text-white text-xs px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity font-body">{foto.legenda}</p></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <section className="bg-white pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4"><span className="text-4xl">🖼️</span><h1 className="font-heading font-bold text-foreground text-3xl md:text-4xl">Galeria de Eventos</h1></div>
          <p className="mt-3 font-body text-muted-foreground text-base">Escolha um evento para ver as fotografias</p>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev) => (
            <div key={ev.id} onClick={() => setEventoId(ev.id)} className="group cursor-pointer bg-card rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow border border-border">
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <OptimisedImage src={ev.capa} alt={ev.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" width={600} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">📷 {ev.fotos.length} fotos</div>
              </div>
              <div className="p-4">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${EVENTO_CAT_COLORS[ev.categoria] || 'bg-muted text-muted-foreground'}`}>{ev.categoria}</span>
                <h3 className="font-heading font-bold text-sm mt-2 text-foreground leading-snug">{ev.titulo}</h3>
                <p className="font-body text-xs text-muted-foreground mt-1">{ev.data}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const normalizar = (str: string) => str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : ''

export function EncontrarIgrejaPage({ content }: { content: SiteContent }) {
  const { churches } = content
  const [provincia, setProvincia] = useState<string | null>(null)
  const [igrejaNome, setIgrejaNome] = useState<string | null>(null)
  const [pesquisa, setPesquisa] = useState('')

  const mostraPesquisa = pesquisa.trim().length >= 2

  let conteudo: React.ReactNode

  if (mostraPesquisa) {
    const q = normalizar(pesquisa.trim())
    const resultados: (Church & { _provNome: string; _provEmoji: string })[] = []
    PROVINCIAS_LIST.forEach((p) => {
      churches.forEach((ig) => {
        if (ig.provincia !== p.nome) return
        if (normalizar(ig.nome).includes(q) || (ig.morada && normalizar(ig.morada).includes(q)) || (ig.pastor && normalizar(ig.pastor).includes(q)) || normalizar(p.nome).includes(q)) {
          resultados.push({ ...ig, _provNome: p.nome, _provEmoji: p.emoji })
        }
      })
    })
    conteudo = (
      <section className="bg-muted py-10 pb-16 pt-28">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-body text-sm text-muted-foreground mb-6">{resultados.length} resultado(s) para <span className="font-semibold text-foreground">&ldquo;{pesquisa}&ldquo;</span></p>
          {resultados.length === 0 ? (
            <div className="text-center py-16"><span className="text-5xl mb-4 block">🔍</span><p className="font-body text-muted-foreground">Nenhuma igreja encontrada.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resultados.map((ig) => (
                <button key={ig.id} onClick={() => { setProvincia(ig._provNome); setIgrejaNome(ig.nome); setPesquisa('') }} className="bg-card rounded-xl border border-border p-5 text-left hover:shadow-md hover:border-primary/40 transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">⛪</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs font-semibold text-accent uppercase tracking-wide mb-1">{ig._provEmoji} {ig._provNome}</p>
                    <h3 className="font-heading font-bold text-sm text-foreground group-hover:text-primary leading-snug">{ig.nome}</h3>
                    {ig.morada && <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-1">{ig.morada}</p>}
                    {ig.pastor && <p className="font-body text-xs text-secondary mt-1 truncate">{ig.pastor}</p>}
                  </div>
                  <span className="text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1">›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  } else if (!provincia) {
    conteudo = (
      <section className="bg-muted py-10 pb-16 pt-28">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-body text-sm text-muted-foreground text-center mb-8">Seleccione uma província para ver as Igrejas Baptistas disponíveis</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {PROVINCIAS_LIST.map((p) => {
              const count = churches.filter((ig) => ig.provincia === p.nome).length
              return (
                <button key={p.nome} onClick={() => setProvincia(p.nome)} className="relative group rounded-2xl border-2 border-border bg-card hover:border-primary hover:shadow-lg transition-all text-center p-5 flex flex-col items-center gap-2">
                  <span className="text-4xl leading-none">{p.emoji}</span>
                  <p className="font-heading font-bold text-sm text-foreground group-hover:text-primary leading-tight">{p.nome}</p>
                  <span className={`font-body text-xs font-semibold px-2 py-0.5 rounded-full ${count > 0 ? 'bg-green-100 text-green-700' : 'bg-muted-foreground/10 text-muted-foreground'}`}>{count > 0 ? `${count} igreja(s)` : 'A actualizar'}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    )
  } else if (!igrejaNome) {
    const provIgrejas = churches.filter((ig) => ig.provincia === provincia)
    const emoji = getProvinciaEmoji(provincia)
    conteudo = (
      <section className="py-10 pb-16 bg-muted pt-28">
        <div className="max-w-5xl mx-auto px-4">
          <button onClick={() => setProvincia(null)} className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors mb-6">← Voltar às províncias</button>
          <div className="flex items-center gap-3 mb-8"><span className="text-4xl">{emoji}</span><div><h2 className="font-heading font-bold text-2xl text-foreground">Província de {provincia}</h2><p className="font-body text-sm text-muted-foreground">{provIgrejas.length} Igreja(s) Baptista(s)</p></div></div>
          {provIgrejas.length === 0 ? (
            <div className="text-center py-16"><span className="text-5xl mb-4 block">📋</span><p className="font-body text-muted-foreground">Dados em actualização.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {provIgrejas.map((ig) => (
                <button key={ig.id} onClick={() => setIgrejaNome(ig.nome)} className="bg-card rounded-xl border border-border p-5 text-left hover:shadow-md hover:border-primary/40 transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">⛪</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-sm text-foreground group-hover:text-primary leading-snug">{ig.nome}</h3>
                    {ig.morada && <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-2">{ig.morada}</p>}
                    {ig.pastor && <p className="font-body text-xs text-secondary mt-1 truncate">{ig.pastor}</p>}
                  </div>
                  <span className="text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1">›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  } else {
    const ig = churches.find((i) => i.nome === igrejaNome && i.provincia === provincia)
    if (!ig) return null
    conteudo = (
      <section className="py-10 pb-16 bg-muted pt-28">
        <div className="max-w-2xl mx-auto px-4">
          <button onClick={() => setIgrejaNome(null)} className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors mb-6">← Voltar à lista de {provincia}</button>
          <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden">
            <div className="bg-primary px-6 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 text-3xl">⛪</div>
              <h2 className="font-heading font-bold text-xl text-white leading-snug">{ig.nome}</h2>
              <p className="font-body text-sm text-white/70 mt-1">{provincia}, Angola</p>
            </div>
            <div className="p-6 space-y-4">
              {ig.morada && <div className="flex items-start gap-3"><span className="text-secondary flex-shrink-0 mt-0.5">📍</span><div><p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide">Morada</p><p className="font-body text-sm text-foreground">{ig.morada}</p></div></div>}
              {ig.pastor && <div className="flex items-start gap-3"><span className="text-secondary flex-shrink-0 mt-0.5">👤</span><div><p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pastor / Líder</p><p className="font-body text-sm text-foreground">{ig.pastor}</p></div></div>}
              {ig.telefone && <div className="flex items-start gap-3"><span className="text-secondary flex-shrink-0 mt-0.5">📞</span><div><p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide">Telefone</p><a href={`tel:${ig.telefone}`} className="font-body text-sm text-primary hover:underline">{ig.telefone}</a></div></div>}
              {ig.email && <div className="flex items-start gap-3"><span className="text-secondary flex-shrink-0 mt-0.5">✉️</span><div><p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</p><a href={`mailto:${ig.email}`} className="font-body text-sm text-primary hover:underline">{ig.email}</a></div></div>}
            </div>
            {ig.gps && (
              <div className="px-6 pb-6">
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${ig.gps}`} target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-secondary hover:bg-secondary/90 text-white font-body font-bold text-sm uppercase tracking-wider rounded-xl py-3">📍 Ir por GPS / Google Maps</button>
                </a>
                <p className="font-body text-xs text-muted-foreground text-center mt-2">Abre o Google Maps com a rota até esta igreja</p>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="page-enter">
      <section className="bg-white pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4"><span className="text-4xl">⛪</span><h1 className="font-heading font-bold text-foreground text-3xl md:text-4xl">Encontre Uma Igreja</h1></div>
          <p className="mt-3 font-body text-muted-foreground text-base">Encontre uma Igreja Baptista perto de si em qualquer província de Angola</p>
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">🔍</span>
              <input type="text" value={pesquisa} onChange={(e) => { setPesquisa(e.target.value); setProvincia(null); setIgrejaNome(null) }} placeholder="Pesquisar por nome, pastor, localidade..." className="w-full pl-12 pr-10 py-4 rounded-2xl border border-border bg-card font-body text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              {pesquisa && <button onClick={() => setPesquisa('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">✕</button>}
            </div>
          </div>
        </div>
      </section>
      {conteudo}
    </div>
  )
}

export function OnlinePage({ content }: { content?: SiteContent }) {
  const settings = content?.settings
  const liveUrl = settings?.liveUrl || ''
  const liveTitle = settings?.liveTitle || 'Culto em Directo'
  const isLive = settings?.liveActive

  // Detectar YouTube
  const youtubeMatch = liveUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  // Detectar Vimeo
  const vimeoMatch = liveUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  const hasVideo = youtubeMatch || vimeoMatch
  const youtubeId = youtubeMatch ? youtubeMatch[1] : null

  return (
    <div className="page-enter">
      <section className="bg-white pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-secondary mb-2">📻 Transmissão</span>
          <h1 className="font-heading font-bold text-foreground text-3xl md:text-4xl mb-2">{liveTitle}</h1>
          <p className="font-body text-muted-foreground text-base">Assista aos nossos Cultos e outros Eventos a partir daqui</p>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4"></div>
        </div>
      </section>
      <section className="py-8 md:py-12 bg-muted">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Player de vídeo */}
            <div className="lg:col-span-3">
              <div className="relative bg-black rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: '16/9' }}>
                {isLive && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold font-body uppercase px-3 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block"></span>
                      Em Directo
                    </span>
                  </div>
                )}
                {hasVideo ? (
                  <iframe
                    src={youtubeMatch ? `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&modestbranding=1&rel=0&showinfo=0` : `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`}
                    title={liveTitle}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : isLive && liveUrl ? (
                  <div className="w-full h-full flex items-center justify-center min-h-[240px]">
                    <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                      <button className="bg-primary hover:bg-primary/90 text-white font-body font-semibold text-sm uppercase tracking-wider rounded-lg px-6 py-3">
                        🔗 Abrir Transmissão
                      </button>
                    </a>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center min-h-[240px]">
                    <div className="text-center text-white/60">
                      <span className="text-5xl block mb-3">📺</span>
                      <p className="font-body text-sm">Nenhuma transmissão activa de momento</p>
                      <p className="font-body text-xs mt-1">Volte mais tarde para assistir ao próximo culto</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chat do YouTube (incorporado) */}
            <div className="lg:col-span-2">
              {youtubeId ? (
                <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden" style={{ height: '100%', minHeight: '400px' }}>
                  <div className="bg-primary px-4 py-3">
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-bold text-white text-lg">Chat ao Vivo</h2>
                      <span className="text-white/70 text-sm">💬</span>
                    </div>
                    <p className="font-body text-xs text-white/70 mt-0.5">Participe via YouTube</p>
                  </div>
                  <iframe
                    src={`https://www.youtube.com/live_chat?v=${youtubeId}&embed_domain=${typeof window !== 'undefined' ? window.location.hostname : 'cba-angola.vercel.app'}`}
                    title="Chat do YouTube"
                    className="w-full"
                    style={{ height: 'calc(100% - 52px)', minHeight: '348px', border: 'none' }}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col" style={{ minHeight: '400px' }}>
                  <div className="bg-primary px-4 py-3">
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-bold text-white text-lg">Chat ao Vivo</h2>
                      <span className="text-white/70 text-sm">💬</span>
                    </div>
                    <p className="font-body text-xs text-white/70 mt-0.5">Participe via YouTube</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-6 text-center">
                    <div>
                      <span className="text-4xl block mb-3">💬</span>
                      <p className="font-body text-sm text-muted-foreground">O chat fica disponível quando houver uma transmissão activa no YouTube.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function QuemSomosPage({ content }: { content?: SiteContent }) {
  const sections = content?.quemSomosSections || []
  return (
    <div className="page-enter">
      <section className="bg-white pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4"><span className="text-4xl">🏛️</span><h1 className="font-heading font-bold text-foreground text-3xl md:text-4xl">Quem Somos</h1></div>
          <p className="font-body text-muted-foreground text-base mt-3">Conheça a Convenção Baptista de Angola</p>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4"></div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 grid gap-4">
          {sections.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">A carregar conteúdo...</p>
          ) : sections.map((s) => (
            <a key={s.slug} href={`#/quem-somos/${s.slug}`} className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-accent transition-all group">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-2xl">{s.icon}</div>
              <div className="flex-1"><h3 className="font-heading font-bold text-foreground text-base group-hover:text-primary">{s.label}</h3><p className="font-body text-sm text-muted-foreground mt-0.5 line-clamp-1">{s.preview}</p></div>
              <span className="text-muted-foreground group-hover:text-accent">›</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

export function QuemSomosSubPage({ sub, content }: { sub: string; content?: SiteContent }) {
  const sections = content?.quemSomosSections || []
  const data = sections.find(s => s.slug === sub)
  const [expandido, setExpandido] = useState(false)

  if (!data) {
    return <div className="pt-32 text-center"><p className="text-muted-foreground">Conteúdo não encontrado.</p><a href="#/quem-somos" className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-lg">Voltar</a></div>
  }

  return (
    <div className="page-enter">
      <section className="bg-white pt-20 pb-8 md:pt-28 md:pb-10 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <a href="#/quem-somos" className="inline-flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-primary mb-6 transition-colors">‹ Quem Somos</a>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-2xl">{data.icon}</div>
            <h1 className="font-heading font-bold text-foreground text-2xl md:text-3xl leading-tight">{data.title}</h1>
          </div>
          <div className="w-16 h-1 bg-secondary mt-5"></div>
        </div>
      </section>
      <section className="py-10 bg-[#faf9f7]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-primary px-8 py-4"><p className="font-body text-white/80 text-xs uppercase tracking-widest">Convenção Baptista de Angola — Documento Oficial</p></div>
            <div className="px-6 md:px-10 py-8">
              <p className="font-body text-foreground/85 leading-relaxed text-base md:text-lg text-justify whitespace-pre-line">{data.preview}</p>
              {expandido && data.full && <p className="font-body text-foreground/85 leading-relaxed text-base md:text-lg text-justify whitespace-pre-line mt-4 pt-4 border-t border-gray-100">{data.full}</p>}
              {data.full && (
                <button onClick={() => setExpandido(!expandido)} className="mt-6 inline-flex items-center gap-2 text-sm font-body font-semibold text-secondary hover:text-secondary/80 transition-colors">
                  {expandido ? '▲ Ver menos' : '▼ Ver mais...'}
                </button>
              )}
            </div>
            <div className="border-t border-gray-100 px-6 md:px-10 py-5 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="font-body text-sm text-muted-foreground">Deseja consultar o documento completo?</p>
              {data.documentoUrl ? (
                <a
                  href={data.documentoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-body font-semibold text-sm rounded-lg px-5 py-2 transition-colors"
                >
                  ⬇ {data.downloadLabel}
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 bg-gray-300 text-gray-500 font-body font-semibold text-sm rounded-lg px-5 py-2 cursor-not-allowed">
                  ⬇ {data.downloadLabel}
                </span>
              )}
            </div>
          </div>
          <div className="mt-8 text-center"><a href="#/quem-somos" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">‹ Voltar a Quem Somos</a></div>
        </div>
      </section>
    </div>
  )
}
