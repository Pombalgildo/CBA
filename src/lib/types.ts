// Tipos TypeScript partilhados e dados estáticos

export interface SiteSettings {
  id: string
  siteTitle: string
  siteShortName: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  logoUrl: string
  fundacao: string
  reconhecimento: string
  tema: string
  divisa: string
  endereco: string
  telefone: string
  email: string
  horarioCultos: string
  iban: string
  copyright: string
  liveActive: boolean
  liveUrl: string | null
  liveTitle: string
  cultoDomingoEBD: string
  cultoDomingoAdoracao: string
  cultoQuartaEstudo: string
  cultoSextaOracao: string
}

export interface QuemSomosSection {
  id: number
  slug: string
  label: string
  icon: string
  title: string
  preview: string
  full: string | null
  downloadLabel: string
  documentoUrl: string | null
  ordem: number
}

export interface UrgentNotice {
  id: number
  tipo: string
  titulo: string
  conteudo: string
  data: string
  cor: string
  imagem: string | null
  link: string | null
  ativo: boolean
  ordem: number
}

export interface NewsItem {
  id: number
  tipo: string
  cor: string
  titulo: string
  data: string
  resumo: string
  conteudo: string
  imagem: string
  videoUrl: string | null
  ordem: number
}

export interface Publication {
  id: number
  category: string
  title: string
  excerpt: string
  date: string
  image: string
  videoUrl: string | null
  ordem: number
}

export interface EventFoto {
  url: string
  legenda: string
}

export interface EventItem {
  id: number
  categoria: string
  titulo: string
  data: string
  capa: string
  fotos: EventFoto[]
  ordem: number
}

export interface Church {
  id: number
  provincia: string
  nome: string
  morada: string | null
  telefone: string | null
  pastor: string | null
  email: string | null
  gps: string | null
  ordem: number
}

export interface Ministry {
  id: number
  title: string
  description: string
  image: string | null
  ordem: number
}

export interface DonationCategory {
  id: number
  label: string
  emoji: string
  descricao: string
  versiculo: string
  gradient: string
  barGrad: string
  iconSvg: string
  ordem: number
}

export interface ContactMessage {
  id: number
  tipo: string
  nome: string
  email: string
  mensagem: string
  lida: boolean
  createdAt: string
}

export interface DonationProof {
  id: number
  categoria: string
  metodo: string
  nome: string
  montante: string
  observacao: string | null
  ficheiro: string | null
  confirmado: boolean
  createdAt: string
}

export interface SiteContent {
  settings: SiteSettings | null
  news: NewsItem[]
  publications: Publication[]
  events: EventItem[]
  churches: Church[]
  ministries: Ministry[]
  donationCats: DonationCategory[]
  quemSomosSections: QuemSomosSection[]
  urgentNotices: UrgentNotice[]
}

// Lista de províncias de Angola (com emojis) — usada na pesquisa de igrejas
export const PROVINCIAS_LIST = [
  { nome: 'Luanda', emoji: '🏙️' },
  { nome: 'Benguela', emoji: '🌊' },
  { nome: 'Huambo', emoji: '⛰️' },
  { nome: 'Huíla', emoji: '🌿' },
  { nome: 'Bié', emoji: '🌾' },
  { nome: 'Malanje', emoji: '🦅' },
  { nome: 'Lunda-Norte', emoji: '💎' },
  { nome: 'Moxico', emoji: '🌅' },
  { nome: 'Namibe', emoji: '🏜️' },
  { nome: 'Cuanza-Sul', emoji: '🌊' },
  { nome: 'Cabinda', emoji: '🛢️' },
  { nome: 'Zaire', emoji: '🌿' },
  { nome: 'Uíge', emoji: '🌿' },
  { nome: 'Bengo', emoji: '🌴' },
  { nome: 'Cuanza-Norte', emoji: '🏞️' },
  { nome: 'Lunda-Sul', emoji: '💎' },
  { nome: 'Cuando Cubango', emoji: '🦁' },
  { nome: 'Cunene', emoji: '🐘' },
]

export function getProvinciaEmoji(nome: string): string {
  return PROVINCIAS_LIST.find(p => p.nome === nome)?.emoji || '📍'
}

// Secções "Quem Somos" — conteúdo estático (documento oficial, não editável)
export const QUEM_SOMOS_SECTIONS = [
  { hash: '#/quem-somos/historial', label: 'Historial', icon: '📖', description: 'A história da Convenção Baptista de Angola' },
  { hash: '#/quem-somos/declaracao-doutrinaria', label: 'Declaração Doutrinária de Fé', icon: '📄', description: 'Declaração Doutrinária de Fé da CBA' },
  { hash: '#/quem-somos/pacto', label: 'Pacto das Igrejas Baptistas', icon: '📕', description: 'O Pacto que une as igrejas baptistas' },
  { hash: '#/quem-somos/baptistas', label: 'Quem são os Baptistas', icon: '👥', description: 'Conheça as convicções e princípios dos Baptistas' },
  { hash: '#/quem-somos/estatuto', label: 'Estatuto da CBA', icon: '🏛️', description: 'Estatuto oficial da Convenção Baptista de Angola' },
  { hash: '#/quem-somos/plano-estrategico', label: 'Plano Estratégico da CBA 2026-2027', icon: '🎯', description: 'Plano estratégico que orienta a CBA nos próximos anos' },
] as const

