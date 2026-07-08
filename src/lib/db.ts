import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// URL precisa de ?pgbouncer=true&prepared_statements=false para o Supabase Pooler
function buildDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || ''
  if (!url) return url
  // Se a URL não tem parâmetros, adicionar os necessários para o PgBouncer
  if (!url.includes('?')) {
    return url + '?pgbouncer=true&prepared_statements=false&connection_limit=1'
  }
  // Se já tem parâmetros mas não tem pgbouncer, adicionar
  if (!url.includes('pgbouncer')) {
    return url + '&pgbouncer=true&prepared_statements=false&connection_limit=1'
  }
  return url
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: buildDatabaseUrl(),
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
