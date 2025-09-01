

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
import { UserProfile, View, TurismoCategoria } from './types';
import { MOCK_USER_PROFILES } from './constants';
import { ToastProvider } from './components/ui/Toast';
import BottomNav from './components/BottomNav';
import ServicosDashboard from './components/servicos/ServicosDashboard';
import MoreDashboard from './components/more/MoreDashboard';
import Search from './components/search/Search';


// As importações abaixo são para componentes de versões futuras e não são usadas na versão inicial.
import './components/onibus/OnibusTracker';
import './components/coleta/ColetaCalendar';
import './components/admin/AdminDashboard';


const App: React.FC = () => {
  const [view, setView] = useState<View>('DASHBOARD');
  const [activeProtocoloId, setActiveProtocoloId] = useState<string | null>(null);
  const [activeNoticiaId, setActiveNoticiaId] = useState<string | null>(null);
  const [activeTurismoId, setActiveTurismoId] = useState<string | null>(null);
  const [activeTurismoCategoria, setActiveTurismoCategoria] = useState<TurismoCategoria | null>(null);
  const [activeServicoId, setActiveServicoId] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(MOCK_USER_PROFILES[0]);
  

  const navigateTo = useCallback((newView: View, params: { protocoloId?: string; noticiaId?: string; turismoId?: string; turismoCategoria?: TurismoCategoria, servicoId?: string } | null = null) => {
    setView(newView);
    setActiveProtocoloId(params?.protocoloId || null);
    setActiveNoticiaId(params?.noticiaId || null);
    setActiveTurismoId(params?.turismoId || null);
    setActiveTurismoCategoria(params?.turismoCategoria || null);
    setActiveServicoId(params?.servicoId || null);
    window.scrollTo(0, 0);
  }, []);
  
  const handleProfileChange = () => {
    const nextProfileIndex = (MOCK_USER_PROFILES.findIndex(p => p.id === activeProfile.id) + 1) % MOCK_USER_PROFILES.length;
    setActiveProfile(MOCK_USER_PROFILES[nextProfileIndex]);
    navigateTo('DASHBOARD');
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
        return <ProtocoloForm goBack={() => navigateTo('SERVICOS_DASHBOARD')} />;
      case 'NOTICIAS_LIST':
        return <NoticiasList navigateTo={navigateTo} />;
      case 'NOTICIA_DETAIL':
        return activeNoticiaId ? <NoticiaDetail noticiaId={activeNoticiaId} navigateTo={navigateTo} /> : <NoticiasList navigateTo={navigateTo} />;
      case 'SECRETARIAS_LIST':
        return <SecretariasList navigateTo={navigateTo} />;
      // FIX: Corrected typo 'MAPA_SERVICIOS' to 'MAPA_SERVICOS' to match the 'View' type.
      case 'MAPA_SERVICOS':
        return <MapaServicos navigateTo={navigateTo} />;
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
      default:
        return <Dashboard navigateTo={navigateTo} userProfile={activeProfile} />;
    }
  };

  const mainContainerClass = view === 'DASHBOARD' 
    ? "flex-grow pb-20"
    : "flex-grow container mx-auto p-4 pb-20";

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col font-sans bg-slate-100">
        <Header activeProfile={activeProfile} onProfileChange={handleProfileChange} navigateTo={navigateTo}/>
        
        <main className={mainContainerClass}>
          {renderView()}
        </main>
        
        <BottomNav navigateTo={navigateTo} currentView={view} />
      </div>
    </ToastProvider>
  );
};

export default App;