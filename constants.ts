// constants.ts
import { 
    UserProfile, UserRole, Protocolo, StatusProtocolo, TipoProtocolo, CategoriaReclamacao,
    Noticia, Comment, Secretaria, PredioPublico, CategoriaPredioPublico, TurismoItem,
    TurismoCategoria, ContatoUtil, CategoriaContato, ServicoOnline, CategoriaServicoOnline,
    Agendamento, AgendamentoStatus, Notificacao, View, Publicacao, StatusPublicacao, TipoPublicacao,
    ConsultaPublica, StatusConsultaPublica
} from './types';

export const MOCK_USER_PROFILES: UserProfile[] = [
  { id: 'user1', name: 'Cidadão Exemplo', avatar: 'https://i.pravatar.cc/150?u=user1', role: UserRole.CIDADAO },
  { id: 'user2', name: 'Gestor Público', avatar: 'https://i.pravatar.cc/150?u=user2', role: UserRole.GESTOR },
];

export const MOCK_COMMENTS: Comment[] = [
    { id: 'c1', author: 'Maria Silva', avatar: 'https://i.pravatar.cc/150?u=maria', text: 'Ótima notícia!', date: '2023-10-26T10:00:00Z' },
    { id: 'c2', author: 'João Souza', avatar: 'https://i.pravatar.cc/150?u=joao', text: 'Parabéns aos envolvidos.', date: '2023-10-26T11:30:00Z' },
];

export const MOCK_NOTICIAS: Noticia[] = [
  { 
    id: 'noticia1', 
    title: 'Prefeitura de Baturité Lança Novo App "Minha Baturité"',
    summary: 'A gestão municipal inova com o lançamento de um aplicativo para facilitar o acesso a serviços e a comunicação com o cidadão.',
    content: 'Com o objetivo de modernizar a administração pública e aproximar o cidadão da gestão, a Prefeitura de Baturité lançou nesta semana o aplicativo "Minha Baturité". A ferramenta, disponível para Android e iOS, permite a abertura de protocolos, agendamento de serviços, acesso a notícias e participação em consultas públicas.',
    imageUrl: 'https://images.unsplash.com/photo-1593463592233-a4a1a0d12a64?q=80&w=2070&auto=format&fit=crop',
    date: '2023-10-27T09:00:00Z',
    likes: 152,
    comments: MOCK_COMMENTS,
    link: 'https://www.baturite.ce.gov.br/noticia.php?id=1',
  },
  { 
    id: 'noticia2', 
    title: 'Campanha de Vacinação Contra a Gripe Começa na Próxima Semana',
    summary: 'A Secretaria de Saúde informa que a campanha de vacinação contra a gripe (Influenza) terá início na próxima segunda-feira em todas as Unidades Básicas de Saúde.',
    content: 'Fique atento ao calendário de vacinação e aos grupos prioritários. A vacina é segura, eficaz e fundamental para proteger a sua saúde e a de sua família. Compareça à UBS mais próxima com seu cartão de vacinação e documento de identidade.',
    imageUrl: 'https://images.unsplash.com/photo-1606303842183-e29b55d7a74a?q=80&w=2070&auto=format&fit=crop',
    date: '2023-10-25T14:00:00Z',
    likes: 98,
    comments: [],
    link: 'https://www.baturite.ce.gov.br/noticia.php?id=2',
  },
];

export const MOCK_PROTOCOLOS: Protocolo[] = [
    {
        id: 'p1', protocolo: '20231027001', tipo: TipoProtocolo.RECLAMACAO, categoria: CategoriaReclamacao.ILUMINACAO,
        descricao: 'Poste de luz na Rua das Flores, em frente ao número 123, está queimado há mais de uma semana.',
        dataAbertura: '2023-10-27T08:30:00Z', bairro: 'Centro', status: StatusProtocolo.EM_ANDAMENTO,
        historico: [
            { status: StatusProtocolo.RECEBIDO, data: '2023-10-27T08:30:00Z', observacao: 'Protocolo aberto pelo cidadão via app.' },
            { status: StatusProtocolo.EM_ANDAMENTO, data: '2023-10-27T10:00:00Z', observacao: 'Encaminhado para a Secretaria de Infraestrutura.' },
        ],
        fotos: ['https://images.unsplash.com/photo-1617082399329-650a3148d7ba?q=80&w=1974&auto=format&fit=crop']
    },
    {
        id: 'p2', protocolo: '20231026005', tipo: TipoProtocolo.SUGESTAO,
        descricao: 'Sugiro a instalação de lixeiras de coleta seletiva na Praça da Matriz para incentivar a reciclagem.',
        dataAbertura: '2023-10-26T15:00:00Z', bairro: 'Centro', status: StatusProtocolo.RECEBIDO,
        historico: [
            { status: StatusProtocolo.RECEBIDO, data: '2023-10-26T15:00:00Z', observacao: 'Protocolo aberto pelo cidadão via app.' }
        ]
    },
    {
        id: 'p3', protocolo: '20231025002', tipo: TipoProtocolo.ELOGIO,
        descricao: 'Gostaria de elogiar o excelente atendimento recebido no Posto de Saúde do bairro Putiú.',
        dataAbertura: '2023-10-25T11:45:00Z', bairro: 'Putiú', status: StatusProtocolo.RESOLVIDO,
        historico: [
            { status: StatusProtocolo.RECEBIDO, data: '2023-10-25T11:45:00Z' },
            { status: StatusProtocolo.RESOLVIDO, data: '2023-10-26T09:00:00Z', observacao: 'Agradecemos o feedback. O elogio foi repassado à equipe.' },
        ]
    }
];

