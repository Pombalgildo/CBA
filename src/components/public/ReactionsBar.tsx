'use client'
import { ShareButton } from './ShareButton'
import { Reactions } from './Reactions'

interface ReactionsBarProps {
  itemType: 'news' | 'publication' | 'notice'
  itemId: number
  shareUrl: string
  shareTitle: string
  shareText: string
  shareImage?: string
}

// Barra unificada que mostra partilha, like e comentar na mesma linha/direcção.
// Em ecrãs grandes ficam lado a lado; em telemóveis ficam empilhados mas alinhados.
export function ReactionsBar({ itemType, itemId, shareUrl, shareTitle, shareText, shareImage }: ReactionsBarProps) {
  return (
    <div className="mt-8 space-y-3">
      {/* Partilha — botão grande (estilo anterior) */}
      <ShareButton
        url={shareUrl}
        title={shareTitle}
        text={shareText}
        image={shareImage}
      />
      {/* Likes + Comentários — alinhados abaixo, na mesma direcção */}
      <Reactions itemType={itemType} itemId={itemId} />
    </div>
  )
}
