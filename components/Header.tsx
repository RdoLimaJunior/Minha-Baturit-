


import React from 'react';
import Icon from './ui/Icon';
import { UserProfile, View } from '../types';
import { useNotificacoes } from '../../hooks/useMockData';

interface HeaderProps {
    activeProfile: UserProfile;
    onProfileChange: () => void;
    navigateTo: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeProfile, onProfileChange, navigateTo }) => {
  const { data: notificacoes } = useNotificacoes();
  const unreadCount = notificacoes?.filter(n => !n.lida).length || 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 flex-shrink-0">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Bras%C3%A3o_de_Baturit%C3%A9_-_CE.svg" 
            alt="Brasão de Baturité" 
            className="h-10"
          />
          <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Minha <span className="text-indigo-700">Baturité</span></h1>
        </div>
        <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateTo('SEARCH')}
              className="p-2 rounded-full hover:bg-slate-100"
              aria-label="Buscar"
            >
              <Icon name="search" className="text-slate-600 text-2xl" />
            </button>
            <button 
              onClick={() => navigateTo('NOTIFICACOES_LIST')} 
              className="p-2 rounded-full hover:bg-slate-100 relative"
              aria-label={`Notificações. ${unreadCount} não lidas.`}
            >
              <Icon name="notifications" className="text-slate-600 text-2xl" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 block w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            <button onClick={onProfileChange} className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-100">
                <img src={activeProfile.avatar} alt="Avatar" className="w-8 h-8 rounded-full"/>
                <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-slate-700">{activeProfile.name}</p>
                    <p className="text-xs text-slate-500">{activeProfile.role}</p>
                </div>
                <Icon name="expand_more" className="text-slate-500" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;