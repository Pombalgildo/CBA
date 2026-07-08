'use client'
import { useState } from 'react'
import type { SiteSettings, DonationCategory } from '@/lib/types'
import { submitDonation } from '@/lib/api-client'

interface DonationModalProps {
  cat: DonationCategory | null
  iban: string
  onClose: () => void
}

export function DonationModal({ cat, iban, onClose }: DonationModalProps) {
  const [step, setStep] = useState<'metodo' | 'comprovativo' | 'sucesso'>('metodo')
  const [metodo, setMetodo] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [nome, setNome] = useState('')
  const [montante, setMontante] = useState('')
  const [observacao, setObservacao] = useState('')
  const [ficheiroNome, setFicheiroNome] = useState<string | null>(null)
  const [ficheiroUrl, setFicheiroUrl] = useState<string | null>(null)
  const [aCarregar, setACarregar] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (!cat) return null

  const copiarIBAN = () => {
    navigator.clipboard?.writeText(iban.replace(/\./g, ''))
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setErro('')
    setACarregar(true)
    try {
      const formData = new FormData()
      formData.append('file', f)
      const res = await fetch('/api/upload?public=1', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro no upload')
      setFicheiroNome(data.filename)
      setFicheiroUrl(data.url)
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setACarregar(false)
    }
  }

  const enviar = async () => {
    setErro('')
    if (!nome) { setErro('Por favor indique o seu nome.'); return }
    if (!montante) { setErro('Por favor indique o montante.'); return }
    if (!ficheiroUrl) { setErro('Por favor anexe o comprovativo.'); return }
    setEnviando(true)
    try {
      await submitDonation({
        categoria: cat.label,
        metodo: metodo || '',
        nome, montante, observacao,
        ficheiro: ficheiroNome,
      })
      setEnviando(false)
      setStep('sucesso')
    } catch {
      setEnviando(false)
      setErro('Erro ao enviar. Tente novamente.')
    }
  }

  const fechar = () => {
    setStep('metodo')
    setMetodo(null)
    setNome('')
    setMontante('')
    setObservacao('')
    setFicheiroNome(null)
    setFicheiroUrl(null)
    setErro('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) fechar() }}
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col modal-content">
        {/* Header */}
        <div className="bg-primary px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: cat.gradient }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: cat.iconSvg }} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-white text-base leading-tight">{cat.label}</h2>
              <p className="font-body text-white/60 text-xs">Convenção Baptista de Angola</p>
            </div>
          </div>
          <button onClick={fechar} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">✕</button>
        </div>

        {/* Progress bar */}
        {step !== 'sucesso' && (
          <div className="flex bg-primary/5 border-b border-border flex-shrink-0">
            <div className={`flex-1 py-2.5 text-center font-body text-xs font-semibold border-b-2 ${step === 'metodo' ? 'border-primary text-primary' : step === 'comprovativo' || step === 'sucesso' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground'}`}>
              {step === 'comprovativo' || step === 'sucesso' ? '✓ ' : ''}Método de Pagamento
            </div>
            <div className={`flex-1 py-2.5 text-center font-body text-xs font-semibold border-b-2 ${step === 'comprovativo' ? 'border-primary text-primary' : step === 'sucesso' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground'}`}>
              Enviar Comprovativo
            </div>
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {step === 'metodo' && (
            <div>
              <p className="font-body text-sm text-muted-foreground mb-1 italic border-l-4 border-accent pl-3 leading-relaxed">{cat.versiculo}</p>
              <p className="font-body text-sm text-foreground/80 mt-4 mb-5 leading-relaxed">{cat.descricao}</p>
              <p className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Escolha o método de pagamento</p>

              {/* Transferência Bancária */}
              <div
                className={`rounded-xl border-2 p-4 mb-3 cursor-pointer transition-all ${metodo === 'Transferência Bancária' ? 'border-green-500 bg-green-50' : 'border-border hover:border-green-300 bg-white'}`}
                onClick={() => setMetodo('Transferência Bancária')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-700">🏦</span>
                  <span className="font-heading font-bold text-sm text-green-700">Transferência Bancária</span>
                  {metodo === 'Transferência Bancária' && <span className="ml-auto text-green-600">✓</span>}
                </div>
                <p className="font-body text-xs text-gray-500 mb-2">Beneficiário: <span className="font-semibold text-gray-700">Convenção Baptista de Angola</span></p>
                <div className="flex items-center justify-between bg-white border border-green-200 rounded-lg px-3 py-2">
                  <span className="font-body text-xs font-semibold text-gray-800 tracking-wider break-all">{iban}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); copiarIBAN() }}
                    className="ml-2 text-green-600 hover:text-green-800 flex-shrink-0"
                  >
                    {copiado ? '✓' : '📋'}
                  </button>
                </div>
                {copiado && <p className="font-body text-xs text-green-600 mt-1">✓ IBAN copiado!</p>}
              </div>

              {/* Multicaixa Express */}
              <div
                className={`rounded-xl border-2 p-4 mb-3 cursor-pointer transition-all ${metodo === 'Multicaixa Express' ? 'border-orange-400 bg-orange-50' : 'border-border hover:border-orange-300 bg-white'}`}
                onClick={() => setMetodo('Multicaixa Express')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-500">📱</span>
                  <span className="font-heading font-bold text-sm text-orange-600">Multicaixa Express</span>
                  {metodo === 'Multicaixa Express' && <span className="ml-auto text-orange-500">✓</span>}
                </div>
                <p className="font-body text-xs text-gray-500 leading-relaxed">Efectue o pagamento via Multicaixa Express. Indique <span className="font-semibold">{cat.label}</span> no campo de referência.</p>
              </div>

              {/* PayPal */}
              <div
                className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${metodo === 'PayPal / Cartão' ? 'border-blue-400 bg-blue-50' : 'border-border hover:border-blue-300 bg-white'}`}
                onClick={() => setMetodo('PayPal / Cartão')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-600">💳</span>
                  <span className="font-heading font-bold text-sm text-blue-700">PayPal / Cartão Internacional</span>
                  {metodo === 'PayPal / Cartão' && <span className="ml-auto text-blue-600">✓</span>}
                </div>
                <p className="font-body text-xs text-gray-500 leading-relaxed">Para pagamentos com Visa, Mastercard ou PayPal.</p>
              </div>

              <button
                disabled={!metodo}
                onClick={() => setStep('comprovativo')}
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-body font-bold text-sm uppercase tracking-wider rounded-xl py-3 disabled:opacity-40"
              >
                Já Efectuei o Pagamento →
              </button>
            </div>
          )}

          {step === 'comprovativo' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">{cat.emoji}</div>
                <span className="font-body text-sm text-muted-foreground">{cat.label} · <span className="font-semibold text-foreground">{metodo}</span></span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">O seu nome *</label>
                  <input value={nome} onChange={(e) => setNome(e.target.value)} className="w-full border border-border rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-muted/30" placeholder="Ex: João Silva" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Montante *</label>
                  <input value={montante} onChange={(e) => setMontante(e.target.value)} className="w-full border border-border rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-muted/30" placeholder="Ex: 5.000 AOA / 10 USD" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Observação (opcional)</label>
                  <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} rows={2} className="w-full border border-border rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-muted/30 resize-none" placeholder="Alguma mensagem para a CBA..." />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Comprovativo *</label>
                  <label
                    className={`block border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${ficheiroNome ? 'border-green-400 bg-green-50' : 'border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40'}`}
                  >
                    {aCarregar ? (
                      <>
                        <div className="spinner mx-auto mb-2" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'hsl(150 34% 24%)' }}></div>
                        <p className="font-body text-sm text-muted-foreground">A carregar ficheiro...</p>
                      </>
                    ) : ficheiroNome ? (
                      <>
                        <div className="text-green-500 text-3xl mb-1">✓</div>
                        <p className="font-body text-sm text-green-700 font-semibold">{ficheiroNome}</p>
                        <p className="font-body text-xs text-muted-foreground">Clique para trocar</p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary text-xl">📤</div>
                        <p className="font-body text-sm font-semibold text-foreground">Anexar comprovativo</p>
                        <p className="font-body text-xs text-muted-foreground">Imagem ou PDF (máx. 10 MB)</p>
                      </>
                    )}
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} disabled={aCarregar} />
                  </label>
                </div>
                {erro && <p className="font-body text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{erro}</p>}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep('metodo')} className="flex-1 border border-border rounded-xl font-body font-semibold text-sm py-3 bg-white">← Voltar</button>
                  <button onClick={enviar} disabled={enviando} className="flex-1 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-body font-bold text-sm uppercase tracking-wide py-3 flex items-center justify-center gap-2">
                    {enviando ? <><span className="spinner"></span>A enviar...</> : '📤 Enviar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'sucesso' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto text-green-600 text-4xl">✓</div>
              <h3 className="font-heading font-bold text-xl text-foreground">Comprovativo Enviado!</h3>
              <p className="font-body text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                O seu comprovativo foi enviado com sucesso para a CBA. A equipa irá confirmar a sua oferta em breve. Que Deus abençoe a sua generosidade!
              </p>
              <blockquote className="font-body text-xs italic text-muted-foreground border-l-4 border-accent pl-3 text-left max-w-xs mx-auto mt-4 leading-relaxed">
                &ldquo;Aquele que semeia com parcimônia, com parcimônia também colherá; e aquele que semeia com generosidade, com generosidade também colherá.&ldquo; — 2 Cor 9:6
              </blockquote>
              <button onClick={fechar} className="mt-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-body font-bold text-sm uppercase tracking-wide px-8 py-3">Fechar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
