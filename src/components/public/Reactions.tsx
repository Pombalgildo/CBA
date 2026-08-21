'use client'
import { useState, useEffect, useCallback } from 'react'

interface ReactionsProps {
  itemType: 'news' | 'publication' | 'notice'
  itemId: number
}

interface CommentData {
  id: number
  nome: string | null
  conteudo: string
  resposta: string | null
  respostaData: string | null
  createdAt: string
}

export function Reactions({ itemType, itemId }: ReactionsProps) {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState<CommentData[]>([])
  const [showComments, setShowComments] = useState(false)
  const [loadingLike, setLoadingLike] = useState(false)

  // Estado do formulário de comentário
  const [nome, setNome] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [msgSucesso, setMsgSucesso] = useState<string | null>(null)
  const [msgErro, setMsgErro] = useState<string | null>(null)

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/interactions/status?itemType=${itemType}&itemId=${itemId}`)
      if (res.ok) {
        const data = await res.json()
        setLikes(data.likes || 0)
        setLiked(!!data.liked)
      }
    } catch {}
  }, [itemType, itemId])

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/interactions/comments?itemType=${itemType}&itemId=${itemId}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch {}
  }, [itemType, itemId])

  useEffect(() => {
    loadStatus()
  }, [loadStatus])

  useEffect(() => {
    if (showComments) loadComments()
  }, [showComments, loadComments])

  const toggleLike = async () => {
    if (loadingLike) return
    setLoadingLike(true)

    // Optimistic update
    const wasLiked = liked
    setLiked(!wasLiked)
    setLikes((l) => l + (wasLiked ? -1 : 1))

    try {
      const res = await fetch('/api/interactions/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType,
          itemId,
          action: wasLiked ? 'unlike' : 'like',
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setLikes(data.likes)
        setLiked(!!data.liked)
      } else {
        // Reverter em caso de erro
        setLiked(wasLiked)
        setLikes((l) => l + (wasLiked ? 1 : -1))
      }
    } catch {
      // Reverter em caso de erro de rede
      setLiked(wasLiked)
      setLikes((l) => l + (wasLiked ? 1 : -1))
    } finally {
      setLoadingLike(false)
    }
  }

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsgSucesso(null)
    setMsgErro(null)

    const conteudoTrim = conteudo.trim()
    if (conteudoTrim.length < 3) {
      setMsgErro('Comentário demasiado curto (mínimo 3 caracteres)')
      return
    }

    setEnviando(true)
    try {
      const res = await fetch('/api/interactions/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType,
          itemId,
          nome: nome.trim() || null,
          conteudo: conteudoTrim,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setMsgSucesso(data.message || 'Comentário enviado!')
        setConteudo('')
        // Não limpa o nome (pode querer usar novamente)
      } else {
        setMsgErro(data.error || 'Erro ao enviar comentário')
      }
    } catch {
      setMsgErro('Erro de ligação. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso)
      return d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
      return ''
    }
  }

  return (
    <div className="mt-3">
      {/* Barra de reacções — bem visível, alinhada com o botão de partilha */}
      <div className="flex items-stretch gap-3 flex-wrap">
        {/* Botão Like */}
        <button
          onClick={toggleLike}
          disabled={loadingLike}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-body font-bold text-sm md:text-base uppercase tracking-wider transition-all shadow-lg ${
            liked
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
          } ${loadingLike ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={liked ? 'white' : 'none'}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {liked ? 'Gostei' : 'Gostar'}
          {likes > 0 && (
            <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">{likes}</span>
          )}
        </button>

        {/* Botão Comentários */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-body font-bold text-sm md:text-base uppercase tracking-wider transition-all shadow-lg cursor-pointer ${
            showComments
              ? 'bg-primary text-white'
              : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Comentar
          {comments.length > 0 && (
            <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">{comments.length}</span>
          )}
        </button>
      </div>

      {/* Secção de comentários */}
      {showComments && (
        <div className="mt-6 bg-white border border-border rounded-xl p-6 md:p-8">
          <h3 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            💬 Comentários
            {comments.length > 0 && (
              <span className="text-sm text-muted-foreground font-body font-normal">({comments.length})</span>
            )}
          </h3>

          {/* Formulário de novo comentário */}
          <form onSubmit={submitComment} className="mb-6 pb-6 border-b border-border">
            <div className="mb-3">
              <label className="block font-body text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">
                Nome <span className="text-muted-foreground font-normal lowercase">(opcional — se não preencher, aparece como "Anónimo")</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={80}
                placeholder="Ex: João Silva"
                className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="mb-3">
              <label className="block font-body text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">
                Comentário <span className="text-red-600">*</span>
              </label>
              <textarea
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="Escreva o seu comentário..."
                className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                required
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">{conteudo.length}/1000</p>
            </div>

            {msgSucesso && (
              <div className="mb-3 bg-green-50 border border-green-300 rounded-lg p-3 text-green-800 text-sm font-body">
                ✅ {msgSucesso}
              </div>
            )}
            {msgErro && (
              <div className="mb-3 bg-red-50 border border-red-300 rounded-lg p-3 text-red-800 text-sm font-body">
                ❌ {msgErro}
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="bg-primary hover:bg-primary/90 text-white font-body font-semibold text-sm uppercase tracking-wider rounded-lg px-6 py-2.5 transition-colors disabled:opacity-50"
            >
              {enviando ? 'A enviar...' : 'Enviar comentário'}
            </button>
            <p className="text-xs text-muted-foreground mt-2 font-body">
              ℹ️ Os comentários são moderados pelo administrador antes de serem publicados.
            </p>
          </form>

          {/* Lista de comentários */}
          {comments.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground text-center py-6">
              Ainda não há comentários. Seja o primeiro a comentar!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading font-bold text-sm">
                      {(c.nome || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground">{c.nome || 'Anónimo'}</p>
                      <p className="font-body text-xs text-muted-foreground">{formatDate(c.createdAt)}</p>
                    </div>
                  </div>
                  <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-line pl-10">{c.conteudo}</p>

                  {/* Resposta do admin */}
                  {c.resposta && (
                    <div className="mt-3 ml-10 pl-4 border-l-2 border-accent">
                      <p className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-1">📍 Resposta da CBA</p>
                      <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-line">{c.resposta}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
