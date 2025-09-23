import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProtocolos } from '../../hooks/useMockData';
import { Protocolo, StatusProtocolo, TipoProtocolo } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

const ProtocoloSkeletonItem: React.FC = () => (
    <Card>
        <div className="animate-pulse flex flex-col space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3 w-3/4">
                    <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-3 bg-slate-200 rounded w-full"></div>
            <div className="h-2 bg-slate-200 rounded w-1/3 pt-2"></div>
        </div>
    </Card>
);

const getStatusChipStyle = (status: StatusProtocolo) => {
    switch (status) {
        case StatusProtocolo.RECEBIDO:
            return 'bg-sky-100 text-sky-800';
        case StatusProtocolo.EM_ANDAMENTO:
            return 'bg-amber-100 text-amber-800';
        case StatusProtocolo.RESOLVIDO:
            return 'bg-emerald-100 text-emerald-800';
        case StatusProtocolo.REJEITADO:
            return 'bg-rose-100 text-rose-800';
        default:
            return 'bg-slate-100 text-slate-800';
    }
};

const getProtocoloTypeStyle = (tipo: TipoProtocolo) => {
    switch (tipo) {
        case TipoProtocolo.RECLAMACAO:
            return { icon: 'report_problem', color: 'text-rose-500' };
        case TipoProtocolo.SUGESTAO:
            return { icon: 'lightbulb', color: 'text-amber-500' };
        case TipoProtocolo.ELOGIO:
            return { icon: 'thumb_up', color: 'text-emerald-500' };
        case TipoProtocolo.DENUNCIA:
            return { icon: 'security', color: 'text-slate-600' };
        default:
            return { icon: 'article', color: 'text-slate-500' };
    }
};

const ProtocoloItem: React.FC<{ protocolo: Protocolo, onClick: () => void }> = ({ protocolo, onClick }) => {
    const typeStyle = getProtocoloTypeStyle(protocolo.tipo);

    return (
        <Card onClick={onClick} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <Icon name={typeStyle.icon} className={`text-3xl ${typeStyle.color}`} />
                    <div>
                        <p className="text-xs font-semibold text-slate-500">{protocolo.protocolo}</p>
                        <h3 className="font-bold text-slate-800">{protocolo.tipo}</h3>
                    </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusChipStyle(protocolo.status)}`}>
                    {protocolo.status}
                </span>
            </div>
            <p className="text-sm text-slate-700 pt-2 border-t border-slate-100">{protocolo.descricao}</p>
            <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>{protocolo.bairro}</span>
                <span>{new Date(protocolo.dataAbertura).toLocaleDateString('pt-BR')}</span>
            </div>
        </Card>
    );
};

const ProtocolosList: React.FC = () => {
  const navigate = useNavigate();
  const { data: protocolos, loading } = useProtocolos();
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'status'>('date-desc');

  const sortedProtocolos = useMemo(() => {
    if (!protocolos) return [];
    
    const statusOrder = {
        [StatusProtocolo.RECEBIDO]: 1,
        [StatusProtocolo.EM_ANDAMENTO]: 2,
        [StatusProtocolo.RESOLVIDO]: 3,
        [StatusProtocolo.REJEITADO]: 4,
    };
    
    const sorted = [...protocolos];
    switch (sortBy) {
        case 'date-asc':
            return sorted.sort((a, b) => new Date(a.dataAbertura).getTime() - new Date(b.dataAbertura).getTime());
        case 'status':
            return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime());
        case 'date-desc':
        default:
            return sorted.sort((a, b) => new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime());
    }
  }, [protocolos, sortBy]);


  if (loading) {
      return (
          <div className="space-y-4">
              <Card className="!p-3">
                  <div className="flex items-center space-x-2 flex-wrap animate-pulse">
                      <div className="h-6 w-20 bg-slate-200 rounded"></div>
                      <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
                      <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
                      <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
                  </div>
              </Card>
              <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <ProtocoloSkeletonItem key={i} />)}
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-4">
      <Card className="!p-2">
        <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm font-medium text-slate-600 mr-2">Ordenar por:</span>
            <Button size="sm" onClick={() => setSortBy('date-desc')} variant={sortBy === 'date-desc' ? 'primary' : 'ghost'}>Recentes</Button>
            <Button size="sm" onClick={() => setSortBy('date-asc')} variant={sortBy === 'date-asc' ? 'primary' : 'ghost'}>Antigos</Button>
            <Button size="sm" onClick={() => setSortBy('status')} variant={sortBy === 'status' ? 'primary' : 'ghost'}>Status</Button>
        </div>
      </Card>
      
      {sortedProtocolos && sortedProtocolos.length > 0 ? (
        sortedProtocolos.map(protocolo => (
          <ProtocoloItem key={protocolo.id} protocolo={protocolo} onClick={() => navigate(`/protocolos/${protocolo.id}`)} />
        ))
      ) : (
        <Card className="text-center">
          <p className="text-slate-600">Você ainda não abriu nenhum protocolo.</p>
          <Button onClick={() => navigate('/protocolos/novo')} className="mt-4">
            Abrir primeiro protocolo
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ProtocolosList;