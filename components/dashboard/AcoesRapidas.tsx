import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';

const acoes: { path: string; icon: string; label: string }[] = [
  { path: '/protocolos/novo', icon: 'add_comment', label: 'Abrir Protocolo' },
  { path: '/protocolos', icon: 'list_alt', label: 'Meus Protocolos' },
  { path: '/participacao', icon: 'campaign', label: 'Participar' },
  { path: '/noticias', icon: 'feed', label: 'Últimas Notícias' },
  { path: '/mapa', icon: 'map', label: 'Mapa de Serviços' },
  { path: '/servicos', icon: 'apps', label: 'Serviços Online' },
  { path: '/turismo', icon: 'tour', label: 'Turismo' },
  { path: '/contatos', icon: 'call', label: 'Contatos Úteis' },
  { path: '/about', icon: 'info', label: 'Sobre' },
];

const ActionItem: React.FC<{ icon: string, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center space-y-2 text-center group">
    <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center group-hover:bg-slate-800 group-hover:shadow-lg group-hover:shadow-slate-200 transition-all duration-200">
      <Icon name={icon} className="text-3xl text-slate-700 group-hover:text-white" />
    </div>
    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-800">{label}</span>
  </button>
);


const AcoesRapidas: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-4 gap-4">
            {acoes.map(acao => (
                <ActionItem 
                    key={acao.path}
                    {...acao}
                    onClick={() => navigate(acao.path)}
                />
            ))}
        </div>
    </div>
  );
};

export default AcoesRapidas;