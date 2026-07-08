'use client'
import { useState, useEffect, useCallback } from 'react'
import { adminList, adminCreate, adminUpdate, adminDelete } from '@/lib/api-client'
import { ImageUpload } from './ImageUpload'

export interface FieldDef {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'image' | 'json-photos'
  options?: string[]
  required?: boolean
  placeholder?: string
  help?: string
}

interface CrudManagerProps {
  resource: string
  resourceLabel: string
  fields: FieldDef[]
  renderRow?: (item: any, onEdit: (item: any) => void, onDelete: (id: number) => void) => React.ReactNode
}

export function CrudManager({ resource, resourceLabel, fields, renderRow }: CrudManagerProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [editando, setEditando] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro('')
    try {
      const data = await adminList(resource)
      setItems(data)
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }, [resource])

  useEffect(() => { carregar() }, [carregar])

  const novo = () => {
    const empty: any = {}
    fields.forEach((f) => {
      if (f.type === 'number') empty[f.name] = 0
      else if (f.type === 'json-photos') empty[f.name] = []
      else empty[f.name] = ''
    })
    setEditando(empty)
    setShowForm(true)
  }

  const editar = (item: any) => {
    setEditando({ ...item })
    setShowForm(true)
  }

  const guardar = async (data: any) => {
    setErro('')
    try {
      if (data.id) {
        await adminUpdate(resource, data.id, data)
      } else {
        await adminCreate(resource, data)
      }
      setShowForm(false)
      setEditando(null)
      carregar()
    } catch (err: any) {
      setErro(err.message)
    }
  }

  const eliminar = async (id: number) => {
    if (!confirm('Tem a certeza que pretende eliminar este item?')) return
    try {
      await adminDelete(resource, id)
      carregar()
    } catch (err: any) {
      setErro(err.message)
    }
  }

  if (showForm && editando) {
    return (
      <CrudForm
        fields={fields}
        item={editando}
        resourceLabel={resourceLabel}
        onSave={guardar}
        onCancel={() => { setShowForm(false); setEditando(null) }}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl text-foreground">{resourceLabel}</h2>
        <button onClick={novo} className="bg-primary hover:bg-primary/90 text-white font-body font-semibold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2">
          <span className="text-lg">+</span> Adicionar
        </button>
      </div>
      {erro && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm font-body">{erro}</div>}
      {loading ? (
        <div className="text-center py-12"><div className="spinner mx-auto" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'hsl(150 30% 18%)' }}></div></div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg"><p className="font-body text-muted-foreground">Nenhum item encontrado. Clique em &ldquo;Adicionar&rdquo; para criar o primeiro.</p></div>
      ) : renderRow ? (
        <div className="space-y-3">{items.map((item) => renderRow(item, editar, eliminar))}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-border rounded-lg p-4 shadow-sm">
              {fields.filter(f => f.type === 'image').map(f => (
                item[f.name] ? <img key={f.name} src={item[f.name]} alt="" className="w-full h-32 object-cover rounded mb-3" /> : null
              ))}
              {fields.filter(f => f.type !== 'image' && f.name !== 'id').slice(0, 3).map(f => (
                <div key={f.name} className="mb-1">
                  <span className="font-body text-xs text-muted-foreground">{f.label}: </span>
                  <span className="font-body text-sm text-foreground font-medium">{String(item[f.name] || '').substring(0, 80)}</span>
                </div>
              ))}
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button onClick={() => editar(item)} className="flex-1 bg-accent/10 hover:bg-accent/20 text-primary font-body font-semibold text-xs py-2 rounded">✏️ Editar</button>
                <button onClick={() => eliminar(item.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-body font-semibold text-xs py-2 rounded">🗑️ Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CrudForm({ fields, item, resourceLabel, onSave, onCancel }: {
  fields: FieldDef[]
  item: any
  resourceLabel: string
  onSave: (data: any) => void
  onCancel: () => void
}) {
  const [data, setData] = useState<any>({ ...item })
  const [erro, setErro] = useState('')

  const set = (name: string, value: any) => setData({ ...data, [name]: value })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    for (const f of fields) {
      if (f.required && !data[f.name]) {
        setErro(`O campo "${f.label}" é obrigatório.`)
        return
      }
    }
    // Converter campos Sim/Não para boolean
    const dataFinal = { ...data }
    for (const f of fields) {
      if (f.options && f.options.length === 2 && f.options.includes('Sim') && f.options.includes('Não')) {
        if (dataFinal[f.name] === 'Sim') dataFinal[f.name] = true
        else if (dataFinal[f.name] === 'Não') dataFinal[f.name] = false
        else if (dataFinal[f.name] === undefined) dataFinal[f.name] = true
      }
    }
    onSave(dataFinal)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground font-body text-sm">← Voltar</button>
        <h2 className="font-heading font-bold text-2xl text-foreground">{item.id ? 'Editar' : 'Adicionar'} {resourceLabel}</h2>
      </div>
      {erro && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm font-body">{erro}</div>}
      <form onSubmit={submit} className="bg-white border border-border rounded-lg p-6 space-y-5 max-w-2xl">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="font-body text-sm font-semibold block mb-1.5 text-foreground">
              {f.label} {f.required && <span className="text-red-600">*</span>}
            </label>
            {f.help && <p className="font-body text-xs text-muted-foreground mb-1.5">{f.help}</p>}
            {f.type === 'text' && (
              <input
                value={data[f.name] || ''}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
                className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            )}
            {f.type === 'number' && (
              <input
                type="number"
                value={data[f.name] ?? 0}
                onChange={(e) => set(f.name, Number(e.target.value))}
                className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            )}
            {f.type === 'textarea' && (
              <textarea
                value={data[f.name] || ''}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
                rows={4}
                className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
              />
            )}
            {f.type === 'select' && (
              <select
                value={typeof data[f.name] === 'boolean' ? (data[f.name] ? 'Sim' : 'Não') : (data[f.name] || '')}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              >
                <option value="">— Seleccionar —</option>
                {f.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
            {f.type === 'image' && (
              <ImageUpload
                value={data[f.name] || ''}
                onChange={(url) => set(f.name, url)}
                placeholder={f.placeholder || 'Carregar imagem'}
                acceptPdf={f.name === 'documentoUrl' || f.name === 'link'}
              />
            )}
            {f.type === 'json-photos' && (
              <PhotoEditor value={data[f.name] || []} onChange={(val) => set(f.name, val)} />
            )}
          </div>
        ))}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button type="button" onClick={onCancel} className="flex-1 border border-border rounded-lg font-body font-semibold text-sm py-2.5 bg-white hover:bg-muted">Cancelar</button>
          <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg font-body font-bold text-sm py-2.5">💾 Guardar</button>
        </div>
      </form>
    </div>
  )
}

function PhotoEditor({ value, onChange }: { value: Array<{ url: string; legenda: string }>; onChange: (val: Array<{ url: string; legenda: string }>) => void }) {
  const [fotos, setFotos] = useState<Array<{ url: string; legenda: string }>>(Array.isArray(value) ? value : [])

  const update = (idx: number, field: 'url' | 'legenda', val: string) => {
    const novas = [...fotos]
    novas[idx] = { ...novas[idx], [field]: val }
    setFotos(novas)
    onChange(novas)
  }

  const add = () => { setFotos([...fotos, { url: '', legenda: '' }]); onChange([...fotos, { url: '', legenda: '' }]) }
  const remove = (idx: number) => { const novas = fotos.filter((_, i) => i !== idx); setFotos(novas); onChange(novas) }

  return (
    <div className="space-y-3">
      {fotos.map((foto, idx) => (
        <div key={idx} className="border border-border rounded-lg p-3 bg-muted/30">
          <div className="flex gap-2 items-start mb-2">
            {foto.url && <img src={foto.url} alt="" className="w-16 h-16 object-cover rounded shrink-0" />}
            <div className="flex-1">
              <ImageUpload value={foto.url} onChange={(url) => update(idx, 'url', url)} placeholder="Carregar foto" />
            </div>
            <button type="button" onClick={() => remove(idx)} className="text-red-600 hover:text-red-800 text-sm">✕</button>
          </div>
          <input value={foto.legenda} onChange={(e) => update(idx, 'legenda', e.target.value)} placeholder="Legenda da foto" className="w-full border border-border rounded px-2 py-1.5 font-body text-xs" />
        </div>
      ))}
      <button type="button" onClick={add} className="text-sm font-body font-semibold text-primary hover:text-primary/80">+ Adicionar foto</button>
    </div>
  )
}
