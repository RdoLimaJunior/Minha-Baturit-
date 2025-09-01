

import { Protocolo, CategoriaReclamacao, StatusProtocolo, UserProfile, UserRole, Noticia, Comment, Secretaria, PredioPublico, TurismoItem, ContatoUtil, CategoriaContato, ServicoOnline, CategoriaServicoOnline, TipoProtocolo, Agendamento, AgendamentoStatus, Notificacao } from './types';

export const BAIRROS_BATURITE: string[] = [
    "Centro", "Conselheiro Estelita", "Putiú", "São Francisco", "Nossa Senhora de Fátima", "Mondubim", "Guarani", "Sanharão"
];

export const MOCK_USER_PROFILES: UserProfile[] = [
    { id: '1', name: 'Raimundo', role: UserRole.CIDADAO, avatar: 'https://i.pravatar.cc/150?u=raimundo' },
    { id: '2', name: 'Gestor', role: UserRole.GESTOR, avatar: 'https://i.pravatar.cc/150?u=gestor' },
];

export const MOCK_PROTOCOLOS: Protocolo[] = [
  {
    id: '1',
    protocolo: '20240728001',
    userId: 'user123',
    tipo: TipoProtocolo.RECLAMACAO,
    categoria: CategoriaReclamacao.ILUMINACAO,
    descricao: 'Poste na Rua Principal com a lâmpada queimada há mais de uma semana. Fica muito escuro à noite.',
    localizacao: { lat: -4.332, lng: -38.880 },
    fotos: ['https://picsum.photos/seed/lamp1/400/300'],
    status: StatusProtocolo.RESOLVIDO,
    dataAbertura: '2024-07-20T10:00:00Z',
    dataAtualizacao: '2024-07-25T15:30:00Z',
    bairro: 'Centro',
    historico: [
      { status: StatusProtocolo.RECEBIDO, data: '2024-07-20T10:00:00Z' },
      { status: StatusProtocolo.EM_ANDAMENTO, data: '2024-07-22T09:00:00Z', observacao: 'Equipe de iluminação notificada.' },
      { status: StatusProtocolo.RESOLVIDO, data: '2024-07-25T15:30:00Z', observacao: 'Lâmpada do poste trocada.' },
    ],
  },
  {
    id: '2',
    protocolo: '20240728002',
    userId: 'user456',
    tipo: TipoProtocolo.RECLAMACAO,
    categoria: CategoriaReclamacao.BURACO_VIA,
    descricao: 'Buraco grande na esquina da Rua das Flores com a Av. dos Cravos. Perigoso para motos.',
    localizacao: { lat: -4.335, lng: -38.875 },
    fotos: ['https://picsum.photos/seed/hole1/400/300'],
    status: StatusProtocolo.EM_ANDAMENTO,
    dataAbertura: '2024-07-26T14:20:00Z',
    dataAtualizacao: '2024-07-27T11:00:00Z',
    bairro: 'Conselheiro Estelita',
    historico: [
      { status: StatusProtocolo.RECEBIDO, data: '2024-07-26T14:20:00Z' },
      { status: StatusProtocolo.EM_ANDAMENTO, data: '2024-07-27T11:00:00Z', observacao: 'Operação tapa-buraco agendada para esta semana.' },
    ],
  },
  {
    id: '3',
    protocolo: '20240728003',
    userId: 'user789',
    tipo: TipoProtocolo.SUGESTAO,
    descricao: 'Gostaria de sugerir a instalação de lixeiras de coleta seletiva na Praça da Matriz. Ajudaria a manter a praça mais limpa e incentivar a reciclagem.',
    status: StatusProtocolo.RECEBIDO,
    dataAbertura: '2024-07-28T08:00:00Z',
    dataAtualizacao: '2024-07-28T08:00:00Z',
    bairro: 'Centro',
    historico: [
      { status: StatusProtocolo.RECEBIDO, data: '2024-07-28T08:00:00Z' },
    ],
  },
  {
    id: '4',
    protocolo: '20240729004',
    userId: 'user123',
    tipo: TipoProtocolo.ELOGIO,
    descricao: 'Quero parabenizar a equipe de limpeza pública pelo excelente trabalho no bairro Putiú. As ruas estão visivelmente mais limpas!',
    status: StatusProtocolo.RECEBIDO,
    dataAbertura: '2024-07-29T11:00:00Z',
    dataAtualizacao: '2024-07-29T11:00:00Z',
    bairro: 'Putiú',
    historico: [
      { status: StatusProtocolo.RECEBIDO, data: '2024-07-29T11:00:00Z', observacao: 'Elogio encaminhado à secretaria responsável.' },
    ],
  },
];

