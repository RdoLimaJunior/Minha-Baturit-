import React, { useState, useMemo } from 'react';
// FIX: Import 'useProtocolos' as 'useChamados' to align with the existing mock data hook.
import { useProtocolos as useChamados } from '../../hooks/useMockData';
// FIX: Import 'Protocolo' and 'StatusProtocolo' and alias them to 'Chamado' and 'StatusChamado' to fix missing type errors.
import { Protocolo as Chamado, StatusProtocolo as StatusChamado, View } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface ChamadosListProps {
  // FIX: Update the parameter name from 'chamadoId' to 'protocoloId' to match the 'navigateTo' function signature in App.tsx.
  navigateTo: (view: View, params?: { protocoloId?: string }) => void;
}

const getStatusChipStyle = (status: StatusChamado) => {
    switch (status) {
        case StatusChamado.RECEBIDO:
            return 'bg-blue-100 text-blue-800';
        case StatusChamado.EM_ANDAMENTO:
            return 'bg-yellow-100 text-yellow-800';
        case StatusChamado.RESOLVIDO:
            return 'bg-green-100 text-green-800';
        case StatusChamado.REJEITADO:
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const ChamadoItem: React.FC<{ chamado: Chamado, onClick: () => void }> = ({ chamado, onClick }) => (
    <Card onClick={onClick}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-semibold text-slate-500">{chamado.protocolo}</p>
                {/* FIX: Display 'tipo' and 'categoria' for better description, as 'categoria' is optional. */}
                <h3 className="font-bold text-slate-800">{chamado.tipo}</h3>
                {chamado.categoria && <p className="text-xs text-slate-500">{chamado.categoria}</p>}
            </div>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusChipStyle(chamado.status)}`}>
                {chamado.status}
            </span>
        </div>
        <p className="text-sm text-slate-600 mt-2 truncate">{chamado.descricao}</p>
        <div className="text-xs text-slate-400 mt-4 flex items-center">
            <Icon name="schedule" className="text-base mr-1" />
            <span>Aberto em: {new Date(chamado.dataAbertura).toLocaleDateString('pt-BR')}</span>
        </div>
    </Card>
);

const ChamadosList: React.FC<ChamadosListProps> = ({ navigateTo }) => {
  const { data: chamados, loading } = useChamados();
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'status'>('date-desc');

  const sortedChamados = useMemo(() => {
    if (!chamados) return [];
    
    const statusOrder = {
        [StatusChamado.RECEBIDO]: 1,
        [StatusChamado.EM_ANDAMENTO]: 2,
        [StatusChamado.RESOLVIDO]: 3,
        [StatusChamado.REJEITADO]: 4,
    };
    
    const sorted = [...chamados];
    switch (sortBy) {
        case 'date-asc':
            return sorted.sort((a, b) => new Date(a.dataAbertura).getTime() - new Date(b.dataAbertura).getTime());
        case 'status':
            return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime());
        case 'date-desc':
        default:
            return sorted.sort((a, b) => new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime());
    }
  }, [chamados, sortBy]);


  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Meus Chamados</h2>
      </div>

      <Card className="!p-3">
        <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm font-medium text-slate-600 mr-2">Ordenar por:</span>
            <Button size="sm" onClick={() => setSortBy('date-desc')} variant={sortBy === 'date-desc' ? 'primary' : 'ghost'}>Recentes</Button>
            <Button size="sm" onClick={() => setSortBy('date-asc')} variant={sortBy === 'date-asc' ? 'primary' : 'ghost'}>Antigos</Button>
            <Button size="sm" onClick={() => setSortBy('status')} variant={sortBy === 'status' ? 'primary' : 'ghost'}>Status</Button>
        </div>
      </Card>
      
      {sortedChamados && sortedChamados.length > 0 ? (
        sortedChamados.map(chamado => (
          // FIX: Navigate to 'PROTOCOLO_DETAIL' view and pass 'protocoloId' as a parameter.
          <ChamadoItem key={chamado.id} chamado={chamado} onClick={() => navigateTo('PROTOCOLO_DETAIL', { protocoloId: chamado.id })} />
        ))
      ) : (
        <Card className="text-center">
          <p className="text-slate-600">Você ainda não abriu nenhum chamado.</p>
        </Card>
      )}
    </div>
  );
};

export default ChamadosList;