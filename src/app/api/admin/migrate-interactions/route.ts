import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/migrate-interactions
// Cria as tabelas Like e Comment na base de dados (idempotente).
// Chamar depois de fazer deploy para garantir que as tabelas existem.
export async function GET() {
  const results: string[] = []
  const errors: string[] = []

  // Verifica se a tabela Like já existe
  try {
    await db.like.count()
    results.push('Tabela Like já existe (OK)')
  } catch (e: any) {
    // Se não existe, o Prisma cria automaticamente no próximo push.
    // Aqui tentamos criar via SQL directo como fallback.
    try {
      await db.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Like" (
          id SERIAL PRIMARY KEY,
          "itemType" TEXT NOT NULL,
          "itemId" INTEGER NOT NULL,
          "fingerprint" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Like_itemType_itemId_fingerprint_key" UNIQUE ("itemType", "itemId", "fingerprint")
        )
      `)
      await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Like_itemType_itemId_idx" ON "Like"("itemType", "itemId")`)
      results.push('Tabela Like criada')
    } catch (e2: any) {
      errors.push(`Like: ${e2.message}`)
    }
  }

  // Verifica se a tabela Comment já existe
  try {
    await db.comment.count()
    results.push('Tabela Comment já existe (OK)')
  } catch (e: any) {
    try {
      await db.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Comment" (
          id SERIAL PRIMARY KEY,
          "itemType" TEXT NOT NULL,
          "itemId" INTEGER NOT NULL,
          "nome" TEXT,
          "conteudo" TEXT NOT NULL,
          "estado" TEXT NOT NULL DEFAULT 'pendente',
          "fingerprint" TEXT NOT NULL,
          "resposta" TEXT,
          "respostaData" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL
        )
      `)
      await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Comment_itemType_itemId_estado_idx" ON "Comment"("itemType", "itemId", "estado")`)
      results.push('Tabela Comment criada')
    } catch (e2: any) {
      errors.push(`Comment: ${e2.message}`)
    }
  }

  return NextResponse.json({
    success: errors.length === 0,
    message: errors.length === 0
      ? 'Migração de interacções concluída! Sistema de likes e comentários activo.'
      : 'Migração concluída com alguns erros',
    results,
    errors,
  })
}
