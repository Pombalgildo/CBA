'use client'
import { useState, useEffect } from 'react'
import { adminList, adminCreate, adminUpdate, adminDelete, isSuperAdmin, type AdminUser, type Permissions } from '@/lib/api-client'

// Lista de abas protegidas (deve corresponder a ADMIN_TABS no backend)
const TABS = [
  { key: 'avisos',       label: 'Avisos',         icon: '🚨' },
  { key: 'noticias',     label: 'Notícias',       icon: '📰' },
  { key: 'publicacoes',  label: 'Publicações',    icon: '📖' },
  { key: 'eventos',      label: 'Galeria',        icon: '🖼️' },
  { key: 'igrejas',      label: 'Igrejas',        icon: '⛪' },
  { key: 'ministerios',  label: 'Departamentos',  icon: '🙏' },
  { key: 'quem-somos',   label: 'Quem Somos',     icon: '🏛️' },
  { key: 'contactos',    label: 'Contactos',      icon: '📬' },
  { key: 'doacoes-cats', label: 'Doações',        icon: '🤲' },
  { key: 'mensagens',    label: 'Mensagens',      icon: '📨' },
  { key: 'doacoes',      label: 'Comprovativos',  icon: '💰' },
  { key: 'definicoes',   label: 'Definições',     icon: '⚙️' },
]

interface EditorRow extends AdminUser {
  id: number
  createdAt?: string
  ativo?: boolean
}

export function EditoresPage() {
  const [editores, setEditores] = useState<EditorRow[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<EditorRow | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setErro(null)
    try {
      const data = await adminList('editores')
      setEditores(data)
    } catch (e: any) {
      setErro(e.message || 'Erro ao carregar editores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isSuperAdmin()) {
      setErro('Apenas o administrador principal pode gerir editores.')
      setLoading(false)
      return
    }
    load()
  }, [])

  const handleSaved = (msg: string) => {
    setShowForm(false)
    setEditing(null)
    setSuccessMsg(msg)
    load()
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  if (!isSuperAdmin()) {
    return (
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 text-amber-900">
        <h2 className="font-heading font-bold text-xl mb-2">⚠️ Acesso restrito</h2>
        <p className="font-body text-sm">Apenas o administrador principal pode criar e gerir perfis de editores.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground mb-1">Gestão de Editores</h2>
          <p className="font-body text-sm text-muted-foreground">
            Bem-vindo! Como administrador principal, pode criar e gerir perfis de editores com acesso parcial ou total às abas do painel.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="bg-primary hover:bg-primary/90 text-white font-body font-semibold text-sm uppercase tracking-wider rounded px-4 py-2"
        >
          + Novo Editor
        </button>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-4 text-red-800 text-sm">{erro}</div>
      )}
      {successMsg && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-4 text-green-800 text-sm">{successMsg}</div>
      )}

      {showForm && (
        <EditorForm
          existing={editing}
          onCancel={() => { setShowForm(false); setEditing(null) }}
          onSaved={handleSaved}
        />
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'hsl(150 30% 18%)' }}></div>
        </div>
      ) : editores.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-8 text-center">
          <p className="font-body text-muted-foreground">Nenhum editor criado ainda. Clique em &ldquo;Novo Editor&rdquo; para começar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {editores.map((ed) => (
            <EditorCard
              key={ed.id}
              editor={ed}
              onEdit={() => { setEditing(ed); setShowForm(true) }}
              onDelete={async () => {
                if (confirm(`Eliminar o editor "${ed.username}"?`)) {
                  try {
                    await adminDelete('editores', ed.id)
                    setSuccessMsg('Editor eliminado.')
                    load()
                    setTimeout(() => setSuccessMsg(null), 4000)
                  } catch (e: any) {
                    setErro(e.message || 'Erro ao eliminar')
                  }
                }
              }}
            />
          ))}
        </div>
      )}

      <div className="mt-8 bg-white border border-border rounded-xl p-6">
        <h3 className="font-heading font-bold text-lg text-foreground mb-3">Como funciona</h3>
        <ul className="space-y-2 font-body text-sm text-foreground/80">
          <li className="flex gap-2"><span className="text-accent">▸</span> <span><b>Administrador</b> (role=admin): tem acesso total a todas as abas, incluindo esta página de Gestão de Editores.</span></li>
          <li className="flex gap-2"><span className="text-accent">▸</span> <span><b>Editor</b> (role=editor): só consegue ver e editar as abas que o administrador marcou como permitidas.</span></li>
          <li className="flex gap-2"><span className="text-accent">▸</span> <span>Um editor sem acesso a uma aba não a vê no menu, e mesmo que tente aceder via URL, a API bloqueia o pedido.</span></li>
          <li className="flex gap-2"><span className="text-accent">▸</span> <span>Pode <b>desactivar</b> um editor sem o eliminar — ele continua a existir mas não consegue iniciar sessão.</span></li>
          <li className="flex gap-2"><span className="text-accent">▸</span> <span>Pode <b>redefinir a palavra-passe</b> de um editor a qualquer momento editando o seu perfil.</span></li>
        </ul>
      </div>
    </div>
  )
}

