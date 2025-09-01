



import React from 'react';
import Icon from './ui/Icon';
import { View } from '../types';

interface BottomNavProps {
  navigateTo: (view: View) => void;
  currentView: View;
}

const NavItem: React.FC<{ icon: string; label: string; view: View; isActive: boolean; onClick: (view: View) => void; }> = ({ icon, label, view, isActive, onClick }) => {
  const activeClasses = 'text-indigo-700';
  const inactiveClasses = 'text-slate-500 hover:text-slate-700';
  return (
    <button onClick={() => onClick(view)} className={`flex flex-col items-center justify-center space-y-1 w-full transition-colors ${isActive ? activeClasses : inactiveClasses}`}>
      <Icon name={icon} className="text-2xl" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ navigateTo, currentView }) => {
  const mainNavItems = [
    { icon: 'home', label: 'Início', view: 'DASHBOARD' as View },
    { icon: 'apps', label: 'Serviços', view: 'SERVICOS_DASHBOARD' as View },
    { icon: 'map', label: 'Mapa', view: 'MAPA_SERVICOS' as View },
    { icon: 'more_horiz', label: 'Mais', view: 'MAIS_DASHBOARD' as View },
  ];
  
  const isViewActive = (view: View) => {
    if (currentView === view) return true;

    const servicosViews: View[] = [
      'PROTOCOLOS_LIST', 'PROTOCOLO_DETAIL', 'PROTOCOLO_FORM',
      'SERVICOS_ONLINE_DASHBOARD', 'SERVICO_FORM', 'AGENDAMENTOS_LIST'
    ];
    if (view === 'SERVICOS_DASHBOARD' && servicosViews.includes(currentView)) return true;

    const maisViews: View[] = [
      'TURISMO_DASHBOARD', 'TURISMO_LIST', 'TURISMO_DETAIL',
      'NOTICIAS_LIST', 'NOTICIA_DETAIL', 'SECRETARIAS_LIST', 'CONTATOS_LIST'
    ];
    if (view === 'MAIS_DASHBOARD' && maisViews.includes(currentView)) return true;
    
    return false;
  };

  return (
    <footer className="bg-white/90 backdrop-blur-sm border-t border-slate-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 flex justify-around items-center h-16">
        {mainNavItems.map(item => (
          <NavItem 
            key={item.view}
            {...item}
            isActive={isViewActive(item.view)}
            onClick={navigateTo}
          />
        ))}
      </div>
    </footer>
  );
};

export default BottomNav;