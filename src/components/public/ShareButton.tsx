'use client'
import { useState } from 'react'

interface ShareButtonProps {
  url: string
  title: string
  text: string
  image?: string
}

export function ShareButton({ url, title, text, image }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // User cancelled — do nothing
      }
    } else {
      setShowModal(true)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // Fallback: select input
      const input = document.getElementById('share-url-input') as HTMLInputElement
      if (input) {
        input.select()
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      }
    }
  }

  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${text}\n\n${url}`)}`
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`

  return (
    <>
      <button
        onClick={handleShare}
        className="w-full bg-primary hover:bg-primary/90 text-white font-body font-bold text-base md:text-lg uppercase tracking-wider rounded-xl px-5 py-4 transition-colors shadow-lg flex items-center justify-center gap-3"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Partilhar esta matéria
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔗</span>
                <h3 className="font-heading font-bold text-lg text-foreground">Partilhar matéria</h3>
              </div>

              {/* Preview card — simula o que vai aparecer no WhatsApp/Facebook */}
              <div className="border border-border rounded-xl overflow-hidden mb-4">
                {image && (
                  <div className="h-36 overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <p className="font-heading font-bold text-sm text-foreground mb-1 line-clamp-2">{title}</p>
                  <p className="font-body text-xs text-muted-foreground line-clamp-2">{text}</p>
                  <p className="font-body text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">cbaangola.org</p>
                </div>
              </div>

              {/* Copy link */}
              <div className="flex gap-2 mb-4">
                <input
                  id="share-url-input"
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 border border-border rounded-lg px-3 py-2 font-body text-xs text-foreground bg-muted"
                  onClick={e => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-lg font-body font-semibold text-xs uppercase tracking-wider transition-colors whitespace-nowrap ${copied ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
                >
                  {copied ? '✓ Copiado!' : '📋 Copiar'}
                </button>
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-4 gap-2">
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <span className="text-2xl">💬</span>
                  <span className="font-body text-[10px] font-semibold text-foreground">WhatsApp</span>
                </a>
                <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <span className="text-2xl">📘</span>
                  <span className="font-body text-[10px] font-semibold text-foreground">Facebook</span>
                </a>
                <a href={twUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-3 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors">
                  <span className="text-2xl">🐦</span>
                  <span className="font-body text-[10px] font-semibold text-foreground">Twitter</span>
                </a>
                <a href={emailUrl} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                  <span className="text-2xl">✉️</span>
                  <span className="font-body text-[10px] font-semibold text-foreground">Email</span>
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 border-t border-border font-body text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
