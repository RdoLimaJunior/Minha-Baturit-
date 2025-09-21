

import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProtocolosList from './components/protocolos/ProtocolosList';
import ProtocoloDetail from './components/protocolos/ProtocoloDetail';
import ProtocoloForm from './components/protocolos/ProtocoloForm';
import NoticiasList from './components/noticias/NoticiasList';
import NoticiaDetail from './components/noticias/NoticiaDetail';
import SecretariasList from './components/secretarias/SecretariasList';
import MapaServicos from './components/mapa/MapaServicos';
import TurismoDashboard from './components/turismo/TurismoDashboard';
import TurismoList from './components/turismo/TurismoList';
import TurismoDetail from './components/turismo/TurismoDetail';
import ContatosList from './components/contatos/ContatosList';
import ServicosOnlineDashboard from './components/servicos/ServicosOnlineDashboard';
import ServicoForm from './components/servicos/ServicoForm';
import AgendamentosList from './components/agendamentos/AgendamentosList';
import NotificacoesList from './components/notificacoes/NotificacoesList';
import Acessibilidade from './components/acessibilidade/Acessibilidade';
import { UserProfile, View, TurismoCategoria } from './types';
import { MOCK_USER_PROFILES } from './constants';
import { ToastProvider } from './components/ui/Toast';
import BottomNav from './components/BottomNav';
import ServicosDashboard from './components/servicos/ServicosDashboard';
import MoreDashboard from './components/more/MoreDashboard';
import Search from './components/search/Search';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import ParticipacaoFeed from './components/participacao/ParticipacaoFeed';
import ParticipacaoDetail from './components/participacao/ParticipacaoDetail';
import ParticipacaoForm from './components/participacao/ParticipacaoForm';
import ConsultasPublicasList from './components/consultas/ConsultasPublicasList';
import ConsultaPublicaDetail from './components/consultas/ConsultaPublicaDetail';
import PrediosPorCategoriaList from './components/predios/PrediosPorCategoriaList';
import Page from './components/ui/Page';

// As importações abaixo são para componentes de versões futuras e não são usadas na versão inicial.
import './components/onibus/OnibusTracker';
import './components/coleta/ColetaCalendar';
import './components/admin/AdminDashboard';


