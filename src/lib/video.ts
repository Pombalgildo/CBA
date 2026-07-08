// Utilitários para vídeos do YouTube e Vimeo

export interface VideoInfo {
  platform: 'youtube' | 'vimeo' | 'unknown'
  embedUrl: string | null
  thumbnailUrl: string | null
  videoId: string | null
}

// Extrai informação de uma URL de YouTube ou Vimeo
export function parseVideoUrl(url: string): VideoInfo {
  if (!url) {
    return { platform: 'unknown', embedUrl: null, thumbnailUrl: null, videoId: null }
  }

  const trimmed = url.trim()

  // === YouTube ===
  // Formatos suportados:
  //   https://www.youtube.com/watch?v=VIDEO_ID
  //   https://youtu.be/VIDEO_ID
  //   https://www.youtube.com/embed/VIDEO_ID
  //   https://www.youtube.com/shorts/VIDEO_ID
  const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const youtubeMatch = trimmed.match(youtubeRegex)
  if (youtubeMatch) {
    const videoId = youtubeMatch[1]
    return {
      platform: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    }
  }

  // === Vimeo ===
  // Formatos suportados:
  //   https://vimeo.com/VIDEO_ID
  //   https://player.vimeo.com/video/VIDEO_ID
  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/
  const vimeoMatch = trimmed.match(vimeoRegex)
  if (vimeoMatch) {
    const videoId = vimeoMatch[1]
    return {
      platform: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      thumbnailUrl: null, // Vimeo não tem thumbnail pública fácil
    }
  }

  return { platform: 'unknown', embedUrl: null, thumbnailUrl: null, videoId: null }
}

// Verifica se uma URL é um vídeo válido do YouTube ou Vimeo
export function isValidVideoUrl(url: string): boolean {
  return parseVideoUrl(url).platform !== 'unknown'
}
