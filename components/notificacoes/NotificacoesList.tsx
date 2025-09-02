import React, { useState, useEffect } from 'react';
import { useNotificacoes } from '../../hooks/useMockData';
import { Notificacao, View } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { timeSince } from '../../utils/helpers';
import { useToast } from '../ui/Toast';

interface NotificacoesListProps {
  navigateTo: (view: View, params?: any) => void;
}

const getIconForNotificacao = (notificacao: Notificacao) => {
    if (notificacao.titulo.toLowerCase().includes('lembrete')) {
        return { icon: 'event_available', color: 'text-blue-500' };
    }
    if (notificacao.titulo.toLowerCase().includes('protocolo')) {
        return { icon: 'list_alt', color: 'text-green-500' };
    }
    return { icon: 'notifications', color: 'text-slate-500 dark:text-slate-400' };
};

const NotificacaoItem: React.FC<{ notificacao: Notificacao; onClick: () => void; }> = ({ notificacao, onClick }) => {
    const { icon, color } = getIconForNotificacao(notificacao);

    return (
        <div 
            onClick={onClick}
            className={`flex items-start space-x-4 p-4 border-l-4 ${notificacao.lida ? 'border-transparent bg-white dark:bg-slate-800' : 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'} rounded-r-lg shadow-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors`}
        >
            <Icon name={icon} className={`text-3xl mt-1 ${color}`} />
            <div className="flex-1">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">{notificacao.titulo}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{notificacao.mensagem}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{timeSince(notificacao.data)}</p>
            </div>
        </div>
    );
};

const NotificacoesList: React.FC<NotificacoesListProps> = ({ navigateTo }) => {
  const { data: notificacoes, loading } = useNotificacoes();
  const [listaNotificacoes, setListaNotificacoes] = useState<Notificacao[]>([]);
  const { addToast } = useToast();
  
  useEffect(() => {
    if (notificacoes) {
        // Ordena por data, mais recentes primeiro
        const sorted = [...notificacoes].sort((a,b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        setListaNotificacoes(sorted);
    }
  }, [notificacoes]);

  const handleNotificationClick = (notificacao: Notificacao) => {
    // Marca como lida
    setListaNotificacoes(prev => 
        prev.map(n => n.id === notificacao.id ? { ...n, lida: true } : n)
    );
    // Navega se houver link
    if (notificacao.link) {
      navigateTo(notificacao.link.view, notificacao.link.params);
    }
  };
  
  const markAllAsRead = () => {
      setListaNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
      addToast('Todas as notificações foram marcadas como lidas.', 'success');
  };

  const unreadCount = listaNotificacoes.filter(n => !n.lida).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Button onClick={() => navigateTo('DASHBOARD')} variant="ghost" size="icon">
              <Icon name="arrow_back" />
            </Button>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Notificações</h2>
        </div>
        {unreadCount > 0 && (
            <Button size="sm" variant="ghost" onClick={markAllAsRead}>
                Marcar todas como lidas
            </Button>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : listaNotificacoes.length > 0 ? (
        <div className="space-y-3">
          {listaNotificacoes.map(notificacao => (
            <NotificacaoItem 
                key={notificacao.id} 
                notificacao={notificacao} 
                onClick={() => handleNotificationClick(notificacao)}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-10">
            <Icon name="notifications_off" className="text-5xl text-slate-400 dark:text-slate-500 mx-auto" />
            <p className="text-slate-600 dark:text-slate-300 mt-4">Você não tem nenhuma notificação.</p>
        </Card>
      )}
    </div>
  );
};

export default NotificacoesList;