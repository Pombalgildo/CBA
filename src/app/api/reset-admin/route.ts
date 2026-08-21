import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, ADMIN_TABS, stringifyPermissions, type Permissions } from '@/lib/auth'

// GET /api/reset-admin — recria o utilizador admin com a password actual
export async function GET() {
  try {
    // Apagar o admin existente
    await db.adminUser.deleteMany({ where: { username: 'admin' } })

    // Todas as permissões true para o admin principal
    const allPerms: Permissions = {}
    for (const t of ADMIN_TABS) allPerms[t.key] = true

    // Criar novo admin com password correcta, role=admin, todas as permissões
    const admin = await db.adminUser.create({
      data: {
        username: 'admin',
        password: hashPassword('cba2026Gpombal'),
        nome: 'Administrador CBA',
        role: 'admin',
        permissions: stringifyPermissions(allPerms),
        ativo: true,
      },
    })

    // Testar a password
    const { verifyPassword } = await import('@/lib/auth')
    const testResult = verifyPassword('cba2026Gpombal', admin.password)

    return NextResponse.json({
      success: true,
      message: 'Admin recriado com sucesso (role=admin, todas as permissões)',
      adminId: admin.id,
      username: admin.username,
      role: admin.role,
      passwordTest: testResult ? 'OK' : 'FALHOU',
      passwordLength: admin.password.length,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