const AppContent: React.FC = () => {
  const [view, setView] = useState<View>('DASHBOARD');
  const [activeParams, setActiveParams] = useState<any>(null);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(MOCK_USER_PROFILES[0]);
  
  const navigateTo = useCallback((newView: View, params: any = {}) => {
    setView(newView);
    setActiveParams(params);
    window.scrollTo(0, 0);
  }, []);
  
  const handleProfileChange = () => {
    const nextProfileIndex = (MOCK_USER_PROFILES.findIndex(p => p.id === activeProfile.id) + 1) % MOCK_USER_PROFILES.length;
    setActiveProfile(MOCK_USER_PROFILES[nextProfileIndex]);
    navigateTo('DASHBOARD');
  };

  const handleBottomNav = (view: View) => {
    navigateTo(view);
  };

  const renderView = () => {
    switch (view) {
      case 'DASHBOARD':
        return <Dashboard navigateTo={navigateTo} userProfile={activeProfile} />;
      
      // --- FLUXO DE SERVIÇOS ---
      case 'SERVICOS_DASHBOARD':
        return <ServicosDashboard navigateTo={navigateTo} />;
      case 'AGENDAMENTOS_LIST':
        return <Page title="Agenda do Cidadão" goBack={() => navigateTo('SERVICOS_DASHBOARD')}><AgendamentosList navigateTo={navigateTo} /></Page>;
      case 'PROTOCOLO_FORM':
        return <Page title="Participação Cidadã" goBack={() => navigateTo('SERVICOS_DASHBOARD')}><ProtocoloForm navigateTo={navigateTo} goBack={() => navigateTo('SERVICOS_DASHBOARD')} /></Page>;
      case 'PROTOCOLOS_LIST':
        return <Page title="Meus Protocolos" goBack={() => navigateTo('PROTOCOLO_FORM')}><ProtocolosList navigateTo={navigateTo} /></Page>;
      case 'PROTOCOLO_DETAIL':
        return <Page title="Detalhes do Protocolo" goBack={() => navigateTo('PROTOCOLOS_LIST')}><ProtocoloDetail protocoloId={activeParams.protocoloId} /></Page>;
      case 'CONSULTAS_PUBLICAS_LIST':
        return <Page title="Consultas Públicas" goBack={() => navigateTo('SERVICOS_DASHBOARD')}><ConsultasPublicasList navigateTo={navigateTo} /></Page>;
      case 'CONSULTAS_PUBLICAS_DETAIL':
        return <Page title="Detalhes da Consulta" goBack={() => navigateTo('CONSULTAS_PUBLICAS_LIST')}><ConsultaPublicaDetail consultaId={activeParams.consultaId} navigateTo={navigateTo} /></Page>;
      case 'SERVICOS_ONLINE_DASHBOARD':
        return <Page title="Serviços Online" goBack={() => navigateTo('SERVICOS_DASHBOARD')}><ServicosOnlineDashboard navigateTo={navigateTo} /></Page>;
      case 'SERVICO_FORM':
        return <Page title="Agendamento de Serviço" goBack={() => navigateTo('SERVICOS_ONLINE_DASHBOARD')}><ServicoForm servicoId={activeParams.servicoId} goBack={() => navigateTo('SERVICOS_ONLINE_DASHBOARD')} /></Page>;
      
      // --- FLUXO DE PARTICIPAÇÃO ---
      case 'PARTICIPACAO_FEED':
        return <ParticipacaoFeed navigateTo={navigateTo} />;
      case 'PARTICIPACAO_DETAIL':
        return <Page title="Detalhes da Publicação" goBack={() => navigateTo('PARTICIPACAO_FEED')}><ParticipacaoDetail publicacaoId={activeParams.publicacaoId} navigateTo={navigateTo} /></Page>;
      case 'PARTICIPACAO_FORM':
        return <Page title="Criar Publicação" goBack={() => navigateTo('PARTICIPACAO_FEED')}><ParticipacaoForm goBack={() => navigateTo('PARTICIPACAO_FEED')} /></Page>;

      // --- FLUXO DO MAPA ---
      case 'MAPA_SERVICOS':
        return <Page title="Mapa Interativo" goBack={() => navigateTo('DASHBOARD')}><MapaServicos navigateTo={navigateTo} {...activeParams} /></Page>;

      // --- FLUXO 'MAIS' ---
      case 'MAIS_DASHBOARD':
        return <MoreDashboard navigateTo={navigateTo} />;
      case 'NOTICIAS_LIST':
        return <Page title="Últimas Notícias" goBack={() => navigateTo('MAIS_DASHBOARD')}><NoticiasList navigateTo={navigateTo} /></Page>;
      case 'NOTICIA_DETAIL':
        return <Page title="Detalhes da Notícia" goBack={() => navigateTo('NOTICIAS_LIST')}><NoticiaDetail noticiaId={activeParams.noticiaId} navigateTo={navigateTo} /></Page>;
      case 'SECRETARIAS_LIST':
        return <Page title="Secretarias Municipais" goBack={() => navigateTo('MAIS_DASHBOARD')}><SecretariasList navigateTo={navigateTo} /></Page>;
      case 'TURISMO_DASHBOARD':
        return <Page title="Cultura e Turismo" goBack={() => navigateTo('MAIS_DASHBOARD')}><TurismoDashboard navigateTo={navigateTo} /></Page>;
      case 'TURISMO_LIST':
        return <Page title={activeParams.turismoCategoria} goBack={() => navigateTo('TURISMO_DASHBOARD')}><TurismoList categoria={activeParams.turismoCategoria as TurismoCategoria} navigateTo={navigateTo} /></Page>;
      case 'TURISMO_DETAIL':
        return <Page title="Detalhes" goBack={() => navigateTo('TURISMO_LIST', { turismoCategoria: activeParams.turismoCategoria })}><TurismoDetail turismoId={activeParams.turismoId} categoria={activeParams.turismoCategoria as TurismoCategoria} navigateTo={navigateTo} /></Page>;
      case 'CONTATOS_LIST':
        return <Page title="Contatos Úteis" goBack={() => navigateTo('MAIS_DASHBOARD')}><ContatosList navigateTo={navigateTo} /></Page>;
      case 'PREDIOS_POR_CATEGORIA_LIST':
        return <Page title={activeParams.titulo} goBack={() => navigateTo('MAIS_DASHBOARD')}><PrediosPorCategoriaList navigateTo={navigateTo} {...activeParams} /></Page>;
      case 'ACESSIBILIDADE':
        return <Page title="Acessibilidade" goBack={() => navigateTo('MAIS_DASHBOARD')}><Acessibilidade /></Page>;
        
      // --- FLUXO GLOBAL / CABEÇALHO ---
      case 'SEARCH':
        return <Page title="Busca Global" goBack={() => navigateTo('DASHBOARD')}><Search navigateTo={navigateTo} /></Page>;
      case 'NOTIFICACOES_LIST':
        return <Page title="Notificações" goBack={() => navigateTo('DASHBOARD')}><NotificacoesList navigateTo={navigateTo} /></Page>;
        
      default:
        return <Dashboard navigateTo={navigateTo} userProfile={activeProfile} />;
    }
  };
  
  const isDashboard = view === 'DASHBOARD' || view === 'PARTICIPACAO_FEED';

  const mainContainerClass = isDashboard
    ? "flex-grow flex flex-col"
    : "flex-grow flex flex-col";

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header activeProfile={activeProfile} onProfileChange={handleProfileChange} navigateTo={navigateTo}/>
      
      <main className={mainContainerClass}>
        {renderView()}
      </main>
      
      <BottomNav navigateTo={handleBottomNav} currentView={view} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AccessibilityProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AccessibilityProvider>
  );
};

export default App;