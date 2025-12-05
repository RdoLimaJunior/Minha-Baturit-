import React, { useState, Suspense } from 'react';
import { HashRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { UserProfile, UserRole, CategoriaPredioPublico, TurismoCategoria } from './types';
import { MOCK_USER_PROFILES } from './constants';

// Providers
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { ToastProvider } from './components/ui/Toast';
import { WeatherProvider } from './hooks/useWeather';

// Layout Components
import Header from './components/Header';
import Page from './components/ui/Page';
import BottomNav from './components/BottomNav';
import LoadingScreen from './components/ui/LoadingScreen';

// Lazy Loaded View Components
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ProtocolosList = React.lazy(() => import('./components/protocolos/ProtocolosList'));
const ProtocoloDetail = React.lazy(() => import('./components/protocolos/ProtocoloDetail'));
const ProtocoloForm = React.lazy(() => import('./components/protocolos/ProtocoloForm'));
const NoticiasList = React.lazy(() => import('./components/noticias/NoticiasList'));
const NoticiaDetail = React.lazy(() => import('./components/noticias/NoticiaDetail'));
const SecretariasList = React.lazy(() => import('./components/secretarias/SecretariasList'));
const MapaServicos = React.lazy(() => import('./components/mapa/MapaServicos'));
const TurismoDashboard = React.lazy(() => import('./components/turismo/TurismoDashboard'));
const TurismoList = React.lazy(() => import('./components/turismo/TurismoList'));
const TurismoDetail = React.lazy(() => import('./components/turismo/TurismoDetail'));
const ContatosList = React.lazy(() => import('./components/contatos/ContatosList'));
const ServicosHub = React.lazy(() => import('./components/servicos/ServicosHub'));
const ServicoForm = React.lazy(() => import('./components/servicos/ServicoForm'));
const AgendamentosList = React.lazy(() => import('./components/agendamentos/AgendamentosList'));
const NotificacoesList = React.lazy(() => import('./components/notificacoes/NotificacoesList'));
const Search = React.lazy(() => import('./components/search/Search'));
const Acessibilidade = React.lazy(() => import('./components/acessibilidade/Acessibilidade'));
const ParticipacaoDashboard = React.lazy(() => import('./components/participacao/ParticipacaoDashboard'));
const ParticipacaoFeed = React.lazy(() => import('./components/participacao/ParticipacaoFeed'));
const ParticipacaoDetail = React.lazy(() => import('./components/participacao/ParticipacaoDetail'));
const ParticipacaoForm = React.lazy(() => import('./components/participacao/ParticipacaoForm'));
const ConsultasPublicasList = React.lazy(() => import('./components/consultas/ConsultasPublicasList'));
const ConsultaPublicaDetail = React.lazy(() => import('./components/consultas/ConsultaPublicaDetail'));
const PrediosPorCategoriaList = React.lazy(() => import('./components/predios/PrediosPorCategoriaList'));
const About = React.lazy(() => import('./components/About'));

// --- Wrappers for components that need URL params ---

const ProtocoloDetailWrapper: React.FC = () => {
    const { protocoloId } = useParams<{ protocoloId?: string }>();
    return <ProtocoloDetail protocoloId={protocoloId} />;
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
    const iconMap: Record<CategoriaPredioPublico, string> = {
        'Saúde': 'local_hospital',
        'Educação': 'school',
        'Assistência Social': 'people',
        'Administração': 'corporate_fare',
    };
    const icon = (categoria && iconMap[categoria]) ? iconMap[categoria] : 'location_on';
    return <PrediosPorCategoriaList categoria={categoria!} titulo={titulo!} icon={icon} />;
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
    return (
        <div className="flex flex-col w-full h-screen bg-slate-50 font-sans antialiased overflow-hidden relative">
            <Header activeProfile={activeProfile} onProfileChange={onProfileChange} />
            <main className="flex-1 overflow-y-auto pb-24 scroll-smooth w-full">
                <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                        {/* Fullscreen Views */}
                        <Route path="/" element={<Dashboard userProfile={activeProfile} />} />
                        <Route path="/mapa" element={<MapaServicosWrapper />} />
                        <Route path="/mapa/predio/:predioId" element={<MapaServicosWrapper />} />
                        <Route path="/mapa/turismo/:turismoId" element={<MapaServicosWrapper />} />
                        <Route path="/search" element={<Search />} />

                        {/* Page-wrapped Views */}
                        <Route path="/about" element={<Page title="Sobre o App"><About /></Page>} />
                        <Route path="/protocolos" element={<Page title="Meus Protocolos"><ProtocolosList /></Page>} />
                        <Route path="/protocolos/novo" element={<Page title="Abrir Protocolo"><ProtocoloForm /></Page>} />
                        <Route path="/protocolos/:protocoloId?" element={<Page title="Detalhes do Protocolo"><ProtocoloDetailWrapper /></Page>} />
                        <Route path="/noticias" element={<Page title="Notícias"><NoticiasList /></Page>} />
                        <Route path="/noticias/:noticiaId" element={<Page title="Detalhes da Notícia"><NoticiaDetailWrapper /></Page>} />
                        <Route path="/secretarias" element={<Page title="Secretarias Municipais"><SecretariasList /></Page>} />
                        <Route path="/locais/:categoria/:titulo" element={<Page title="Locais"><PrediosPorCategoriaListWrapper /></Page>} />
                        <Route path="/turismo" element={<Page title="Turismo em Baturité"><TurismoDashboard /></Page>} />
                        <Route path="/turismo/lista/:categoria" element={<Page title="Turismo"><TurismoListWrapper /></Page>} />
                        <Route path="/turismo/detalhe/:categoria/:turismoId" element={<Page title="Detalhes"><TurismoDetailWrapper /></Page>} />
                        <Route path="/contatos" element={<Page title="Contatos Úteis"><ContatosList /></Page>} />
                        <Route path="/servicos" element={<Page title="Serviços e Informações"><ServicosHub /></Page>} />
                        <Route path="/servicos/agendar/:servicoId" element={<Page title="Agendamento de Serviço"><ServicoFormWrapper /></Page>} />
                        <Route path="/agendamentos" element={<Page title="Meus Agendamentos"><AgendamentosList /></Page>} />
                        <Route path="/notificacoes" element={<Page title="Notificações"><NotificacoesList /></Page>} />
                        <Route path="/acessibilidade" element={<Page title="Acessibilidade"><Acessibilidade /></Page>} />
                        <Route path="/participacao" element={<Page title="Participação Pública"><ParticipacaoDashboard /></Page>} />
                        <Route path="/participacao/feed" element={<Page title="Participação Cidadã"><ParticipacaoFeed /></Page>} />
                        <Route path="/participacao/detalhe/:publicacaoId" element={<Page title="Detalhes da Publicação"><ParticipacaoDetailWrapper /></Page>} />
                        <Route path="/participacao/novo" element={<Page title="Criar Publicação"><ParticipacaoForm /></Page>} />
                        <Route path="/consultas" element={<Page title="Consultas Públicas"><ConsultasPublicasList /></Page>} />
                        <Route path="/consultas/:consultaId" element={<Page title="Detalhes da Consulta"><ConsultaPublicaDetailWrapper /></Page>} />
                        
                        {/* Fallback route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </main>
            <BottomNav />
        </div>
    );
};

const App: React.FC = () => {
    const initialProfile = (MOCK_USER_PROFILES && MOCK_USER_PROFILES.length > 0) 
        ? MOCK_USER_PROFILES[0] 
        : { id: 'default', name: 'Usuário', avatar: '', role: UserRole.CIDADAO };

    const [activeProfile, setActiveProfile] = useState<UserProfile>(initialProfile);

    const handleProfileChange = () => {
        const newProfile = activeProfile.role === UserRole.CIDADAO 
            ? ((MOCK_USER_PROFILES && MOCK_USER_PROFILES.length > 1) ? MOCK_USER_PROFILES[1] : initialProfile)
            : initialProfile;
        setActiveProfile(newProfile);
    };
  
    return (
        <AccessibilityProvider>
            <ToastProvider>
                <WeatherProvider>
                    <HashRouter>
                        <AppContent activeProfile={activeProfile} onProfileChange={handleProfileChange} />
                    </HashRouter>
                </WeatherProvider>
            </ToastProvider>
        </AccessibilityProvider>
    );
};

export default App;