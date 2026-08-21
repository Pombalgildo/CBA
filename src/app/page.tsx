'use client'

import { useEffect, useState } from 'react'
import { PublicSite } from '@/components/public/PublicSite'
import { AdminPanel } from '@/components/admin/AdminPanel'

export default function Home() {
  const [hash, setHash] = useState<string>(typeof window !== 'undefined' ? window.location.hash || '#/' : '#/')

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Painel admin acessível via #/admin
  if (hash.startsWith('#/admin')) {
    return <AdminPanel />
  }

  return <PublicSite />
}
