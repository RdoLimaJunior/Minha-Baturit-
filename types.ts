// types.ts

// Enums
export enum UserRole {
  CIDADAO = 'Cidadão',
  GESTOR = 'Gestor',
}

export enum StatusProtocolo {
  RECEBIDO = 'Recebido',
  EM_ANDAMENTO = 'Em Andamento',
  RESOLVIDO = 'Resolvido',
  REJEITADO = 'Rejeitado',
}

export enum TipoProtocolo {
  RECLAMACAO = 'Reclamação',
  SUGESTAO = 'Sugestão',
  ELOGIO = 'Elogio',
  DENUNCIA = 'Denúncia',
}

export enum CategoriaReclamacao {
  ILUMINACAO = 'Iluminação Pública',
  VIAS = 'Vias e Buracos',
  LIMPEZA = 'Limpeza Urbana',
  PRACAS = 'Praças e Parques',
  OUTROS = 'Outros',
}

export enum CategoriaPredioPublico {
  SAUDE = 'Saúde',
  EDUCACAO = 'Educação',
  ASSISTENCIA = 'Assistência Social',
  ADMINISTRACAO = 'Administração',
}

export enum TurismoCategoria {
    PONTOS_TURISTICOS = 'Pontos Turísticos',
    GASTRONOMIA = 'Gastronomia',
    HOSPEDAGEM = 'Hospedagem',
    LAZER = 'Lazer e Entretenimento',
    CULTURA = 'Cultura'
}

export enum CategoriaContato {
    EMERGENCIA = 'Emergência',
    SAUDE = 'Saúde',
    SERVICOS = 'Serviços Públicos',
    OUTROS = 'Outros'
}

export enum CategoriaServicoOnline {
    ASSISTENCIA = 'Assistência Social',
    TRIBUTOS = 'Tributos e Finanças',
    EDUCACAO = 'Educação',
    SAUDE = 'Saúde',
    OUTROS = 'Outros Serviços'
}

export enum AgendamentoStatus {
    AGENDADO = 'Agendado',
    REALIZADO = 'Realizado',
    CANCELADO = 'Cancelado'
}

export enum TipoPublicacao {
  IDEIA = 'Ideia',
  PROBLEMA = 'Problema',
  ELOGIO = 'Elogio',
  EVENTO = 'Evento',
}

export enum StatusPublicacao {
  ABERTO = 'Aberto',
  EM_ANALISE = 'Em Análise',
  ENCAMINHADO = 'Encaminhado',
  CONCLUIDO = 'Concluído',
  REJEITADO = 'Rejeitado',
}

export enum StatusConsultaPublica {
  ABERTA = 'Aberta',
  ENCERRADA = 'Encerrada',
  EM_ANALISE = 'Em Análise',
}

// Interfaces and Types
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
}

export interface Noticia {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  date: string;
  likes: number;
  comments: Comment[];
  link: string;
}

export interface HistoricoProtocolo {
  status: StatusProtocolo;
  data: string;
  observacao?: string;
}

export interface Protocolo {
  id: string;
  protocolo: string;
  tipo: TipoProtocolo;
  categoria?: CategoriaReclamacao;
  descricao: string;
  dataAbertura: string;
  bairro: string;
  status: StatusProtocolo;
  historico: HistoricoProtocolo[];
  fotos?: string[];
}

export interface Secretaria {
    id: string;
    nome: string;
    secretario: string;
    cargo: string;
    avatarUrl: string;
    email: string;
    telefone: string;
    horario: string;
    endereco: string;
    link?: string;
}

export interface PredioPublico {
    id: string;
    nome: string;
    categoria: CategoriaPredioPublico;
    endereco: string;
    bairro: string;
    telefone: string;
    horario: string;
    localizacao: { latitude: number; longitude: number };
    isOpenNow: boolean;
    busyness?: string; // e.g., 'Pouco movimentado'
    servicos: string[];
    profissionais?: { nome: string; cargo: string; cargaHoraria: string }[];
    imagens: string[];
}

export interface TurismoItem {
    id: string;
    nome: string;
    categoria: TurismoCategoria;
    descricao: string;
    descricaoCurta: string;
    endereco: string;
    localizacao: { latitude: number; longitude: number };
    imagens: string[];
    contato?: string;
    site?: string;
}

export interface ContatoUtil {
    id: string;
    nome: string;
    telefone: string;
    categoria: CategoriaContato;
    icon: string;
}

export interface ServicoOnline {
    id: string;
    nome: string;
    descricao: string;
    categoria: CategoriaServicoOnline;
    icon: string;
}

export interface Agendamento {
    id: string;
    servicoId: string;
    servicoNome: string;
    servicoIcon: string;
    dataHora: string;
    status: AgendamentoStatus;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  link?: {
    view: View;
    params?: any;
  };
}

export interface PublicacaoAuthor {
    uid: string;
    name: string;
    avatar: string;
    isAnonymous: boolean;
}

export interface ComentarioPublicacao {
    id: string;
    author: { uid: string; name: string; avatar: string; };
    text: string;
    date: string;
    isOfficialReply: boolean;
}

export interface HistoricoPublicacao {
    status: StatusPublicacao;
    data: string;
    observacao?: string;
}

export interface Publicacao {
    id: string;
    author: PublicacaoAuthor;
    tipo: TipoPublicacao;
    title: string;
    resumo: string;
    descricao: string;
    bairro: string;
    fotos: string[];
    createdAt: string;
    status: StatusPublicacao;
    historico: HistoricoPublicacao[];
    comments: ComentarioPublicacao[];
    counts: {
        supports: number;
        comments: number;
    };
}

export interface OpiniaoConsulta {
    id: string;
    author: { uid: string; name: string; avatar: string; };
    text: string;
    date: string;
    supports: number;
}

export interface ConsultaPublica {
    id: string;
    title: string;
    summary: string;
    description: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
    status: StatusConsultaPublica;
    opinioes: OpiniaoConsulta[];
    documentos: { nome: string; url: string; icon: string }[];
}


export type View = 
  | 'DASHBOARD' | 'ABOUT'
  | 'PROTOCOLOS_LIST' | 'PROTOCOLO_DETAIL' | 'PROTOCOLO_FORM'
  | 'NOTICIAS_LIST' | 'NOTICIA_DETAIL'
  | 'SECRETARIAS_LIST' | 'MAPA_SERVICOS' | 'CONTATOS_LIST'
  | 'TURISMO_DASHBOARD' | 'TURISMO_LIST' | 'TURISMO_DETAIL'
  | 'SERVICOS_ONLINE_DASHBOARD' | 'SERVICO_FORM' | 'AGENDAMENTOS_LIST'
  | 'NOTIFICACOES_LIST' | 'SEARCH' | 'ACESSIBILIDADE'
  | 'PARTICIPACAO_FEED' | 'PARTICIPACAO_DETAIL' | 'PARTICIPACAO_FORM'
  | 'CONSULTAS_PUBLICAS_LIST' | 'CONSULTAS_PUBLICAS_DETAIL'
  | 'PREDIOS_POR_CATEGORIA_LIST';

export interface ChatAction {
  type: 'NAVIGATE' | 'OPEN_URL' | 'CALL';
  buttonText: string;
  payload: {
    view?: View;
    params?: any;
    url?: string;
    phoneNumber?: string;
  };
}

export interface ChatStructuredContent {
  address?: string;
  phone?: string;
  openingHours?: string;
  documents?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  actions?: ChatAction[];
  structuredContent?: ChatStructuredContent;
  feedback?: 'like' | 'dislike' | null;
}

export type Theme = 'light' | 'dark';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';
