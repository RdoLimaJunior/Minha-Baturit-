import React from 'react';
import { View } from '../../types';
import Card from '../ui/Card';
import Icon from '../ui/Icon';

interface ServicosDashboardProps {
  navigateTo: (view: View, params?: any) => void;
}

const SERVICOS_ITEMS: { view: View; icon: string; title: string; description: string; }[] = [
    { view: 'PROTOCOLOS_LIST', icon: 'list_alt', title: 'Protocolos', description: 'Acompanhe suas solicitações' },
    { view: 'SERVICOS_ONLINE_DASHBOARD', icon: 'apps', title: 'Serviços Online', description: 'Acesse serviços digitais' },
    { view: 'AGENDAMENTOS_LIST', icon: 'event_available', title: 'Agenda do Cidadão', description: 'Gerencie seus agendamentos' },
    { view: 'PROTOCOLO_FORM', icon: 'campaign', title: 'Participação Cidadã', description: 'Abra um novo protocolo' },
];

const ServicosDashboard: React.FC<ServicosDashboardProps> = ({ navigateTo }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Serviços ao Cidadão</h2>
      <p className="text-slate-600 dark:text-slate-300">
        Encontre aqui as principais ferramentas para interagir com a prefeitura, solicitar serviços e agendar atendimentos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {SERVICOS_ITEMS.map(item => (
          <Card 
            key={item.view} 
            onClick={() => navigateTo(item.view)}
            className="text-center flex flex-col items-center justify-center space-y-2 !p-6"
          >
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full">
              <Icon name={item.icon} className="text-indigo-700 dark:text-indigo-400 text-4xl" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{item.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicosDashboard;