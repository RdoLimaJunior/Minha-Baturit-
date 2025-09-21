import React from 'react';
import Icon from './ui/Icon';
import { View } from '../types';

interface BottomNavProps {
  navigateTo: (view: View) => void;
  currentView: View;
}

const NavItem: React.FC<{ icon: string; label: string; view: View; isActive: boolean; onClick: (view: View) => void; }> = ({ icon, label, view, isActive, onClick }) => {
  const activeClasses = 'text-indigo-600';
  const inactiveClasses = 'text-slate-500 hover:text-slate-800';
  return (
    <button onClick={() => onClick(view)} className={`flex flex-col items-center justify-center space-y-1 w-full transition-colors ${isActive ? activeClasses : inactiveClasses}`}>
      <Icon name={icon} className="text-2xl" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

// --- View Groups for Active State Logic ---
const DASHBOARD_GROUP: View[] = ['DASHBOARD'];
const SERVICOS_GROUP: View[] = ['SERVICOS_DASHBOARD', 'PROTOCOLOS_LIST', 'PROTOCOLO_DETAIL', 'PROTOCOLO_FORM', 'SERVICOS_ONLINE_DASHBOARD', 'SERVICO_FORM', 'AGENDAMENTOS_LIST', 'CONSULTAS_PUBLICAS_LIST', 'CONSULTAS_PUBLICAS_DETAIL'];
const PARTICIPACAO_GROUP: View[] = ['PARTICIPACAO_FEED', 'PARTICIPACAO_DETAIL', 'PARTICIPACAO_FORM'];
const MAPA_GROUP: View[] = ['MAPA_SERVICOS'];
const MAIS_GROUP: View[] = ['MAIS_DASHBOARD', 'TURISMO_DASHBOARD', 'TURISMO_LIST', 'TURISMO_DETAIL', 'NOTICIAS_LIST', 'NOTICIA_DETAIL', 'SECRETARIAS_LIST', 'CONTATOS_LIST', 'PREDIOS_POR_CATEGORIA_LIST', 'ACESSIBILIDADE'];

const viewGroupMap: Record<string, View[]> = {
    DASHBOARD: DASHBOARD_GROUP,
    SERVICOS_DASHBOARD: SERVICOS_GROUP,
    PARTICIPACAO_FEED: PARTICIPACAO_GROUP,
    MAPA_SERVICOS: MAPA_GROUP,
    MAIS_DASHBOARD: MAIS_GROUP,
};

const BottomNav: React.FC<BottomNavProps> = ({ navigateTo, currentView }) => {
  const mainNavItems = [
    { icon: 'home', label: 'Início', view: 'DASHBOARD' as View },
    { icon: 'apps', label: 'Serviços', view: 'SERVICOS_DASHBOARD' as View },
    { icon: 'campaign', label: 'Participar', view: 'PARTICIPACAO_FEED' as View },
    { icon: 'map', label: 'Mapa', view: 'MAPA_SERVICOS' as View },
    { icon: 'more_horiz', label: 'Mais', view: 'MAIS_DASHBOARD' as View },
  ];
  
  const isViewActive = (view: View): boolean => {
    const group = viewGroupMap[view];
    return group ? group.includes(currentView) : false;
  };

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 flex justify-around items-center h-16">
        {mainNavItems.map((item, index) => {
          const isActive = isViewActive(item.view);
          if (index === 2) { // Central button
            return (
              <div key={item.view} className="w-1/5 flex justify-center">
                  <button 
                    onClick={() => navigateTo(item.view)} 
                    className={`-translate-y-5 w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 ${isActive ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                    aria-label="Participar da Cidade"
                  >
                      <Icon name="campaign" className="text-3xl" />
                      <span className="text-xs font-bold tracking-tighter mt-0.5">Participar</span>
                  </button>
              </div>
            );
          }
          return (
            <div key={item.view} className="w-1/5">
              <NavItem 
                {...item}
                isActive={isActive}
                onClick={navigateTo}
              />
            </div>
          );
        })}
      </div>
    </footer>
  );
};

export default BottomNav;