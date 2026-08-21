'use client'

interface OptimisedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  loading?: 'lazy' | 'eager'
}

// Componente de imagem optimizada
// - Usa o proxy /api/image para imagens externas (Unsplash, etc.)
// - Adiciona lazy loading por defeito
// - Adiciona decoding assíncrono
export function OptimisedImage({ src, alt, className = '', width = 800, loading = 'lazy' }: OptimisedImageProps) {
  if (!src) return null

  // Determinar se a imagem precisa do proxy
  let finalSrc = src
  if (src.includes('images.unsplash.com') || src.includes('media.base44.com')) {
    // Usar o proxy de optimização
    finalSrc = `/api/image?url=${encodeURIComponent(src)}&w=${width}&q=75`
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      // Mostrar um fundo cinza enquanto carrega
      style={{ backgroundColor: '#f0ece4' }}
    />
  )
}
