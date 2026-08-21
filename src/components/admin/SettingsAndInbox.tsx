'use client'
import { useState, useEffect } from 'react'
import { getSettings, updateSettings, adminList, adminPatch, adminDelete } from '@/lib/api-client'
import { ImageUpload } from './ImageUpload'
import type { SiteSettings } from '@/lib/types'

const SETTING_FIELDS: { key: keyof SiteSettings; label: string; type: 'text' | 'textarea' | 'image' | 'live-toggle'; help?: string }[] = [
  { key: 'siteTitle', label: 'Título do Site', type: 'text' },
  { key: 'siteShortName', label: 'Nome Curto (sigla)', type: 'text' },
  { key: 'heroTitle', label: 'Título do Banner Principal', type: 'text', help: 'Aparece no topo da página inicial' },
  { key: 'heroSubtitle', label: 'Subtítulo do Banner', type: 'text' },
  { key: 'heroImage', label: 'Imagem do Banner', type: 'image' },
  { key: 'logoUrl', label: 'Logótipo', type: 'image' },
  { key: 'fundacao', label: 'Data de Fundação', type: 'text' },
  { key: 'reconhecimento', label: 'Texto de Reconhecimento Legal', type: 'textarea' },
  { key: 'tema', label: 'Tema Actual', type: 'textarea' },
  { key: 'divisa', label: 'Divisa', type: 'text' },
  { key: 'copyright', label: 'Texto de Copyright (rodapé)', type: 'textarea' },
  { key: 'liveActive', label: '🔴 Transmissão em Directo (Live)', type: 'live-toggle', help: 'Active quando houver um culto ou evento a decorrer em directo. Um botão flutuante vermelho aparecerá no site para os visitantes assistirem.' },
  { key: 'liveTitle', label: 'Título da Transmissão', type: 'text', help: 'Ex: Culto de Domingo, Conferência Nacional, etc.' },
  { key: 'liveUrl', label: 'Link da Transmissão (YouTube/Vimeo)', type: 'text', help: 'Cole o link do YouTube ou Vimeo. O vídeo será incorporado automaticamente no botão flutuante.' },
]

// Campos específicos da página de Contactos
const CONTACTOS_FIELDS: { key: keyof SiteSettings; label: string; type: 'text' | 'textarea'; help?: string }[] = [
  { key: 'endereco', label: 'Endereço', type: 'text' },
  { key: 'telefone', label: 'Telefone', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'horarioCultos', label: 'Horário de Funcionamento (resumo para o rodapé)', type: 'text', help: 'Ex: Segunda a Sexta: 8h-15h' },
  { key: 'cultoDomingoEBD', label: 'Hora de Abertura (Segunda a Sexta)', type: 'text', placeholder: '8h00' },
  { key: 'cultoDomingoAdoracao', label: 'Hora de Encerramento (Segunda a Sexta)', type: 'text', placeholder: '15h00' },
  { key: 'cultoQuartaEstudo', label: 'Fim de Semana (Sábado e Domingo)', type: 'text', placeholder: 'Fechado' },
  { key: 'iban', label: 'IBAN para Doações', type: 'text' },
]

