'use client'
import { parseVideoUrl } from '@/lib/video'

interface VideoEmbedProps {
  url: string | null | undefined
  className?: string
}

export function VideoEmbed({ url, className = '' }: VideoEmbedProps) {
  if (!url) return null

  const video = parseVideoUrl(url)
  if (!video.embedUrl) return null

  return (
    <div className={`relative w-full overflow-hidden rounded-xl shadow-md ${className}`} style={{ aspectRatio: '16/9' }}>
      <iframe
        src={video.embedUrl}
        title="Vídeo"
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
