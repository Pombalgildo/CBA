// Deploy script — executa prisma db push + seed na base de dados de produção
// Usado automaticamente pela Vercel durante o build, ou manualmente com: bun run scripts/deploy-init.ts

import { PrismaClient } from '@prisma/client'
import { scryptSync, randomBytes } from 'crypto'

const db = new PrismaClient()

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

async function main() {
  console.log('A inicializar base de dados de produção...')

  // --- SiteSetting (singleton) ---
  await db.siteSetting.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      siteTitle: 'Convenção Baptista de Angola',
      siteShortName: 'C.B.A',
      heroTitle: 'Bem-vindo à Convenção Baptista de Angola',
      heroSubtitle: 'Uma comunidade de fé, amor e esperança',
      heroImage: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&h=500&fit=crop',
      logoUrl: 'https://media.base44.com/images/public/6a00a570762307f2d561e2c0/a3754e789_LOGOCBASEMFUNDO.png',
      fundacao: '25 de Junho de 1940',
      reconhecimento: 'Reconhecida pelo Governo de Angola através do Decreto Executivo n.º 9, Diário da República n.º 71, de 24 de Janeiro de 1987',
      tema: 'Uma CBA Comprometida com um Ensino Metodológico, Progressivo e Multiplicador',
      divisa: 'Mateus 28.18-20',
      endereco: 'Luanda, Angola',
      telefone: '+244 923 000 000',
      email: 'info@cba-angola.org',
      horarioCultos: 'Domingo: 9h-12h | Quarta: 18h-20h',
      iban: 'AO06.0051.0000.8338.4538.1017.7',
      copyright: '© 2026 Convenção Baptista de Angola (C.B.A). Todos os direitos reservados.',
    },
  })

  // --- AdminUser (cria apenas se não existir) ---
  const existingAdmin = await db.adminUser.findUnique({ where: { username: 'admin' } })
  if (!existingAdmin) {
    await db.adminUser.create({
      data: {
        username: 'admin',
        password: hashPassword('cba2026'),
        nome: 'Administrador CBA',
      },
    })
    console.log('Admin criado: admin / cba2026')
  } else {
    console.log('Admin já existe, a saltar...')
  }

  // Verificar se já existem notícias (não fazer seed duplicado)
  const newsCount = await db.newsItem.count()
  if (newsCount === 0) {
    console.log('A carregar dados iniciais...')
    // Apenas criar dados iniciais se a BD estiver vazia
    // Para um deploy limpo, você pode importar o conteúdo completo de scripts/seed.ts
    await db.ministry.createMany({
      data: [
        { title: 'Departamento de Evangelismo e Missões', description: 'Proclamando o evangelho e enviando missionários a todo o país.', ordem: 0 },
        { title: 'Departamento de Educação Religiosa e Publicações', description: 'Promovendo a educação bíblica e produção de material cristão.', ordem: 1 },
        { title: 'Departamento de Educação Teológica', description: 'Formando líderes e pastores com sólida base teológica.', ordem: 2 },
      ],
    })
    console.log('Dados iniciais carregados.')
  } else {
    console.log(`Base de dados já contém ${newsCount} notícias, a saltar seed completo.`)
  }

  console.log('✅ Inicialização concluída com sucesso!')
}

main()
  .catch((e) => { console.error('❌ Erro na inicialização:', e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