export function DefinicoesPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    getSettings()
      .then((data) => { setSettings(data); setLoading(false) })
      .catch(() => { setErro('Erro ao carregar definições'); setLoading(false) })
  }, [])

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    setErro('')
    setSucesso(false)
    try {
      const updated = await updateSettings(settings)
      setSettings(updated)
      setSucesso(true)
      setTimeout(() => setSucesso(false), 4000)
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12"><div className="spinner mx-auto" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'hsl(150 30% 18%)' }}></div></div>
  if (!settings) return <div className="text-center py-12 text-red-600">{erro}</div>

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-foreground mb-6">Definições do Site</h2>
      {sucesso && <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm font-body">✓ Definições guardadas com sucesso!</div>}
      {erro && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm font-body">{erro}</div>}
      <form onSubmit={guardar} className="bg-white border border-border rounded-lg p-6 space-y-5 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SETTING_FIELDS.map((f) => (
            <div key={f.key} className={(f.type === 'textarea' || f.type === 'image' || f.type === 'live-toggle') ? 'md:col-span-2' : ''}>
              <label className="font-body text-sm font-semibold block mb-1.5 text-foreground">{f.label}</label>
              {f.help && <p className="font-body text-xs text-muted-foreground mb-1.5">{f.help}</p>}
              {f.type === 'text' && (
                <input
                  value={(settings[f.key] as string) || ''}
                  onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              )}
              {f.type === 'textarea' && (
                <textarea
                  value={(settings[f.key] as string) || ''}
                  onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                  rows={3}
                  className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                />
              )}
              {f.type === 'image' && (
                <ImageUpload value={(settings[f.key] as string) || ''} onChange={(url) => setSettings({ ...settings, [f.key]: url })} placeholder="Carregar imagem" />
              )}
              {f.type === 'live-toggle' && (
                <div className="flex items-center gap-4 p-4 border-2 border-border rounded-lg bg-muted/30">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, [f.key]: !settings[f.key] })}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${(settings[f.key] as boolean) ? 'bg-red-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${(settings[f.key] as boolean) ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                  <div>
                    <p className={`font-body font-bold text-sm ${(settings[f.key] as boolean) ? 'text-red-600' : 'text-muted-foreground'}`}>
                      {(settings[f.key] as boolean) ? '🔴 LIVE ACTIVADA — Botão flutuante visível no site' : '⚪ Live desactivada — Botão flutuante oculto'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-border">
          <button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-white font-body font-bold text-sm px-8 py-2.5 rounded-lg disabled:opacity-50">
            {saving ? 'A guardar...' : '💾 Guardar Definições'}
          </button>
        </div>
      </form>
    </div>
  )
}

export function MensagensPage() {
  const [mensagens, setMensagens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    adminList('messages')
      .then((data) => { setMensagens(data); setLoading(false) })
      .catch((err) => { setErro(err.message); setLoading(false) })
  }, [])

  const marcarLida = async (id: number, lida: boolean) => {
    try {
      await adminPatch('messages', id, { lida: !lida })
      setMensagens(mensagens.map(m => m.id === id ? { ...m, lida: !lida } : m))
    } catch (err: any) { setErro(err.message) }
  }

  const eliminar = async (id: number) => {
    if (!confirm('Eliminar esta mensagem?')) return
    try {
      await adminDelete('messages', id)
      setMensagens(mensagens.filter(m => m.id !== id))
    } catch (err: any) { setErro(err.message) }
  }

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-foreground mb-6">Mensagens Recebidas</h2>
      {erro && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm font-body">{erro}</div>}
      {loading ? <div className="text-center py-12"><div className="spinner mx-auto" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'hsl(150 30% 18%)' }}></div></div> :
       mensagens.length === 0 ? <div className="text-center py-12 bg-muted rounded-lg"><p className="font-body text-muted-foreground">Nenhuma mensagem recebida.</p></div> :
       <div className="space-y-3">
         {mensagens.map((m) => (
           <div key={m.id} className={`bg-white border rounded-lg p-4 ${m.lida ? 'border-border' : 'border-secondary border-l-4 border-l-secondary'}`}>
             <div className="flex items-start justify-between gap-4">
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                   <span className="font-heading font-bold text-sm text-foreground">{m.nome}</span>
                   <span className="font-body text-xs text-muted-foreground">{m.email}</span>
                   <span className="font-body text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{m.tipo}</span>
                   {!m.lida && <span className="font-body text-xs bg-secondary text-white px-2 py-0.5 rounded-full">Nova</span>}
                 </div>
                 <p className="font-body text-sm text-foreground/80 leading-relaxed">{m.mensagem}</p>
                 <p className="font-body text-xs text-muted-foreground mt-2">{new Date(m.createdAt).toLocaleString('pt-PT')}</p>
               </div>
               <div className="flex flex-col gap-2 shrink-0">
                 <button onClick={() => marcarLida(m.id, m.lida)} className="text-xs font-body font-semibold text-primary hover:underline">{m.lida ? 'Marcar como não lida' : 'Marcar como lida'}</button>
                 <button onClick={() => eliminar(m.id)} className="text-xs font-body font-semibold text-red-600 hover:underline">Eliminar</button>
               </div>
             </div>
           </div>
         ))}
       </div>}
    </div>
  )
}

