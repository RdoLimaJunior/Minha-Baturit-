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

const ServicoCard: React.FC<{ servico: ServicoOnline; onClick: () => void }> = ({ servico, onClick }) => (
    <Card onClick={onClick} className="flex items-start space-x-4">
        <Icon name={servico.icon} className="text-3xl text-indigo-700 mt-1" />
        <div>
            <h3 className="font-bold text-slate-800">{servico.nome}</h3>
            <p className="text-sm text-slate-600 mt-1">{servico.descricao}</p>
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

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('SERVICOS_DASHBOARD')} variant="ghost" size="icon" aria-label="Voltar para o início">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800">Serviços Online</h2>
      </div>
      <p className="text-slate-600">
        Solicite serviços e realize agendamentos de forma rápida e digital.
      </p>

      <div className="sticky top-[70px] bg-slate-100 py-2 z-5">
        <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar serviço..."
                className="w-full p-3 pl-10 border border-slate-300 rounded-full focus:ring-indigo-600 focus:border-indigo-600 text-sm"
            />
        </div>
      </div>
      
      {loading ? (
        <Spinner />
      ) : groupedServicos ? (
        <div className="space-y-6">
          {categoryOrder.map(category => {
            if (groupedServicos[category]?.length > 0) {
              return (
                <section key={category} aria-labelledby={`category-title-${category.replace(/\s/g, '-')}`}>
                  <h3 id={`category-title-${category.replace(/\s/g, '-')}`} className="text-lg font-bold text-slate-700 mb-2 pl-1">{category}</h3>
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
          <p className="text-slate-600">Nenhum serviço encontrado.</p>
        </Card>
      )}
    </div>
  );
};

export default ServicosOnlineDashboard;