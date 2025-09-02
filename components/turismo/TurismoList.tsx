import React, { useMemo } from 'react';
import { useTurismoItens } from '../../hooks/useMockData';
import { View, TurismoCategoria, TurismoItem } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import LazyImage from '../ui/LazyImage';

interface TurismoListProps {
  categoria: TurismoCategoria;
  navigateTo: (view: View, params?: { turismoId?: string; turismoCategoria?: TurismoCategoria }) => void;
}

const TurismoListItem: React.FC<{ item: TurismoItem; onClick: () => void }> = ({ item, onClick }) => {
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  return (
    <Card onClick={onClick} className="!p-0">
      <LazyImage 
        src={item.imagens[0]} 
        alt={`Foto de ${item.nome}`}
        className="w-full h-48 object-cover"
        isLoading={isImageLoading}
        onLoad={() => setIsImageLoading(false)}
      />
      <div className="p-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{item.nome}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{item.descricaoCurta}</p>
      </div>
    </Card>
  );
};

const TurismoList: React.FC<TurismoListProps> = ({ categoria, navigateTo }) => {
  const { data: todosItens, loading } = useTurismoItens();

  const itensFiltrados = useMemo(() => {
    if (!todosItens) return [];
    return todosItens.filter(item => item.categoria === categoria);
  }, [todosItens, categoria]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('TURISMO_DASHBOARD')} variant="ghost" size="icon">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{categoria}</h2>
      </div>

      {loading ? (
        <Spinner />
      ) : itensFiltrados.length > 0 ? (
        <div className="space-y-4">
          {itensFiltrados.map(item => (
            <TurismoListItem 
              key={item.id} 
              item={item} 
              onClick={() => navigateTo('TURISMO_DETAIL', { turismoId: item.id, turismoCategoria: categoria })} 
            />
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <p className="text-slate-600 dark:text-slate-300">Nenhum item encontrado nesta categoria no momento.</p>
        </Card>
      )}
    </div>
  );
};

export default TurismoList;