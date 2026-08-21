// Parser de datas em português (Angola) para timestamp
// Suporta formatos como:
//   - "5 de Março de 2026"
//   - "1 de Junho de 2026"
//   - "Março de 2026" ou "Maio 2026"
//   - "14 e 15 de Agosto de 2026" (usa o primeiro dia)
//   - "2026-03-05" (ISO)
//   - "Outubro 2024 · Luanda" (eventos com sufixo)

const MESES: Record<string, number> = {
  janeiro: 0, jan: 0,
  fevereiro: 1, fev: 1,
  marco: 2, março: 2, mar: 2,
  abril: 3, abr: 3,
  maio: 4, mai: 4,
  junho: 5, jun: 5,
  julho: 6, jul: 6,
  agosto: 7, ago: 7,
  setembro: 8, set: 8,
  outubro: 9, out: 9,
  novembro: 10, nov: 10,
  dezembro: 11, dez: 11,
}

/**
 * Converte uma string de data em português para timestamp.
 * Retorna 0 se não conseguir fazer o parse.
 */
export function parseDataPT(dataStr: string | null | undefined): number {
  if (!dataStr) return 0
  const s = dataStr.toLowerCase().trim()

  // Formato: "5 de Março de 2026" ou "5 de Março, 2026" ou "5 de Março 2026"
  let m = s.match(/(\d{1,2})\s+de\s+([a-zç]+)\s+(?:de\s+)?(\d{4})/)
  if (m) {
    const dia = parseInt(m[1], 10)
    const mes = MESES[m[2]]
    const ano = parseInt(m[3], 10)
    if (mes !== undefined) return new Date(ano, mes, dia, 12, 0, 0).getTime()
  }

  // Formato: "Março de 2026" ou "Maio 2026"
  m = s.match(/([a-zç]+)\s+(?:de\s+)?(\d{4})/)
  if (m) {
    const mes = MESES[m[1]]
    const ano = parseInt(m[2], 10)
    if (mes !== undefined) return new Date(ano, mes, 1, 12, 0, 0).getTime()
  }

  // Formato ISO: "2026-03-05"
  m = s.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (m) {
    return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10), 12, 0, 0).getTime()
  }

  // Formato: "2026" (apenas ano)
  m = s.match(/^\s*(\d{4})\s*$/)
  if (m) {
    return new Date(parseInt(m[1], 10), 0, 1, 12, 0, 0).getTime()
  }

  // Fallback: tentar Date.parse nativo
  const t = Date.parse(dataStr)
  if (!isNaN(t)) return t

  return 0
}

/**
 * Formata um timestamp para o nome do mês + ano em português.
 * Ex: 1785364800000 → "Agosto 2026"
 */
export function mesAnoPT(timestamp: number): string {
  if (!timestamp) return 'Data desconhecida'
  const d = new Date(timestamp)
  const nomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  return `${nomes[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * Ordena uma lista de items por data (mais recente primeiro).
 * Items sem data parseable vão para o fim (ordenados por id descendente).
 */
export function sortByDataDesc<T extends { data?: string; date?: string; id: number }>(
  items: T[],
  dataKey: 'data' | 'date' = 'data'
): T[] {
  return [...items].sort((a, b) => {
    const da = parseDataPT(a[dataKey] as string)
    const db = parseDataPT(b[dataKey] as string)
    if (db !== da) return db - da
    // Desempate: id maior (criado mais recentemente) primeiro
    return b.id - a.id
  })
}