export function DoacoesPage() {
  const [doacoes, setDoacoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    adminList('donations')
      .then((data) => { setDoacoes(data); setLoading(false) })
      .catch((err) => { setErro(err.message); setLoading(false) })
  }, [])

  const toggleConfirmado = async (id: number, confirmado: boolean) => {
    try {
      await adminPatch('donations', id, { confirmado: !confirmado })
      setDoacoes(doacoes.map(d => d.id === id ? { ...d, confirmado: !confirmado } : d))
    } catch (err: any) { setErro(err.message) }
  }

  const eliminar = async (id: number) => {
    if (!confirm('Eliminar este registo de doação?')) return
    try {
      await adminDelete('donations', id)
      setDoacoes(doacoes.filter(d => d.id !== id))
    } catch (err: any) { setErro(err.message) }
  }

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-foreground mb-6">Comprovativos de Doação</h2>
      {erro && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm font-body">{erro}</div>}
      {loading ? <div className="text-center py-12"><div className="spinner mx-auto" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'hsl(150 30% 18%)' }}></div></div> :
       doacoes.length === 0 ? <div className="text-center py-12 bg-muted rounded-lg"><p className="font-body text-muted-foreground">Nenhum comprovativo recebido.</p></div> :
       <div className="space-y-3">
         {doacoes.map((d) => (
           <div key={d.id} className={`bg-white border rounded-lg p-4 ${d.confirmado ? 'border-green-300 bg-green-50/30' : 'border-border'}`}>
             <div className="flex items-start justify-between gap-4">
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2 flex-wrap">
                   <span className="font-heading font-bold text-sm text-foreground">{d.nome}</span>
                   <span className="font-body text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{d.categoria}</span>
                   <span className="font-body text-xs text-muted-foreground">{d.metodo}</span>
                   <span className="font-body text-sm font-semibold text-foreground">{d.montante}</span>
                   {d.confirmado ? <span className="font-body text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Confirmado</span> : <span className="font-body text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pendente</span>}
                 </div>
                 {d.observacao && <p className="font-body text-sm text-muted-foreground mb-1">{d.observacao}</p>}
                 {d.ficheiro && <p className="font-body text-xs text-secondary">📎 {d.ficheiro}</p>}
                 <p className="font-body text-xs text-muted-foreground mt-2">{new Date(d.createdAt).toLocaleString('pt-PT')}</p>
               </div>
               <div className="flex flex-col gap-2 shrink-0">
                 <button onClick={() => toggleConfirmado(d.id, d.confirmado)} className="text-xs font-body font-semibold text-primary hover:underline">{d.confirmado ? 'Marcar pendente' : 'Confirmar'}</button>
                 <button onClick={() => eliminar(d.id)} className="text-xs font-body font-semibold text-red-600 hover:underline">Eliminar</button>
               </div>
             </div>
           </div>
         ))}
       </div>}
    </div>
  )
}

