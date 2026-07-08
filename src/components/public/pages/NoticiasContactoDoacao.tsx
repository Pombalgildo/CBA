'use client'
import { useState } from 'react'
import type { SiteContent, NewsItem } from '@/lib/types'
import { NEWS_CATEGORIAS } from '@/lib/types'
import { submitContact } from '@/lib/api-client'
import { VideoEmbed } from '../VideoEmbed'
import { OptimisedImage } from '../OptimisedImage'

export function NoticiasPage({ content }: { content: SiteContent }) {
  const { news } = content
  const [filtro, setFiltro] = useState('Todos')
  const [selecionado, setSelecionado] = useState<NewsItem | null>(null)

  if (selecionado) {
    const item = selecionado
    return (
      <div className="page-enter">
        <section className="bg-white pt-20 md:pt-24 pb-8 md:pb-10 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <button onClick={() => setSelecionado(null)} className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary mb-6 transition-colors">← Voltar às Notícias</button>
            <div className="flex items-center gap-3 mb-3">
              <span className={`${item.cor} text-white text-xs font-body px-2 py-0.5 rounded-full`}>{item.tipo}</span>
              <span className="font-body text-xs text-muted-foreground">📅 {item.data}</span>
            </div>
            <h1 className="font-heading font-bold text-foreground text-2xl md:text-3xl leading-tight mb-4">{item.titulo}</h1>
            <div className="w-16 h-1 bg-secondary mb-6"></div>
          </div>
        </section>
        <section className="py-8 bg-muted">
          <div className="max-w-5xl mx-auto px-4">
            {item.imagem && (
              <div className="mb-6 rounded-xl overflow-hidden shadow-md">
                <OptimisedImage src={item.imagem} alt={item.titulo} className="w-full h-auto object-cover" loading="eager" width={900} />
              </div>
            )}
            <div className="bg-card rounded-xl border border-border p-6 md:p-10">
              <p className="font-body text-foreground leading-relaxed text-base md:text-lg text-justify whitespace-pre-line">{item.conteudo}</p>
              {item.videoUrl && (
                <div className="mt-6">
                  <h3 className="font-heading font-bold text-foreground text-lg mb-3">🎬 Vídeo</h3>
                  <VideoEmbed url={item.videoUrl} />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    )
  }

  const filtrados = filtro === 'Todos' ? news : news.filter((i) => i.tipo === filtro)
  return (
    <div className="page-enter">
      <section className="bg-white pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4"><span className="text-4xl">📰</span><h1 className="font-heading font-bold text-foreground text-3xl md:text-4xl">Notícias</h1></div>
          <p className="mt-3 font-body text-muted-foreground text-base">Acompanhe as últimas notícias e eventos da Convenção Baptista de Angola</p>
        </div>
      </section>
      <section className="bg-background border-b border-border py-5">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-2">
          {NEWS_CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-5 py-2 rounded-full text-sm font-body font-semibold uppercase tracking-wide transition-all ${filtro === cat ? 'bg-primary text-white shadow' : 'bg-gray-100 text-foreground hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>
      <section className="bg-muted py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtrados.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelecionado(item)}
                className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden"
              >
                <div className="relative h-44 overflow-hidden">
                  <OptimisedImage src={item.imagem} alt={item.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" width={400} />
                  <div className="absolute top-3 left-3"><span className={`${item.cor} text-white text-xs font-body px-2 py-0.5 rounded-full`}>{item.tipo}</span></div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-body text-muted-foreground mb-2">📅 {item.data}</p>
                  <h3 className="font-heading font-bold text-foreground text-base leading-snug mb-2 group-hover:text-primary transition-colors">{item.titulo}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3">{item.resumo}</p>
                  <span className="inline-block mt-4 text-xs font-semibold font-body text-secondary group-hover:underline">Ler mais →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export function ContactoPage({ content }: { content: SiteContent }) {
  const { settings } = content
  const [tipo, setTipo] = useState('Dúvida')
  const [nome, setNome] = useState('')
  const [contacto, setContacto] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!nome || !contacto || !mensagem) { setErro('Por favor preencha todos os campos.'); return }
    setEnviando(true)
    try {
      await submitContact({ tipo, nome, email: contacto, mensagem })
      setEnviando(false)
      setSucesso(true)
      setNome(''); setContacto(''); setMensagem('')
      setTimeout(() => setSucesso(false), 5000)
    } catch {
      setEnviando(false)
      setErro('Erro ao enviar mensagem. Tente novamente.')
    }
  }

  return (
    <div className="page-enter">
      <section className="bg-white pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4"><span className="text-4xl">📬</span><h1 className="font-heading font-bold text-foreground text-3xl md:text-4xl">Contacto</h1></div>
          <p className="mt-3 font-body text-muted-foreground text-base">Entre em contacto connosco</p>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-6">Informações de Contacto</h2>
              <div className="space-y-5">
                {[
                  { icon: '📍', label: 'Endereço', value: settings?.endereco },
                  { icon: '📞', label: 'Telefone', value: settings?.telefone },
                  { icon: '✉️', label: 'Email', value: settings?.email },
                  { icon: '🕐', label: 'Horário de Funcionamento', value: settings?.horarioCultos },
                ].map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0"><span>{info.icon}</span></div>
                    <div><p className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{info.label}</p><p className="font-body text-sm text-foreground">{info.value}</p></div>
                  </div>
                ))}
              </div>
              <div className="mt-8 bg-primary text-white rounded-xl p-6">
                <h3 className="font-heading font-bold text-lg mb-4">Horário de Funcionamento do Escritório</h3>
                <div className="space-y-3 font-body text-sm">
                  <div className="flex justify-between"><span className="text-white/80">Segunda a Sexta-feira</span><span className="text-accent font-semibold">{settings?.cultoDomingoEBD || '8h00'}</span></div>
                  <div className="flex justify-between"><span className="text-white/80">Encerramento</span><span className="text-accent font-semibold">{settings?.cultoDomingoAdoracao || '15h00'}</span></div>
                  <div className="flex justify-between"><span className="text-white/80">Sábado e Domingo</span><span className="text-accent font-semibold">{settings?.cultoQuartaEstudo || 'Fechado'}</span></div>
                </div>
                <p className="font-body text-xs text-white/60 mt-4 pt-3 border-t border-white/10 italic">
                  A CBA é o órgão de cooperação das igrejas baptistas em Angola. Para horários de cultos, contacte a igreja local mais próxima através de &ldquo;Encontre Uma Igreja&rdquo;.
                </p>
              </div>
            </div>
            <div className="bg-card rounded-xl shadow-lg border border-border/50 p-6 md:p-8">
              <h2 className="font-heading font-bold text-2xl text-foreground mb-6">Envie uma Mensagem</h2>
              {sucesso && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm font-body">
                  ✓ Mensagem enviada com sucesso! Entraremos em contacto brevemente.
                </div>
              )}
              {erro && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm font-body">{erro}</div>
              )}
              <form className="space-y-5" onSubmit={enviar}>
                <div>
                  <label className="font-body text-sm block mb-1.5">Tipo de Mensagem</label>
                  <div className="flex gap-2 flex-wrap">
                    {['Dúvida', 'Pedido de Oração', 'Outro'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTipo(t)}
                        className={`px-4 py-1.5 rounded-full text-sm font-body font-semibold border ${tipo === t ? 'bg-secondary text-white border-secondary' : 'bg-white text-foreground border-border hover:border-secondary'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div><label className="font-body text-sm block mb-1.5">Nome</label><input value={nome} onChange={(e) => setNome(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="O seu nome" /></div>
                <div><label className="font-body text-sm block mb-1.5">Telefone ou Email (como prefere ser contactado)</label><input value={contacto} onChange={(e) => setContacto(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Ex: +244 923 000 000 ou o.seu@email.com" /></div>
                <div><label className="font-body text-sm block mb-1.5">Mensagem</label><textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[120px]" placeholder="A sua mensagem..." /></div>
                <button type="submit" disabled={enviando} className="bg-secondary hover:bg-secondary/90 text-white font-body font-semibold text-sm uppercase tracking-wider rounded-full px-8 py-3 w-full disabled:opacity-50">
                  {enviando ? 'A enviar...' : '📤 Enviar Mensagem'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function DoacaoPage({ content, onOpenDonation }: { content: SiteContent; onOpenDonation: (idx: number) => void }) {
  const { donationCats } = content
  return (
    <div className="page-enter min-h-screen bg-gradient-to-b from-[#f5f0e8] to-[#ece6d8]">
      <section className="relative pt-28 pb-16 text-center overflow-hidden px-4">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 pointer-events-none"></div>
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-accent/10 pointer-events-none"></div>
        <div className="relative z-10">
          <span className="text-5xl mb-4 block">🤲</span>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-primary leading-tight mb-3">Ofertas &amp; Missões</h1>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6"></div>
          <blockquote className="font-body text-sm md:text-base text-muted-foreground max-w-lg mx-auto italic leading-relaxed">
            &ldquo;Dai, e ser-vos-á dado; boa medida, recalcada, sacudida e transbordante se deitará no vosso regaço.&ldquo;
            <span className="block mt-2 font-semibold not-italic text-foreground/70">— Lucas 6:38</span>
          </blockquote>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <p className="font-body text-center text-sm text-muted-foreground mb-8">Seleccione uma forma de contribuir e siga as instruções</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {donationCats.map((cat, i) => (
            <div
              key={cat.id}
              onClick={() => onOpenDonation(i)}
              className="group bg-white rounded-3xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-white/60 hover:-translate-y-1"
            >
              <div className="h-2" style={{ background: cat.barGrad }}></div>
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform" style={{ background: cat.gradient }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: cat.iconSvg }} />
                </div>
                <span className="text-2xl mb-2">{cat.emoji}</span>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2 leading-tight">{cat.label}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed mb-6 flex-1">{cat.descricao.substring(0, 90)}…</p>
                <div className="w-full py-3 rounded-2xl font-body font-bold text-sm uppercase tracking-wider text-white shadow group-hover:shadow-md transition-all flex items-center justify-center gap-2" style={{ background: cat.gradient }}>Contribuir <span className="opacity-70">→</span></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 bg-white/70 rounded-2xl border border-border p-5 text-center">
          <p className="font-body text-xs text-muted-foreground leading-relaxed">🔒 Todas as contribuições são processadas de forma segura. Após o pagamento, utilize o botão <span className="font-semibold text-foreground">&ldquo;Já Efectuei o Pagamento&ldquo;</span> para enviar o comprovativo directamente à CBA.</p>
        </div>
      </section>
    </div>
  )
}