export const MOCK_SECRETARIAS: Secretaria[] = [
    {
        id: 'sec1', nome: 'Secretaria de Saúde', secretario: 'Dr. João da Silva', cargo: 'Secretário Municipal de Saúde',
        avatarUrl: 'https://i.pravatar.cc/150?u=sec1', email: 'saude@baturite.ce.gov.br', telefone: '(85) 3347-0001',
        horario: 'Segunda a Sexta, 08h às 17h', endereco: 'Rua Senador Pompeu, 100, Centro',
        link: 'https://www.baturite.ce.gov.br/secretaria.php?id=1'
    },
    {
        id: 'sec2', nome: 'Secretaria de Educação', secretario: 'Maria Oliveira', cargo: 'Secretária Municipal de Educação',
        avatarUrl: 'https://i.pravatar.cc/150?u=sec2', email: 'educacao@baturite.ce.gov.br', telefone: '(85) 3347-0002',
        horario: 'Segunda a Sexta, 08h às 17h', endereco: 'Rua XV de Novembro, 200, Centro',
        link: 'https://www.baturite.ce.gov.br/secretaria.php?id=2'
    }
];

export const MOCK_PREDIOS_PUBLICOS: PredioPublico[] = [
    {
        id: 'predio1', nome: 'Hospital e Maternidade de Baturité', categoria: CategoriaPredioPublico.SAUDE,
        endereco: 'Av. Sete de Setembro, 550, Centro', bairro: 'Centro', telefone: '(85) 3347-0354',
        horario: '24 horas', localizacao: { latitude: -4.3315, longitude: -38.8825 },
        isOpenNow: true, busyness: 'Movimentado', servicos: ['Emergência', 'Internação', 'Maternidade', 'Consultas'],
        imagens: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_xNqXqY8Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Q&s']
    },
    {
        id: 'predio2', nome: 'Escola de Ensino Fundamental Domingos Sávio', categoria: CategoriaPredioPublico.EDUCACAO,
        endereco: 'Rua São José, 123, Putiú', bairro: 'Putiú', telefone: '(85) 3347-1122',
        horario: 'Segunda a Sexta, 07h às 17h', localizacao: { latitude: -4.328, longitude: -38.879 },
        isOpenNow: new Date().getHours() >= 7 && new Date().getHours() < 17, servicos: ['Ensino Fundamental I e II', 'Biblioteca', 'Quadra de Esportes'],
        imagens: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5R-pS_Il2gY3R-8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Q&s']
    }
];

export const MOCK_TURISMO_ITENS: TurismoItem[] = [
    {
        id: 'turismo1', nome: 'Mosteiro dos Jesuítas', categoria: TurismoCategoria.PONTOS_TURISTICOS,
        descricao: 'O Mosteiro dos Jesuítas é um marco histórico e religioso, oferecendo uma vista panorâmica da cidade e um ambiente de paz e reflexão.',
        descricaoCurta: 'Marco histórico e religioso com vista panorâmica.',
        endereco: 'Sítio Olho D\'água, s/n - Zona Rural', localizacao: { latitude: -4.345, longitude: -38.889 },
        imagens: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Y4Z8Q&s']
    },
     {
        id: 'turismo2', nome: 'Restaurante Sabor da Serra', categoria: TurismoCategoria.GASTRONOMIA,
        descricao: 'Desfrute da culinária regional com pratos típicos da serra, em um ambiente aconchegante e familiar.',
        descricaoCurta: 'Culinária regional e pratos típicos.',
        endereco: 'Rua Principal, 50, Centro', localizacao: { latitude: -4.330, longitude: -38.881 },
        imagens: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop'],
        contato: '(85) 99999-8888'
    }
];

export const MOCK_CONTATOS: ContatoUtil[] = [
    { id: 'cont1', nome: 'Polícia Militar', telefone: '190', categoria: CategoriaContato.EMERGENCIA, icon: 'local_police' },
    { id: 'cont2', nome: 'SAMU', telefone: '192', categoria: CategoriaContato.EMERGENCIA, icon: 'emergency' },
    { id: 'cont3', nome: 'Hospital Municipal', telefone: '(85) 3347-0354', categoria: CategoriaContato.SAUDE, icon: 'local_hospital' },
    { id: 'cont4', nome: 'Guarda Municipal', telefone: '(85) 3347-1188', categoria: CategoriaContato.SERVICOS, icon: 'security' },
];

