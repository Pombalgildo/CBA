// Cliente Supabase para upload de ficheiros
// Funciona em produção (Vercel + Supabase) e desenvolvimento (sandbox local)

import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return null

  if (!supabaseClient) {
    supabaseClient = createClient(url, key, {
      auth: { persistSession: false },
    })
  }
  return supabaseClient
}

// Verifica se o Supabase está configurado
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// Nome do bucket no Supabase Storage
export const SUPABASE_BUCKET = 'cba-uploads'

// Faz upload de um ficheiro para o Supabase Storage
// Retorna a URL pública do ficheiro
export async function uploadToSupabase(file: File | Buffer, filename: string, contentType: string): Promise<string> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase não configurado')

  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(filename, file, {
      contentType,
      upsert: false,
    })

  if (error) throw error

  // Obter URL pública
  const { data: publicUrlData } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(data.path)

  return publicUrlData.publicUrl
}