const MOCK_COMMENTS: Comment[] = [
    { id: 'c1', author: 'Maria Silva', avatar: 'https://i.pravatar.cc/150?u=maria', text: 'Excelente iniciativa! Parabéns a todos os envolvidos.', date: '2024-05-11T10:00:00Z' },
    { id: 'c2', author: 'João Costa', avatar: 'https://i.pravatar.cc/150?u=joao', text: 'Muito importante para o futuro das nossas crianças.', date: '2024-05-11T11:30:00Z' },
];

export const MOCK_NOTICIAS: Noticia[] = [
    {
        id: '1',
        title: 'Prefeitura de Baturité realiza o II Fórum Comunitário do Selo UNICEF',
        summary: 'A Prefeitura de Baturité, através do Conselho Municipal dos Direitos da Criança e do Adolescente (CMDCA) e da Comissão Intersetorial pelos Direitos da Criança e do Adolescente, realizou o II Fórum Comunitário do Selo UNICEF.',
        date: '2024-05-10T14:00:00Z',
        imageUrl: 'https://www.baturite.ce.gov.br/fotos/noticias/11052024103126.jpeg',
        link: 'https://www.baturite.ce.gov.br/noticia.php?id=141',
        likes: 125,
        comments: MOCK_COMMENTS,
    },
    {
        id: '2',
        title: 'Baturité participa de encontro sobre o programa Garantia Safra',
        summary: 'A Prefeitura de Baturité, por meio da Secretaria de Agricultura e Meio Ambiente, participou de um encontro para discutir o programa Garantia Safra. O evento, realizado em parceria com a EMATERCE, reuniu agricultores locais.',
        date: '2024-05-08T11:00:00Z',
        imageUrl: 'https://www.baturite.ce.gov.br/fotos/noticias/11052024102927.jpeg',
        link: 'https://www.baturite.ce.gov.br/noticia.php?id=140',
        likes: 88,
        comments: [],
    },
    {
        id: '3',
        title: 'Prefeito assina ordem de serviço para reforma do Hospital e Maternidade',
        summary: 'O prefeito de Baturité, Herberlh Mota, assinou a ordem de serviço para a reforma e ampliação do Hospital e Maternidade local. A obra visa melhorar a infraestrutura e a qualidade do atendimento à população.',
        date: '2024-05-02T09:00:00Z',
        imageUrl: 'https://www.baturite.ce.gov.br/fotos/noticias/03052024125827.jpeg',
        link: 'https://www.baturite.ce.gov.br/noticia.php?id=139',
        likes: 231,
        comments: [
            { id: 'c3', author: 'Ana Pereira', avatar: 'https://i.pravatar.cc/150?u=ana', text: 'Notícia maravilhosa! A saúde da nossa cidade agradece.', date: '2024-05-02T10:00:00Z' }
        ],
    }
];

