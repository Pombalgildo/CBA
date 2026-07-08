'use client'
import { useState, useEffect } from 'react'
import { getAdminToken, clearAdminToken, adminList } from '@/lib/api-client'
import { AdminLogin } from './AdminLogin'
import { CrudManager, type FieldDef } from './CrudManager'
import { DefinicoesPage, MensagensPage, DoacoesPage, ContactosPage, DoacoesCatsPage } from './SettingsAndInbox'

// Definições de campos para cada recurso CRUD
const NEWS_FIELDS: FieldDef[] = [
  { name: 'tipo', label: 'Tipo', type: 'select', options: ['Notícia', 'Evento', 'Seminário', 'Conferência', 'Encontro'], required: true },
  { name: 'cor', label: 'Cor da Etiqueta (classe Tailwind)', type: 'text', placeholder: 'bg-primary, bg-amber-500, bg-red-600...', help: 'Classes Tailwind como bg-primary, bg-amber-500, bg-slate-600, etc.' },
  { name: 'titulo', label: 'Título', type: 'text', required: true },
  { name: 'data', label: 'Data', type: 'text', placeholder: '5 de Março de 2026', required: true },
  { name: 'resumo', label: 'Resumo', type: 'textarea', required: true },
  { name: 'conteudo', label: 'Conteúdo Completo', type: 'textarea', required: true },
  { name: 'imagem', label: 'Imagem', type: 'image', required: true },
  { name: 'videoUrl', label: 'Vídeo (opcional)', type: 'text', placeholder: 'https://www.youtube.com/watch?v=... ou https://vimeo.com/...', help: 'Cole aqui o link do YouTube ou Vimeo. O vídeo será incorporado automaticamente.' },
  { name: 'ordem', label: 'Ordem', type: 'number' },
]

const PUBLICATION_FIELDS: FieldDef[] = [
  { name: 'category', label: 'Categoria', type: 'select', options: ['Devocional', 'Artigo', 'Revista EBD', 'Opinião', 'Estudo Bíblico', 'Mensagem', 'Aniversário', 'Reflexão', 'Poesia', 'Testemunho', 'Notícia', 'Editorial'], required: true },
  { name: 'title', label: 'Título do Artigo', type: 'text', required: true },
  { name: 'author', label: 'Autor (opcional)', type: 'text', placeholder: 'Ex: Pastor João Silva' },
  { name: 'excerpt', label: 'Resumo (pré-visualização curta)', type: 'textarea', required: true, help: 'Texto curto que aparece na listagem (máx 2-3 linhas). Não coloque o texto completo aqui.' },
  { name: 'content', label: 'Conteúdo Completo (opcional)', type: 'textarea', help: 'Texto completo que aparece ao clicar em "Ler Mais". Se deixar vazio, mostra apenas o resumo.' },
  { name: 'image', label: 'Imagem de Capa', type: 'image', required: true },
  { name: 'videoUrl', label: 'Vídeo (opcional)', type: 'text', placeholder: 'https://www.youtube.com/watch?v=... ou https://vimeo.com/...', help: 'Cole aqui o link do YouTube ou Vimeo. O vídeo será incorporado automaticamente.' },
  { name: 'date', label: 'Data', type: 'text', placeholder: 'Maio 2026', required: true },
  { name: 'ordem', label: 'Ordem', type: 'number' },
]

const EVENT_FIELDS: FieldDef[] = [
  { name: 'categoria', label: 'Categoria', type: 'select', options: ['Conferências', 'Jovens', 'Missões', 'Cultos', 'Formação'], required: true },
  { name: 'titulo', label: 'Título', type: 'text', required: true },
  { name: 'data', label: 'Data e Local', type: 'text', placeholder: 'Outubro 2024 · Luanda', required: true },
  { name: 'capa', label: 'Imagem de Capa (URL)', type: 'image', required: true },
  { name: 'fotos', label: 'Fotografias', type: 'json-photos' },
  { name: 'ordem', label: 'Ordem', type: 'number' },
]

const CHURCH_FIELDS: FieldDef[] = [
  { name: 'provincia', label: 'Província', type: 'select', options: ['Luanda', 'Benguela', 'Huambo', 'Huíla', 'Bié', 'Malanje', 'Lunda-Norte', 'Moxico', 'Namibe', 'Cuanza-Sul', 'Cabinda', 'Zaire', 'Uíge', 'Bengo', 'Cuanza-Norte', 'Lunda-Sul', 'Cuando Cubango', 'Cunene'], required: true },
  { name: 'nome', label: 'Nome da Igreja', type: 'text', required: true },
  { name: 'morada', label: 'Morada', type: 'textarea' },
  { name: 'telefone', label: 'Telefone', type: 'text' },
  { name: 'pastor', label: 'Pastor / Líder', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'gps', label: 'Coordenadas GPS', type: 'text', placeholder: '-8.8147,-13.2302', help: 'Latitude,Longitude para o Google Maps' },
  { name: 'ordem', label: 'Ordem', type: 'number' },
]

