import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TurismoCategoria } from '../../types';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface TurismoDashboardProps {
}

// FIX: Use enum members for the 'id' property to match the TurismoCategoria type.
const CATEGORIAS_TURISMO: { id: TurismoCategoria; title: string; icon: string; description: string; color: string; }[] = [
    { id: TurismoCategoria.PONTOS_TURISTICOS, title: 'Pontos Turísticos', icon: 'account_balance', description: 'Monumentos e história', color: 'bg-amber-500' },
    { id: TurismoCategoria.GASTRONOMIA, title: 'Gastronomia', icon: 'restaurant', description: 'Sabores da serra', color: 'bg-red-500' },
    { id: TurismoCategoria.HOSPEDAGEM, title: 'Hospedagem', icon: 'hotel', description: 'Encontre seu refúgio', color: 'bg-blue-500' },
    { id: TurismoCategoria.LAZER, title: 'Lazer e Entretenimento', icon: 'local_activity', description: 'Aventura e diversão', color: 'bg-green-500' },
    { id: TurismoCategoria.CULTURA, title: 'Cultura', icon: 'theater_comedy', description: 'Espaços e eventos', color: 'bg-purple-500' },
];

const TurismoDashboard: React.FC<TurismoDashboardProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <p className="text-slate-600">
        Explore os encantos da serra. Descubra lugares incríveis, sabores autênticos e a hospitalidade de Baturité.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {CATEGORIAS_TURISMO.map(cat => (
          <Card 
            key={cat.id} 
            onClick={() => navigate(`/turismo/lista/${cat.id}`)}
            className="text-center flex flex-col items-center justify-center space-y-2 !p-6"
          >
            <div className={`${cat.color} p-4 rounded-full`}>
              <Icon name={cat.icon} className="text-white text-4xl" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">{cat.title}</h3>
            <p className="text-sm text-slate-600">{cat.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TurismoDashboard;