export const MOCK_SERVICOS_ONLINE: ServicoOnline[] = [
    { id: 'serv1', nome: 'Agendamento de Consulta', descricao: 'Agende sua consulta com clínico geral na UBS mais próxima.', categoria: CategoriaServicoOnline.SAUDE, icon: 'event' },
    { id: 'serv2', nome: 'Emissão de 2ª via do IPTU', descricao: 'Acesse o portal do contribuinte para emitir seu boleto.', categoria: CategoriaServicoOnline.TRIBUTOS, icon: 'receipt' },
];

export const MOCK_AGENDAMENTOS: Agendamento[] = [
    { id: 'ag1', servicoId: 'serv1', servicoNome: 'Consulta Clínico Geral', servicoIcon: 'event', dataHora: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), status: AgendamentoStatus.AGENDADO },
    { id: 'ag2', servicoId: 'serv1', servicoNome: 'Consulta Clínico Geral', servicoIcon: 'event', dataHora: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: AgendamentoStatus.REALIZADO },
];

export const MOCK_NOTIFICACOES: Notificacao[] = [
    { id: 'notif1', titulo: 'Protocolo Atualizado', mensagem: 'Seu protocolo 20231027001 foi atualizado para "Em Andamento".', data: '2023-10-27T10:01:00Z', lida: false, link: { view: 'PROTOCOLO_DETAIL', params: { protocoloId: 'p1' } } },
    { id: 'notif2', titulo: 'Lembrete de Agendamento', mensagem: 'Sua consulta está agendada para amanhã às 10:00.', data: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), lida: true, link: { view: 'AGENDAMENTOS_LIST' } },
];

export const MOCK_PUBLICATIONS: Publicacao[] = [
  {
    id: 'pub1',
    author: { uid: 'user1', name: 'Carlos Pereira', avatar: 'https://i.pravatar.cc/150?u=carlos', isAnonymous: false },
    tipo: TipoPublicacao.IDEIA,
    title: 'Ciclofaixa na Avenida Principal',
    resumo: 'Sugestão de criar uma ciclofaixa na avenida principal para melhorar a segurança dos ciclistas e incentivar o transporte sustentável.',
    descricao: 'A Avenida Sete de Setembro é muito movimentada e perigosa para quem anda de bicicleta. Uma ciclofaixa segregada traria mais segurança, incentivaria mais pessoas a usarem a bicicleta e melhoraria o trânsito.',
    bairro: 'Centro',
    fotos: ['https://images.unsplash.com/photo-1576426863848-c21f68c6aa98?q=80&w=2070&auto=format&fit=crop'],
    createdAt: '2023-10-28T10:00:00Z',
    status: StatusPublicacao.EM_ANALISE,
    historico: [{ status: StatusPublicacao.ABERTO, data: '2023-10-28T10:00:00Z' }, { status: StatusPublicacao.EM_ANALISE, data: '2023-10-29T11:00:00Z', observacao: 'Sugestão encaminhada para o departamento de trânsito.' }],
    comments: [],
    counts: { supports: 42, comments: 5 },
  },
];

export const MOCK_CONSULTAS_PUBLICAS: ConsultaPublica[] = [
    {
        id: 'cp1', title: 'Revisão do Plano Diretor Municipal',
        summary: 'Participe da revisão do Plano Diretor, o principal instrumento de planejamento e desenvolvimento da cidade para os próximos 10 anos.',
        description: 'A Prefeitura de Baturité convida todos os cidadãos para participarem da Consulta Pública sobre a revisão do Plano Diretor. Sua opinião é crucial para definirmos juntos as diretrizes para o crescimento urbano, a preservação ambiental, a mobilidade e a qualidade de vida em nossa cidade. Acesse os documentos e deixe sua contribuição.',
        imageUrl: 'https://images.unsplash.com/photo-1549492423-400259a3e574?q=80&w=2070&auto=format&fit=crop',
        startDate: '2023-11-01T00:00:00Z', endDate: '2023-11-30T23:59:59Z',
        status: StatusConsultaPublica.ABERTA,
        opinioes: [],
        documentos: [{ nome: 'Minuta do Projeto de Lei', url: '#', icon: 'description' }, { nome: 'Mapa de Zoneamento Proposto', url: '#', icon: 'map' }],
    }
];


export const BAIRROS_BATURITE: string[] = [
    'Açudinho', 'Centro', 'Conselho', 'Lages', 'Monte Alegre', 'Mundo Novo', 'Putiú', 'Sanharão', 'São Francisco', 'Outro'
];
