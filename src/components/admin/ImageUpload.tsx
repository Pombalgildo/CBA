'use client'
import { useState, useRef } from 'react'
import { getAdminToken } from '@/lib/api-client'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  placeholder?: string
  acceptPdf?: boolean
}

// Comprime uma imagem no browser antes do upload
// Reduz para máximo 1200px de largura e qualidade 80%
async function compressImage(file: File): Promise<File> {
  // Se não for imagem, devolve o ficheiro original
  if (!file.type.startsWith('image/')) return file
  // GIFs não devem ser comprimidos (perdem a animação)
  if (file.type === 'image/gif') return file

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 900
        let { width, height } = img

        // Manter proporção
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width
          width = MAX_WIDTH
        }
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height
          height = MAX_HEIGHT
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }

        // Fundo branco para PNGs com transparência (evita fundo preto em JPG)
        if (file.type !== 'image/png') {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, width, height)
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Converter para WebP se suportado, senão JPEG
        const mimeType = 'image/jpeg'
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }
            const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: mimeType })
            // Só usar a versão comprimida se for menor que o original
            if (compressed.size < file.size) {
              resolve(compressed)
            } else {
              resolve(file)
            }
          },
          mimeType,
          0.80 // 80% de qualidade
        )
      }
      img.onerror = () => resolve(file)
      img.src = e.target?.result as string
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

export function ImageUpload({ value, onChange, placeholder = 'Clique para carregar imagem', acceptPdf = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [erro, setErro] = useState('')
  const [progresso, setProgresso] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setErro('')
    setUploading(true)

    // Determinar se é PDF ou imagem
    const isPdf = file.type === 'application/pdf'
    if (isPdf && !acceptPdf) {
      setErro('Não é possível carregar PDFs neste campo.')
      setUploading(false)
      return
    }

    try {
      let fileToUpload = file
      if (!isPdf) {
        setProgresso('A optimizar imagem...')
        fileToUpload = await compressImage(file)
      } else {
        setProgresso('A enviar PDF...')
      }
      setProgresso(`A enviar (${Math.round(fileToUpload.size / 1024)}KB)...`)

      // 2. Upload do ficheiro
      const formData = new FormData()
      formData.append('file', fileToUpload)
      const token = getAdminToken()
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro no upload')
      onChange(data.url)
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setUploading(false)
      setProgresso('')
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const acceptAttr = acceptPdf ? 'image/*,.pdf' : 'image/*'

  return (
    <div>
      <div className="flex gap-2 items-start">
        {value && (
          value.toLowerCase().endsWith('.pdf') ? (
            <div className="w-24 h-24 rounded-lg border border-border shrink-0 flex items-center justify-center bg-red-50">
              <div className="text-center">
                <span className="text-3xl">📄</span>
                <p className="text-[10px] text-red-700 font-semibold mt-1">PDF</p>
              </div>
            </div>
          ) : (
            <img src={value} alt="Pré-visualização" loading="lazy" className="w-24 h-24 object-cover rounded-lg border border-border shrink-0" />
          )
        )}
        <label className={`flex-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[96px] ${
          uploading ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50'
        }`}>
          {uploading ? (
            <>
              <div className="spinner" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'hsl(150 34% 24%)' }}></div>
              <p className="font-body text-xs text-muted-foreground mt-2">{progresso || 'A carregar...'}</p>
            </>
          ) : value ? (
            <>
              <span className="text-2xl mb-1">📎</span>
              <p className="font-body text-xs font-semibold text-primary">Trocar ficheiro</p>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">Clique para substituir</p>
            </>
          ) : (
            <>
              <span className="text-2xl mb-1">📤</span>
              <p className="font-body text-sm font-semibold text-foreground">{placeholder}</p>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">{acceptPdf ? 'JPG, PNG, WebP, PDF (máx. 10MB)' : 'JPG, PNG, WebP (máx. 10MB)'} — optimizado automaticamente</p>
            </>
          )}
          <input ref={inputRef} type="file" accept={acceptAttr} className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
      {erro && <p className="font-body text-xs text-red-600 mt-1.5">{erro}</p>}
      {value && (
        <div className="mt-2 flex items-center gap-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 border border-border rounded px-2 py-1 font-body text-xs text-muted-foreground bg-muted/30"
            readOnly
          />
          <button type="button" onClick={() => onChange('')} className="text-red-600 hover:text-red-800 text-xs font-body font-semibold">Remover</button>
        </div>
      )}
    </div>
  )
}
