export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';

export type View = 
  | 'DASHBOARD'
  | 'PROTOCOLOS_LIST'
  | 'PROTOCOLO_DETAIL'
  | 'PROTOCOLO_FORM'
  | 'NOTICIAS_LIST'
  | 'NOTICIA_DETAIL'
  | 'SECRETARIAS_LIST'
  | 'MAPA_SERVICOS'
  | 'TURISMO_DASHBOARD'
  | 'TURISMO_LIST'
  | 'TURISMO_DETAIL'
  | 'CONTATOS_LIST'
  | 'SERVICOS_ONLINE_DASHBOARD'
  | 'SERVICO_FORM'
  | 'AGENDAMENTOS_LIST'
  | 'NOTIFICACOES_LIST'
  | 'SERVICOS_DASHBOARD'
  | 'MAIS_DASHBOARD'
  | 'SEARCH'
  | 'ACESSIBILIDADE'
  | 'PARTICIPACAO_FEED'
  | 'PARTICIPACAO_DETAIL'
  | 'PARTICIPACAO_FORM'
  | 'CONSULTAS_PUBLICAS_LIST'
  | 'CONSULTAS_PUBLICAS_DETAIL'
  | 'PREDIOS_POR_CATEGORIA_LIST';

export enum TipoProtocolo {
  RECLAMACAO = 'Reclamação',
  SUGESTAO = 'Sugestão',
  DENUNCIA = 'Denúncia',
  ELOGIO = 'Elogio',
}

export enum CategoriaReclamacao {
  ILUMINACAO = 'Iluminação Pública',
  BURACO_VIA = 'Buraco na Via',
  LIXO = 'Coleta de Lixo',
  OBRAS = 'Obras e Reparos',
  SANEAMENTO = 'Saneamento Básico',
  OUTRO = 'Outro',
}

export enum StatusProtocolo {
  RECEBIDO = 'Recebido',
  EM_ANDAMENTO = 'Em Andamento',
  RESOLVIDO = 'Resolvido',
  REJEITADO = 'Rejeitado',
}

export interface HistoricoProtocolo {
  status: StatusProtocolo;
  data: string;
  observacao?: string;
}

export interface Protocolo {
  id: string;
  protocolo: string;
  userId: string;
  tipo: TipoProtocolo;
  categoria?: CategoriaReclamacao;
  descricao: string;
  localizacao?: {
    lat: number;
    lng: number;
  };
  fotos?: string[];
  status: StatusProtocolo;
  dataAbertura: string;
  dataAtualizacao: string;
  historico: HistoricoProtocolo[];
  bairro: string;
}

export enum UserRole {
  CIDADAO = 'Cidadão',
  GESTOR = 'Gestor Público',
}

export interface UserProfile {
    id: string;
    name: string;
    role: UserRole;
    avatar: string;
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
  date: string;
  imageUrl: string;
  link: string;
  likes: number;
  comments: Comment[];
}

export interface Secretaria {
  id: string;
  nome: string;
  secretario: string;
  cargo: string;
  avatarUrl: string;
  endereco: string;
  telefone: string;
  email: string;
  horario: string;
  link?: string;
}

export type CategoriaPredioPublico = 'Saúde' | 'Educação' | 'Assistência Social' | 'Administração';

export interface Profissional {
  nome: string;
  cargo: string;
  cargaHoraria: string;
}

export interface PredioPublico {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  telefone: string;
  email?: string;
  categoria: CategoriaPredioPublico;
  horario: string;
  servicos: string[];
  localizacao: {
    latitude: number;
    longitude: number;
  };
  isOpenNow: boolean;
  busyness?: string;
  imagens?: string[];
  profissionais?: Profissional[];
}

export type TurismoCategoria = 'Gastronomia' | 'Lazer e Entretenimento' | 'Hospedagem' | 'Pontos Turísticos' | 'Cultura';

export interface TurismoItem {
  id: string;
  categoria: TurismoCategoria;
  nome: string;
  descricao: string;
  descricaoCurta: string;
  endereco: string;
  contato?: string;
  site?: string;
  localizacao: {
    latitude: number;
    longitude: number;
  };
  imagens: string[];
}