export const MOCK_SECRETARIAS: Secretaria[] = [
  {
    id: '1',
    nome: 'Gabinete do Prefeito',
    secretario: 'Herberlh Mota',
    cargo: 'Prefeito',
    avatarUrl: 'https://i.pravatar.cc/150?u=herberlhmota',
    endereco: 'Praça da Matriz, S/N, Centro',
    telefone: '(85) 3347-1114',
    email: 'gabinete@baturite.ce.gov.br',
    horario: '07:30 às 13:30 (Segunda a Sexta)',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '2',
    nome: 'Procuradoria Geral do Município',
    secretario: 'Dr. Rene Viana',
    cargo: 'Procurador Geral',
    avatarUrl: 'https://i.pravatar.cc/150?u=reneviana',
    endereco: 'Praça da Matriz, S/N, Centro',
    telefone: '(85) 3347-1114',
    email: 'juridico@baturite.ce.gov.br',
    horario: '07:30 às 13:30 (Segunda a Sexta)',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '3',
    nome: 'Secretaria de Administração, Planejamento e Finanças',
    secretario: 'Geisiane de Souza Costa',
    cargo: 'Secretária',
    avatarUrl: 'https://i.pravatar.cc/150?u=geisianecosta',
    endereco: 'Praça da Matriz, S/N, Centro',
    telefone: '(85) 3347-1114',
    email: 'financas@baturite.ce.gov.br',
    horario: '07:30 às 13:30 (Segunda a Sexta)',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '8',
    nome: 'Autarquia do Meio Ambiente de Baturité',
    secretario: 'Artur Emilio Ivo de Holanda',
    cargo: 'Superintendente',
    avatarUrl: 'https://i.pravatar.cc/150?u=arturemilio',
    endereco: 'Rua 15 de Novembro, Nº 973 - Centro - CEP: 62.760-000',
    telefone: '(85) 9.9189-1109',
    email: 'amabbte@gmail.com',
    horario: 'Segunda A Sexta de 07h às 13h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '4',
    nome: 'Secretaria de Agricultura e Meio Ambiente',
    secretario: 'Marcos André de Almeida',
    cargo: 'Secretário',
    avatarUrl: 'https://i.pravatar.cc/150?u=marcosandre',
    endereco: 'Rua 15 de Novembro, 1011, Centro',
    telefone: '(85) 3347-0000',
    email: 'agricultura@baturite.ce.gov.br',
    horario: '07:30 às 13:30 (Segunda a Sexta)',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '5',
    nome: 'Secretaria de Assistência Social e do Trabalho',
    secretario: 'Valdeci de Castro Sampaio',
    cargo: 'Secretário',
    avatarUrl: 'https://i.pravatar.cc/150?u=valdecisampaio',
    endereco: 'Rua Senador João Cordeiro, 1269, Centro',
    telefone: '(85) 3347-1229',
    email: 'setas@baturite.ce.gov.br',
    horario: '07:30 às 13:30 (Segunda a Sexta)',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '6',
    nome: 'Secretaria de Cultura e Turismo',
    secretario: 'Giscard Martins',
    cargo: 'Secretário',
    avatarUrl: 'https://i.pravatar.cc/150?u=giscardmartins',
    endereco: 'Praça da Matriz, S/N, Centro',
    telefone: '(85) 3347-1114',
    email: 'cultura@baturite.ce.gov.br',
    horario: '07:30 às 13:30 (Segunda a Sexta)',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '7',
    nome: 'Secretaria de Educação',
    secretario: 'Vitoria Evelline Carneiro',
    cargo: 'Secretária',
    avatarUrl: 'https://i.pravatar.cc/150?u=vitoriacarneiro',
    endereco: 'Rua 15 de Novembro, S/N, Centro',
    telefone: '(85) 3347-1123',
    email: 'sme@baturite.ce.gov.br',
    horario: '07:30 às 13:30 (Segunda a Sexta)',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
];

export const MOCK_PREDIOS_PUBLICOS: PredioPublico[] = [
  {
    id: 'ps1',
    nome: "Posto de Saúde do Centro",
    endereco: "Praça da Matriz, S/N, Centro, Baturité - CE",
    telefone: "(85) 3347-1122",
    categoria: "Saúde",
    horario: "07:00 às 17:00",
    servicos: ["Atendimento básico", "Vacinação", "Farmácia popular"],
    localizacao: { latitude: -4.3315, longitude: -38.8825 },
    isOpenNow: true,
    busyness: "Normalmente movimentado",
    imageUrl: "https://picsum.photos/seed/posto-saude-centro/800/400",
  },
  {
    id: 'ps2',
    nome: "Hospital e Maternidade Franklin Cavalcante",
    endereco: "Rua Sen. João Cordeiro, 1421, Centro, Baturité - CE",
    telefone: "(85) 3347-0354",
    categoria: "Saúde",
    horario: "24 horas",
    servicos: ["Emergência", "Internação", "Maternidade", "Exames"],
    localizacao: { latitude: -4.3298, longitude: -38.8835 },
    isOpenNow: true,
    busyness: "Pouco movimentado",
    imageUrl: "https://lh5.googleusercontent.com/p/AF1QipM-pXjW_7R9-X9eX0J5-f9X0Jz_jJ6-K3Q-Zz4=w800-h400-k-no",
  },
  {
    id: 'edu1',
    nome: "EEEP Professor César Campelo",
    endereco: "R. José do Vale, 123, Putiú, Baturité - CE",
    telefone: "(85) 3347-4567",
    categoria: "Educação",
    horario: "07:00 às 17:00",
    servicos: ["Ensino Médio em Tempo Integral", "Cursos Técnicos"],
    localizacao: { latitude: -4.3271, longitude: -38.8799 },
    isOpenNow: true,
    busyness: "Mais movimentado que o normal",
    imageUrl: "https://picsum.photos/seed/eeep-cesar/800/400",
  },
  {
    id: 'edu2',
    nome: "Escola Domingos Sávio",
    endereco: "Av. Sete de Setembro, 555, Centro, Baturité - CE",
    telefone: "(85) 3347-1199",
    categoria: "Educação",
    horario: "07:00 às 17:00",
    servicos: ["Ensino Fundamental I e II", "Atividades extracurriculares"],
    localizacao: { latitude: -4.3338, longitude: -38.8812 },
    isOpenNow: false,
    busyness: "Fechado",
    imageUrl: "https://picsum.photos/seed/domingos-savio/800/400",
  },
  {
    id: 'as1',
    nome: "CRAS - Centro de Referência de Assistência Social",
    endereco: "Rua Senador João Cordeiro, 1269, Centro",
    telefone: "(85) 3347-1229",
    categoria: "Assistência Social",
    horario: "07:30 às 13:30",
    servicos: ["Cadastro Único", "Apoio a famílias", "Serviço de Convivência"],
    localizacao: { latitude: -4.3305, longitude: -38.8841 },
    isOpenNow: true,
    busyness: "Pouco movimentado",
    imageUrl: "https://picsum.photos/seed/cras-baturite/800/400",
  },
  {
    id: 'adm1',
    nome: "Prefeitura Municipal de Baturité",
    endereco: "Praça da Matriz, S/N, Centro",
    telefone: "(85) 3347-1114",
    categoria: "Administração",
    horario: "07:30 às 13:30",
    servicos: ["Gabinete do Prefeito", "Secretarias", "Protocolo Geral"],
    localizacao: { latitude: -4.3320, longitude: -38.8830 },
    isOpenNow: false,
    busyness: "Fechado",
    imageUrl: "https://www.baturite.ce.gov.br/imagens/galeria/prefeitura-municipal-de-baturite-um-patrimonio-historico-e-cultural_29012024103633_0.jpg",
  }
];

export const MOCK_TURISMO_ITENS: TurismoItem[] = [
  // Pontos Turísticos
  {
    id: 'pt1',
    categoria: 'Pontos Turísticos',
    nome: 'Mosteiro dos Jesuítas',
    descricaoCurta: 'Um refúgio de paz e espiritualidade com uma arquitetura impressionante e vistas deslumbrantes da serra.',
    descricao: 'O Mosteiro dos Jesuítas é um dos principais cartões-postais de Baturité. Fundado no início do século XX, o local serviu como casa de formação para noviços jesuítas e hoje é um espaço de retiros espirituais, aberto à visitação. Sua capela neogótica e os jardins bem cuidados oferecem um ambiente de tranquilidade e contemplação. A vista panorâmica da cidade e da serra a partir do mosteiro é inesquecível.',
    endereco: 'Sítio Olho D\'água, s/n - Zona Rural, Baturité - CE, 62760-000',
    contato: '(85) 3347-0320',
    localizacao: { latitude: -4.3218, longitude: -38.8686 },
    imagens: [
      'https://www.baturite.ce.gov.br/fotos/turismo/13102022120021.jpg',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/72/1d/19/photo0-largejpg.jpg?w=1200&h=-1&s=1',
      'https://www.baturite.ce.gov.br/fotos/turismo/13102022115948.jpg'
    ]
  },
  {
    id: 'pt2',
    categoria: 'Pontos Turísticos',
    nome: 'Igreja Matriz de Nossa Senhora da Palma',
    descricaoCurta: 'Principal templo católico da cidade, a Igreja Matriz é um marco histórico e arquitetônico no coração de Baturité.',
    descricao: 'Localizada na Praça da Matriz, a igreja é um exemplar da arquitetura do século XVIII. Sua construção imponente, com torres sineiras e um interior rico em detalhes sacros, conta parte da história da colonização da região. É o centro da vida religiosa e cultural da cidade, palco de festas e celebrações tradicionais.',
    endereco: 'Praça da Matriz, Centro, Baturité - CE, 62760-000',
    localizacao: { latitude: -4.3324, longitude: -38.8832 },
    imagens: [
      'https://www.baturite.ce.gov.br/fotos/turismo/13102022121350.jpg',
      'https://www.baturite.ce.gov.br/fotos/turismo/13102022121404.jpg',
    ]
  },
  // Gastronomia
  {
    id: 'gas1',
    categoria: 'Gastronomia',
    nome: 'Restaurante Akitem',
    descricaoCurta: 'Saboreie a autêntica culinária regional em um ambiente acolhedor e familiar no centro da cidade.',
    descricao: 'O Restaurante Akitem é uma referência em Baturité quando o assunto é comida caseira de qualidade. Com um cardápio variado que valoriza os ingredientes locais, o restaurante oferece pratos como galinha caipira, carne de sol com macaxeira e uma feijoada famosa na região. O ambiente é simples e acolhedor, ideal para um almoço em família.',
    endereco: 'Rua Cônego João, 123, Centro, Baturité - CE, 62760-000',
    contato: '(85) 98765-4321',
    localizacao: { latitude: -4.3330, longitude: -38.8820 },
    imagens: [
      'https://www.baturite.ce.gov.br/fotos/turismo/13102022120404.jpg',
      'https://picsum.photos/seed/akitem2/800/600',
    ]
  },
  // Hospedagem
  {
    id: 'hos1',
    categoria: 'Hospedagem',
    nome: 'Hotel Fazenda Sete Nascentes',
    descricaoCurta: 'Conforto e natureza se encontram neste hotel fazenda, ideal para quem busca descanso e lazer na serra.',
    descricao: 'O Hotel Fazenda Sete Nascentes oferece uma experiência completa de imersão na natureza. Com chalés confortáveis, piscinas, trilhas ecológicas e atividades como passeios a cavalo, é o lugar perfeito para relaxar e se desconectar da rotina. O hotel também conta com um restaurante que serve delícias da fazenda, com produtos orgânicos cultivados no local.',
    endereco: 'Sítio Sete Nascentes, s/n - Zona Rural, Baturité - CE, 62760-000',
    contato: '(85) 3347-9876',
    site: 'http://www.hotelfazendasetenascentes.com.br/',
    localizacao: { latitude: -4.2985, longitude: -38.8910 },
    imagens: [
      'https://www.baturite.ce.gov.br/fotos/turismo/13102022120803.jpg',
      'https://picsum.photos/seed/setenascentes2/800/600',
    ]
  },
  // Lazer e Entretenimento
  {
    id: 'lazer1',
    categoria: 'Lazer e Entretenimento',
    nome: 'Passeio de Bondinho',
    descricaoCurta: 'Desfrute de uma vista panorâmica da cidade e da serra em um passeio de bondinho que leva ao Alto da Cruz.',
    descricao: 'O passeio de bondinho é uma das atrações mais procuradas em Baturité. O percurso liga a base no centro da cidade ao monumento do Alto da Cruz, proporcionando uma vista espetacular da paisagem serrana. É uma ótima opção de lazer para todas as idades e uma oportunidade única para tirar fotos incríveis.',
    endereco: 'Estação do Bondinho, Centro, Baturité - CE, 62760-000',
    localizacao: { latitude: -4.3345, longitude: -38.8845 },
    imagens: [
      'https://www.baturite.ce.gov.br/fotos/turismo/13102022121650.jpg',
      'https://diariodonordeste.verdesmares.com.br/image/contentid/policy:1.3204924:1647466851/baturite.jpg?f=16x9&h=720&q=0.8&w=1280&$p$f$h$q$w=7a2333b',
    ]
  },
];

export const MOCK_CONTATOS: ContatoUtil[] = [
  // Emergência
  { id: 'c1', categoria: CategoriaContato.EMERGENCIA, nome: 'SAMU', telefone: '192', icon: 'emergency' },
  { id: 'c2', categoria: CategoriaContato.EMERGENCIA, nome: 'Polícia Militar', telefone: '190', icon: 'local_police' },
  { id: 'c3', categoria: CategoriaContato.EMERGENCIA, nome: 'Corpo de Bombeiros', telefone: '193', icon: 'fire_truck' },
  { id: 'c4', categoria: CategoriaContato.EMERGENCIA, nome: 'Defesa Civil', telefone: '(85) 99189-1109', icon: 'security' },

  // Saúde
  { id: 's1', categoria: CategoriaContato.SAUDE, nome: 'Hospital e Maternidade', telefone: '(85) 3347-0354', icon: 'local_hospital' },
  { id: 's2', categoria: CategoriaContato.SAUDE, nome: 'Posto de Saúde (Centro)', telefone: '(85) 3347-1122', icon: 'vaccines' },

  // Serviços Municipais
  { id: 'm1', categoria: CategoriaContato.SERVICOS, nome: 'Prefeitura de Baturité', telefone: '(85) 3347-1114', icon: 'corporate_fare' },
  { id: 'm2', categoria: CategoriaContato.SERVICOS, nome: 'Conselho Tutelar', telefone: '(85) 99201-1400', icon: 'escalator_warning' },
  { id: 'm3', categoria: CategoriaContato.SERVICOS, nome: 'Autarquia de Meio Ambiente', telefone: '(85) 99189-1109', icon: 'eco' },
  { id: 'm4', categoria: CategoriaContato.SERVICOS, nome: 'Secretaria de Assistência Social', telefone: '(85) 3347-1229', icon: 'groups' },
];

export const MOCK_SERVICOS_ONLINE: ServicoOnline[] = [
  // Assistência Social
  { id: 'serv1', categoria: CategoriaServicoOnline.ASSISTENCIA, nome: 'Agendar Atendimento CRAS', descricao: 'Marque seu atendimento no Centro de Referência de Assistência Social.', icon: 'event', requiresAuth: true },
  { id: 'serv2', categoria: CategoriaServicoOnline.ASSISTENCIA, nome: 'Cadastro Único (CadÚnico)', descricao: 'Informações e agendamento para inscrição no CadÚnico.', icon: 'assignment_ind', requiresAuth: true },
  // Tributos
  { id: 'serv3', categoria: CategoriaServicoOnline.TRIBUTOS, nome: '2ª Via de IPTU', descricao: 'Emita a segunda via do seu boleto de IPTU de forma online.', icon: 'receipt_long', requiresAuth: false },
  { id: 'serv4', categoria: CategoriaServicoOnline.TRIBUTOS, nome: 'Certidão Negativa de Débitos', descricao: 'Solicite sua certidão de regularidade fiscal com o município.', icon: 'verified', requiresAuth: false },
  // Educação
  { id: 'serv5', categoria: CategoriaServicoOnline.EDUCACAO, nome: 'Matrícula Escolar Online', descricao: 'Realize a pré-matrícula na rede municipal de ensino.', icon: 'school', requiresAuth: true },
  // Saúde
  { id: 'serv6', categoria: CategoriaServicoOnline.SAUDE, nome: 'Agendar Consulta', descricao: 'Marque consultas na Unidade Básica de Saúde (em breve).', icon: 'vaccines', requiresAuth: true },
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0);

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);
nextWeek.setHours(14, 30, 0, 0);

