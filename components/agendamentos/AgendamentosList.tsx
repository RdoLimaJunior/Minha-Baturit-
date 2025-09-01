

import React, { useState, useMemo } from 'react';
import { useAgendamentos } from '../../hooks/useMockData';
import { Agendamento, AgendamentoStatus, View } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import CalendarView from './CalendarView';

interface AgendamentosListProps {
  navigateTo: (view: View) => void;
}

const getStatusChipStyle = (status: AgendamentoStatus) => {
    switch (status) {
        case AgendamentoStatus.AGENDADO:
            return 'bg-blue-100 text-blue-800';
        case AgendamentoStatus.REALIZADO:
            return 'bg-green-100 text-green-800';
        case AgendamentoStatus.CANCELADO:
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const AgendamentoItem: React.FC<{ agendamento: Agendamento; onCancel: (id: string) => void; isCancellable: boolean }> = ({ agendamento, onCancel, isCancellable }) => {
    const data = new Date(agendamento.dataHora);
    const dataFormatada = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return (
        <Card>
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <Icon name={agendamento.servicoIcon} className="text-2xl text-indigo-600" />
                    <div>
                        <h3 className="font-bold text-slate-800">{agendamento.servicoNome}</h3>
                        <p className="text-sm text-slate-500">{dataFormatada} às {horaFormatada}</p>
                    </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusChipStyle(agendamento.status)}`}>
                    {agendamento.status}
                </span>
            </div>
            {isCancellable && agendamento.status === AgendamentoStatus.AGENDADO && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-right">
                    <Button size="sm" variant="secondary" onClick={() => onCancel(agendamento.id)}>
                        Cancelar
                    </Button>
                </div>
            )}
        </Card>
    );
};

const AgendamentosList: React.FC<AgendamentosListProps> = ({ navigateTo }) => {
  const { data: agendamentos, loading } = useAgendamentos();
  const [listaAgendamentos, setListaAgendamentos] = useState<Agendamento[]>([]);
  const { addToast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);

  React.useEffect(() => {
    if (agendamentos) {
      setListaAgendamentos(agendamentos);
    }
  }, [agendamentos]);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(1); // Evita problemas com dias do mês (ex: 31)
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
      return newDate;
    });
  };

  const handleDateSelect = (date: Date) => {
    // Se a mesma data for selecionada novamente, desmarque-a
    if (selectedDate && date.getTime() === selectedDate.getTime()) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const filteredAgendamentos = useMemo(() => {
    if (!listaAgendamentos || !selectedDate) return null;
    
    return listaAgendamentos.filter(ag => {
      const agDate = new Date(ag.dataHora);
      return agDate.getFullYear() === selectedDate.getFullYear() &&
             agDate.getMonth() === selectedDate.getMonth() &&
             agDate.getDate() === selectedDate.getDate();
    }).sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  }, [listaAgendamentos, selectedDate]);

  const { proximos, anteriores } = useMemo(() => {
    if (!listaAgendamentos || selectedDate) return { proximos: [], anteriores: [] };
    
    const agora = new Date();
    agora.setHours(0, 0, 0, 0); // Considera o dia inteiro para "próximos"
    
    const proximosAg = listaAgendamentos
        .filter(a => new Date(a.dataHora) >= agora && a.status !== AgendamentoStatus.CANCELADO)
        .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
        
    const anterioresAg = listaAgendamentos
        .filter(a => new Date(a.dataHora) < agora || a.status === AgendamentoStatus.CANCELADO)
        .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());

    return { proximos: proximosAg, anteriores: anterioresAg };
  }, [listaAgendamentos, selectedDate]);

  const handleCancel = (id: string) => {
    if(window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
        setListaAgendamentos(prev => prev.map(ag => ag.id === id ? { ...ag, status: AgendamentoStatus.CANCELADO } : ag));
        addToast('Agendamento cancelado.', 'info');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Button onClick={() => navigateTo('SERVICOS_DASHBOARD')} variant="ghost" size="icon">
              <Icon name="arrow_back" />
            </Button>
            <h2 className="text-2xl font-bold text-slate-800">Agenda do Cidadão</h2>
        </div>
        <Button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            variant="ghost"
            size="icon"
            aria-label={isCalendarOpen ? "Ocultar calendário" : "Mostrar calendário"}
            aria-expanded={isCalendarOpen}
            aria-controls="calendar-view-container"
            className={!isCalendarOpen ? "text-indigo-700" : ""}
        >
            <Icon name="calendar_month" />
        </Button>
      </div>
      
      {isCalendarOpen && (
        <div id="calendar-view-container">
            <CalendarView
                agendamentos={listaAgendamentos}
                currentDate={currentDate}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onMonthChange={handleMonthChange}
            />
        </div>
      )}

      {selectedDate ? (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-slate-700 pl-1">
              Agendamentos de {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
            </h3>
            <Button size="sm" variant="ghost" onClick={() => setSelectedDate(null)}>Limpar</Button>
          </div>
          {filteredAgendamentos && filteredAgendamentos.length > 0 ? (
            <div className="space-y-3">
              {filteredAgendamentos.map(ag => (
                <AgendamentoItem key={ag.id} agendamento={ag} onCancel={handleCancel} isCancellable={new Date(ag.dataHora) >= new Date()} />
              ))}
            </div>
          ) : (
            <Card><p className="text-center text-slate-500">Nenhum agendamento para este dia.</p></Card>
          )}
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-2 pl-1">Próximos</h3>
            {proximos.length > 0 ? (
              <div className="space-y-3">
                {proximos.map(ag => (
                  <AgendamentoItem key={ag.id} agendamento={ag} onCancel={handleCancel} isCancellable={true} />
                ))}
              </div>
            ) : (
              <Card><p className="text-center text-slate-500">Nenhum agendamento futuro.</p></Card>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-2 pl-1">Anteriores</h3>
            {anteriores.length > 0 ? (
              <div className="space-y-3">
                {anteriores.map(ag => (
                  <AgendamentoItem key={ag.id} agendamento={ag} onCancel={handleCancel} isCancellable={false} />
                ))}
              </div>
            ) : (
              <Card><p className="text-center text-slate-500">Nenhum agendamento anterior.</p></Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AgendamentosList;