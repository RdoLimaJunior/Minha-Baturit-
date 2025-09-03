import React, { useState } from 'react';
import { useServicoOnlineById } from '../../hooks/useMockData';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';

interface ServicoFormProps {
  servicoId: string;
  goBack: () => void;
}

const ServicoForm: React.FC<ServicoFormProps> = ({ servicoId, goBack }) => {
  const { data: servico, loading } = useServicoOnlineById(servicoId);
  const { addToast } = useToast();
  
  const [dataHora, setDataHora] = useState('');
  const [comLembrete, setComLembrete] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataHora) {
      addToast('Por favor, selecione uma data e hora.', 'error');
      return;
    }
    setIsSubmitting(true);
    // Simula a chamada de API
    setTimeout(() => {
      setIsSubmitting(false);
      addToast('Agendamento realizado com sucesso!', 'success');
      goBack();
    }, 1500);
  };

  if (loading) return <Spinner />;
  if (!servico) return <Card><p>Serviço não encontrado.</p></Card>;

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-4">
      <Button onClick={goBack} variant="ghost" iconLeft="arrow_back">
        Voltar para Serviços
      </Button>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <Icon name={servico.icon} className="text-6xl text-indigo-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{servico.nome}</h2>
            <p className="text-gray-600 mt-2">
              {servico.descricao}
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Realizar Agendamento</h3>
            <div>
              <label htmlFor="dataHora" className="block text-sm font-medium text-gray-700 mb-1">Escolha a data e hora *</label>
              <input
                type="datetime-local"
                id="dataHora"
                value={dataHora}
                onChange={(e) => setDataHora(e.target.value)}
                min={getMinDateTime()}
                className="w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
            
            <div className="mt-4 flex items-center">
              <input
                id="lembrete"
                type="checkbox"
                checked={comLembrete}
                onChange={(e) => setComLembrete(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="lembrete" className="ml-2 block text-sm text-gray-700">
                Criar lembrete para este agendamento
              </label>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ServicoForm;
