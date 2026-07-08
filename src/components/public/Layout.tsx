'use client'
import { useState } from 'react'
import type { SiteSettings } from '@/lib/types'

const NAV_LINKS = [
  { label: 'Início', hash: '#/', icon: '🏠' },
  { label: 'Quem Somos', hash: '#/quem-somos', icon: '🏛️' },
  { label: 'Departamentos', hash: '#/ministerios', icon: '🙏' },
  { label: 'Notícias', hash: '#/noticias', icon: '📰' },
  { label: 'Publicações', hash: '#/publicacoes', icon: '📖' },
  { label: 'Galeria', hash: '#/galeria', icon: '🖼️' },
  { label: 'Contactos', hash: '#/contacto', icon: '📬' },
]

export function Navbar({ settings, currentHash }: { settings: SiteSettings | null; currentHash: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const logo = settings?.logoUrl || ''
  const shortName = settings?.siteShortName || 'C.B.A'
  const siteTitle = settings?.siteTitle || 'Convenção Baptista de Angola'

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-primary/95 backdrop-blur-md border-b-4 border-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:-translate-x-20">
        <div className="flex items-center justify-between h-20 md:h-24">
          <a href="#/" className="flex items-center gap-3 shrink-0 mr-4">
            {logo && <img src={logo} alt={`${shortName} Logo`} className="h-20 md:h-24 w-auto object-contain" />}
            <div className="hidden sm:block">
              <p className="text-white font-heading font-bold text-base md:text-lg leading-tight">{shortName}</p>
              <p className="text-white/80 font-body leading-tight font-bold text-xs md:text-sm uppercase">{siteTitle}</p>
            </div>
          </a>
          <div className="hidden xl:flex items-center justify-between w-full">
            {/* Links centrados no espaço restante */}
            <div className="hidden xl:flex items-center justify-center gap-2 flex-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.hash}
                  href={l.hash}
                  className={`px-3 py-2 text-sm font-body font-medium uppercase tracking-wider transition-colors text-white/80 hover:text-accent text-center ${
                    currentHash === l.hash ? 'text-accent' : ''
                  }`}
                  style={currentHash === l.hash ? { borderBottom: '2px solid hsl(38 78% 55%)' } : {}}
                >
                  {l.label}
                </a>
              ))}
            </div>
            {/* Encontre Uma Igreja + Doe Agora alinhados à direita */}
            <div className="hidden xl:flex items-center gap-3 shrink-0">
              <a href="#/encontrar-igreja" className="flex flex-col items-center text-center text-xs font-body font-medium uppercase tracking-wider text-white/80 hover:text-accent leading-tight max-w-[90px]">
                <span>Encontre</span>
                <span>Uma Igreja</span>
              </a>
              <a href="#/doacao">
                <button className="bg-accent hover:bg-accent/90 text-primary font-body font-semibold text-sm uppercase tracking-wider rounded px-4 py-2.5">
                  Doe Agora
                </button>
              </a>
            </div>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu hamburger mobile — com icones SVG brancos */}
      {mobileOpen && (
        <div className="xl:hidden bg-primary border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.hash}
                href={l.hash}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentHash === l.hash ? 'bg-white/10 text-accent' : 'text-white/80 hover:bg-white/5 hover:text-accent'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  {l.hash === '#/' && <path d="M3 12l9-9 9 9M5 10v10h14V10" />}
                  {l.hash === '#/quem-somos' && <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />}
                  {l.hash === '#/ministerios' && <path d="M12 2v20M2 7l10-5 10 5M2 17l10 5 10-5" />}
                  {l.hash === '#/noticias' && <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2M18 14h-8M15 18h-6M10 6h8v4h-8V6z" />}
                  {l.hash === '#/publicacoes' && <path d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />}
                  {l.hash === '#/galeria' && <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                  {l.hash === '#/contacto' && <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                </svg>
                <span className="text-sm font-body font-medium">{l.label}</span>
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 space-y-1">
              <a
                href="#/encontrar-igreja"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentHash === '#/encontrar-igreja' ? 'bg-white/10 text-accent' : 'text-white/80 hover:bg-white/5 hover:text-accent'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <span className="text-sm font-body font-medium">Encontre Uma Igreja</span>
              </a>
              <a
                href="#/doacao"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 2v20M2 7h20M5 7l3 5-3 5M19 7l-3 5 3 5" />
                </svg>
                <span className="text-sm font-body font-semibold">Doe Agora</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

// Barra de navegação inferior fixa — estilo app (apenas mobile)
export function MobileBottomBar({ currentHash }: { currentHash: string }) {
  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-primary border-t border-white/10" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around px-2 py-2">
        <a href="#/" className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-lg transition-colors ${currentHash === '#/' ? 'text-accent' : 'text-white/60'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v10h14V10" /></svg>
          <span className="text-[10px] font-body font-medium">Início</span>
        </a>
        <a href="#/noticias" className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-lg transition-colors ${currentHash === '#/noticias' ? 'text-accent' : 'text-white/60'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2M18 14h-8M15 18h-6M10 6h8v4h-8V6z" /></svg>
          <span className="text-[10px] font-body font-medium">Notícias</span>
        </a>
        <a href="#/contacto" className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-lg transition-colors ${currentHash === '#/contacto' ? 'text-accent' : 'text-white/60'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <span className="text-[10px] font-body font-medium">Contactos</span>
        </a>
        <a href="#/encontrar-igreja" className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-lg transition-colors ${currentHash === '#/encontrar-igreja' ? 'text-accent' : 'text-white/60'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
          <span className="text-[10px] font-body font-medium">Igreja</span>
        </a>
      </div>
    </div>
  )
}

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const logo = settings?.logoUrl || ''
  const siteTitle = settings?.siteTitle || 'Convenção Baptista de Angola'
  const fundacao = settings?.fundacao || ''
  const reconhecimento = settings?.reconhecimento || ''
  const tema = settings?.tema || ''
  const divisa = settings?.divisa || ''
  const endereco = settings?.endereco || ''
  const telefone = settings?.telefone || ''
  const email = settings?.email || ''
  const horarioCultos = settings?.horarioCultos || ''
  const copyright = settings?.copyright || ''

  return (
    <footer className="bg-primary text-white">
      <div className="h-1 bg-secondary w-full"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="flex items-start gap-4">
            {logo && <img src={logo} alt={`${siteTitle} Logo`} className="h-24 w-auto object-contain shrink-0" />}
            <div className="space-y-1">
              <p className="font-heading font-bold text-white text-sm leading-tight">{siteTitle.toUpperCase()}</p>
              <p className="font-body text-white/70 text-xs">Fundada a <span className="text-accent font-semibold">{fundacao}</span></p>
              <p className="font-body text-white/50 text-xs leading-relaxed">{reconhecimento}</p>
              <p className="font-body text-white/60 text-xs italic">Tema: &ldquo;{tema}&ldquo;</p>
              <p className="font-body text-accent text-xs font-semibold">Divisa: {divisa}</p>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3 text-accent uppercase tracking-wider">Links Rápidos</h4>
            <ul className="space-y-1.5">
              {[
                { label: 'Início', hash: '#/' },
                { label: 'Departamentos', hash: '#/ministerios' },
                { label: 'Notícias', hash: '#/noticias' },
                { label: 'Publicações', hash: '#/publicacoes' },
                { label: 'Quem Somos', hash: '#/quem-somos' },
                { label: 'Contacto', hash: '#/contacto' },
              ].map((l) => (
                <li key={l.hash}>
                  <a href={l.hash} className="font-body text-xs text-white/70 hover:text-accent transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3 text-accent uppercase tracking-wider">Contactos</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>📍 {endereco}</li>
              <li>📞 {telefone}</li>
              <li>✉️ {email}</li>
              <li>🕐 {horarioCultos}</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-white/40 text-center sm:text-left">{copyright}</p>
          <p className="font-body text-[10px] text-white/30 italic">
            Desenvolvido por <span className="text-white/50 font-semibold">Hermenegildo José Pombal</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
