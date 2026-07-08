import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

// GET /api/reset-admin — recria o utilizador admin com a password actual
export async function GET() {
  try {
    // Apagar o admin existente
    await db.adminUser.deleteMany({ where: { username: 'admin' } })
    
    // Criar novo admin com password correcta
    const admin = await db.adminUser.create({
      data: {
        username: 'admin',
        password: hashPassword('cba2026Gpombal'),
        nome: 'Administrador CBA',
      },
    })
    
    // Testar a password
    const { verifyPassword } = await import('@/lib/auth')
    const testResult = verifyPassword('cba2026Gpombal', admin.password)
    
    return NextResponse.json({
      success: true,
      message: 'Admin recriado com sucesso',
      adminId: admin.id,
      username: admin.username,
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