export type ActionType = 'NAVIGATE' | 'OPEN_URL' | 'CALL';

export interface ActionPayload {
    view?: View;
    params?: any;
    url?: string;
    phoneNumber?: string;
}

export interface ChatAction {
    type: ActionType;
    buttonText: string;
    payload: ActionPayload;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  actions?: ChatAction[];
  structuredContent?: {
      address?: string;
      phone?: string;
      openingHours?: string;
      documents?: string[];
  };
  feedback?: 'like' | 'dislike' | null;
}

export enum CategoriaContato {
  EMERGENCIA = 'Emergência',
  SERVICOS = 'Serviços Municipais',
  SAUDE = 'Saúde',
  OUTROS = 'Outros',
}

export interface ContatoUtil {
  id: string;
  categoria: CategoriaContato;
  nome: string;
  telefone: string;
  icon: string; // Material Icon name
}

export enum CategoriaServicoOnline {
  ASSISTENCIA = 'Assistência Social',
  TRIBUTOS = 'Tributos e Finanças',
  EDUCACAO = 'Educação',
  SAUDE = 'Saúde',
  OUTROS = 'Outros Serviços',
}

export interface ServicoOnline {
  id: string;
  categoria: CategoriaServicoOnline;
  nome: string;
  descricao: string;
  icon: string; // Material Icon name
  requiresAuth: boolean;
}

export enum AgendamentoStatus {
  AGENDADO = 'Agendado',
  CANCELADO = 'Cancelado',
  REALIZADO = 'Realizado',
}

export interface Agendamento {
  id: string;
  userId: string;
  servicoId: string;
  servicoNome: string;
  servicoIcon: string;
  dataHora: string;
  status: AgendamentoStatus;
  lembreteAtivo: boolean;
}

export interface Notificacao {
  id: string;
  userId: string;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  link?: {
    view: View;
    params?: any;
  };
}

// --- Tipos para Participação Pública ---

export enum TipoPublicacao {
  IDEIA = 'Ideia',
  PROBLEMA = 'Problema',
  ELOGIO = 'Elogio',
  EVENTO = 'Evento',
}

export enum StatusPublicacao {
  ABERTO = 'Aberto',
  EM_ANALISE = 'Em análise',
  ENCAMINHADO = 'Encaminhado',
  CONCLUIDO = 'Concluído',
  REJEITADO = 'Rejeitado', // Adicionado para moderação
}

export interface ComentarioPublicacao {
  id: string;
  author: {
    uid: string;
    name: string;
    avatar: string;
  };
  text: string;
  date: string;
  isOfficialReply: boolean;
}

export interface HistoricoPublicacao {
  status: StatusPublicacao;
  data: string;
  observacao?: string;
  responsavel?: string; // e.g., "Secretaria de Obras"
}


export interface Publicacao {
  id: string;
  tipo: TipoPublicacao;
  title: string;
  resumo: string;
  descricao: string;
  bairro: string;
  tags?: string[];
  fotos?: string[];
  localizacao?: { lat: number; lng: number };
  author: {
    uid: string;
    name: string;
    avatar: string;
    isAnonymous: boolean;
  };
  counts: {
    supports: number;
    comments: number;
  };
  status: StatusPublicacao;
  createdAt: string;
  updatedAt: string;
  comments: ComentarioPublicacao[];
  historico: HistoricoPublicacao[];
}

// --- Tipos para Consultas Públicas ---

export enum StatusConsultaPublica {
  ABERTA = 'Aberta',
  ENCERRADA = 'Encerrada',
  EM_ANALISE = 'Resultados em Análise',
}

export interface OpiniaoConsulta {
  id: string;
  author: {
    uid:string;
    name: string;
    avatar: string;
  };
  text: string;
  date: string;
  supports: number;
}

export interface DocumentoConsulta {
  nome: string;
  url: string;
  icon: string; // Material Icon name
}

export interface ConsultaPublica {
  id: string;
  title: string;
  summary: string;
  description: string;
  imageUrl: string;
  status: StatusConsultaPublica;
  startDate: string;
  endDate: string;
  documentos?: DocumentoConsulta[];
  opinioes: OpiniaoConsulta[];
}