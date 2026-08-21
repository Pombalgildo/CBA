'use client'
import { useState, useEffect } from 'react'
import { adminList, adminUpdate, adminDelete, isSuperAdmin } from '@/lib/api-client'

interface Comment {
  id: number
  itemType: string
  itemId: number
  nome: string | null
  conteudo: string
  estado: string
  fingerprint: string
  resposta: string | null
  respostaData: string | null
  createdAt: string
}

const ITEM_TYPE_LABELS: Record<string, string> = {
  news: 'Notícia',
  publication: 'Publicação',
  notice: 'Aviso',
}

const ITEM_TYPE_LINKS: Record<string, string> = {
  news: 'noticias',
  publication: 'publicacoes',
  notice: 'avisos',
}

export function ComentariosPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<'pendente' | 'aprovado' | 'rejeitado' | 'todos'>('pendente')

  // Estado para o modal de resposta
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')

  const load = async () => {
    setLoading(true)
    setErro(null)
    try {
      const data = await adminList(`comments?estado=${filtro}`)
      setComments(data)
    } catch (e: any) {
      setErro(e.message || 'Erro ao carregar comentários')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isSuperAdmin()) {
      setErro('Apenas o administrador principal pode moderar comentários.')
      setLoading(false)
      return
    }
    load()
  }, [filtro])

  const handleAction = async (id: number, action: 'aprovado' | 'rejeitado' | 'pendente') => {
    try {
      await adminUpdate('comments', id, { estado: action })
      setSuccessMsg(`Comentário ${action === 'aprovado' ? 'aprovado' : action === 'rejeitado' ? 'rejeitado' : 'marcado como pendente'} com sucesso.`)
      load()
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (e: any) {
      setErro(e.message || 'Erro ao actualizar comentário')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar permanentemente este comentário?')) return
    try {
      await adminDelete('comments', id)
      setSuccessMsg('Comentário eliminado.')
      load()
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (e: any) {
      setErro(e.message || 'Erro ao eliminar')
    }
  }

  const handleReply = async (id: number) => {
    if (!replyText.trim()) return
    try {
      await adminUpdate('comments', id, { resposta: replyText.trim() })
      setSuccessMsg('Resposta publicada.')
      setReplyingTo(null)
      setReplyText('')
      load()
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (e: any) {
      setErro(e.message || 'Erro ao guardar resposta')
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('pt-PT', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return ''
    }
  }

  // Calcula tempo restante até auto-aprovação (24h)
  const timeUntilAuto = (createdAt: string) => {
    const created = new Date(createdAt).getTime()
    const autoTime = created + 24 * 60 * 60 * 1000
    const now = Date.now()
    const diff = autoTime - now
    if (diff <= 0) return 'Será auto-aprovado a qualquer momento'
    const hours = Math.floor(diff / (60 * 60 * 1000))
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
    return `Auto-aprova em ${hours}h ${minutes}min`
  }

  if (!isSuperAdmin()) {
    return (
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 text-amber-900">
        <h2 className="font-heading font-bold text-xl mb-2">⚠️ Acesso restrito</h2>
        <p className="font-body text-sm">Apenas o administrador principal pode moderar comentários.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">Moderação de Comentários</h2>
        <p className="font-body text-sm text-muted-foreground">
          Aprove, rejeite ou responda aos comentários deixados pelos visitantes nas matérias.
          Comentários pendentes há mais de 24h ficam visíveis automaticamente.
        </p>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-4 text-red-800 text-sm">{erro}</div>
      )}
      {successMsg && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-4 text-green-800 text-sm">{successMsg}</div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['pendente', 'aprovado', 'rejeitado', 'todos'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-lg text-sm font-body font-semibold uppercase tracking-wide transition-all ${
              filtro === f ? 'bg-primary text-white shadow' : 'bg-gray-100 text-foreground hover:bg-gray-200'
            }`}
          >
            {f === 'pendente' ? '⏳ Pendentes' : f === 'aprovado' ? '✅ Aprovados' : f === 'rejeitado' ? '❌ Rejeitados' : '📋 Todos'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'hsl(150 30% 18%)' }}></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-8 text-center">
          <p className="font-body text-muted-foreground">
            {filtro === 'pendente' ? '✅ Sem comentários pendentes. Tudo em dia!' : `Sem comentários ${filtro}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="bg-white border border-border rounded-xl p-5 shadow-sm">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-heading font-bold text-foreground">{c.nome || 'Anónimo'}</span>
                    <span className={`text-xs font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      c.estado === 'aprovado' ? 'bg-green-100 text-green-800' :
                      c.estado === 'rejeitado' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {c.estado}
                    </span>
                    <span className="text-xs font-body text-muted-foreground">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-xs font-body text-muted-foreground">
                    Em: <a
                      href={`https://www.cbaangola.org/${ITEM_TYPE_LINKS[c.itemType]}/${c.itemId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {ITEM_TYPE_LABELS[c.itemType]} #{c.itemId}
                    </a>
                  </p>
                  {c.estado === 'pendente' && (
                    <p className="text-xs font-body text-amber-700 mt-1">⏰ {timeUntilAuto(c.createdAt)}</p>
                  )}
                </div>
              </div>

              {/* Conteúdo do comentário */}
              <div className="bg-muted/50 rounded-lg p-3 mb-3">
                <p className="font-body text-sm text-foreground whitespace-pre-line">{c.conteudo}</p>
              </div>

              {/* Resposta existente */}
              {c.resposta && (
                <div className="ml-4 pl-4 border-l-2 border-accent mb-3">
                  <p className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-1">📍 Resposta da CBA</p>
                  <p className="font-body text-sm text-foreground whitespace-pre-line">{c.resposta}</p>
                  {c.respostaData && (
                    <p className="font-body text-xs text-muted-foreground mt-1">{formatDate(c.respostaData)}</p>
                  )}
                </div>
              )}

              {/* Formulário de resposta */}
              {replyingTo === c.id ? (
                <div className="mb-3 bg-accent/10 rounded-lg p-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    maxLength={2000}
                    placeholder="Escreva a resposta da CBA..."
                    className="w-full border border-border rounded px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleReply(c.id)}
                      className="bg-primary hover:bg-primary/90 text-white font-body font-semibold text-xs uppercase tracking-wider rounded px-4 py-2"
                    >
                      Publicar resposta
                    </button>
                    <button
                      onClick={() => { setReplyingTo(null); setReplyText('') }}
                      className="bg-muted hover:bg-muted/80 text-foreground font-body font-semibold text-xs uppercase tracking-wider rounded px-4 py-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setReplyingTo(c.id); setReplyText(c.resposta || '') }}
                  className="text-xs font-body font-semibold text-primary hover:underline mb-3"
                >
                  💬 {c.resposta ? 'Editar resposta' : 'Responder a este comentário'}
                </button>
              )}

              {/* Acções */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                {c.estado !== 'aprovado' && (
                  <button
                    onClick={() => handleAction(c.id, 'aprovado')}
                    className="bg-green-600 hover:bg-green-700 text-white font-body font-semibold text-xs uppercase tracking-wider rounded px-4 py-2"
                  >
                    ✅ Aprovar
                  </button>
                )}
                {c.estado !== 'rejeitado' && (
                  <button
                    onClick={() => handleAction(c.id, 'rejeitado')}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-body font-semibold text-xs uppercase tracking-wider rounded px-4 py-2"
                  >
                    ❌ Rejeitar
                  </button>
                )}
                {c.estado !== 'pendente' && (
                  <button
                    onClick={() => handleAction(c.id, 'pendente')}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-body font-semibold text-xs uppercase tracking-wider rounded px-4 py-2"
                  >
                    ⏳ Marcar pendente
                  </button>
                )}
                <button
                  onClick={() => handleDelete(c.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-body font-semibold text-xs uppercase tracking-wider rounded px-4 py-2 ml-auto"
                >
                  🗑 Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