const MINISTRY_FIELDS: FieldDef[] = [
  { name: 'title', label: 'Nome do Departamento', type: 'text', required: true },
  { name: 'description', label: 'Descrição', type: 'textarea', required: true },
  { name: 'image', label: 'Imagem (URL)', type: 'image' },
  { name: 'ordem', label: 'Ordem', type: 'number' },
]

const QUEM_SOMOS_FIELDS: FieldDef[] = [
  { name: 'slug', label: 'Slug (URL)', type: 'text', placeholder: 'historial, declaracao-doutrinaria, etc.', help: 'Identificador único usado no URL (ex: historial = #/quem-somos/historial)', required: true },
  { name: 'label', label: 'Nome da Secção', type: 'text', required: true },
  { name: 'icon', label: 'Ícone (emoji)', type: 'text', placeholder: '📖, 📄, 📕, 👥, 🏛️, 🎯', required: true },
  { name: 'title', label: 'Título da Página', type: 'text', required: true },
  { name: 'preview', label: 'Texto de Pré-visualização', type: 'textarea', help: 'Texto que aparece inicialmente na página', required: true },
  { name: 'full', label: 'Texto Completo (opcional)', type: 'textarea', help: 'Texto adicional que aparece ao clicar em "Ver mais"' },
  { name: 'downloadLabel', label: 'Texto do Botão de Download', type: 'text' },
  { name: 'documentoUrl', label: 'Documento PDF para Download (opcional)', type: 'image', help: 'Faça upload do documento PDF que os visitantes podem baixar. Se não carregar nenhum, o botão não aparece.' },
  { name: 'ordem', label: 'Ordem', type: 'number' },
]

