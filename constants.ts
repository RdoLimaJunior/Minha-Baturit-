import { Protocolo, CategoriaReclamacao, StatusProtocolo, UserProfile, UserRole, Noticia, Comment, Secretaria, PredioPublico, TurismoItem, ContatoUtil, CategoriaContato, ServicoOnline, CategoriaServicoOnline, TipoProtocolo, Agendamento, AgendamentoStatus, Notificacao, Publicacao, TipoPublicacao, StatusPublicacao, ConsultaPublica, StatusConsultaPublica, Profissional } from './types';

export const BAIRROS_BATURITE: string[] = [
    "Centro", "Conselheiro Estelita", "Putiú", "São Francisco", "Nossa Senhora de Fátima", "Mondubim", "Guarani", "Sanharão"
];

export const MOCK_USER_PROFILES: UserProfile[] = [
    { id: '1', name: 'Raimundo', role: UserRole.CIDADAO, avatar: 'https://i.pravatar.cc/150?u=raimundo' },
    { id: '2', name: 'Gestor', role: UserRole.GESTOR, avatar: 'https://i.pravatar.cc/150?u=gestor' },
    { id: '3', name: 'Ana', role: UserRole.CIDADAO, avatar: 'https://i.pravatar.cc/150?u=ana' },
    { id: '4', name: 'Carlos', role: UserRole.CIDADAO, avatar: 'https://i.pravatar.cc/150?u=carlos' },
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
    secretario: 'Joao de Paula Barros Filho',
    cargo: 'Chefe de Gabinete',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/gabinete-do-prefeito_22012024103126_0.jpg',
    endereco: 'Praça da Matriz, Palácio Entre Rios , Nº S/N - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 9926-2383',
    email: 'gabinete@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 17:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '2',
    nome: 'Procuradoria Geral do Município',
    secretario: 'Rene Viana de Oliveira',
    cargo: 'Procurador Geral do Município',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/procuradoria-geral-do-municipio_22012024103328_0.jpg',
    endereco: 'Praça da Matriz, Palácio Entre Rios , Nº S/N - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 98135-0102',
    email: 'procuradoria@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 14:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '3',
    nome: 'Controladoria e Ouvidoria Geral do Município',
    secretario: 'Felipe de Castro Sampaio',
    cargo: 'Controlador e Ouvidor Geral do Município',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/controladoria-e-ouvidoria-geral-do-municipio_22012024103422_0.jpeg',
    endereco: 'Praça da Matriz, Palácio Entre Rios , Nº S/N - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 99427-7772',
    email: 'controladoria@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 14:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '4',
    nome: 'Secretaria de Governo',
    secretario: 'Francisco Jose Alves da Silva',
    cargo: 'Secretário de Governo',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/secretaria-de-governo_22012024103507_0.jpg',
    endereco: 'Praça da Matriz, Palácio Entre Rios , Nº S/N - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 99241-1188',
    email: 'governo@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 17:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '5',
    nome: 'Secretaria de Administração e Planejamento',
    secretario: 'Zelia Maria de Pinho',
    cargo: 'Secretária de Administração e Planejamento',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/secretaria-de-administracao-e-planejamento_22012024103607_0.jpg',
    endereco: 'Praça da Matriz, Palácio Entre Rios , Nº S/N - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 99129-8758',
    email: 'administracao@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 14:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '6',
    nome: 'Secretaria de Finanças',
    secretario: 'Geisiane de Souza Costa',
    cargo: 'Secretária de Finanças',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/secretaria-de-financas_22012024103649_0.jpg',
    endereco: 'Praça da Matriz, Palácio Entre Rios , Nº S/N - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 99129-8758',
    email: 'financas@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 14:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '7',
    nome: 'Secretaria de Educação',
    secretario: 'Vitoria Evelline Carneiro de Pinho',
    cargo: 'Secretária de Educação',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/secretaria-de-educacao_22012024103730_0.jpeg',
    endereco: 'Rua 15 de Novembro, Nº S/N - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 99144-8488',
    email: 'sme@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 17:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '8',
    nome: 'Secretaria de Saúde',
    secretario: 'Francisco Saymon Oliveira de Souza',
    cargo: 'Secretário de Saúde',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/secretaria-de-saude_22012024103810_0.jpg',
    endereco: 'Rua Senador João Cordeiro, Nº 1421 - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 99173-9828',
    email: 'saude@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 17:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '9',
    nome: 'Secretaria de Assistência Social e do Trabalho',
    secretario: 'Maria Valdeci de Castro Sampaio',
    cargo: 'Secretária de Assistência Social e do Trabalho',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/secretaria-de-assistencia-social-e-do-trabalho_22012024103845_0.jpg',
    endereco: 'Rua Senador João Cordeiro, Nº 1269 - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 99201-1400',
    email: 'setas@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 14:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '10',
    nome: 'Secretaria de Infraestrutura e do Desenvolvimento Urbano',
    secretario: 'Cicero Alencar de Pinho Filho',
    cargo: 'Secretário de Infraestrutura e do Desenvolvimento Urbano',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/secretaria-de-infraestrutura-e-do-desenvolvimento-urbano_22012024103923_0.jpeg',
    endereco: 'Rua Senador João Cordeiro, Nº S/N - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 99195-2605',
    email: 'infraestrutura@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 17:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '11',
    nome: 'Secretaria de Agricultura e Meio Ambiente',
    secretario: 'Marcos Andre de Almeida',
    cargo: 'Secretário de Agricultura e Meio Ambiente',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/secretaria-de-agricultura-e-meio-ambiente_22012024103957_0.jpg',
    endereco: 'Rua 15 de Novembro, Nº 1011 - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 99244-0104',
    email: 'agricultura@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 14:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '12',
    nome: 'Secretaria de Esporte e Juventude',
    secretario: 'Francisco de Assis de Sousa Oliveira',
    cargo: 'Secretário de Esporte e Juventude',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/secretaria-de-esporte-e-juventude_22012024104033_0.jpeg',
    endereco: 'Praça da Matriz, Palácio Entre Rios , Nº S/N - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 99114-1100',
    email: 'esporte@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 14:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '13',
    nome: 'Secretaria de Cultura e Turismo',
    secretario: 'Giscard Feitosa Martins',
    cargo: 'Secretário de Cultura e Turismo',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/secretaria-de-cultura-e-turismo_22012024104113_0.jpg',
    endereco: 'Praça da Matriz, Antiga Estação Ferroviária , Nº S/N - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 99144-8488',
    email: 'cultura@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 17:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '14',
    nome: 'Autarquia Municipal de Trânsito de Baturité',
    secretario: 'Francisco Jose Alves da Silva',
    cargo: 'Superintendente',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/autarquia-municipal-de-transito-de-baturite_22012024104245_0.jpeg',
    endereco: 'Rua Travessa Sete de Setembro, Nº S/N - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 99122-3837',
    email: 'amtbaturite@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 17:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
  {
    id: '15',
    nome: 'Autarquia do Meio Ambiente de Baturité',
    secretario: 'Artur Emilio Ivo de Holanda',
    cargo: 'Superintendente',
    avatarUrl: 'https://www.baturite.ce.gov.br/fotos/secretarias/autarquia-do-meio-ambiente-de-baturite_22012024104332_0.jpg',
    endereco: 'Rua 15 de Novembro, Nº 973 - Centro - CEP: 62.760-000, Baturité-CE',
    telefone: '(85) 99189-1109',
    email: 'amab@baturite.ce.gov.br',
    horario: 'de Segunda A Sexta -das 08:00 As 14:00h',
    link: 'https://www.baturite.ce.gov.br/secretaria.php'
  },
];