export const QUEM_SOMOS_CONTENT: Record<string, {
  title: string
  icon: string
  downloadLabel: string
  preview: string
  full: string
}> = {
  'historial': {
    title: 'Historial', icon: '📖', downloadLabel: 'Baixar Historial Completo',
    preview: 'A Convenção Baptista de Angola (CBA) tem uma história rica de fé, serviço e missão no território angolano. Fundada por missionários baptistas que chegaram a Angola no século XIX, a CBA cresceu para se tornar uma das principais organizações protestantes do país. Ao longo dos anos, a Convenção tem desempenhado um papel fundamental na evangelização, educação e serviço social, estendendo a mensagem do Evangelho a todas as províncias de Angola.',
    full: 'A 59ª Assembleia Geral, realizada no Huambo, no Colégio Baptista Ocikembe, marcou um momento importante na história da CBA, com a adopção de um plano estratégico que guia as acções da instituição para os próximos anos. Hoje, a CBA congrega centenas de igrejas em todo o território nacional, unidas pela fé em Jesus Cristo e pelo compromisso com a missão do Evangelho em Angola e no mundo.',
  },
  'declaracao-doutrinaria': {
    title: 'Declaração Doutrinária de Fé', icon: '📄', downloadLabel: 'Baixar Declaração Completa',
    preview: 'Os discípulos de Jesus Cristo que vieram a ser designados pelo nome "Baptista" caracterizavam-se pela sua fidelidade às Escrituras e por isso só recebiam nas suas comunidades, como membros actuantes, pessoas convertidas pelo Espírito Santo de Deus.',
    full: 'As Escrituras Sagradas, o Antigo e o Novo Testamento, foram dadas por inspiração divina. Elas constituem a única regra suficiente, certa e infalível de fé e prática. Deus é um Ser espiritual, eterno, inteligente e perfeito. É o Criador, Conservador e Governador de todas as coisas. Jesus Cristo é o Filho eterno de Deus. No seu nascimento virginal uniram-se as duas naturezas, divina e humana, numa só Pessoa.',
  },
  'pacto': {
    title: 'Pacto das Igrejas Baptistas', icon: '📕', downloadLabel: 'Baixar Pacto Completo',
    preview: 'Tendo sido levados pelo Espírito Santo a aceitar a Jesus Cristo como único e suficiente Salvador, e baptizados, sob profissão de fé, decidimo-nos firmar o seguinte Pacto: comprometemo-nos a andar sempre unidos no amor cristão; trabalhar para que esta igreja cresça no conhecimento da Palavra, na santidade, no conforto mútuo e na espiritualidade.',
    full: 'Comprometemo-nos a manter uma devoção particular; a evitar e condenar todos os vícios; a educar religiosamente os nossos filhos; a procurar a salvação de todo o mundo. Comprometemo-nos a ser cuidadosos na nossa vida, a influenciar os outros pelo bom exemplo, a apoiar e encorajar todos os projectos legítimos da Igreja.',
  },
  'baptistas': {
    title: 'Quem são os Baptistas', icon: '👥', downloadLabel: 'Baixar Documento Completo',
    preview: 'Os Baptistas têm muitas convicções em comum com outros cristãos: acreditam em Deus como Criador, em Jesus Cristo como Filho de Deus encarnado e Salvador, e no Espírito Santo como guia sempre presente.',
    full: 'Os Baptistas crêem que somente os que confessam a fé em Jesus Cristo devem ser baptizados, por imersão. Crêem na autonomia da Igreja local, na separação entre a Igreja e o Estado, e na liberdade religiosa.',
  },
  'estatuto': {
    title: 'Estatuto da CBA', icon: '🏛️', downloadLabel: 'Baixar Estatuto Completo',
    preview: 'O estatuto oficial da Convenção Baptista de Angola está em processo de digitalização e será disponibilizado em breve na sua versão completa.',
    full: '',
  },
  'plano-estrategico': {
    title: 'Plano Estratégico CBA 2026-2027', icon: '🎯', downloadLabel: 'Baixar Plano Estratégico',
    preview: 'A 59ª Assembleia Geral da CBA recomendou à direcção envidar esforços no sentido de elaborar um plano estratégico que conduzirá as acções da Instituição nos próximos anos. Visão: Ser uma convenção missionária que proclama o Evangelho de Jesus Cristo a toda Angola e ao mundo, formando discípulos e plantando igrejas em todas as províncias.',
    full: 'Missão: Proclamar o Evangelho, formar líderes cristãos, promover a educação cristã e servir a comunidade em nome de Jesus Cristo. Valores Fundamentais: Fidelidade às Escrituras Sagradas; Compromisso com a missão evangelística; Unidade na diversidade; Excelência no serviço; Transparência e integridade.',
  },
}

export const NEWS_CATEGORIAS = ['Todos', 'Notícia', 'Evento', 'Seminário', 'Conferência', 'Encontro']
export const EVENTO_CAT_COLORS: Record<string, string> = {
  'Conferências': 'bg-blue-100 text-blue-700',
  'Jovens': 'bg-orange-100 text-orange-700',
  'Missões': 'bg-green-100 text-green-700',
  'Cultos': 'bg-purple-100 text-purple-700',
  'Formação': 'bg-amber-100 text-amber-700',
}
