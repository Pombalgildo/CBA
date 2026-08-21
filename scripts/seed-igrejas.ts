// Script para popular a base de dados de produção com as igrejas reais do documento
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient({
  datasources: { db: { url: 'postgresql://postgres:Avelinapombal2021@db.crhsvxdgkbwsvafxnomg.supabase.co:5432/postgres' } },
})

const igrejas = [
  // BENGUELA
  { provincia: 'Benguela', nome: 'Primeira Igreja Baptista do Lobito', morada: 'Rua de Moçambique, Caixa Postal 1161, Restinga - Lobito', telefone: '+244 937 195 750', pastor: 'Pastor Natanael Paulino', email: 'piblobito@gmail.com' },
  { provincia: 'Benguela', nome: 'Igreja Baptista do Lírio', morada: 'Bairro do Lírio - Lobito, Benguela', telefone: '+244 923 53 28 27', pastor: 'Pastor Adelino Camota' },
  { provincia: 'Benguela', nome: 'Igreja Baptista de Calumba', morada: 'Lobito', pastor: 'Pastor Valentino Augusto Samala Eugénio' },
  { provincia: 'Benguela', nome: 'Igreja Baptista Damasco', morada: 'Cidade de Benguela', pastor: 'Pastor António P. G. Chacamba' },
  { provincia: 'Benguela', nome: 'Igreja Baptista Lembi-Lembi', morada: 'Luongo - Catumbela', pastor: 'Pastor Fernando Jose Sanji' },
  { provincia: 'Benguela', nome: 'Igreja Baptista de Belém', morada: 'Morro da Rádio, Caixa Postal 446, Lobito', pastor: 'Pastor Fernando Victorino' },

  // MALANGE
  { provincia: 'Malanje', nome: '1ª Igreja Baptista de Malange', morada: 'Bairro Canambua - Malange' },
  { provincia: 'Malanje', nome: '2ª Igreja Baptista de Malange', morada: 'Bairro da Quizanga, zona 8, rua directa da captação d água da Guine', telefone: '+244 925096828', pastor: 'Pastor Manuel Joaquim Clemente' },

  // BIÉ
  { provincia: 'Bié', nome: '1ª Igreja Baptista do Kuito', morada: 'Rua Serpa Pinto, Bairro Cantiflas (por detrás do Centro de Formacao Profissional), Caixa Postal 235, Kuito', telefone: '+244 923 250 031', pastor: 'Pastor Paulino Cativa Chimbenda Moleco', email: 'primeiraigrejabaptistadokuito@hotmail.com' },

  // HUAMBO
  { provincia: 'Huambo', nome: '1ª Igreja Baptista do Huambo', morada: 'Bairro de Kapango - Urbano, Rua Gago Coutinho, Cidade Alta, Caixa Postal 854', telefone: '+244 923 108 334', email: 'primeiraigrejabaptistadohuambo@gmail.com' },
  { provincia: 'Huambo', nome: '3ª Igreja Baptista do Huambo', morada: 'Cidade Baixa, Rua Vicente Ferreira, Caixa Postal 777', pastor: 'Pastor Mateus Justino Chaves' },
  { provincia: 'Huambo', nome: 'Igreja Baptista Nova Jerusalém', morada: 'Bairro de Fátima, Caixa Postal 777, Huambo', telefone: '+244 923 237 709', pastor: 'Pastor Mateus Joao' },
  { provincia: 'Huambo', nome: 'Igreja Baptista Vida Nova', morada: 'Kalomanda, a entrada da Rua Nova, Huambo', telefone: '+244 924 229 283', email: 'ibvnpradeus@hotmail.com' },
  { provincia: 'Huambo', nome: 'Igreja Baptista de Bereia', morada: 'Calombrigo, Huambo', pastor: 'Pastor Feliciano F. Carlos' },

  // HUILA
  { provincia: 'Huíla', nome: 'Igreja Baptista Monte Sinai', morada: 'Bairro Chioco, Lubango', pastor: 'Pastor Avelino Pedro' },
  { provincia: 'Huíla', nome: '2ª Igreja Baptista do Lubango', morada: 'Caixa Postal 996, Lubango', telefone: '+244 261 224 774', pastor: 'Líder Salomão Muhongo Soares', email: 'ecclesiabaptista@hotmail.com' },

  // LUNDA-NORTE
  { provincia: 'Lunda-Norte', nome: 'Igreja Baptista de Cafunfo', morada: 'Rua Neves Bendinho, Bairro do Aeroporto, sector de Cafunfo, Município do Cuango', telefone: '+244 926 45 77 85', pastor: 'Pastor Francisco Guilherme Luís' },

  // LUANDA
  { provincia: 'Luanda', nome: '1ª Igreja Baptista de Luanda', morada: 'Avenida Deolinda Rodrigues (Junto à Escola Che Guevara), Luanda', pastor: 'Pastor João César e Pastor Kiala Alberto' },
  { provincia: 'Luanda', nome: '2ª Igreja Baptista de Luanda', morada: 'Rua dos Cooperantes nº 13 MA 153, Bairro Marcal, Caixa Postal n. 18233', telefone: '+244 38 42 23', pastor: 'Pastor Morais Francisco' },
  { provincia: 'Luanda', nome: '3ª Igreja Baptista de Luanda', morada: 'Rua Nicolau Gomes Spencer n. 5 - E, Distrito Urbano da Ingombota, Caixa Postal 681', telefone: '+244 33 15 40', pastor: 'Pastor André Bartolomeu', email: 'tbl36anosaoservicodomestre@hotmail.com' },
  { provincia: 'Luanda', nome: 'Igreja Baptista do Prenda', morada: 'Prenda, Luanda' },
  { provincia: 'Luanda', nome: 'Igreja Baptista Graças a Deus', morada: 'Cazenga - Zona 18, por detrás do Marco Histórico 4 de Fevereiro', pastor: 'Pastor João da Silva' },
  { provincia: 'Luanda', nome: 'Igreja Baptista da Fé', morada: 'Município do Sambizanga - Bairro da Petrangol/Socola (Organizada em 18/12/2005)', pastor: 'Pastor Isaac Rodrigues' },
  { provincia: 'Luanda', nome: 'Igreja Baptista Boas Novas do Golf', morada: 'Bairro do Golf', telefone: '+244 938 15 80 94', pastor: 'Moderador André António' },
  { provincia: 'Luanda', nome: 'Igreja Baptista Fonte de Água Viva', morada: 'Rua da Ex-Esquadra Policial da Terra Vermelha, Cazenga - Cala Wenda (Organizada em 07/02/2010)' },
  { provincia: 'Luanda', nome: '1ª Igreja Baptista de Viana', morada: 'Rua do Aviário, junto à quinta do Senhor Carvalho, Bairro Caop-C, Viana', telefone: '+244 923 544 838', pastor: 'Pastor Francisco Pedro' },
  { provincia: 'Luanda', nome: 'Igreja Baptista do Farol', morada: 'Bairro Farol - Ngola Kiluanje, Rua direita do Centro de Formação Profissional, Sambizanga', telefone: '+244 926 201 720', pastor: 'Pastor Justino Antunes' },
  { provincia: 'Luanda', nome: 'Igreja Baptista Ebenézer de Viana', morada: 'Bairro Kazombo, Viana II (Organizada em 27/10/2007)', telefone: '+244 932 241 515', pastor: 'Pastor Sebastião Macaba' },
  { provincia: 'Luanda', nome: 'Igreja Baptista da Boavista', morada: 'Bairro Boavista, Rua dos Municípios', telefone: '+244 924 450 859', pastor: 'Pastor Lopes Sambuando' },
  { provincia: 'Luanda', nome: 'Igreja Baptista Sal da Terra', morada: 'Bairro da Paz - Ngola Kiluanje, Sambizanga (Organizada em 04/07/2010)', telefone: '+244 922 602 026' },
  { provincia: 'Luanda', nome: 'Igreja Baptista da Redenção', morada: 'Rua da Comissão de Moradores, Cawele - Kikolo, Caixa Postal 5.129', telefone: '+244 923 784 606' },
  { provincia: 'Luanda', nome: 'Igreja Baptista Memorial da Fé', morada: 'Rua 21 de Janeiro, Bairro Rocha Pinto, Distrito da Samba', pastor: 'Pastor Oliveira Panzo Catangui' },
  { provincia: 'Luanda', nome: 'Igreja Baptista Monte das Oliveiras', morada: 'Rua 21 de Janeiro, Bairro Rocha Pinto, Distrito da Samba', pastor: 'Pastor Armando Frederico António' },
  { provincia: 'Luanda', nome: '1ª Igreja Baptista do Rocha Pinto', morada: 'Caixa Postal 10554, Distrito da Samba (Organizada em 1985)', telefone: '+244 923 428 870', pastor: 'Pastor Esteves Bula' },
  { provincia: 'Luanda', nome: 'Igreja Baptista do Simione', morada: 'Bairro do Simione, Município de Belas (Organizada em 27/02/2011)', telefone: '+244 936 791 054', pastor: 'Pastor Sebastiao Francisco Soki', email: 'sebastiaosoqui70@hotmail.com' },
  { provincia: 'Luanda', nome: 'Igreja Baptista de Canã', morada: 'Bairro da Estalagem Km - 12A, Viana' },
  { provincia: 'Luanda', nome: 'Igreja Baptista Cristo Rei', morada: 'Rua 21 de Janeiro, Sector C, Quarteirão 3 - Casa n. 4, Distrito da Samba' },
  { provincia: 'Luanda', nome: '1ª Igreja Baptista de Cacuaco', morada: 'Rua F, Sector 2, Nova Urbanização (Organizada em 15/07/2012)', pastor: 'Pastor Pedro Graça Simões' },
  { provincia: 'Luanda', nome: 'Igreja Baptista de Camadeira', morada: 'Rua Cambiri, Km-14, Viana', email: 'igrejabaptistadecamadeira@hotmail.com' },
  { provincia: 'Luanda', nome: 'Igreja Baptista Boa Esperança', morada: 'Grafanil, Rua da Gadil, Luanda' },
  { provincia: 'Luanda', nome: 'Igreja Baptista Fonte de Água Viva', morada: 'Luanda' },
  { provincia: 'Luanda', nome: 'Igreja Baptista Ebenézer da Sapú', morada: 'Luanda' },
  { provincia: 'Luanda', nome: '1.ª Igreja Baptista da Sapu', morada: 'Luanda' },
  { provincia: 'Luanda', nome: '1.ª Igreja Baptista da Vila Flor', morada: 'Vila Flor, Luanda' },
  { provincia: 'Luanda', nome: '2ª Igreja Baptista da Vila Flor', morada: 'Vila Flor, Luanda' },
  { provincia: 'Luanda', nome: '1.ª Igreja Baptista do Tanque 1', morada: 'Luanda' },
  { provincia: 'Luanda', nome: '1ª Igreja Baptista do Zango', morada: 'Zango, Luanda' },
  { provincia: 'Luanda', nome: '2ª Igreja Baptista do Zango', morada: 'Zango, Luanda' },
  { provincia: 'Luanda', nome: '1ª Igreja Baptista do Benfica', morada: 'Benfica, Luanda' },

  // NAMIBE
  { provincia: 'Namibe', nome: '1ª Igreja Baptista do Namibe', morada: 'Bairro Plato, Junto ao Centro Recreativo Bongo', pastor: 'Pastor Docas Marcolino Neco' },

  // MOXICO
  { provincia: 'Moxico', nome: '1ª Igreja Baptista do Luena', morada: 'Caixa Postal 182, Luena', pastor: 'Pastor João Dinis Calimbue Cassanga' },

  // CUANZA-SUL
  { provincia: 'Cuanza-Sul', nome: 'Igreja Baptista Rio de Água da Vida', morada: 'Sumbe', pastor: 'Pastor José João Zamba (Lima)' },
]

async function main() {
  console.log(`A inserir ${igrejas.length} igrejas...`)

  // Apagar igrejas existentes
  await db.church.deleteMany({})
  console.log('Igrejas antigas removidas')

  // Inserir novas
  let ordem = 0
  for (const ig of igrejas) {
    await db.church.create({
      data: {
        provincia: ig.provincia,
        nome: ig.nome,
        morada: ig.morada || null,
        telefone: ig.telefone || null,
        pastor: ig.pastor || null,
        email: ig.email || null,
        ordem: ordem++,
      },
    })
  }

  console.log(`✅ ${igrejas.length} igrejas inseridas com sucesso!`)
}

main()
  .catch((e) => { console.error('❌ Erro:', e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