export function ContactosPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    getSettings()
      .then((data) => { setSettings(data); setLoading(false) })
      .catch(() => { setErro('Erro ao carregar dados'); setLoading(false) })
  }, [])

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    setErro('')
    setSucesso(false)
    try {
      const updated = await updateSettings(settings)
      setSettings(updated)
      setSucesso(true)
      setTimeout(() => setSucesso(false), 4000)
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12"><div className="spinner mx-auto" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'hsl(150 34% 24%)' }}></div></div>
  if (!settings) return <div className="text-center py-12 text-red-600">{erro}</div>

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-foreground mb-2">Contactos e Horários</h2>
      <p className="font-body text-sm text-muted-foreground mb-6">Edite as informações de contacto e os horários de funcionamento do escritório que aparecem na página de Contactos do site.</p>
      {sucesso && <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm font-body">✓ Contactos guardados com sucesso!</div>}
      {erro && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm font-body">{erro}</div>}
      <form onSubmit={guardar} className="bg-white border border-border rounded-lg p-6 space-y-5 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CONTACTOS_FIELDS.map((f) => (
            <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
              <label className="font-body text-sm font-semibold block mb-1.5 text-foreground">{f.label}</label>
              {f.help && <p className="font-body text-xs text-muted-foreground mb-1">{f.help}</p>}
              <input
                value={(settings[f.key] as string) || ''}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                placeholder={(f as any).placeholder}
                className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-border">
          <button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-white font-body font-bold text-sm px-8 py-2.5 rounded-lg disabled:opacity-50">
            {saving ? 'A guardar...' : '💾 Guardar Contactos'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Página de Doações no admin: IBAN + Categorias de Doação
export function DoacoesCatsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    getSettings()
      .then((data) => { setSettings(data); setLoading(false) })
      .catch(() => { setErro('Erro ao carregar dados'); setLoading(false) })
  }, [])

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    setErro('')
    setSucesso(false)
    try {
      const updated = await updateSettings(settings)
      setSettings(updated)
      setSucesso(true)
      setTimeout(() => setSucesso(false), 4000)
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12"><div className="spinner mx-auto" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'hsl(150 34% 24%)' }}></div></div>
  if (!settings) return <div className="text-center py-12 text-red-600">{erro}</div>

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-foreground mb-2">Doações</h2>
      <p className="font-body text-sm text-muted-foreground mb-6">Gerencie os dados de pagamento e as categorias de doação que aparecem no site.</p>

      {/* IBAN e dados de pagamento */}
      <div className="bg-white border border-border rounded-lg p-6 mb-8 max-w-3xl">
        <h3 className="font-heading font-bold text-lg text-foreground mb-4">📋 Dados de Pagamento</h3>
        {sucesso && <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm font-body">✓ Dados guardados com sucesso!</div>}
        {erro && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm font-body">{erro}</div>}
        <form onSubmit={guardar} className="space-y-5">
          <div>
            <label className="font-body text-sm font-semibold block mb-1.5 text-foreground">IBAN para Doações</label>
            <input
              value={settings.iban || ''}
              onChange={(e) => setSettings({ ...settings, iban: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="AO06.0051.0000.8338.4538.1017.7"
            />
            <p className="font-body text-xs text-muted-foreground mt-1">Este IBAN aparece no modal de doação no site público.</p>
          </div>
          <div>
            <label className="font-body text-sm font-semibold block mb-1.5 text-foreground">Nome do Beneficiário</label>
            <input
              value={settings.siteTitle || ''}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Convenção Baptista de Angola"
            />
            <p className="font-body text-xs text-muted-foreground mt-1">Nome que aparece como beneficiário no modal de doação.</p>
          </div>
          <div className="pt-4 border-t border-border">
            <button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-white font-body font-bold text-sm px-8 py-2.5 rounded-lg disabled:opacity-50">
              {saving ? 'A guardar...' : '💾 Guardar Dados de Pagamento'}
            </button>
          </div>
        </form>
      </div>

      {/* Categorias de Doação */}
      <div className="mt-8">
        <h3 className="font-heading font-bold text-lg text-foreground mb-4">🤲 Categorias de Doação</h3>
        <p className="font-body text-sm text-muted-foreground mb-4">Estas são as categorias que aparecem na página de doações do site. Pode adicionar, editar ou eliminar.</p>
        <DoacoesCrudWrapper />
      </div>
    </div>
  )
}

// Wrapper para o CrudManager das categorias de doação
import { CrudManager, type FieldDef } from './CrudManager'

const DONATION_CAT_FIELDS: FieldDef[] = [
  { name: 'label', label: 'Nome', type: 'text', required: true },
  { name: 'emoji', label: 'Emoji', type: 'text', placeholder: '🕊️' },
  { name: 'descricao', label: 'Descrição', type: 'textarea', required: true },
  { name: 'versiculo', label: 'Versículo Bíblico', type: 'textarea' },
  { name: 'gradient', label: 'Gradiente (CSS)', type: 'text', placeholder: 'linear-gradient(135deg,#f59e0b,#facc15)' },
  { name: 'barGrad', label: 'Gradiente da Barra (CSS)', type: 'text' },
  { name: 'iconSvg', label: 'Ícone SVG (paths)', type: 'textarea', help: 'Apenas os elementos <path>, <circle>, etc. do SVG' },
  { name: 'ordem', label: 'Ordem', type: 'number' },
]

function DoacoesCrudWrapper() {
  return <CrudManager resource="donation-categories" resourceLabel="Categorias de Doação" fields={DONATION_CAT_FIELDS} />
}
