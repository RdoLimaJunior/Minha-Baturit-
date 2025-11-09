import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { UserProfile, UserRole, CategoriaPredioPublico, TurismoCategoria } from './types';
import { MOCK_USER_PROFILES } from './constants';

// Providers
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { ToastProvider } from './components/ui/Toast';

// Layout Components
import Header from './components/Header';
import Page from './components/ui/Page';
import BottomNav from './components/BottomNav';

// View Components
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
import Search from './components/search/Search';
import Acessibilidade from './components/acessibilidade/Acessibilidade';
import ParticipacaoFeed from './components/participacao/ParticipacaoFeed';
import ParticipacaoDetail from './components/participacao/ParticipacaoDetail';
import ParticipacaoForm from './components/participacao/ParticipacaoForm';
import ConsultasPublicasList from './components/consultas/ConsultasPublicasList';
import ConsultaPublicaDetail from './components/consultas/ConsultaPublicaDetail';
import PrediosPorCategoriaList from './components/predios/PrediosPorCategoriaList';
import WelcomeScreen from './components/welcome/WelcomeScreen';
import About from './components/About';

// --- Wrappers for components that need URL params ---

const ProtocoloDetailWrapper: React.FC = () => {
    const { protocoloId } = useParams<{ protocoloId: string }>();
    return <ProtocoloDetail protocoloId={protocoloId!} />;
};

const NoticiaDetailWrapper: React.FC = () => {
    const { noticiaId } = useParams<{ noticiaId: string }>();
    return <NoticiaDetail noticiaId={noticiaId!} />;
};

const MapaServicosWrapper: React.FC = () => {
    const { predioId, turismoId } = useParams<{ predioId?: string; turismoId?: string }>();
    return <MapaServicos predioId={predioId} turismoId={turismoId} />;
};

const PrediosPorCategoriaListWrapper: React.FC = () => {
    const { categoria, titulo } = useParams<{ categoria: CategoriaPredioPublico, titulo: string }>();
    // Note: The icon property cannot be passed through URL params easily.
    // It should be derived from the 'categoria' or handled differently if dynamic.
    const iconMap: Record<CategoriaPredioPublico, string> = {
        'Saúde': 'local_hospital',
        'Educação': 'school',
        'Assistência Social': 'people',
        'Administração': 'corporate_fare',
    };
    return <PrediosPorCategoriaList categoria={categoria!} titulo={titulo!} icon={iconMap[categoria!]} />;
};

const TurismoListWrapper: React.FC = () => {
    const { categoria } = useParams<{ categoria: TurismoCategoria }>();
    return <TurismoList categoria={categoria!} />;
};

const TurismoDetailWrapper: React.FC = () => {
    const { turismoId, categoria } = useParams<{ turismoId: string; categoria: TurismoCategoria }>();
    return <TurismoDetail turismoId={turismoId!} categoria={categoria!} />;
};

const ServicoFormWrapper: React.FC = () => {
    const { servicoId } = useParams<{ servicoId: string }>();
    return <ServicoForm servicoId={servicoId!} />;
};

const ParticipacaoDetailWrapper: React.FC = () => {
    const { publicacaoId } = useParams<{ publicacaoId: string }>();
    return <ParticipacaoDetail publicacaoId={publicacaoId!} />;
};

const ConsultaPublicaDetailWrapper: React.FC = () => {
    const { consultaId } = useParams<{ consultaId: string }>();
    return <ConsultaPublicaDetail consultaId={consultaId!} />;
};

