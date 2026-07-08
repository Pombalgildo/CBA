import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

// GET /api/init — inicializa a base de dados de produção com dados iniciais
export async function GET() {
  const results: string[] = []
  const errors: string[] = []

  // 1. SiteSetting
  try {
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
        logoUrl: '/logo-cba.png',
        fundacao: '25 de Junho de 1940',
        reconhecimento: 'Reconhecida pelo Governo de Angola através do Decreto Executivo n.º 9',
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
    results.push('SiteSetting criado')
  } catch (e: any) {
    errors.push(`SiteSetting: ${e.message}`)
  }

  // 2. AdminUser
  try {
    const existingAdmin = await db.adminUser.findUnique({ where: { username: 'admin' } })
    if (!existingAdmin) {
      await db.adminUser.create({
        data: { username: 'admin', password: hashPassword('cba2026Gpombal'), nome: 'Administrador CBA' },
      })
      results.push('Admin criado (admin / cba2026Gpombal)')
    } else {
      results.push('Admin ja existe')
    }
  } catch (e: any) {
    errors.push(`AdminUser: ${e.message}`)
  }

  // 3. Noticias
  try {
    const newsCount = await db.newsItem.count()
    if (newsCount === 0) {
      await db.newsItem.createMany({ data: [
        { tipo:'Notícia', cor:'bg-primary', titulo:'Assembleia Geral da CBA realizada com sucesso', data:'5 de Março de 2026', resumo:'A Assembleia Geral da CBA decorreu com grande participação.', conteudo:'A Assembleia Geral da CBA reuniu delegados de todas as províncias.', imagem:'https://images.unsplash.com/photo-1560541919-d49f7c18eb90?w=800&h=450&fit=crop', ordem:0 },
        { tipo:'Evento', cor:'bg-amber-500', titulo:'Especial Abril Jovem', data:'12 de Abril de 2026', resumo:'Grande encontro do Mês da Juventude.', conteudo:'Evento especial do Departamento da Juventude.', imagem:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop', ordem:1 },
        { tipo:'Seminário', cor:'bg-slate-500', titulo:'Reflexão sobre Cristo nas Relações', data:'20 de Maio de 2026', resumo:'Seminário para crescimento espiritual.', conteudo:'Seminário promovido pela CBA.', imagem:'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=450&fit=crop', ordem:2 },
        { tipo:'Conferência', cor:'bg-slate-600', titulo:'Cristo no centro das relações', data:'15 de Junho de 2026', resumo:'Conferência para a juventude.', conteudo:'Conferência anual da Juventude Baptista.', imagem:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=450&fit=crop', ordem:3 },
        { tipo:'Notícia', cor:'bg-primary', titulo:'Lançamento da nova Revista EBD', data:'1 de Abril de 2026', resumo:'Nova edição da Revista EBD.', conteudo:'Nova revista da Escola Bíblica Dominical.', imagem:'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=450&fit=crop', ordem:4 },
        { tipo:'Encontro', cor:'bg-red-600', titulo:'Encontro Nacional de Pastores', data:'10 de Julho de 2026', resumo:'Encontro de líderes.', conteudo:'Encontro Nacional de Pastores.', imagem:'https://images.unsplash.com/photo-1438232992991-995b671e4435?w=800&h=450&fit=crop', ordem:5 },
      ]})
      results.push('6 noticias criadas')
    } else {
      results.push(`${newsCount} noticias ja existem`)
    }
  } catch (e: any) {
    errors.push(`NewsItem: ${e.message}`)
  }

  // 4. Publicacoes
  try {
    const pubCount = await db.publication.count()
    if (pubCount === 0) {
      await db.publication.createMany({ data: [
        { category:'Devocional', title:'A Graça que Transforma', excerpt:'Reflexão sobre a graça.', date:'Maio 2026', image:'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=300&fit=crop', ordem:0 },
        { category:'Artigo', title:'Vida em Comunidade', excerpt:'Comunhão como corpo de Cristo.', date:'Abril 2026', image:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=300&fit=crop', ordem:1 },
        { category:'Revista EBD', title:'Estudos em Romanos', excerpt:'Estudo de Romanos.', date:'Março 2026', image:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=300&fit=crop', ordem:2 },
        { category:'Devocional', title:'Esperança em Tempos Difíceis', excerpt:'Encorajamento e fé.', date:'Fevereiro 2026', image:'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=300&fit=crop', ordem:3 },
      ]})
      results.push('4 publicacoes criadas')
    } else {
      results.push(`${pubCount} publicacoes ja existem`)
    }
  } catch (e: any) {
    errors.push(`Publication: ${e.message}`)
  }

  // 5. Eventos
  try {
    const eventCount = await db.event.count()
    if (eventCount === 0) {
      await db.event.createMany({ data: [
        { categoria:'Conferências', titulo:'Conferência Nacional 2024', data:'Outubro 2024 · Luanda', capa:'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80', fotos: JSON.stringify([{url:'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',legenda:'Sessão plenária'}]), ordem:0 },
        { categoria:'Jovens', titulo:'Retiro Juvenil – Serra da Leba', data:'Agosto 2024 · Lubango', capa:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', fotos: JSON.stringify([{url:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',legenda:'Chegada'}]), ordem:1 },
        { categoria:'Missões', titulo:'Missão nas Províncias – Malanje', data:'Julho 2024 · Malanje', capa:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80', fotos: JSON.stringify([{url:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',legenda:'Equipa'}]), ordem:2 },
      ]})
      results.push('3 eventos criados')
    } else {
      results.push(`${eventCount} eventos ja existem`)
    }
  } catch (e: any) {
    errors.push(`Event: ${e.message}`)
  }

  // 6. Igrejas
  try {
    const churchCount = await db.church.count()
    if (churchCount === 0) {
      await db.church.createMany({ data: [
        { provincia:'Luanda', nome:'1ª Igreja Baptista de Luanda', morada:'Avenida Deolinda Rodrigues', pastor:'Pastor João César', gps:'-8.8147,-13.2302', ordem:0 },
        { provincia:'Luanda', nome:'2ª Igreja Baptista de Luanda', morada:'Rua dos Cooperantes nº 13', telefone:'+244 38 42 23', pastor:'Pastor Morais Francisco', gps:'-8.8200,-13.2400', ordem:1 },
        { provincia:'Benguela', nome:'Primeira Igreja Baptista do Lobito', morada:'Rua de Moçambique', telefone:'+244 937 195 750', pastor:'Pastor Natanael Paulino', gps:'-12.3647,-13.5396', ordem:0 },
        { provincia:'Huambo', nome:'1ª Igreja Baptista do Huambo', morada:'Bairro de Kapango', telefone:'+244 923 108 334', pastor:'Pastor Mateus Justino', gps:'-12.7756,-15.7394', ordem:0 },
      ]})
      results.push('4 igrejas criadas')
    } else {
      results.push(`${churchCount} igrejas ja existem`)
    }
  } catch (e: any) {
    errors.push(`Church: ${e.message}`)
  }

  // 7. Ministerios
  try {
    const minCount = await db.ministry.count()
    if (minCount === 0) {
      await db.ministry.createMany({ data: [
        { title:'Departamento de Evangelismo e Missões', description:'Proclamando o evangelho.', ordem:0 },
        { title:'Departamento de Educação Religiosa', description:'Educação bíblica.', ordem:1 },
        { title:'Departamento de Educação Teológica', description:'Formando líderes.', ordem:2 },
        { title:'Ordem Nacional de Pastores', description:'Apoiando os pastores.', ordem:3 },
        { title:'Departamento de Acção Social', description:'Servindo a comunidade.', ordem:4 },
        { title:'União Feminina Missionária', description:'Unidas em missão.', ordem:5 },
        { title:'Juventude Baptista de Angola', description:'Fortalecendo a juventude.', ordem:6 },
        { title:'União Masculina Missionária', description:'Unidos em crescimento.', ordem:7 },
        { title:'Departamento de Comunicação e Imagem', description:'Comunicando com excelência.', ordem:8 },
      ]})
      results.push('9 ministerios criados')
    } else {
      results.push(`${minCount} ministerios ja existem`)
    }
  } catch (e: any) {
    errors.push(`Ministry: ${e.message}`)
  }

  // 8. Categorias de doacao
  try {
    const donCount = await db.donationCategory.count()
    if (donCount === 0) {
      await db.donationCategory.createMany({ data: [
        { label:'Oferta', emoji:'🕊️', descricao:'Sustenta o ministério local.', versiculo:'2 Cor 9:7', gradient:'linear-gradient(135deg,#f59e0b,#facc15)', barGrad:'linear-gradient(to right,#f59e0b,#facc15)', iconSvg:'<path d="M20 12v10H4V12"/>', ordem:0 },
        { label:'Apoiar uma Causa', emoji:'❤️', descricao:'Causas sociais.', versiculo:'1 João 3:17', gradient:'linear-gradient(135deg,#f43f5e,#fb7185)', barGrad:'linear-gradient(to right,#f43f5e,#fb7185)', iconSvg:'<path d="M19 14l-7 7"/>', ordem:1 },
        { label:'Patrocinar Missões', emoji:'🌍', descricao:'Financiar missionários.', versiculo:'Rom 10:14', gradient:'linear-gradient(135deg,#1a3a2a,#059669)', barGrad:'linear-gradient(to right,#1a3a2a,#059669)', iconSvg:'<circle cx="12" cy="12" r="10"/>', ordem:2 },
      ]})
      results.push('3 categorias de doacao criadas')
    } else {
      results.push(`${donCount} categorias de doacao ja existem`)
    }
  } catch (e: any) {
    errors.push(`DonationCategory: ${e.message}`)
  }

  // 9. Secções Quem Somos
  try {
    const qsCount = await db.quemSomosSection.count()
    if (qsCount === 0) {
      await db.quemSomosSection.createMany({ data: [
        { slug: 'visao-e-valores', label: 'Visão e Valores', icon: '🎯', title: 'Visão e Valores', preview: 'A Convenção Baptista de Angola tem uma visão clara de ser uma convenção missionária que proclama o Evangelho de Jesus Cristo a toda Angola e ao mundo. Os nossos valores fundamentais guiam todas as nossas acções e decisões: fidelidade às Escrituras Sagradas, compromisso com a missão evangelística, unidade na diversidade, excelência no serviço, transparência e integridade.', full: 'Visão: Ser uma convenção missionária que proclama o Evangelho de Jesus Cristo a toda Angola e ao mundo, formando discípulos e plantando igrejas em todas as províncias.\n\nMissão: Proclamar o Evangelho, formar líderes cristãos, promover a educação cristã e servir a comunidade em nome de Jesus Cristo.\n\nValores Fundamentais:\n• Fidelidade às Escrituras Sagradas\n• Compromisso com a missão evangelística\n• Unidade na diversidade\n• Excelência no serviço\n• Transparência e integridade', downloadLabel: 'Baixar Documento Completo', ordem: 0 },
        { slug: 'historial', label: 'Historial', icon: '📖', title: 'Historial', preview: 'A Convenção Baptista de Angola (CBA) tem uma história rica de fé, serviço e missão no território angolano. Fundada por missionários baptistas que chegaram a Angola no século XIX, a CBA cresceu para se tornar uma das principais organizações protestantes do país.', full: 'A 59ª Assembleia Geral, realizada no Huambo, no Colégio Baptista Ocikembe, marcou um momento importante na história da CBA, com a adopção de um plano estratégico que guia as acções da instituição para os próximos anos. Hoje, a CBA congrega centenas de igrejas em todo o território nacional, unidas pela fé em Jesus Cristo e pelo compromisso com a missão do Evangelho em Angola e no mundo.', downloadLabel: 'Baixar Historial Completo', ordem: 1 },
        { slug: 'declaracao-doutrinaria', label: 'Declaração Doutrinária de Fé', icon: '📄', title: 'Declaração Doutrinária de Fé', preview: 'Os discípulos de Jesus Cristo que vieram a ser designados pelo nome "Baptista" caracterizavam-se pela sua fidelidade às Escrituras e por isso só recebiam nas suas comunidades, como membros actuantes, pessoas convertidas pelo Espírito Santo de Deus.', full: 'As Escrituras Sagradas, o Antigo e o Novo Testamento, foram dadas por inspiração divina. Elas constituem a única regra suficiente, certa e infalível de fé e prática. Deus é um Ser espiritual, eterno, inteligente e perfeito. É o Criador, Conservador e Governador de todas as coisas. Jesus Cristo é o Filho eterno de Deus. No seu nascimento virginal uniram-se as duas naturezas, divina e humana, numa só Pessoa.', downloadLabel: 'Baixar Declaração Completa', ordem: 2 },
        { slug: 'pacto', label: 'Pacto das Igrejas Baptistas', icon: '📕', title: 'Pacto das Igrejas Baptistas', preview: 'Tendo sido levados pelo Espírito Santo a aceitar a Jesus Cristo como único e suficiente Salvador, e baptizados, sob profissão de fé, decidimo-nos firmar o seguinte Pacto: comprometemo-nos a andar sempre unidos no amor cristão; trabalhar para que esta igreja cresça no conhecimento da Palavra, na santidade, no conforto mútuo e na espiritualidade.', full: 'Comprometemo-nos a manter uma devoção particular; a evitar e condenar todos os vícios; a educar religiosamente os nossos filhos; a procurar a salvação de todo o mundo. Comprometemo-nos a ser cuidadosos na nossa vida, a influenciar os outros pelo bom exemplo, a apoiar e encorajar todos os projectos legítimos da Igreja.', downloadLabel: 'Baixar Pacto Completo', ordem: 3 },
        { slug: 'baptistas', label: 'Quem são os Baptistas', icon: '👥', title: 'Quem são os Baptistas', preview: 'Os Baptistas têm muitas convicções em comum com outros cristãos: acreditam em Deus como Criador, em Jesus Cristo como Filho de Deus encarnado e Salvador, e no Espírito Santo como guia sempre presente.', full: 'Os Baptistas crêem que somente os que confessam a fé em Jesus Cristo devem ser baptizados, por imersão. Crêem na autonomia da Igreja local, na separação entre a Igreja e o Estado, e na liberdade religiosa.', downloadLabel: 'Baixar Documento Completo', ordem: 4 },
        { slug: 'estatuto', label: 'Estatuto da CBA', icon: '🏛️', title: 'Estatuto da CBA', preview: 'O estatuto oficial da Convenção Baptista de Angola está em processo de digitalização e será disponibilizado em breve na sua versão completa.', full: '', downloadLabel: 'Baixar Estatuto Completo', ordem: 5 },
        { slug: 'plano-estrategico', label: 'Plano Estratégico da CBA 2026-2027', icon: '🎯', title: 'Plano Estratégico CBA 2026-2027', preview: 'A 59ª Assembleia Geral da CBA recomendou à direcção envidar esforços no sentido de elaborar um plano estratégico que conduzirá as acções da Instituição nos próximos anos. Visão: Ser uma convenção missionária que proclama o Evangelho de Jesus Cristo a toda Angola e ao mundo, formando discípulos e plantando igrejas em todas as províncias.', full: 'Missão: Proclamar o Evangelho, formar líderes cristãos, promover a educação cristã e servir a comunidade em nome de Jesus Cristo. Valores Fundamentais: Fidelidade às Escrituras Sagradas; Compromisso com a missão evangelística; Unidade na diversidade; Excelência no serviço; Transparência e integridade.', downloadLabel: 'Baixar Plano Estratégico', ordem: 6 },
      ]})
      results.push('7 secções Quem Somos criadas')
    } else {
      results.push(`${qsCount} secções Quem Somos ja existem`)
    }
  } catch (e: any) {
    errors.push(`QuemSomosSection: ${e.message}`)
  }

  // 10. Avisos Urgentes (exemplo)
  try {
    const avisoCount = await db.urgentNotice.count()
    if (avisoCount === 0) {
      await db.urgentNotice.createMany({ data: [
        { tipo: 'Anúncio', titulo: 'Assembleia Geral Extraordinária', conteudo: 'Informamos a todos os pastores e delegados que a Assembleia Geral Extraordinária da CBA realizar-se-á no dia 15 de Agosto de 2026, no Colégio Baptista Ocikembe, Huambo. A presença de todos os delegados é obrigatória.', data: '5 de Julho de 2026', cor: 'bg-red-600', ativo: true, ordem: 0 },
        { tipo: 'Obituário', titulo: 'Faleceu o Pastor Emérito João Silva', conteudo: 'Com profundo pesar informamos o falecimento do Pastor Emérito João Silva, ocorrido no dia 3 de Julho de 2026. O funeral realizar-se-á no dia 5 de Julho, no Cemitério do Alto das Cruzes. Os cultos fúnebres decorrerão na 1ª Igreja Baptista de Luanda.', data: '4 de Julho de 2026', cor: 'bg-slate-600', ativo: true, ordem: 1 },
      ]})
      results.push('2 avisos urgentes de exemplo criados')
    } else {
      results.push(`${avisoCount} avisos urgentes ja existem`)
    }
  } catch (e: any) {
    errors.push(`UrgentNotice: ${e.message}`)
  }

  return NextResponse.json({
    success: errors.length === 0,
    message: errors.length === 0 ? 'Base de dados inicializada com sucesso!' : 'Concluido com alguns erros',
    results,
    errors,
  })
}
