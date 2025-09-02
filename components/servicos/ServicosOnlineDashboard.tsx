import React, { useState, useMemo } from 'react';
import { useServicosOnline } from '../../hooks/useMockData';
import { View, ServicoOnline, CategoriaServicoOnline } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface ServicosOnlineDashboardProps {
  navigateTo: (view: View, params?: { servicoId?: string }) => void;
}

const ServicoSkeletonItem: React.FC = () => (
    <Card className="flex items-start space-x-4 animate-pulse">
        <div className="w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-700 mt-1"></div>
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        </div>
    </Card>
);

const ServicoCard: React.FC<{ servico: ServicoOnline; onClick: () => void }> = ({ servico, onClick }) => (
    <Card onClick={onClick} className="flex items-start space-x-4">
        <Icon name={servico.icon} className="text-3xl text-indigo-700 dark:text-indigo-400 mt-1" />
        <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">{servico.nome}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{servico.descricao}</p>
        </div>
    </Card>
);

const ServicosOnlineDashboard: React.FC<ServicosOnlineDashboardProps> = ({ navigateTo }) => {
  const { data: servicos, loading } = useServicosOnline();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServicos = useMemo(() => {
    if (!servicos) return [];
    return servicos.filter(servico => 
      servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [servicos, searchTerm]);

  const groupedServicos = useMemo(() => {
    if (!filteredServicos) return {};
    return filteredServicos.reduce((acc, servico) => {
        (acc[servico.categoria] = acc[servico.categoria] || []).push(servico);
        return acc;
    }, {} as Record<CategoriaServicoOnline, ServicoOnline[]>);
  }, [filteredServicos]);

  const categoryOrder: CategoriaServicoOnline[] = [
      CategoriaServicoOnline.ASSISTENCIA,
      CategoriaServicoOnline.TRIBUTOS,
      CategoriaServicoOnline.EDUCACAO,
      CategoriaServicoOnline.SAUDE,
      CategoriaServicoOnline.OUTROS,
  ];

  if (loading) {
      return (
          <div className="space-y-4">
              <div className="flex items-center space-x-2 animate-pulse">
                  <Button variant="ghost" size="icon" className="!bg-slate-200 dark:!bg-slate-700" disabled><Icon name="arrow_back" className="text-transparent" /></Button>
                  <div className="h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-700"></div>
              </div>
              <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse mt-2"></div>
              <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div>

              <div className="sticky top-[70px] bg-slate-100 dark:bg-slate-900 py-2 z-5 animate-pulse">
                  <div className="h-12 w-full rounded-full bg-slate-200 dark:bg-slate-800"></div>
              </div>
              
              <div className="space-y-6 pt-2">
                  {[...Array(2)].map((_, section) => (
                      <div key={section} className="space-y-3">
                          <div className="h-5 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-2 ml-1 animate-pulse"></div>
                          <ServicoSkeletonItem />
                          <ServicoSkeletonItem />
                      </div>
                  ))}
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('SERVICOS_DASHBOARD')} variant="ghost" size="icon" aria-label="Voltar para o início">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Serviços Online</h2>
      </div>
      <p className="text-slate-600 dark:text-slate-300">
        Solicite serviços e realize agendamentos de forma rápida e digital.
      </p>

      <div className="sticky top-[70px] bg-slate-100 dark:bg-slate-900 py-2 z-5">
        <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar serviço..."
                className="w-full p-3 pl-10 bg-white text-slate-900 border border-slate-300 rounded-full focus:ring-indigo-600 focus:border-indigo-600 text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
        </div>
      </div>
      
      {groupedServicos ? (
        <div className="space-y-6">
          {categoryOrder.map(category => {
            if (groupedServicos[category]?.length > 0) {
              return (
                <section key={category} aria-labelledby={`category-title-${category.replace(/\s/g, '-')}`}>
                  <h3 id={`category-title-${category.replace(/\s/g, '-')}`} className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2 pl-1">{category}</h3>
                  <div className="space-y-3">
                    {groupedServicos[category].map(servico => (
                      <ServicoCard 
                        key={servico.id} 
                        servico={servico} 
                        onClick={() => navigateTo('SERVICO_FORM', { servicoId: servico.id })} 
                      />
                    ))}
                  </div>
                </section>
              );
            }
            return null;
          })}
        </div>
      ) : (
        <Card className="text-center">
          <p className="text-slate-600 dark:text-slate-300">Nenhum serviço encontrado.</p>
        </Card>
      )}
    </div>
  );
};

export default ServicosOnlineDashboard;