const AVISOS_FIELDS: FieldDef[] = [
  { name: 'tipo', label: 'Tipo de Aviso', type: 'select', options: ['Anúncio', 'Obituário', 'Aniversariante', 'Concurso Público', 'Documento', 'Urgente'], required: true },
  { name: 'titulo', label: 'Título', type: 'text', required: true, placeholder: 'Ex: Faleceu o irmão João Silva' },
  { name: 'conteudo', label: 'Conteúdo', type: 'textarea', required: true, help: 'Texto completo do aviso' },
  { name: 'imagem', label: 'Imagem (opcional)', type: 'image', help: 'Foto do aviso (ex: foto do falecido, cartaz do concurso, etc.)' },
  { name: 'data', label: 'Data', type: 'text', placeholder: '5 de Julho de 2026', required: true },
  { name: 'cor', label: 'Cor da Etiqueta', type: 'select', options: ['bg-red-600', 'bg-amber-500', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-slate-600', 'bg-primary'], help: 'Cor de destaque do aviso' },
  { name: 'link', label: 'Link (opcional)', type: 'text', placeholder: 'https://... (para documentos PDF, etc.)' },
  { name: 'ativo', label: 'Visível no site', type: 'select', options: ['Sim', 'Não'], help: 'Se "Não", o aviso fica guardado mas não aparece no site' },
  { name: 'ordem', label: 'Ordem', type: 'number' },
]

const DONATION_CAT_FIELDS: FieldDef[] = [
  { name: 'label', label: 'Nome', type: 'text', required: true },
  { name: 'emoji', label: 'Emoji', type: 'text', placeholder: '🕊️' },
  { name: 'descricao', label: 'Descrição', type: 'textarea', required: true },
  { name: 'versiculo', label: 'Versículo Bíblico', type: 'textarea' },
  { name: 'gradient', label: 'Gradiente (CSS)', type: 'text', placeholder: 'linear-gradient(135deg,#f59e0b,#facc15)' },
  { name: 'barGrad', label: 'Gradiente da Barra (CSS)', type: 'text' },
  { name: 'iconSvg', label: 'Ícone SVG (paths)', type: 'textarea', help: 'Apenas os elementos <path>, <circle>, etc. do SVG' },
  { name: 'ordem', label: 'Ordem', type: 'number' },
]

const SIDEBAR_ITEMS = [
  { hash: '#/admin', label: 'Dashboard', icon: '📊' },
  { hash: '#/admin/avisos', label: 'Avisos', icon: '🚨' },
  { hash: '#/admin/noticias', label: 'Notícias', icon: '📰' },
  { hash: '#/admin/publicacoes', label: 'Publicações', icon: '📖' },
  { hash: '#/admin/eventos', label: 'Galeria', icon: '🖼️' },
  { hash: '#/admin/igrejas', label: 'Igrejas', icon: '⛪' },
  { hash: '#/admin/ministerios', label: 'Departamentos', icon: '🙏' },
  { hash: '#/admin/quem-somos', label: 'Quem Somos', icon: '🏛️' },
  { hash: '#/admin/contactos', label: 'Contactos', icon: '📬' },
  { hash: '#/admin/doacoes-cats', label: 'Doações', icon: '🤲' },
  { hash: '#/admin/mensagens', label: 'Mensagens', icon: '📨' },
  { hash: '#/admin/doacoes', label: 'Comprovativos', icon: '💰' },
  { hash: '#/admin/definicoes', label: 'Definições', icon: '⚙️' },
]

export function AdminPanel() {
  const [logado, setLogado] = useState(() => {
    if (typeof window === 'undefined') return false
    return !!getAdminToken()
  })
  const [hash, setHash] = useState<string>(typeof window !== 'undefined' ? window.location.hash : '#/admin')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/admin')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const logout = () => {
    clearAdminToken()
    setLogado(false)
    window.location.hash = '#/admin'
  }

  if (!logado) return <AdminLogin onSuccess={() => setLogado(true)} />

  let conteudo: React.ReactNode
  if (hash === '#/admin' || hash === '') {
    conteudo = <Dashboard />
  } else if (hash === '#/admin/avisos') {
    conteudo = <CrudManager resource="avisos" resourceLabel="Avisos Urgentes" fields={AVISOS_FIELDS} />
  } else if (hash === '#/admin/noticias') {
    conteudo = <CrudManager resource="news" resourceLabel="Notícias" fields={NEWS_FIELDS} />
  } else if (hash === '#/admin/publicacoes') {
    conteudo = <CrudManager resource="publications" resourceLabel="Publicações" fields={PUBLICATION_FIELDS} />
  } else if (hash === '#/admin/eventos') {
    conteudo = <CrudManager resource="events" resourceLabel="Eventos da Galeria" fields={EVENT_FIELDS} />
  } else if (hash === '#/admin/igrejas') {
    conteudo = <CrudManager resource="churches" resourceLabel="Igrejas" fields={CHURCH_FIELDS} />
  } else if (hash === '#/admin/ministerios') {
    conteudo = <CrudManager resource="ministries" resourceLabel="Departamentos" fields={MINISTRY_FIELDS} />
  } else if (hash === '#/admin/quem-somos') {
    conteudo = <CrudManager resource="quem-somos" resourceLabel="Secções de Quem Somos" fields={QUEM_SOMOS_FIELDS} />
  } else if (hash === '#/admin/contactos') {
    conteudo = <ContactosPage />
  } else if (hash === '#/admin/doacoes-cats') {
    conteudo = <DoacoesCatsPage />
  } else if (hash === '#/admin/mensagens') {
    conteudo = <MensagensPage />
  } else if (hash === '#/admin/doacoes') {
    conteudo = <DoacoesPage />
  } else if (hash === '#/admin/definicoes') {
    conteudo = <DefinicoesPage />
  } else {
    conteudo = <Dashboard />
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Navbar única — mesma identidade do site */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-primary/95 backdrop-blur-md border-b-4 border-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Linha 1: Logo + Ver Site + Sair */}
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="#/admin" className="flex items-center gap-3 shrink-0">
              <img src="/logo-cba.png" alt="C.B.A Logo" className="h-12 md:h-14 w-auto object-contain" />
              <div className="hidden sm:block">
                <p className="text-white font-heading font-bold text-sm md:text-base leading-tight">C.B.A</p>
                <p className="text-white/80 font-body leading-tight font-bold text-xs uppercase">Painel Admin</p>
              </div>
            </a>

            <div className="flex items-center gap-2">
              <a href="#/"><button className="bg-accent hover:bg-accent/90 text-primary font-body font-semibold text-sm uppercase tracking-wider rounded px-4 py-2">Ver Site</button></a>
              <button onClick={logout} className="bg-secondary hover:bg-secondary/90 text-white font-body font-semibold text-sm uppercase tracking-wider rounded px-4 py-2">Sair</button>
            </div>
          </div>

          {/* Linha 2: Primeiros 7 itens */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pb-2">
            {SIDEBAR_ITEMS.slice(0, 7).map((item) => (
              <a
                key={item.hash}
                href={item.hash}
                className={`px-3 py-1.5 text-sm font-body font-medium uppercase tracking-wider transition-colors whitespace-nowrap ${
                  hash === item.hash ? 'text-accent' : 'text-white/70 hover:text-accent'
                }`}
                style={hash === item.hash ? { borderBottom: '2px solid hsl(38 78% 55%)' } : {}}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Linha 3: Restantes 6 itens */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pb-3">
            {SIDEBAR_ITEMS.slice(7).map((item) => (
              <a
                key={item.hash}
                href={item.hash}
                className={`px-3 py-1.5 text-sm font-body font-medium uppercase tracking-wider transition-colors whitespace-nowrap ${
                  hash === item.hash ? 'text-accent' : 'text-white/70 hover:text-accent'
                }`}
                style={hash === item.hash ? { borderBottom: '2px solid hsl(38 78% 55%)' } : {}}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Conteúdo */}
      <main className="flex-1 p-4 md:p-8 pt-44 md:pt-48 max-w-7xl mx-auto w-full">
        {conteudo}
      </main>
    </div>
  )
}

function Dashboard() {
  const [stats, setStats] = useState<{ label: string; value: number; icon: string; hash: string }[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [news, pubs, events, churches, ministries, messages, donations] = await Promise.all([
          adminList('news'),
          adminList('publications'),
          adminList('events'),
          adminList('churches'),
          adminList('ministries'),
          adminList('messages'),
          adminList('donations'),
        ])
        const naoLidas = messages.filter((m: any) => !m.lida).length
        const pendentes = donations.filter((d: any) => !d.confirmado).length
        setStats([
          { label: 'Notícias', value: news.length, icon: '📰', hash: '#/admin/noticias' },
          { label: 'Publicações', value: pubs.length, icon: '📖', hash: '#/admin/publicacoes' },
          { label: 'Eventos', value: events.length, icon: '🖼️', hash: '#/admin/eventos' },
          { label: 'Igrejas', value: churches.length, icon: '⛪', hash: '#/admin/igrejas' },
          { label: 'Departamentos', value: ministries.length, icon: '🙏', hash: '#/admin/ministerios' },
          { label: 'Mensagens Novas', value: naoLidas, icon: '📬', hash: '#/admin/mensagens' },
          { label: 'Doações Pendentes', value: pendentes, icon: '💰', hash: '#/admin/doacoes' },
        ])
      } catch {}
    }
    load()
  }, [])

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-foreground mb-2">Dashboard</h2>
      <p className="font-body text-sm text-muted-foreground mb-8">Bem-vindo ao painel de administração. Gerencie todo o conteúdo do site a partir daqui.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.length === 0 ? (
          <div className="col-span-full text-center py-8"><div className="spinner mx-auto" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'hsl(150 30% 18%)' }}></div></div>
        ) : (
          stats.map((s) => (
            <a key={s.label} href={s.hash} className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{s.icon}</span>
                <span className="font-heading font-bold text-3xl text-primary group-hover:text-secondary transition-colors">{s.value}</span>
              </div>
              <p className="font-body text-sm text-muted-foreground">{s.label}</p>
            </a>
          ))
        )}
      </div>
      <div className="mt-8 bg-white border border-border rounded-xl p-6">
        <h3 className="font-heading font-bold text-lg text-foreground mb-3">Como usar</h3>
        <ul className="space-y-2 font-body text-sm text-foreground/80">
          <li className="flex gap-2"><span className="text-accent">▸</span> Use o menu no topo acima para navegar entre as secções.</li>
          <li className="flex gap-2"><span className="text-accent">▸</span> Em cada secção pode adicionar, editar e eliminar itens.</li>
          <li className="flex gap-2"><span className="text-accent">▸</span> As alterações ficam visíveis imediatamente no site público.</li>
          <li className="flex gap-2"><span className="text-accent">▸</span> Em &ldquo;Definições&rdquo; pode alterar o título, contactos, IBAN e outros textos.</li>
          <li className="flex gap-2"><span className="text-accent">▸</span> As mensagens recebidas pelo formulário de contacto aparecem em &ldquo;Mensagens&rdquo;.</li>
          <li className="flex gap-2"><span className="text-accent">▸</span> Os comprovativos de doação enviados aparecem em &ldquo;Comprovativos&rdquo;.</li>
        </ul>
      </div>
    </div>
  )
}
