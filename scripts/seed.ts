// Seed script - popula a base de dados com conteúdo inicial
import { PrismaClient } from '@prisma/client'
import { scryptSync, randomBytes } from 'crypto'

const db = new PrismaClient()

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

async function main() {
  console.log('A iniciar seed...')

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

  // --- AdminUser ---
  await db.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashPassword('cba2026'),
      nome: 'Administrador CBA',
    },
  })

  // --- Notícias ---
  await db.newsItem.deleteMany()
  const noticias = [
    { tipo:'Evento', cor:'bg-amber-500', titulo:'Especial Abril Jovem', data:'12 de Abril de 2026', resumo:'Não perca o grande encontro alusivo ao Mês da Juventude, vamos juntos reflectir sobre Cristo nas Relações.', conteudo:'O Departamento da Juventude Baptista de Angola organiza este evento especial no mês de Abril, dedicado a todos os jovens da Convenção. Será um dia de adoração, reflexão bíblica e comunhão fraterna. O tema central é "Cristo no centro das nossas relações", abordando como os princípios cristãos devem guiar os relacionamentos na juventude actual. Contamos com a presença de pregadores convidados, momentos de louvor e partilha em grupo.', imagem:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop', ordem:1 },
    { tipo:'Seminário', cor:'bg-slate-500', titulo:'Reflexão sobre Cristo nas Relações', data:'20 de Maio de 2026', resumo:'A Direcção da CBA promove um seminário para o ensino e crescimento espiritual dos jovens.', conteudo:'Este seminário é promovido pela Direcção da Convenção Baptista de Angola e destina-se a líderes e jovens que desejam aprofundar a sua compreensão sobre como viver relações saudáveis à luz da Palavra de Deus. O programa inclui plenárias, grupos de discussão e momentos de oração.', imagem:'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=450&fit=crop', ordem:2 },
    { tipo:'Notícia', cor:'bg-primary', titulo:'Assembleia Geral da CBA realizada com sucesso', data:'5 de Março de 2026', resumo:'A Assembleia Geral da Convenção Baptista de Angola decorreu com grande participação de delegados de todo o país.', conteudo:'A Assembleia Geral da CBA reuniu delegados representantes de igrejas de todas as províncias de Angola. Durante os trabalhos foram aprovadas as contas do exercício anterior, eleita a nova direcção e debatidos os planos estratégicos para os próximos anos. O evento contou com momentos de louvor, oração e profunda comunhão entre os delegados.', imagem:'https://images.unsplash.com/photo-1560541919-d49f7c18eb90?w=800&h=450&fit=crop', ordem:0 },
    { tipo:'Conferência', cor:'bg-slate-600', titulo:'Cristo no centro das relações', data:'15 de Junho de 2026', resumo:'O Departamento da Juventude realiza uma conferência voltada à reflexão e inspiração da juventude baptista.', conteudo:'A conferência "Cristo no centro das relações" é um evento anual promovido pelo Departamento da Juventude Baptista de Angola. Reúne centenas de jovens de várias províncias para três dias de adoração, ensino bíblico e evangelização.', imagem:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=450&fit=crop', ordem:3 },
    { tipo:'Notícia', cor:'bg-primary', titulo:'Lançamento da nova Revista EBD', data:'1 de Abril de 2026', resumo:'O Departamento de Educação Religiosa e Publicações lança a nova edição da Revista da Escola Bíblica Dominical.', conteudo:'O Departamento de Educação Religiosa e Publicações da CBA tem o prazer de anunciar o lançamento da nova edição da Revista da Escola Bíblica Dominical. Esta edição traz estudos aprofundados do livro de Romanos, com aplicações práticas para a vida diária e sugestões para os professores da EBD.', imagem:'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=450&fit=crop', ordem:4 },
    { tipo:'Encontro', cor:'bg-red-600', titulo:'Encontro Nacional de Pastores', data:'10 de Julho de 2026', resumo:'A Ordem Nacional de Pastores reúne líderes de todo o país para três dias de comunhão e capacitação.', conteudo:'O Encontro Nacional de Pastores da CBA é um momento único de comunhão, partilha e capacitação para os líderes das igrejas filiadas. O programa inclui pregações, seminários sobre liderança pastoral e momentos de oração pelos desafios do ministério em Angola.', imagem:'https://images.unsplash.com/photo-1438232992991-995b671e4435?w=800&h=450&fit=crop', ordem:5 },
  ]
  for (const n of noticias) await db.newsItem.create({ data: n })

  // --- Publicações ---
  await db.publication.deleteMany()
  const publicacoes = [
    { category:'Devocional', title:'A Graça que Transforma', excerpt:'Uma reflexão sobre como a graça de Deus opera em nossas vidas de maneiras surpreendentes.', date:'Maio 2026', image:'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=300&fit=crop', ordem:0 },
    { category:'Artigo', title:'Vida em Comunidade', excerpt:'O valor de viver em comunhão como corpo de Cristo e fortalecer os laços entre irmãos.', date:'Abril 2026', image:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=300&fit=crop', ordem:1 },
    { category:'Revista EBD', title:'Estudos em Romanos', excerpt:'Material da Escola Bíblica Dominical com estudo aprofundado da carta de Paulo aos Romanos.', date:'Março 2026', image:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=300&fit=crop', ordem:2 },
    { category:'Devocional', title:'Esperança em Tempos Difíceis', excerpt:'Palavras de encorajamento e fé para enfrentar os desafios do dia a dia.', date:'Fevereiro 2026', image:'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=300&fit=crop', ordem:3 },
  ]
  for (const p of publicacoes) await db.publication.create({ data: p })

  // --- Eventos (galeria) ---
  await db.event.deleteMany()
  const eventos = [
    { categoria:'Conferências', titulo:'Conferência Nacional da CBA 2024', data:'Outubro 2024 · Luanda', capa:'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80', fotos: JSON.stringify([
      {url:'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',legenda:'Sessão plenária de abertura'},
      {url:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',legenda:'Painel de líderes'},
      {url:'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',legenda:'Momento de louvor'},
      {url:'https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&q=80',legenda:'Delegados em assembléia'},
      {url:'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',legenda:'Encerramento oficial'}
    ]), ordem:0 },
    { categoria:'Jovens', titulo:'Retiro Juvenil – Serra da Leba', data:'Agosto 2024 · Lubango', capa:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', fotos: JSON.stringify([
      {url:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',legenda:'Chegada ao retiro'},
      {url:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',legenda:'Meditação matinal'},
      {url:'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',legenda:'Louvor ao entardecer'},
      {url:'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80',legenda:'Grupos de oração'}
    ]), ordem:1 },
    { categoria:'Missões', titulo:'Missão nas Províncias – Malanje', data:'Julho 2024 · Malanje', capa:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80', fotos: JSON.stringify([
      {url:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',legenda:'Equipa de missão'},
      {url:'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80',legenda:'Baptismos realizados'},
      {url:'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80',legenda:'Distribuição de Bíblias'},
      {url:'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',legenda:'Culto ao ar livre'},
      {url:'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',legenda:'Visita às famílias'},
      {url:'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80',legenda:'Regresso em acção de graças'}
    ]), ordem:2 },
    { categoria:'Cultos', titulo:'Culto de Acção de Graças 2024', data:'Dezembro 2024 · Luanda', capa:'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&q=80', fotos: JSON.stringify([
      {url:'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&q=80',legenda:'Culto festivo'},
      {url:'https://images.unsplash.com/photo-1596466165753-80cf7ec40b72?w=800&q=80',legenda:'Coral em louvor'},
      {url:'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',legenda:'Momento de oração'}
    ]), ordem:3 },
    { categoria:'Formação', titulo:'Seminário de Liderança Pastoral', data:'Maio 2024 · Benguela', capa:'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80', fotos: JSON.stringify([
      {url:'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',legenda:'Abertura do seminário'},
      {url:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',legenda:'Aula de hermenêutica'},
      {url:'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',legenda:'Grupos de estudo'},
      {url:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',legenda:'Encerramento com certificação'}
    ]), ordem:4 },
  ]
  for (const e of eventos) await db.event.create({ data: e })

  // --- Igrejas ---
  await db.church.deleteMany()
  const igrejas = [
    { provincia:'Luanda', nome:'1ª Igreja Baptista de Luanda', morada:'Avenida Deolinda Rodrigues (Junto à Escola Che Guevara)', pastor:'Pastor João César e Pastor Kiala Alberto', gps:'-8.8147,-13.2302', ordem:0 },
    { provincia:'Luanda', nome:'2ª Igreja Baptista de Luanda', morada:'Rua dos Cooperantes nº 13 MA 153, Bairro Marcal', telefone:'+244 38 42 23', pastor:'Pastor Morais Francisco', gps:'-8.8200,-13.2400', ordem:1 },
    { provincia:'Luanda', nome:'3ª Igreja Baptista de Luanda', morada:'Rua Nicolau Gomes Spencer n. 5-E, Ingombota', telefone:'+244 33 15 40 / 33 50 83', pastor:'Pastor André Bartolomeu', gps:'-8.8100,-13.2350', ordem:2 },
    { provincia:'Luanda', nome:'Igreja Baptista do Prenda', morada:'Prenda, Luanda', gps:'-8.8300,-13.2500', ordem:3 },
    { provincia:'Luanda', nome:'Igreja Baptista Graças a Deus', morada:'Cazenga - Zona 18', pastor:'Pastor João da Silva', gps:'-8.8250,-13.2550', ordem:4 },
    { provincia:'Luanda', nome:'Igreja Baptista da Fé', morada:'Município do Sambizanga - Bairro da Petrangol/Socola', pastor:'Pastor Isaac Rodrigues', gps:'-8.8180,-13.2450', ordem:5 },
    { provincia:'Luanda', nome:'Igreja Baptista Boas Novas do Golf', morada:'Bairro do Golf, Luanda', telefone:'+244 938 15 80 94', pastor:'Moderador André António', gps:'-8.8050,-13.2380', ordem:6 },
    { provincia:'Luanda', nome:'1ª Igreja Baptista de Viana', morada:'Rua do Aviário, Viana', telefone:'+244 923 544 838', pastor:'Pastor Francisco Pedro', gps:'-8.9040,-13.3660', ordem:7 },
    { provincia:'Benguela', nome:'Primeira Igreja Baptista do Lobito', morada:'Rua de Moçambique, Restinga - Lobito', telefone:'+244 937 195 750', pastor:'Pastor Natanael Paulino', gps:'-12.3647,-13.5396', ordem:0 },
    { provincia:'Benguela', nome:'Igreja Baptista do Lírio', morada:'Bairro do Lírio - Lobito', telefone:'+244 923 53 28 27', pastor:'Pastor Adelino Camota', gps:'-12.3700,-13.5500', ordem:1 },
    { provincia:'Benguela', nome:'Igreja Baptista Damasco', morada:'Cidade de Benguela', pastor:'Pastor António P. G. Chacamba', gps:'-12.5763,-13.4055', ordem:2 },
    { provincia:'Huambo', nome:'1ª Igreja Baptista do Huambo', morada:'Bairro de Kapango - Urbano, Rua Gago Coutinho', telefone:'+244 923 108 334', pastor:'Pastor Mateus Justino Chaves', gps:'-12.7756,-15.7394', ordem:0 },
    { provincia:'Huambo', nome:'3ª Igreja Baptista do Huambo', morada:'Cidade Baixa, Rua Vicente Ferreira', pastor:'Pastor Mateus Justino Chaves', gps:'-12.7800,-15.7450', ordem:1 },
    { provincia:'Huíla', nome:'Igreja Baptista Monte Sinai', morada:'Bairro Chioco, Lubango', pastor:'Pastor Avelino Pedro', gps:'-14.9177,-13.4922', ordem:0 },
    { provincia:'Huíla', nome:'2ª Igreja Baptista do Lubango', morada:'Lubango', telefone:'+244 261 224 774', pastor:'Líder Salomão Muhongo Soares', gps:'-14.9200,-13.4950', ordem:1 },
    { provincia:'Bié', nome:'1ª Igreja Baptista do Kuito', morada:'Rua Serpa Pinto, Bairro Cantiflas, Kuito', telefone:'+244 923 250 031', pastor:'Pastor Paulino Cativa Chimbenda Moleco', gps:'-12.3870,-16.9410', ordem:0 },
    { provincia:'Malanje', nome:'1ª Igreja Baptista de Malange', morada:'Bairro Canambua - Malange', gps:'-9.5399,-16.3411', ordem:0 },
    { provincia:'Malanje', nome:'2ª Igreja Baptista de Malange', morada:'Bairro da Quizanga, zona 8', telefone:'+244 925096828', pastor:'Pastor Manuel Joaquim Clemente', gps:'-9.5420,-16.3430', ordem:1 },
    { provincia:'Lunda-Norte', nome:'Igreja Baptista de Cafunfo', morada:'Rua Neves Bendinho, Bairro do Aeroporto, Cafunfo', telefone:'+244 926 45 77 85', pastor:'Pastor Francisco Guilherme Luís', gps:'-8.7749,-18.5965', ordem:0 },
    { provincia:'Moxico', nome:'1ª Igreja Baptista do Luena', morada:'Luena', pastor:'Pastor João Dinis Calimbue Cassanga', gps:'-11.7885,-19.9170', ordem:0 },
    { provincia:'Namibe', nome:'1ª Igreja Baptista do Namibe', morada:'Bairro Plato, Namibe', pastor:'Pastor Docas Marcolino Neco', gps:'-15.1961,-12.1522', ordem:0 },
    { provincia:'Cuanza-Sul', nome:'Igreja Baptista Rio de Água da Vida', morada:'Sumbe', pastor:'Pastor José João Zamba', gps:'-11.2081,-13.8478', ordem:0 },
  ]
  for (const ig of igrejas) await db.church.create({ data: ig })

  // --- Ministérios ---
  await db.ministry.deleteMany()
  const ministerios = [
    { title:'Departamento de Evangelismo e Missões', description:'Proclamando o evangelho e enviando missionários a todo o país.', image:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop', ordem:0 },
    { title:'Departamento de Educação Religiosa e Publicações', description:'Promovendo a educação bíblica e produção de material cristão.', image:'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop', ordem:1 },
    { title:'Departamento de Educação Teológica', description:'Formando líderes e pastores com sólida base teológica.', image:'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop', ordem:2 },
    { title:'Ordem Nacional de Pastores', description:'Fortalecendo e apoiando os pastores em todo o território nacional.', image:'https://images.unsplash.com/photo-1438232992991-995b671e4435?w=600&h=400&fit=crop', ordem:3 },
    { title:'Departamento de Acção Social', description:'Servindo a comunidade com amor e solidariedade cristã.', image:'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop', ordem:4 },
    { title:'Departamento da União Feminina Missionária Baptista de Angola', description:'Unidas em comunhão, missão e serviço ao Senhor.', image:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop', ordem:5 },
    { title:'Departamento da Juventude Baptista de Angola', description:'Fortalecendo e inspirando a juventude baptista angolana.', image:'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop', ordem:6 },
    { title:'Departamento da União Masculina Missionária Baptista de Angola', description:'Unidos em crescimento espiritual e serviço ao Reino de Deus.', image:'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop', ordem:7 },
    { title:'Departamento de Comunicação e Imagem', description:'Comunicando a mensagem da C.B.A com excelência e criatividade.', image:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', ordem:8 },
  ]
  for (const m of ministerios) await db.ministry.create({ data: m })

  // --- Categorias de doação ---
  await db.donationCategory.deleteMany()
  const doacoes = [
    { label:'Oferta', emoji:'🕊️', descricao:'A sua oferta sustenta o ministério local, apoia famílias necessitadas e financia actividades da convenção.', versiculo:'"Cada um dê conforme determinou em seu coração, não com tristeza nem por obrigação, pois Deus ama quem dá com alegria." — 2 Coríntios 9:7', gradient:'linear-gradient(135deg,#f59e0b,#facc15)', barGrad:'linear-gradient(to right,#f59e0b,#facc15)', iconSvg:'<path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>', ordem:0 },
    { label:'Apoiar uma Causa', emoji:'❤️', descricao:'Contribua para causas sociais apoiadas pela CBA: alimentação, educação cristã e assistência a famílias carenciadas.', versiculo:'"Aquele que tem bens deste mundo e vê seu irmão em necessidade, mas fecha o seu coração, como pode o amor de Deus habitar nele?" — 1 João 3:17', gradient:'linear-gradient(135deg,#f43f5e,#fb7185)', barGrad:'linear-gradient(to right,#f43f5e,#fb7185)', iconSvg:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>', ordem:1 },
    { label:'Patrocinar Missões', emoji:'🌍', descricao:'Ajude a financiar missionários e equipas que levam o Evangelho a regiões remotas de Angola e além-fronteiras.', versiculo:'"Como, pois, invocarão aquele em quem não creram? E como ouvirão sem que haja quem pregue?" — Romanos 10:14', gradient:'linear-gradient(135deg,#1a3a2a,#059669)', barGrad:'linear-gradient(to right,#1a3a2a,#059669)', iconSvg:'<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>', ordem:2 },
  ]
  for (const d of doacoes) await db.donationCategory.create({ data: d })

  console.log('Seed concluído com sucesso!')
  console.log('Login admin: username=admin  password=cba2026')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