// ─── Cartão de um editor ───
function EditorCard({ editor, onEdit, onDelete }: { editor: EditorRow; onEdit: () => void; onDelete: () => void }) {
  const allowedTabs = TABS.filter((t) => editor.role === 'admin' || editor.permissions?.[t.key])
  const isAtivo = editor.ativo !== false

  return (
    <div className={`bg-white border rounded-xl p-5 ${isAtivo ? 'border-border' : 'border-red-200 bg-red-50/30'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading font-bold text-lg text-foreground">{editor.nome || editor.username}</span>
            <span className={`text-xs font-body font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${editor.role === 'admin' ? 'bg-primary text-white' : 'bg-accent/30 text-primary'}`}>
              {editor.role === 'admin' ? 'Administrador' : 'Editor'}
            </span>
            {!isAtivo && (
              <span className="text-xs font-body font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white">
                Desactivado
              </span>
            )}
          </div>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Utilizador: <span className="font-mono">@{editor.username}</span>
          </p>
          <div className="mt-3">
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {editor.role === 'admin' ? 'Acesso total a todas as abas' : `Acesso a ${allowedTabs.length} de ${TABS.length} abas:`}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {editor.role === 'admin' ? (
                <span className="text-sm">✅ Todas as secções</span>
              ) : allowedTabs.length === 0 ? (
                <span className="text-sm text-red-600">⛔ Sem acesso a nenhuma aba</span>
              ) : (
                allowedTabs.map((t) => (
                  <span key={t.key} className="text-xs font-body bg-muted px-2 py-0.5 rounded">
                    {t.icon} {t.label}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="bg-secondary hover:bg-secondary/90 text-white font-body font-semibold text-xs uppercase tracking-wider rounded px-3 py-1.5"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-body font-semibold text-xs uppercase tracking-wider rounded px-3 py-1.5"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Formulário criar/editar editor ───
function EditorForm({ existing, onCancel, onSaved }: {
  existing: EditorRow | null
  onCancel: () => void
  onSaved: (msg: string) => void
}) {
  const [username, setUsername] = useState(existing?.username || '')
  const [nome, setNome] = useState(existing?.nome || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'editor'>(existing?.role || 'editor')
  const [perms, setPerms] = useState<Permissions>(() => {
    const initial: Permissions = {}
    for (const t of TABS) {
      initial[t.key] = existing?.role === 'admin' ? true : (existing?.permissions?.[t.key] === true)
    }
    return initial
  })
  const [ativo, setAtivo] = useState(existing?.ativo !== false)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const togglePerm = (key: string) => {
    setPerms((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const selectAll = () => {
    const all: Permissions = {}
    for (const t of TABS) all[t.key] = true
    setPerms(all)
  }
  const selectNone = () => {
    const none: Permissions = {}
    for (const t of TABS) none[t.key] = false
    setPerms(none)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setSaving(true)
    try {
      if (existing) {
        // Update
        const payload: any = { nome, role, permissions: perms, ativo }
        if (password) payload.password = password
        await adminUpdate('editores', existing.id, payload)
        onSaved('Editor actualizado com sucesso.')
      } else {
        // Create
        if (!username || !password) {
          setErro('Nome de utilizador e palavra-passe são obrigatórios.')
          setSaving(false)
          return
        }
        await adminCreate('editores', { username, nome, password, role, permissions: perms, ativo })
        onSaved('Editor criado com sucesso.')
      }
    } catch (e: any) {
      setErro(e.message || 'Erro ao guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white border border-border rounded-xl p-6 mb-6 space-y-5">
      <h3 className="font-heading font-bold text-lg text-foreground">
        {existing ? `Editar: ${existing.username}` : 'Criar Novo Editor'}
      </h3>

      {erro && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-red-800 text-sm">{erro}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-sm font-semibold text-foreground mb-1">
            Nome de utilizador <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!!existing}
            className="w-full border border-border rounded px-3 py-2 font-body text-sm disabled:bg-muted disabled:cursor-not-allowed"
            placeholder="ex: editor_joao"
            minLength={3}
            required
          />
          {existing && <p className="text-xs text-muted-foreground mt-1">O nome de utilizador não pode ser alterado.</p>}
        </div>

        <div>
          <label className="block font-body text-sm font-semibold text-foreground mb-1">
            Nome completo
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border border-border rounded px-3 py-2 font-body text-sm"
            placeholder="ex: João Silva"
          />
        </div>
      </div>

      <div>
        <label className="block font-body text-sm font-semibold text-foreground mb-1">
          Palavra-passe {existing ? '(deixe vazio para manter)' : <span className="text-red-600">*</span>}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-border rounded px-3 py-2 font-body text-sm"
          placeholder={existing ? '•••••••' : 'Mínimo 6 caracteres'}
          minLength={existing ? 0 : 6}
          required={!existing}
        />
      </div>

      <div>
        <label className="block font-body text-sm font-semibold text-foreground mb-2">
          Tipo de acesso
        </label>
        <div className="flex flex-wrap gap-3">
          <label className={`flex items-center gap-2 cursor-pointer border rounded-lg px-4 py-2 ${role === 'editor' ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <input
              type="radio"
              checked={role === 'editor'}
              onChange={() => setRole('editor')}
            />
            <div>
              <div className="font-body text-sm font-semibold text-foreground">Editor</div>
              <div className="font-body text-xs text-muted-foreground">Acesso apenas às abas seleccionadas abaixo</div>
            </div>
          </label>
          <label className={`flex items-center gap-2 cursor-pointer border rounded-lg px-4 py-2 ${role === 'admin' ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <input
              type="radio"
              checked={role === 'admin'}
              onChange={() => setRole('admin')}
            />
            <div>
              <div className="font-body text-sm font-semibold text-foreground">Administrador</div>
              <div className="font-body text-xs text-muted-foreground">Acesso total a todas as abas (incluindo Editores)</div>
            </div>
          </label>
        </div>
      </div>

      {role === 'editor' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block font-body text-sm font-semibold text-foreground">
              Permissões por aba
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={selectAll} className="text-xs font-body text-primary hover:underline">
                Selecionar todas
              </button>
              <span className="text-muted-foreground">·</span>
              <button type="button" onClick={selectNone} className="text-xs font-body text-primary hover:underline">
                Limpar todas
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {TABS.map((t) => (
              <label
                key={t.key}
                className={`flex items-center gap-2 cursor-pointer border rounded-lg px-3 py-2 transition-colors ${
                  perms[t.key] ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={perms[t.key] === true}
                  onChange={() => togglePerm(t.key)}
                  className="cursor-pointer"
                />
                <span className="font-body text-sm">{t.icon} {t.label}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            As abas não seleccionadas ficam invisíveis para o editor no menu, e o acesso via URL é bloqueado pela API.
          </p>
        </div>
      )}

      {existing && (
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
            />
            <span className="font-body text-sm font-semibold text-foreground">
              Conta activa
            </span>
          </label>
          <p className="text-xs text-muted-foreground mt-1 ml-6">
            Se desactivada, o editor não consegue iniciar sessão (mas a conta não é eliminada).
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="bg-muted hover:bg-muted/80 text-foreground font-body font-semibold text-sm uppercase tracking-wider rounded px-4 py-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white font-body font-semibold text-sm uppercase tracking-wider rounded px-4 py-2 disabled:opacity-50"
        >
          {saving ? 'A guardar...' : existing ? 'Guardar alterações' : 'Criar editor'}
        </button>
      </div>
    </form>
  )
}