const AppContent: React.FC<{
    activeProfile: UserProfile;
    onProfileChange: () => void;
}> = ({ activeProfile, onProfileChange }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans antialiased">
            <Header activeProfile={activeProfile} onProfileChange={onProfileChange} />
            <main className="flex-1 overflow-y-auto pb-24">
                <Routes>
                    {/* Fullscreen Views */}
                    <Route path="/" element={<Dashboard userProfile={activeProfile} />} />
                    <Route path="/participacao" element={<ParticipacaoFeed />} />
                    <Route path="/mapa" element={<MapaServicosWrapper />} />
                    <Route path="/mapa/predio/:predioId" element={<MapaServicosWrapper />} />
                    <Route path="/mapa/turismo/:turismoId" element={<MapaServicosWrapper />} />
                    <Route path="/search" element={<Search />} />

                    {/* Page-wrapped Views */}
                    <Route path="/about" element={<Page title="Sobre o App"><About /></Page>} />
                    <Route path="/protocolos" element={<Page title="Meus Protocolos"><ProtocolosList /></Page>} />
                    <Route path="/protocolos/novo" element={<Page title="Abrir Protocolo"><ProtocoloForm /></Page>} />
                    <Route path="/protocolos/:protocoloId" element={<Page title="Detalhes do Protocolo"><ProtocoloDetailWrapper /></Page>} />
                    <Route path="/noticias" element={<Page title="Notícias"><NoticiasList /></Page>} />
                    <Route path="/noticias/:noticiaId" element={<Page title="Detalhes da Notícia"><NoticiaDetailWrapper /></Page>} />
                    <Route path="/secretarias" element={<Page title="Secretarias Municipais"><SecretariasList /></Page>} />
                    <Route path="/locais/:categoria/:titulo" element={<Page title="Locais"><PrediosPorCategoriaListWrapper /></Page>} />
                    <Route path="/turismo" element={<Page title="Turismo em Baturité"><TurismoDashboard /></Page>} />
                    <Route path="/turismo/lista/:categoria" element={<Page title="Turismo"><TurismoListWrapper /></Page>} />
                    <Route path="/turismo/detalhe/:categoria/:turismoId" element={<Page title="Detalhes"><TurismoDetailWrapper /></Page>} />
                    <Route path="/contatos" element={<Page title="Contatos Úteis"><ContatosList /></Page>} />
                    <Route path="/servicos" element={<Page title="Serviços Online"><ServicosOnlineDashboard /></Page>} />
                    <Route path="/servicos/agendar/:servicoId" element={<Page title="Agendamento de Serviço"><ServicoFormWrapper /></Page>} />
                    <Route path="/agendamentos" element={<Page title="Meus Agendamentos"><AgendamentosList /></Page>} />
                    <Route path="/notificacoes" element={<Page title="Notificações"><NotificacoesList /></Page>} />
                    <Route path="/acessibilidade" element={<Page title="Acessibilidade"><Acessibilidade /></Page>} />
                    <Route path="/participacao/detalhe/:publicacaoId" element={<Page title="Detalhes da Publicação"><ParticipacaoDetailWrapper /></Page>} />
                    <Route path="/participacao/novo" element={<Page title="Criar Publicação"><ParticipacaoForm /></Page>} />
                    <Route path="/consultas" element={<Page title="Consultas Públicas"><ConsultasPublicasList /></Page>} />
                    <Route path="/consultas/:consultaId" element={<Page title="Detalhes da Consulta"><ConsultaPublicaDetailWrapper /></Page>} />
                </Routes>
            </main>
            <BottomNav />
        </div>
    );
};

const App: React.FC = () => {
    const [activeProfile, setActiveProfile] = useState<UserProfile>(MOCK_USER_PROFILES[0]);
    const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('hasVisited'));

    useEffect(() => {
        if ('serviceWorker' in navigator) {
          const registerSW = () => {
            // Construct the URL dynamically to ensure it's on the same origin.
            // This fixes the cross-origin registration error.
            const swUrl = new URL('service-worker.js', window.location.href).href;
            navigator.serviceWorker.register(swUrl)
              .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
              })
              .catch(error => {
                console.error('Service Worker registration failed:', error);
              });
          };
    
          // The 'load' event fires when the whole page has loaded,
          // including all dependent resources such as stylesheets and images.
          // This is the safest moment to register a service worker.
          window.addEventListener('load', registerSW);
    
          // Cleanup the event listener when the component unmounts.
          return () => {
            window.removeEventListener('load', registerSW);
          };
        }
    }, []);

    const handleProfileChange = () => {
        const newProfile = activeProfile.role === UserRole.CIDADAO ? MOCK_USER_PROFILES[1] : MOCK_USER_PROFILES[0];
        setActiveProfile(newProfile);
        // In a router-based app, navigation to home on profile change is a good practice.
        // This will be handled by the component triggering the change if needed.
    };
    
    const handleWelcomeComplete = () => {
        localStorage.setItem('hasVisited', 'true');
        setShowWelcome(false);
    };

    if (showWelcome) {
        return <WelcomeScreen onComplete={handleWelcomeComplete} />;
    }
  
    return (
        <AccessibilityProvider>
            <ToastProvider>
                <HashRouter>
                    <AppContent activeProfile={activeProfile} onProfileChange={handleProfileChange} />
                </HashRouter>
            </ToastProvider>
        </AccessibilityProvider>
    );
};

export default App;