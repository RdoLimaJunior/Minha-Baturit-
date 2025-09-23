import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTurismoItens } from '../../hooks/useMockData';
import { TurismoItem, TurismoCategoria } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';

interface TurismoListProps {
  categoria: TurismoCategoria;
}

const TurismoItemSkeleton: React.FC = () => (
    <Card className="animate-pulse">
        <div className="w-full h-48 bg-slate-200 rounded-t-xl"></div>
        <div className="p-4 space-y-3">
            <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
            <div className="h-3 w-full bg-slate-200 rounded"></div>
            <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
        </div>
    </Card>
);

const TurismoCard: React.FC<{ item: TurismoItem }> = ({ item }) => {
    const navigate = useNavigate();
    
    return (
        <Card onClick={() => navigate(`/turismo/detalhe/${item.categoria}/${item.id}`)} className="!p-0">
            <img 
                src={item.imagens[0]} 
                alt={item.nome}
                className="w-full h-48 object-cover rounded-t-xl"
                loading="lazy"
            />
            <div className="p-4">
                <h3 className="font-bold text-lg text-slate-800">{item.nome}</h3>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.descricaoCurta}</p>
                 <div className="flex items-center text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                    <Icon name="location_on" className="text-base mr-1" />
                    <span>{item.endereco}</span>
                </div>
            </div>
        </Card>
    );
};


const TurismoList: React.FC<TurismoListProps> = ({ categoria }) => {
    const { data: itens, loading } = useTurismoItens();

    const filteredItens = React.useMemo(() => {
        if (!itens) return [];
        return itens.filter(item => item.categoria === categoria);
    }, [itens, categoria]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TurismoItemSkeleton />
                <TurismoItemSkeleton />
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            {filteredItens.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredItens.map(item => (
                        <TurismoCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <Card className="text-center">
                    <p className="text-slate-600">Nenhum item encontrado nesta categoria.</p>
                </Card>
            )}
        </div>
    );
};

export default TurismoList;
