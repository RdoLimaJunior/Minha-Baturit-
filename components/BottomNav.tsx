import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from './ui/Icon';

const navItems = [
  { path: '/', label: 'Início', icon: 'home' },
  { path: '/protocolos', label: 'Protocolos', icon: 'list_alt' },
  { path: '/participacao', label: 'Participar', icon: 'campaign' },
  { path: '/mapa', label: 'Mapa', icon: 'map' },
  { path: '/servicos', label: 'Serviços', icon: 'apps' },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide the nav bar on specific pages like forms, detail views, or utility screens
  // where it might obstruct content or be contextually inappropriate.
  const hiddenOnPaths = [
    /^\/protocolos\/novo$/,
    /^\/protocolos\/.+/,
    /^\/noticias\/.+/,
    /^\/locais\/.+/,
    /^\/turismo\/detalhe\/.+/,
    /^\/servicos\/agendar\/.+/,
    /^\/participacao\/novo$/,
    /^\/participacao\/detalhe\/.+/,
    /^\/consultas\/.+/,
    /^\/search$/,
    /^\/acessibilidade$/,
    /^\/about$/,
    /^\/notificacoes$/, // Notifications is a utility page, better accessed from header
  ];

  const isHidden = hiddenOnPaths.some(regex => regex.test(location.pathname));

  if (isHidden) {
    return null;
  }
  
  const isPathActive = (path: string) => {
    // Exact match for home, startsWith for others to keep tab active on sub-routes
    if (path === '/') {
        return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-10 shadow-[0_-2px_10px_-3px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto px-2 flex justify-around">
        {navItems.map((item) => {
          const isActive = isPathActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full py-2 text-center transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-slate-400 rounded-lg ${
                isActive ? 'text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                name={item.icon}
                className={`text-2xl mb-0.5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
              />
              <span className={`text-xs ${isActive ? 'font-bold' : 'font-semibold'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;