const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);
lastMonth.setHours(9, 0, 0, 0);


export const MOCK_AGENDAMENTOS: Agendamento[] = [
  {
    id: 'ag1',
    userId: '1',
    servicoId: 'serv1',
    servicoNome: 'Atendimento CRAS',
    servicoIcon: 'event',
    dataHora: tomorrow.toISOString(),
    status: AgendamentoStatus.AGENDADO,
    lembreteAtivo: true,
  },
  {
    id: 'ag2',
    userId: '1',
    servicoId: 'serv3',
    servicoNome: 'Retirada de 2ª Via de IPTU',
    servicoIcon: 'receipt_long',
    dataHora: nextWeek.toISOString(),
    status: AgendamentoStatus.AGENDADO,
    lembreteAtivo: false,
  },
  {
    id: 'ag3',
    userId: '1',
    servicoId: 'serv2',
    servicoNome: 'Atualização do Cadastro Único',
    servicoIcon: 'assignment_ind',
    dataHora: lastMonth.toISOString(),
    status: AgendamentoStatus.REALIZADO,
    lembreteAtivo: false,
  },
];


export const MOCK_NOTIFICACOES: Notificacao[] = [
  {
    id: 'not1',
    userId: '1',
    titulo: 'Lembrete de Agendamento',
    mensagem: `Seu atendimento no CRAS está agendado para amanhã às ${tomorrow.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`,
    data: new Date().toISOString(),
    lida: false,
    link: { view: 'AGENDAMENTOS_LIST' }
  },
  {
    id: 'not2',
    userId: '1',
    titulo: 'Protocolo Resolvido',
    mensagem: 'Seu protocolo de Iluminação Pública (nº 20240728001) foi marcado como resolvido.',
    data: '2024-07-25T15:35:00Z',
    lida: true,
    link: { view: 'PROTOCOLO_DETAIL', params: { protocoloId: '1' } }
  }
];