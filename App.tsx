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
import Button from './components/ui/Button';
import Icon from './components/ui/Icon';


// As importações abaixo são для componentes de versões futuras e não são usadas на versão inicial.
import './components/onibus/OnibusTracker';
import './components/coleta/ColetaCalendar';
import './components/admin/AdminDashboard';


const AppContent: React.FC = () => {
  const [view, setView] = useState<View>('DASHBOARD');
  const [activeProtocoloId, setActiveProtocoloId] = useState<string | null>(null);
  const [activeNoticiaId, setActiveNoticiaId] = useState<string | null>(null);
  const [activeTurismoId, setActiveTurismoId] = useState<string | null>(null);
  const [activeTurismoCategoria, setActiveTurismoCategoria] = useState<TurismoCategoria | null>(null);
  const [activeServicoId, setActiveServicoId] = useState<string | null>(null);
  const [activePublicacaoId, setActivePublicacaoId] = useState<string | null>(null);
  const [activeConsultaId, setActiveConsultaId] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(MOCK_USER_PROFILES[0]);
  const [activeViewParams, setActiveViewParams] = useState<any>(null);
  

  const navigateTo = useCallback((newView: View, params: { [key: string]: any } | any = null) => {
    setView(newView);
    setActiveProtocoloId(params?.protocoloId || null);
    setActiveNoticiaId(params?.noticiaId || null);
    setActiveTurismoId(params?.turismoId || null);
    setActiveTurismoCategoria(params?.turismoCategoria || null);
    setActiveServicoId(params?.servicoId || null);
    setActivePublicacaoId(params?.publicacaoId || null);
    setActiveConsultaId(params?.consultaId || null);
    setActiveViewParams(params);
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
      case 'PROTOCOLOS_LIST':
        return <ProtocolosList navigateTo={navigateTo} />;
      case 'PROTOCOLO_DETAIL':
        return activeProtocoloId ? <ProtocoloDetail protocoloId={activeProtocoloId} goBack={() => navigateTo('PROTOCOLOS_LIST')} /> : <Dashboard navigateTo={navigateTo} userProfile={activeProfile} />;
      case 'PROTOCOLO_FORM':
        return <ProtocoloForm goBack={() => navigateTo('SERVICOS_DASHBOARD')} navigateTo={navigateTo} />;
      case 'NOTICIAS_LIST':
        return <NoticiasList navigateTo={navigateTo} />;
      case 'NOTICIA_DETAIL':
        return activeNoticiaId ? <NoticiaDetail noticiaId={activeNoticiaId} navigateTo={navigateTo} /> : <NoticiasList navigateTo={navigateTo} />;
      case 'SECRETARIAS_LIST':
        return <SecretariasList navigateTo={navigateTo} />;
      // FIX: Corrected typo 'MAPA_SERVICIOS' to 'MAPA_SERVICOS' to match the 'View' type.
      case 'MAPA_SERVICOS':
        return <MapaServicos navigateTo={navigateTo} {...activeViewParams} />;
      case 'TURISMO_DASHBOARD':
        return <TurismoDashboard navigateTo={navigateTo} />;
      case 'TURISMO_LIST':
        return activeTurismoCategoria ? <TurismoList categoria={activeTurismoCategoria} navigateTo={navigateTo} /> : <TurismoDashboard navigateTo={navigateTo} />;
      case 'TURISMO_DETAIL':
        return activeTurismoId && activeTurismoCategoria ? <TurismoDetail turismoId={activeTurismoId} categoria={activeTurismoCategoria} navigateTo={navigateTo} /> : <TurismoDashboard navigateTo={navigateTo} />;
      case 'CONTATOS_LIST':
        return <ContatosList navigateTo={navigateTo} />;
      case 'SERVICOS_ONLINE_DASHBOARD':
        return <ServicosOnlineDashboard navigateTo={navigateTo} />;
      case 'SERVICO_FORM':
        return activeServicoId ? <ServicoForm servicoId={activeServicoId} goBack={() => navigateTo('SERVICOS_ONLINE_DASHBOARD')} /> : <ServicosOnlineDashboard navigateTo={navigateTo} />;
      case 'AGENDAMENTOS_LIST':
        return <AgendamentosList navigateTo={navigateTo} />;
      case 'NOTIFICACOES_LIST':
        return <NotificacoesList navigateTo={navigateTo} />;
      case 'SERVICOS_DASHBOARD':
        return <ServicosDashboard navigateTo={navigateTo} />;
      case 'MAIS_DASHBOARD':
        return <MoreDashboard navigateTo={navigateTo} />;
      case 'SEARCH':
        return <Search navigateTo={navigateTo} />;
      case 'ACESSIBILIDADE':
        return <Acessibilidade navigateTo={navigateTo} />;
      case 'PARTICIPACAO_FEED':
        return <ParticipacaoFeed navigateTo={navigateTo} />;
      case 'PARTICIPACAO_DETAIL':
        return activePublicacaoId ? <ParticipacaoDetail publicacaoId={activePublicacaoId} navigateTo={navigateTo} /> : <ParticipacaoFeed navigateTo={navigateTo} />;
      case 'PARTICIPACAO_FORM':
        return <ParticipacaoForm goBack={() => navigateTo('PARTICIPACAO_FEED')} />;
      case 'CONSULTAS_PUBLICAS_LIST':
        return <ConsultasPublicasList navigateTo={navigateTo} />;
      case 'CONSULTAS_PUBLICAS_DETAIL':
        return activeConsultaId ? <ConsultaPublicaDetail consultaId={activeConsultaId} navigateTo={navigateTo} /> : <ConsultasPublicasList navigateTo={navigateTo} />;
      case 'PREDIOS_POR_CATEGORIA_LIST':
        return activeViewParams ? <PrediosPorCategoriaList navigateTo={navigateTo} {...activeViewParams} /> : <MoreDashboard navigateTo={navigateTo} />;
      default:
        return <Dashboard navigateTo={navigateTo} userProfile={activeProfile} />;
    }
  };
  
  const isDashboard = view === 'DASHBOARD';

  const mainContainerClass = isDashboard
    ? "flex-grow flex flex-col pb-20"
    : "flex-grow container mx-auto p-4 pb-20";

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