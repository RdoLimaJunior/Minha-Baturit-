import React from 'react';
// FIX: Import 'useProtocoloById' as 'useChamadoById' to use the correct data hook.
import { useProtocoloById as useChamadoById } from '../../hooks/useMockData';
// FIX: Import correct types from '../../types' and alias them to match component usage.
import { StatusProtocolo as StatusChamado, HistoricoProtocolo as HistoricoChamado, Protocolo as Chamado, TipoProtocolo } from '../../types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface ChamadoDetailProps {
  chamadoId: string;
  goBack: () => void;
}

const getStatusIcon = (status: StatusChamado) => {
    switch(status) {
        case StatusChamado.RECEBIDO: return <Icon name="article" className="text-blue-500 text-2xl" />;
        case StatusChamado.EM_ANDAMENTO: return <Icon name="sync" className="text-yellow-500 text-2xl" />;
        case StatusChamado.RESOLVIDO: return <Icon name="check_circle" className="text-green-500 text-2xl" />;
        case StatusChamado.REJEITADO: return <Icon name="cancel" className="text-red-500 text-2xl" />;
        default: return null;
    }
};

const TimelineItem: React.FC<{ item: HistoricoChamado, isLast: boolean }> = ({ item, isLast }) => (
    <li className="relative pb-8">
        {!isLast && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true"></span>}
        <div className="relative flex items-start space-x-3">
            <div>
                <div className="relative px-1">
                    <div className="h-8 w-8 bg-white rounded-full ring-4 ring-white flex items-center justify-center">
                        {getStatusIcon(item.status)}
                    </div>
                </div>
            </div>
            <div className="min-w-0 flex-1 py-1.5">
                <div className="text-sm text-slate-600">
                    Status alterado para <span className="font-semibold">{item.status}</span>
                </div>
                <div className="text-xs text-slate-400">
                    {new Date(item.data).toLocaleString('pt-BR')}
                </div>
                {item.observacao && <p className="text-sm mt-1 p-2 bg-slate-100 rounded-md">{item.observacao}</p>}
            </div>
        </div>
    </li>
);

const ChamadoDetail: React.FC<ChamadoDetailProps> = ({ chamadoId, goBack }) => {
  const { data: chamado, loading } = useChamadoById(chamadoId);

  if (loading) return <Spinner />;
  if (!chamado) return <Card><p>Chamado não encontrado.</p></Card>;

  return (
    <div className="space-y-4">
      <Button onClick={goBack} variant="ghost" iconLeft="arrow_back">Voltar</Button>
      
      <Card>
        {/* FIX: Use 'tipo' as the main title and show 'categoria' conditionally, as 'categoria' is optional. */}
        <h2 className="text-xl font-bold text-slate-800 mb-1">{chamado.tipo}</h2>
        {chamado.tipo === TipoProtocolo.RECLAMACAO && chamado.categoria && (
            <p className="text-md font-medium text-slate-600">{chamado.categoria}</p>
        )}
        <p className="text-sm font-medium text-slate-500 mt-2">Protocolo: {chamado.protocolo}</p>
        
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <p><span className="font-semibold">Descrição:</span> {chamado.descricao}</p>
          <p><span className="font-semibold">Bairro:</span> {chamado.bairro}</p>
          <p><span className="font-semibold">Data de Abertura:</span> {new Date(chamado.dataAbertura).toLocaleString('pt-BR')}</p>
        </div>
        
        {/* FIX: Add a check for 'chamado.fotos' because it's an optional property on the Protocolo type. */}
        {chamado.fotos && chamado.fotos.length > 0 && (
            <div className="mt-4">
                <h3 className="font-semibold text-slate-800 mb-2">Fotos:</h3>
                <img src={chamado.fotos[0]} alt="Foto do chamado" className="rounded-lg w-full h-auto object-cover"/>
            </div>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Histórico de Atualizações</h3>
        <ul>
            {[...chamado.historico].reverse().map((item, index, arr) => (
                <TimelineItem key={index} item={item} isLast={index === arr.length - 1} />
            ))}
        </ul>
      </Card>
    </div>
  );
};

export default ChamadoDetail;