// --- MOCK DATA FOR PUBLIC BUILDINGS ---

const parseBairro = (endereco: string | number): string => {
    const enderecoStr = String(endereco);
    if (!endereco || enderecoStr.trim() === '' || enderecoStr === '-' || enderecoStr === '0') {
        return 'Não informado';
    }
    const parts = enderecoStr.split(' - ');
    let bairro = parts[parts.length - 1].trim();

    // Capitalize properly
    bairro = bairro.toLowerCase().replace(/(^|\s)\S/g, char => char.toUpperCase());

    if (bairro.toLowerCase().includes('zona rural')) {
        return 'Zona Rural';
    }
    
    return bairro;
};


const MOCK_PROFISSIONAIS_SAUDE: Profissional[] = [
    { nome: 'Ana Patrícia de Souza', cargo: 'Técnico de Enfermagem', cargaHoraria: 'CARGA HORÁRIA: 40H' },
    { nome: 'Maria Luiza Fereira Geracino', cargo: 'Auxiliar de Enfermagem', cargaHoraria: 'CARGA HORÁRIA: 40H' },
    { nome: 'Micael Pereira Nobre', cargo: 'Farmacêutico Analista Clínico', cargaHoraria: 'CARGA HORÁRIA: 40H' },
    { nome: 'Dr. Carlos Alberto Lima', cargo: 'Clínico Geral', cargaHoraria: 'CARGA HORÁRIA: 20H' },
    { nome: 'Dra. Juliana Mendes', cargo: 'Pediatra', cargaHoraria: 'CARGA HORÁRIA: 20H' },
    { nome: 'Roberto Vasconcelos', cargo: 'Recepcionista', cargaHoraria: 'CARGA HORÁRIA: 40H' },
    { nome: 'Sandra Holanda', cargo: 'Enfermeira Chefe', cargaHoraria: 'CARGA HORÁRIA: 40H' },
    { nome: 'José Airton Cavalcante', cargo: 'Dentista', cargaHoraria: 'CARGA HORÁRIA: 40H' },
];

const MOCK_SERVICOS_SAUDE = ['Consultas', 'Vacinação', 'Curativos', 'Farmácia Básica', 'Atendimento Odontológico', 'Exames Laboratoriais'];
const MOCK_BUSYNESS = ['Pouco movimentado', 'Normalmente movimentado', 'Mais movimentado que o normal'];

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => 0.5 - Math.random());
const getRandomItems = <T,>(array: T[], count: number): T[] => shuffleArray(array).slice(0, count);

// Data from user, cleaned and enriched
const MOCK_UNIDADES_SAUDE_RAW = [
    {"Nome":"CENTRAL DE ATENÇÃO FARMACEUTICA - CAF","Endereço":"PRAÇA WALDEMAR FALCÃO - CENTRO","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 16:00H","Telefone":85994001530,"E-mail":"medicamentopravaler@gmail.com"},
    {"Nome":"CENTRO DE ATENÇÃO ESPECIALIZADA - CAE","Endereço":"RUA NOSSA SENHORA DA PALMA - CENTRO","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 13:00H","Telefone":85992713139,"E-mail":"caebaturite@gmail.com"},
    {"Nome":"CENTRO DE ATENÇÃO PSICOSSOCIAL - CAPS","Endereço":"AVENIDA OUVIDOR MOR VITORIANO SOARES BARBOSA - SANHARÃO","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 17:00H","Telefone":85992808739,"E-mail":"capsbaturite@gmail.com"},
    {"Nome":"NÚCLEO DE APOIO AS ENDEMIAS - NUCETEB","Endereço":"TRAVESSA NOSSA SENHORA DE FÁTIMA - CENTRO","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992828003,"E-mail":"nucetbendemiasbte@gmail.com"},
    {"Nome":"NÚCLEO DE ATENDIMENTO DA SAUDE DA FAMILIA - NASF","Endereço":"RUA 15 DE NOVEMBRO - CENTRO","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 17:00H","Telefone":85992854395,"E-mail":"riwdson@hotmail.com"},
    {"Nome":"PONTO DE APOIO DA SAUDE DA FAMILIA SERRA DO EVARISTO","Endereço":"SERRA DO EVARISTO - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"SECRETARIA MUNICIPAL DE SAUDE","Endereço":"PRAÇA VALDEMAR FALCÃO - CENTRO","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"secretariasaudebte2021@gmail.com"},
    {"Nome":"SETOR DE DOAÇÃO","Endereço":0,"Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 17:30H","Telefone":85992325600,"E-mail":0},
    {"Nome":"SETOR DE TRANSPORTE","Endereço":0,"Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 17:00H","Telefone":85991596161,"E-mail":0},
    {"Nome":"UNIDADE BÁSICA DE SAUDE AÇUDINHO","Endereço":"AÇUDINHO DOS VIANAS - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAÚDE ALTO ALEGRE","Endereço":"ALTO ALEGRE - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAUDE BEIRA RIO","Endereço":"RUA PEDRO VIANA - CONSELHEIRO ESTELITA","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAUDE CANDEIA BOA VISTA","Endereço":"DISTRITO DO CANDEIA BOA VISTA - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAUDE CANDEIA SÃO SEBASTIÃO","Endereço":"DISTRITO DO CANDEIA SÃO SEBASTIÃO - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAUDE CONSELHEIRO ESTELITA","Endereço":"RUA PEDRO VIANA - CONSELHEIRO ESTELITA","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAUDE DA MANGA","Endereço":"RUA FARMACEUTICO JOÃO PAULINO NETO - MANGA","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAUDE JORDÃO","Endereço":"SITIO JORDÃO - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAUDE JUCA DO ZÉ VILAR","Endereço":"SITIO JUCÁ DO ZÉ VILAR - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAÚDE MONDEGO 1","Endereço":"RUA MAJOR PEDRO CATÃO - MONDEGO","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":8599227070,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAÚDE MONDEGO 2","Endereço":"RUA MAJOR PEDRO CATÃO - MONDEGO","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAUDE OITICICA","Endereço":"SITIO OITICICA - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAÚDE PUTIÚ","Endereço":"RUA DUQUE DE CAXIAS - PUTIÚ","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAUDE SEDE 1","Endereço":"RUA NOSSA SENHA DA PALMA - CENTRO","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE BÁSICA DE SAUDE SEDE 2","Endereço":"RUA MADRE PIERINA USLENGH - CENTRO","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992270706,"E-mail":"coord.atencaobasica.bte@gmail.com"},
    {"Nome":"UNIDADE DE PRONTO ATENDIMENTO - UPA 24H","Endereço":"AVENIDA OUVIDOR MOR VITORIANO SOARES BARBOSA - SANHARÃO","Hórario":"24H","Telefone":85992794973,"E-mail":"upabaturite@igcce.com"},
    {"Nome":"VIGILÂNCIA SANITÁRIA - VISA","Endereço":"PRAÇA WALDEMAR FALCÃO - CENTRO","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 14:00H","Telefone":85992368550,"E-mail":"visabaturite@gmail.com"},
];

const MOCK_UNIDADES_SAUDE: PredioPublico[] = MOCK_UNIDADES_SAUDE_RAW.map((unidade, index) => {
    const horario = unidade.Hórario.replace(/DE |H/g, '').replace(' ÀS ', '-');
    const isOpenNow = () => {
        if (horario === '24') return true;
        const now = new Date();
        const day = now.getDay(); // 0 = Domingo, 1 = Segunda...
        if (day === 0 || day === 6) return false; // Assumindo fechado nos fins de semana, a menos que especificado

        const parts = horario.match(/(\d{2}):(\d{2})-(\d{2}):(\d{2})/);
        if (!parts) return false;

        const startHour = parseInt(parts[1], 10);
        const startMinute = parseInt(parts[2], 10);
        const endHour = parseInt(parts[3], 10);
        const endMinute = parseInt(parts[4], 10);
        
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        return currentTime >= startTime && currentTime <= endTime;
    };
    
    // Baturité center: -4.332, -38.880. Randomize around it.
    const lat = -4.332 + (Math.random() - 0.5) * 0.05;
    const lng = -38.880 + (Math.random() - 0.5) * 0.05;
    
    return {
        id: `saude-${index + 1}`,
        nome: unidade.Nome,
        endereco: unidade.Endereço === 0 ? 'Endereço não informado' : String(unidade.Endereço),
        bairro: parseBairro(unidade.Endereço),
        telefone: String(unidade.Telefone),
        email: unidade["E-mail"] === 0 ? 'E-mail não informado' : String(unidade["E-mail"]),
        categoria: 'Saúde',
        horario: horario,
        servicos: getRandomItems(MOCK_SERVICOS_SAUDE, Math.floor(Math.random() * 3) + 2),
        localizacao: { latitude: lat, longitude: lng },
        isOpenNow: isOpenNow(),
        busyness: getRandomItems(MOCK_BUSYNESS, 1)[0],
        imagens: [
            `https://picsum.photos/seed/saude${index}/800/400`,
            `https://picsum.photos/seed/saude${index}_2/800/400`,
            `https://picsum.photos/seed/saude${index}_3/800/400`,
        ],
        profissionais: getRandomItems(MOCK_PROFISSIONAIS_SAUDE, Math.floor(Math.random() * 3) + 2),
    };
});

const MOCK_PROFISSIONAIS_ASSISTENCIA: Profissional[] = [
    { nome: 'Francisca Maria Lima', cargo: 'Assistente Social', cargaHoraria: 'CARGA HORÁRIA: 40H' },
    { nome: 'João Paulo Almeida', cargo: 'Psicólogo', cargaHoraria: 'CARGA HORÁRIA: 30H' },
    { nome: 'Ana Carolina Borges', cargo: 'Coordenadora', cargaHoraria: 'CARGA HORÁRIA: 40H' },
    { nome: 'Carlos Eduardo Dias', cargo: 'Educador Social', cargaHoraria: 'CARGA HORÁRIA: 40H' },
    { nome: 'Helena Costa', cargo: 'Pedagoga', cargaHoraria: 'CARGA HORÁRIA: 40H' },
    { nome: 'Ricardo Nunes', cargo: 'Atendente CadÚnico', cargaHoraria: 'CARGA HORÁRIA: 40H' },
];

const MOCK_SERVICOS_ASSISTENCIA = ['Cadastro Único', 'Atendimento Psicossocial', 'SCFV', 'Acompanhamento Familiar', 'Emissão de Documentos'];

const MOCK_UNIDADES_ASSISTENCIA_SOCIAL_RAW = [
    {"Nome":"CADASTRO ÚNICO - PROGRAMA BOLSA FAMÍLIA","Endereço":"AV. FRANCISCO BRAGA FILHO, SN - CONSELHEIRO ESTELITA","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 17:00H","Telefone":85982006115,"E-mail":"bolsafamiliacadastrounicobte@gmail.com"},
    {"Nome":"CENTRO DE CONVIVÊNCIA E FORTALECIMENTO DE VÍNCULOS","Endereço":"RUA SÃO VICENTE DE PAULA - VILA NOVA","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 17:00H","Telefone":85999169723,"E-mail":"sedes@baturite.ce.gov.br"},
    {"Nome":"CENTRO DE REFERÊNCIA DA ASSISTÊNCIA SOCIAL - CRAS CONSELHEIRO ESTELITA","Endereço":"AV FRANCISCO BRAGA FILHO - CONSELHEIRO ESTELITA","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 17:00H","Telefone":85994292479,"E-mail":"crascentrobte@gmail.com"},
    {"Nome":"CENTRO DE REFERÊNCIA DA ASSISTÊNCIA SOCIAL - CRAS MONDEGO","Endereço":"RUA MAJOR PEDRO CATÃO - MONDEGO","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 17:00H","Telefone":85992865483,"E-mail":"crassdes2021@gmail.com"},
    {"Nome":"CENTRO DE REFERÊNCIA DA ASSISTÊNCIA SOCIAL - CRAS RURAL","Endereço":"RUA CORAÇÃO DE JESUS - CANDEIA BOA VISTA - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 17:00H","Telefone":85981706113,"E-mail":"crasruralcbv@gmail.com"},
    {"Nome":"CENTRO DE REFERÊNCIA ESPECIALIZADO DA ASSISTÊNCIA SOCIAL - CREAS","Endereço":"RUA PADRE ARTHUR REDONDO - BEIRA RIO","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 17:00H","Telefone":85997901471,"E-mail":"creasbaturite@gmail.com"},
    {"Nome":"SALA DO CIDADÃO","Endereço":"AV FRANCISCO BRAGA FILHO - CONSELHEIRO ESTELITA","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 17:00H","Telefone":85997897642,"E-mail":"setordeidentificacaobte@gmail.com"},
    {"Nome":"SECRETARIA DO DESENVOLVIMENTO ECONÔMICO E SOCIAL","Endereço":"AV. FRANCISCO BRAGA FILHO - CONSELHEIRO ESTELITA","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 17:00","Telefone":85997897642,"E-mail":"sedes@baturite.ce.gov.br"},
    {"Nome":"UNIDADE DE ACOLHIMENTO PARA CRIANÇAS E ADOLESCENTES","Endereço":"-","Hórario":"SEGUNDA A SEXTA DE 08:00H ÀS 17:00H","Telefone":85999366244,"E-mail":"acolhimentobte@gmail.com"},
];

const MOCK_UNIDADES_ASSISTENCIA_SOCIAL: PredioPublico[] = MOCK_UNIDADES_ASSISTENCIA_SOCIAL_RAW.map((unidade, index) => {
    const horario = unidade.Hórario.replace(/DE |H/g, '').replace(' ÀS ', '-');
    const isOpenNow = () => {
        if (horario === '24') return true;
        const now = new Date();
        const day = now.getDay();
        if (day === 0 || day === 6) return false;

        const parts = horario.match(/(\d{2}):(\d{2})-(\d{2}):(\d{2})/);
        if (!parts) return false;

        const startHour = parseInt(parts[1], 10);
        const startMinute = parseInt(parts[2], 10);
        const endHour = parseInt(parts[3], 10);
        const endMinute = parseInt(parts[4], 10);
        
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        return currentTime >= startTime && currentTime <= endTime;
    };
    
    const lat = -4.332 + (Math.random() - 0.5) * 0.05;
    const lng = -38.880 + (Math.random() - 0.5) * 0.05;
    
    return {
        id: `assistencia-${index + 1}`,
        nome: unidade.Nome,
        endereco: unidade.Endereço === '-' ? 'Endereço não informado' : String(unidade.Endereço),
        bairro: parseBairro(unidade.Endereço),
        telefone: String(unidade.Telefone),
        email: String(unidade["E-mail"]),
        categoria: 'Assistência Social',
        horario: horario,
        servicos: getRandomItems(MOCK_SERVICOS_ASSISTENCIA, Math.floor(Math.random() * 2) + 2),
        localizacao: { latitude: lat, longitude: lng },
        isOpenNow: isOpenNow(),
        busyness: getRandomItems(MOCK_BUSYNESS, 1)[0],
        imagens: [
            `https://picsum.photos/seed/assistencia${index}/800/400`,
            `https://picsum.photos/seed/assistencia${index}_2/800/400`,
        ],
        profissionais: getRandomItems(MOCK_PROFISSIONAIS_ASSISTENCIA, Math.floor(Math.random() * 2) + 2),
    };
});

const MOCK_SERVICOS_EDUCACAO = ['Ensino Infantil', 'Ensino Fundamental', 'Atividades Extracurriculares', 'Matrículas Abertas'];

const MOCK_UNIDADES_EDUCACAO_RAW = [
    {"Nome":"CENTRO DE EDUCAÇÃO INFANTIL MARIA LEIDIANE","Endereço":"MANGA - MANGA","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00H E 12:30H ÀS 16:30H","Telefone":85999560127,"E-mail":"julinalopes@hotmail.com"},
    {"Nome":"CENTRO DE EDUCAÇÃO INFANTIL NOSSA SENHORA AUXILIADORA","Endereço":"PROURB - PROURB","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00H E 13:00H ÀS 17:00H","Telefone":85997634991,"E-mail":"mimendesm11@gmail.com"},
    {"Nome":"CENTRO EDUCACIONAL INFANTIL ROCILDA GERMANO ARRUDA","Endereço":"BEIRA RIO - BEIRA RIO","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00H E 13:00H ÀS 17:00H","Telefone":85988780345,"E-mail":"escolasmecirocildagermano@gmail.com"},
    {"Nome":"CENTRO EDUCACIONAL INFANTIL SÃO FRANCISCO","Endereço":"CONJUNTO SÃO FRANCISCO - SÃO FRANCISCO","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00H E 13:00H ÀS 17:00H","Telefone":85992050416,"E-mail":"escolasmeceisaofrancisco@gmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL ANTÔNIO VICENTE","Endereço":"CORRENTES - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 07:30H ÀS 11:00H E 12:30H ÀS 16:30H","Telefone":85991210023,"E-mail":"amancioarislene@gmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL CAPITÃO PORFÍRIO RODRIGUES DE SOUZA","Endereço":"CANDEIA SÃO SEBASTIÃO - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 07:30H ÀS 11:00H E 12:30H ÀS 16:30H","Telefone":85981057598,"E-mail":"vandapaulo85@gmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL CORONEL ESTEVÃO ALVES DA ROCHA","Endereço":"PUTIU - PUTIÚ","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00H E 13:00H ÀS 17:00H","Telefone":85998491061,"E-mail":"elianeviana1@hotmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL CRISTO REI","Endereço":"PUTIU - PUTIÚ","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00H E 13:00H ÀS 17:00H","Telefone":85991023936,"E-mail":"adilasouza20@gmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL DIOMEDES MARINHO","Endereço":"TRAVESSA LUIZ SERAFIM FILHO - LAGES","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00H E 13:00H ÀS 17:00H","Telefone":85997073513,"E-mail":"suiannyprofa@gmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL DOMINGOS SÁVIO","Endereço":"AVENIDA DOM BOSCO - CENTRO","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00H E 13:00H ÀS 17:00H","Telefone":85996335338,"E-mail":"aryrodrigues13leao@hotmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL EDUARDO TAVEIRA","Endereço":"SITIO LABIRINTO - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 07:30H ÀS 11:00H E 12:30H ÀS 16:30H","Telefone":85999873323,"E-mail":"rosane.bte@gmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL EVANDRO VASCONCELOS HOLANDA","Endereço":"SÍTIO SÃO BENTO - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 07:30H ÀS 11:00H E 12:30H ÀS 16:30H","Telefone":85994148003,"E-mail":"eudyenhooliveira@gmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL FRANCISCO AIRTON AMORA VASCONCELOS","Endereço":"JORDÃO - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 07:30H ÀS 11:00H E 12:30H ÀS 16:30H","Telefone":85994148003,"E-mail":"eudyenhooliveira@gmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL JOÃO LINO FILHO","Endereço":"CONJUNTO MARIA JOSÉ VIANA - CONSELHEIRO ESTELITA","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00H E 13:00H ÀS 17:00H","Telefone":85999918008,"E-mail":"marlybertoleza@hotmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL JOSÉ VIEIRA DE MENEZES","Endereço":"FLORES - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 07:30H ÀS 11:00H E 12:30H ÀS 16:30H","Telefone":85994148003,"E-mail":"eudyenhooliviera@gmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL LAURA VICUNA","Endereço":"MANGA - MANGA","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00H E 13:00H ÀS 17:00H","Telefone":85991639047,"E-mail":"gilvaniagaldino@live.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL MARIA DE LOURDES DA SILVEIRA","Endereço":"CANDEIA BOA VISTA - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 07:30H ÀS 11:00H E 12:30H ÀS 16:30H","Telefone":85997905412,"E-mail":"escolasmemariadelourdes@gmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL MARIA JOSÉ VIANA","Endereço":"AÇUDINHO DOS VIANAS - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 07:30H ÀS 11:00H E 12:30H ÀS 16:30H","Telefone":85996318741,"E-mail":"mariajosevianamaze@gmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL MONSENHOR MANUEL CÂNDIDO","Endereço":"RUA VEREADOR FRANCISCO FRANCELINO - CENTRO","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00H E 13:00H ÀS 17:00H","Telefone":85996212302,"E-mail":"albertinacastelo@hotmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL NAÇÕES UNIDAS","Endereço":"MONDEGO - MONDEGO","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00H E 13:00H ÀS 17:00H","Telefone":85996749036,"E-mail":"lucivanycastro@hotmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL OSÓRIO JULIÃO","Endereço":"EVARISTO - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 07:30H ÀS 11:00H E 12:30H ÀS 16:30H","Telefone":85999865181,"E-mail":"robertamaria0206@gmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL PADRE ANCHIETA","Endereço":"JUCÁ DO JESUÍTA - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 07:30H ÀS 11:00H E 12:30H ÀS 16:30H","Telefone":85997949866,"E-mail":"escolasmepadreanchieta@gmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL PEDRO LOPES FILHO","Endereço":"OITICICA - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00 E 12:30H ÁS 16:30","Telefone":8599057054,"E-mail":"claudeneide1974@hotmail.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL SERRA PRETA","Endereço":"SERRA PRETA - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 07:30H ÀS 11:00H E 12:30H ÀS 16:30H","Telefone":85991210023,"E-mail":"amancioarislene@gmaill.com"},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL VICENTE JUSCIER BERNARDINO DE OLIVEIRA","Endereço":"CHORÓ BOA VISTA - ZONA RURAL","Hórario":"SEGUNDA A SEXTA DE 07:30H ÀS 11:00H E 12:30H ÀS 16:30H","Telefone":85998449976,"E-mail":0},
    {"Nome":"ESCOLA DE ENSINO FUNDAMENTAL MUNICIPAL VOVÓ GUILHERMINA","Endereço":"MUCUNA - MUCUNA","Hórario":"SEGUNDA A SEXTA DE 07:00H ÀS 11:00H E 13:00H ÀS 17:00H","Telefone":85996378452,"E-mail":"escolavovoguilhermina@gmail.com"},
];

const MOCK_UNIDADES_EDUCACAO: PredioPublico[] = MOCK_UNIDADES_EDUCACAO_RAW
  .filter(unidade => unidade.Nome && !unidade.Nome.includes('www.baturite.ce.gov.br'))
  .map((unidade, index) => {
    const horario = `SEGUNDA A SEXTA ${unidade.Hórario.replace(/SEGUNDA A SEXTA DE /i, '').replace(/H/gi, '').replace(/ ÀS | ÁS /gi, '-').replace(/ E /gi, ' e ')}`;
    
    const isOpenNow = () => {
        const horarioString = unidade.Hórario;
        const now = new Date();
        const day = now.getDay();
        if (day === 0 || day === 6) return false;

        const currentTime = now.getHours() * 60 + now.getMinutes();

        const timeRanges = horarioString.match(/(\d{2}:\d{2}).*?(\d{2}:\d{2})/g);
        if (!timeRanges) return false;

        for (const range of timeRanges) {
            const times = range.match(/(\d{2}:\d{2})/g);
            if (!times || times.length < 2) continue;

            const [start, end] = times;
            const [startHour, startMinute] = start.split(':').map(Number);
            const [endHour, endMinute] = end.split(':').map(Number);

            const startTime = startHour * 60 + startMinute;
            const endTime = endHour * 60 + endMinute;

            if (currentTime >= startTime && currentTime < endTime) {
                return true;
            }
        }
        return false;
    };
    
    const lat = -4.332 + (Math.random() - 0.5) * 0.05;
    const lng = -38.880 + (Math.random() - 0.5) * 0.05;
    
    return {
        id: `educacao-${index + 1}`,
        nome: unidade.Nome,
        endereco: `${String(unidade.Endereço).split(' - ')[0]}, Baturité - CE`,
        bairro: parseBairro(unidade.Endereço),
        telefone: String(unidade.Telefone),
        email: unidade["E-mail"] === 0 ? 'E-mail não informado' : String(unidade["E-mail"]),
        categoria: 'Educação',
        horario: horario,
        servicos: getRandomItems(MOCK_SERVICOS_EDUCACAO, Math.floor(Math.random() * 2) + 1),
        localizacao: { latitude: lat, longitude: lng },
        isOpenNow: isOpenNow(),
        busyness: getRandomItems(MOCK_BUSYNESS, 1)[0],
        imagens: [
            `https://picsum.photos/seed/educacao${index}/800/400`,
            `https://picsum.photos/seed/educacao${index}_2/800/400`,
        ],
        profissionais: [], // Sem profissionais para escolas
    };
});


export const MOCK_PREDIOS_PUBLICOS: PredioPublico[] = [
  ...MOCK_UNIDADES_SAUDE,
  ...MOCK_UNIDADES_ASSISTENCIA_SOCIAL,
  ...MOCK_UNIDADES_EDUCACAO,
  {
    id: 'adm1',
    nome: "Prefeitura Municipal de Baturité",
    endereco: "Praça da Matriz, S/N, Centro",
    bairro: "Centro",
    telefone: "(85) 3347-1114",
    categoria: "Administração",
    horario: "07:30 às 13:30",
    servicos: ["Gabinete do Prefeito", "Secretarias", "Protocolo Geral"],
    localizacao: { latitude: -4.3320, longitude: -38.8830 },
    isOpenNow: false,
    busyness: "Fechado",
    imagens: [
        "https://www.baturite.ce.gov.br/imagens/galeria/prefeitura-municipal-de-baturite-um-patrimonio-historico-e-cultural_29012024103633_0.jpg",
        "https://www.baturite.ce.gov.br/fotos/banco-de-imagens/13102022121921.jpg"
    ],
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
  // Cultura
  {
    id: 'cult1',
    categoria: 'Cultura',
    nome: 'Estação Ferroviária de Baturité',
    descricaoCurta: 'Um marco histórico da cidade, a antiga estação hoje abriga a Secretaria de Cultura e Turismo.',
    descricao: 'A Estação Ferroviária de Baturité, inaugurada em 1882, foi um importante ponto de escoamento da produção de café da serra. Hoje, o prédio histórico foi restaurado e sedia a Secretaria de Cultura e Turismo, mantendo viva a memória da ferrovia e promovendo eventos culturais na cidade.',
    endereco: 'Praça da Matriz, s/n, Centro, Baturité - CE, 62760-000',
    localizacao: { latitude: -4.3328, longitude: -38.8835 },
    imagens: [
      'https://www.baturite.ce.gov.br/fotos/turismo/13102022121731.jpg',
      'https://www.baturite.ce.gov.br/fotos/turismo/13102022121752.jpg',
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

export const MOCK_PUBLICATIONS: Publicacao[] = [
    {
        id: 'pub1',
        tipo: TipoPublicacao.PROBLEMA,
        title: 'Calçada quebrada na Rua Principal',
        resumo: 'A calçada em frente ao número 123 está completamente destruída, oferecendo risco para pedestres, principalmente idosos.',
        descricao: 'Há meses a calçada na Rua Principal, próximo à padaria, está em péssimas condições. Vários moradores já tropeçaram no local. É uma área de grande movimento e precisa de reparo urgente antes que um acidente mais grave aconteça. Anexei uma foto para mostrar a situação.',
        bairro: 'Centro',
        tags: ['#calçada', '#acessibilidade', '#segurança'],
        fotos: ['https://picsum.photos/seed/calcada1/800/600'],
        author: {
            uid: '1',
            name: 'Raimundo',
            avatar: MOCK_USER_PROFILES[0].avatar,
            isAnonymous: false,
        },
        counts: { supports: 42, comments: 3 },
        status: StatusPublicacao.EM_ANALISE,
        createdAt: '2024-07-25T10:00:00Z',
        updatedAt: '2024-07-26T14:00:00Z',
        historico: [
            { status: StatusPublicacao.ABERTO, data: '2024-07-25T10:00:00Z', observacao: 'Publicação recebida e aguardando moderação.' },
            { status: StatusPublicacao.EM_ANALISE, data: '2024-07-26T14:00:00Z', observacao: 'Encaminhado para a Secretaria de Infraestrutura.', responsavel: 'Moderação' }
        ],
        comments: [
            { id: 'cpub1', author: { uid: 'user2', name: 'Maria', avatar: 'https://i.pravatar.cc/150?u=maria' }, text: 'Realmente, passo aí todo dia e está muito perigoso!', date: '2024-07-25T11:00:00Z', isOfficialReply: false },
            { id: 'cpub2', author: { uid: 'gestor1', name: 'Secretaria de Infraestrutura', avatar: MOCK_USER_PROFILES[1].avatar }, text: 'Agradecemos o registro. Uma equipe fará a vistoria no local até o final da semana para avaliar a urgência do reparo.', date: '2024-07-26T14:05:00Z', isOfficialReply: true }
        ],
    },
    {
        id: 'pub2',
        tipo: TipoPublicacao.IDEIA,
        title: 'Criar uma feira de artesanato local aos domingos na Praça da Matriz',
        resumo: 'Uma feira semanal poderia impulsionar o turismo, gerar renda para os artesãos locais e criar um novo ponto de encontro para a comunidade.',
        descricao: 'Baturité tem muitos artesãos talentosos que não têm um espaço fixo para vender seus produtos. Uma feira na Praça da Matriz aos domingos de manhã poderia se tornar uma atração turística, atraindo visitantes de outras cidades e valorizando nossa cultura. Poderia ter também barracas de comidas típicas.',
        bairro: 'Centro',
        tags: ['#turismo', '#cultura', '#economia'],
        author: {
            uid: 'user3',
            name: 'Anônimo',
            avatar: 'https://i.pravatar.cc/150?u=anonymous',
            isAnonymous: true,
        },
        counts: { supports: 112, comments: 5 },
        status: StatusPublicacao.ABERTO,
        createdAt: '2024-07-22T09:00:00Z',
        updatedAt: '2024-07-22T09:00:00Z',
        historico: [
             { status: StatusPublicacao.ABERTO, data: '2024-07-22T09:00:00Z', observacao: 'Publicação aprovada pela moderação.' }
        ],
        comments: [],
    },
    {
        id: 'pub3',
        tipo: TipoPublicacao.ELOGIO,
        title: 'Parabéns pela organização da festa junina no bairro São Francisco',
        resumo: 'A festa estava incrível! Muito bem organizada, segura e com atrações para toda a família. A equipe da prefeitura está de parabéns!',
        descricao: 'Queria deixar meu agradecimento e elogio a todos os envolvidos na organização do São João do nosso bairro. A decoração estava linda, as barracas com comidas deliciosas e a seleção de bandas foi ótima. Me senti seguro com a presença da guarda municipal. Foi um evento que uniu a comunidade. Espero que tenha todos os anos!',
        bairro: 'São Francisco',
        author: {
            uid: 'user4',
            name: 'Carlos',
            avatar: 'https://i.pravatar.cc/150?u=carlos',
            isAnonymous: false,
        },
        counts: { supports: 88, comments: 1 },
        status: StatusPublicacao.CONCLUIDO,
        createdAt: '2024-06-30T22:00:00Z',
        updatedAt: '2024-07-01T11:00:00Z',
        historico: [
             { status: StatusPublicacao.ABERTO, data: '2024-06-30T22:00:00Z' },
             { status: StatusPublicacao.CONCLUIDO, data: '2024-07-01T11:00:00Z', observacao: 'Agradecimento encaminhado à Secretaria de Cultura.', responsavel: 'Moderação' }
        ],
        comments: [
            { id: 'cpub3', author: { uid: 'gestor2', name: 'Secretaria de Cultura', avatar: 'https://i.pravatar.cc/150?u=gestor_cultura' }, text: 'Ficamos muito felizes com seu feedback! É gratificante saber que o evento agradou a comunidade. Já estamos planejando o do próximo ano!', date: '2024-07-01T11:05:00Z', isOfficialReply: true }
        ],
    },
];

const hoje = new Date();
const dataFim = new Date();
dataFim.setDate(hoje.getDate() + 15); // A consulta termina em 15 dias

export const MOCK_CONSULTAS_PUBLICAS: ConsultaPublica[] = [
    {
        id: 'cp1',
        title: 'Consulta Pública sobre melhorias para a CE-060',
        summary: 'Participe da discussão sobre o projeto de restauração e duplicação da rodovia CE-060, trecho que atravessa os municípios de Redenção, Aracoiaba e Baturité.',
        description: 'A Superintendência de Obras Públicas (SOP) convida a população a participar da consulta pública sobre as melhorias planejadas para a rodovia CE-060. O projeto visa a duplicação de um segmento de 2 km em Baturité e a restauração de 65,4 km da via, com foco em segurança e trafegabilidade. Sua opinião é fundamental para aprimorar o projeto, abordando questões como a construção de ciclovias, novas paradas de ônibus, e o impacto na urbanização local. Todas as contribuições serão analisadas pela equipe técnica.',
        imageUrl: 'https://www.sop.ce.gov.br/wp-content/uploads/sites/46/2024/03/WhatsApp-Image-2024-03-28-at-10.45.19.jpeg',
        status: StatusConsultaPublica.ABERTA,
        startDate: hoje.toISOString(),
        endDate: dataFim.toISOString(),
        documentos: [
            { nome: 'Edital da Consulta.pdf', url: '#', icon: 'description' },
            { nome: 'Estudo Técnico Preliminar.pdf', url: '#', icon: 'science' },
            { nome: 'Mapa do Projeto.png', url: '#', icon: 'map' },
        ],
        opinioes: [
            {
                id: 'op1',
                author: { uid: '3', name: 'Ana', avatar: MOCK_USER_PROFILES[2].avatar },
                text: 'A duplicação é muito necessária, principalmente na entrada de Baturité. O trânsito ali é perigoso. A ciclovia também é uma ótima ideia para a segurança dos ciclistas.',
                date: new Date(hoje.getTime() - 86400000).toISOString(), // Ontem
                supports: 42,
            },
            {
                id: 'op2',
                author: { uid: '4', name: 'Carlos', avatar: MOCK_USER_PROFILES[3].avatar },
                text: 'Gostaria de sugerir que as novas paradas de ônibus tenham cobertura e assentos adequados. Muitos idosos utilizam o transporte público e sofrem com o sol e a chuva.',
                date: new Date(hoje.getTime() - 172800000).toISOString(), // Anteontem
                supports: 78,
            }
        ]
    },
    {
        id: 'cp2',
        title: 'Revisão do Plano Diretor Municipal',
        summary: 'A Prefeitura de Baturité inicia o processo de revisão do Plano Diretor e convida a comunidade a participar ativamente da construção do futuro da nossa cidade.',
        description: 'O Plano Diretor é a lei que orienta o desenvolvimento e o crescimento da cidade. Esta revisão é uma oportunidade para definirmos juntos as diretrizes para habitação, meio ambiente, mobilidade urbana e desenvolvimento econômico para os próximos 10 anos. Participe das audiências e envie suas sugestões.',
        imageUrl: 'https://picsum.photos/seed/planodiretor/800/400',
        status: StatusConsultaPublica.ENCERRADA,
        startDate: new Date('2024-05-01T00:00:00Z').toISOString(),
        endDate: new Date('2024-06-30T23:59:59Z').toISOString(),
        documentos: [
             { nome: 'Lei do Plano Diretor Atual.pdf', url: '#', icon: 'gavel' },
        ],
        opinioes: []
    }
];