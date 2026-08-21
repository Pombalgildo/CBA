import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, ADMIN_TABS, stringifyPermissions, type Permissions } from '@/lib/auth'

// GET /api/admin/migrate-editors
// Adiciona as colunas role, permissions, ativo à tabela AdminUser (se não existirem)
// e actualiza o admin principal com role='admin' e todas as permissões.
// Esta rota é segura chamar múltiplas vezes (idempotente).
export async function GET() {
  const results: string[] = []
  const errors: string[] = []

  // 1. Adicionar colunas se não existirem (PostgreSQL e SQLite compatível)
  const columns = [
    { name: 'role',        sql: 'ALTER TABLE "AdminUser" ADD COLUMN "role" TEXT NOT NULL DEFAULT \'admin\'' },
    { name: 'permissions', sql: 'ALTER TABLE "AdminUser" ADD COLUMN "permissions" TEXT NOT NULL DEFAULT \'{}\'' },
    { name: 'ativo',       sql: 'ALTER TABLE "AdminUser" ADD COLUMN "ativo" BOOLEAN NOT NULL DEFAULT true' },
  ]

  for (const col of columns) {
    try {
      // Tenta adicionar a coluna; se já existir, ignora o erro
      await db.$executeRawUnsafe(col.sql)
      results.push(`Coluna '${col.name}' adicionada`)
    } catch (e: any) {
      // Erro esperado se a coluna já existe
      if (e.message && (e.message.includes('already exists') || e.message.includes('duplicate column'))) {
        results.push(`Coluna '${col.name}' já existe (OK)`)
      } else {
        errors.push(`Coluna '${col.name}': ${e.message}`)
      }
    }
  }

  // 2. Actualizar o admin principal com role='admin' e todas as permissões
  try {
    const allPerms: Permissions = {}
    for (const t of ADMIN_TABS) allPerms[t.key] = true
    const permsStr = stringifyPermissions(allPerms)

    // Verifica se o admin principal existe
    const existing = await db.adminUser.findUnique({ where: { username: 'admin' } })
    if (existing) {
      await db.adminUser.update({
        where: { username: 'admin' },
        data: {
          role: 'admin',
          permissions: permsStr,
          ativo: true,
        },
      })
      results.push('Admin principal actualizado (role=admin, todas as permissões)')
    } else {
      // Cria o admin principal se não existir
      await db.adminUser.create({
        data: {
          username: 'admin',
          password: hashPassword('cba2026Gpombal'),
          nome: 'Administrador CBA',
          role: 'admin',
          permissions: permsStr,
          ativo: true,
        },
      })
      results.push('Admin principal criado (username=admin, password=cba2026Gpombal)')
    }
  } catch (e: any) {
    errors.push(`Actualizar admin: ${e.message}`)
  }

  return NextResponse.json({
    success: errors.length === 0,
    message: errors.length === 0
      ? 'Migração concluída com sucesso! O painel admin agora suporta editores.'
      : 'Migração concluída com alguns erros',
    results,
    errors,
  })
}
