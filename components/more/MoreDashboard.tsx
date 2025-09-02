import React from 'react';
import { View } from '../../types';
import Card from '../ui/Card';
import Icon from '../ui/Icon';

interface MoreDashboardProps {
  navigateTo: (view: View) => void;
}

const MORE_ITEMS = [
    { view: 'TURISMO_DASHBOARD' as View, icon: 'tour', title: 'Turismo' },
    { view: 'NOTICIAS_LIST' as View, icon: 'feed', title: 'Notícias' },
    { view: 'SECRETARIAS_LIST' as View, icon: 'groups', title: 'Secretarias' },
    { view: 'CONTATOS_LIST' as View, icon: 'contact_phone', title: 'Contatos Úteis' },
];

const MoreDashboard: React.FC<MoreDashboardProps> = ({ navigateTo }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Mais Opções</h2>
      
      <div className="space-y-3 pt-2">
        {MORE_ITEMS.map(item => (
          <Card 
            key={item.view} 
            onClick={() => navigateTo(item.view)}
            className="!p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
                <Icon name={item.icon} className="text-2xl text-slate-600 dark:text-slate-300" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</h3>
            </div>
            <Icon name="chevron_right" className="text-slate-400 dark:text-slate-500" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MoreDashboard;