import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Icon from '../ui/Icon';

const ParticipacaoDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <p className="text-slate-600">
        Sua voz é fundamental para construir o futuro de Baturité. Participe, opine e ajude a tomar as melhores decisões para nossa cidade.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <Card 
          onClick={() => navigate('/participacao/feed')}
          className="text-center flex flex-col items-center justify-center space-y-2 !p-6"
        >
          <div className="bg-sky-500 p-4 rounded-full">
            <Icon name="forum" className="text-white text-4xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Participação Cidadã</h3>
          <p className="text-sm text-slate-600">Compartilhe ideias, relate problemas e faça elogios sobre a cidade.</p>
        </Card>

        <Card 
          onClick={() => navigate('/consultas')}
          className="text-center flex flex-col items-center justify-center space-y-2 !p-6"
        >
          <div className="bg-emerald-500 p-4 rounded-full">
            <Icon name="how_to_vote" className="text-white text-4xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Consultas Públicas</h3>
          <p className="text-sm text-slate-600">Opine sobre projetos e leis importantes que estão em discussão.</p>
        </Card>
      </div>
    </div>
  );
};

export default ParticipacaoDashboard;
