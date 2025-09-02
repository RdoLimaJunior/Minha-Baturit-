import React from 'react';
import { useSecretarias } from '../../hooks/useMockData';
import { Secretaria, View } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface SecretariasListProps {
  navigateTo: (view: View) => void;
}

const SecretariaItem: React.FC<{ secretaria: Secretaria }> = ({ secretaria }) => (
  <Card className="flex flex-col items-center text-center">
    <img 
      src={secretaria.avatarUrl} 
      alt={`Foto de ${secretaria.secretario}`}
      className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-slate-100 dark:border-slate-700 shadow-md"
    />
    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{secretaria.nome}</h3>
    <div className="mt-2">
        <p className="text-md font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center space-x-1">
            <span>{secretaria.secretario}</span>
            <Icon name="check_circle" className="text-green-500 text-base" />
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{secretaria.cargo}</p>
    </div>
    
    <div className="mt-6 w-full text-left space-y-3">
        <div className="flex items-start space-x-3 text-slate-700 dark:text-slate-200">
            <Icon name="email" className="text-xl text-slate-400 dark:text-slate-500 mt-0.5" />
            <span className="text-sm">{secretaria.email}</span>
        </div>
        <div className="flex items-start space-x-3 text-slate-700 dark:text-slate-200">
            <Icon name="phone" className="text-xl text-slate-400 dark:text-slate-500 mt-0.5" />
            <span className="text-sm">{secretaria.telefone}</span>
        </div>
        <div className="flex items-start space-x-3 text-slate-700 dark:text-slate-200">
            <Icon name="schedule" className="text-xl text-slate-400 dark:text-slate-500 mt-0.5" />
            <span className="text-sm">{secretaria.horario}</span>
        </div>
        <div className="flex items-start space-x-3 text-slate-700 dark:text-slate-200">
            <Icon name="location_on" className="text-xl text-slate-400 dark:text-slate-500 mt-0.5" />
            <span className="text-sm">{secretaria.endereco}</span>
        </div>
    </div>

    {secretaria.link && (
         <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 w-full">
            <a 
              href={secretaria.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold text-green-700 dark:text-green-500 transition-colors hover:text-green-800 dark:hover:text-green-400"
            >
                Mais informações
            </a>
        </div>
    )}
  </Card>
);

const SecretariasList: React.FC<SecretariasListProps> = ({ navigateTo }) => {
  const { data: secretarias, loading } = useSecretarias();

  // Ordena para que a Autarquia do Meio Ambiente apareça primeiro, como na referência
  const sortedSecretarias = React.useMemo(() => {
    if (!secretarias) return [];
    return [...secretarias].sort((a, b) => {
        if (a.nome.includes('Autarquia')) return -1;
        if (b.nome.includes('Autarquia')) return 1;
        return 0;
    });
  }, [secretarias]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('MAIS_DASHBOARD')} variant="ghost" size="icon">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Secretarias</h2>
      </div>
      
      {loading ? (
        <Spinner />
      ) : sortedSecretarias && sortedSecretarias.length > 0 ? (
        <div className="space-y-4">
          {sortedSecretarias.map(sec => (
            <SecretariaItem key={sec.id} secretaria={sec} />
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <p className="text-slate-600 dark:text-slate-300">Nenhuma secretaria encontrada.</p>
        </Card>
      )}
    </div>
  );
};

export default SecretariasList;