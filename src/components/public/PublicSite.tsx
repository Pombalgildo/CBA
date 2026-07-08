'use client'
import { useState, useEffect, useCallback } from 'react'
import type { SiteContent } from '@/lib/types'
import { fetchContent } from '@/lib/api-client'
import { Navbar, Footer, MobileBottomBar } from './Layout'
import { DonationModal } from './DonationModal'
import { FloatingLiveButton } from './FloatingLiveButton'
import { HomePage, MinisteriosPage, PublicacoesPage } from './pages/MainPages'
import { NoticiasPage, ContactoPage, DoacaoPage } from './pages/NoticiasContactoDoacao'
import { GaleriaPage, EncontrarIgrejaPage, OnlinePage, QuemSomosPage, QuemSomosSubPage } from './pages/GaleriaIgrejaOutros'

export function PublicSite() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [hash, setHash] = useState<string>(typeof window !== 'undefined' ? window.location.hash || '#/' : '#/')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [donationCatIdx, setDonationCatIdx] = useState<number | null>(null)

  // Carregar conteúdo
  useEffect(() => {
    let mounted = true
    fetchContent()
      .then((data) => { if (mounted) { setContent(data); setLoading(false) } })
      .catch(() => { if (mounted) { setError('Erro ao carregar o conteúdo do site.'); setLoading(false) } })
    return () => { mounted = false }
  }, [])

  // Hash routing
  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash || '#/')
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const openDonation = useCallback((idx: number) => setDonationCatIdx(idx), [])
  const closeDonation = useCallback(() => setDonationCatIdx(null), [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(40 30% 97%)' }}>
        <div className="text-center">
          <img src="/logo-cba.png" alt="C.B.A" className="h-24 w-auto object-contain mx-auto mb-4" />
          <div className="spinner mx-auto" style={{ width: '32px', height: '32px', borderWidth: '3px', borderColor: 'rgba(45,74,59,0.2)', borderTopColor: 'hsl(150 34% 24%)' }}></div>
          <p className="mt-4 font-body text-sm" style={{ color: 'hsl(150 34% 24%)' }}>A carregar...</p>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center p-8">
          <p className="text-red-600 font-body mb-4">{error || 'Erro ao carregar'}</p>
          <button onClick={() => window.location.reload()} className="bg-primary text-white px-6 py-3 rounded-lg font-body font-semibold">Tentar novamente</button>
        </div>
      </div>
    )
  }

  // Determinar página
  let page: React.ReactNode
  if (hash === '#/' || hash === '') {
    page = <HomePage content={content} />
  } else if (hash === '#/ministerios') {
    page = <MinisteriosPage content={content} />
  } else if (hash === '#/noticias') {
    page = <NoticiasPage content={content} />
  } else if (hash === '#/publicacoes') {
    page = <PublicacoesPage content={content} />
  } else if (hash === '#/galeria') {
    page = <GaleriaPage content={content} />
  } else if (hash === '#/contacto') {
    page = <ContactoPage content={content} />
  } else if (hash === '#/encontrar-igreja') {
    page = <EncontrarIgrejaPage content={content} />
  } else if (hash === '#/online') {
    page = <OnlinePage content={content} />
  } else if (hash === '#/doacao') {
    page = <DoacaoPage content={content} onOpenDonation={openDonation} />
  } else if (hash === '#/quem-somos') {
    page = <QuemSomosPage content={content} />
  } else if (hash.startsWith('#/quem-somos/')) {
    const sub = hash.replace('#/quem-somos/', '')
    page = <QuemSomosSubPage sub={sub} content={content} />
  } else {
    page = (
      <div className="pt-32 text-center">
        <h1 className="text-4xl font-heading font-bold text-primary">404</h1>
        <p className="mt-4 text-muted-foreground">Página não encontrada</p>
        <a href="#/" className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-lg font-heading font-bold">Voltar ao Início</a>
      </div>
    )
  }

  const donationCat = donationCatIdx !== null && content.donationCats[donationCatIdx] ? content.donationCats[donationCatIdx] : null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar settings={content.settings} currentHash={hash} />
      <main className="flex-1 pb-16 xl:pb-0">{page}</main>
      <Footer settings={content.settings} />
      <MobileBottomBar currentHash={hash} />
      <FloatingLiveButton settings={content.settings} />
      {donationCat && (
        <DonationModal cat={donationCat} iban={content.settings?.iban || ''} onClose={closeDonation} />
      )}
    </div>
  )
}
