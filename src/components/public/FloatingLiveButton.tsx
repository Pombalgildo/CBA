'use client'
import type { SiteSettings } from '@/lib/types'

interface FloatingLiveButtonProps {
  settings: SiteSettings | null
}

export function FloatingLiveButton({ settings }: FloatingLiveButtonProps) {
  // Só aparece se o admin activou a live
  if (!settings?.liveActive) return null

  // O botão flutuante leva SEMPRE à página Online do site
  // (a página Online é que incorpora o vídeo do YouTube/Vimeo)
  return (
    <a
      href="#/online"
      className="fixed bottom-6 right-6 z-40 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center gap-3 pl-4 pr-6 py-4 transition-all hover:scale-105"
      aria-label="Assistir Transmissão em Directo"
    >
      <span className="relative flex items-center justify-center w-3 h-3">
        <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
      <span className="font-heading font-bold text-sm uppercase tracking-wider">Assistir Directo</span>
    </a>
  )
}
