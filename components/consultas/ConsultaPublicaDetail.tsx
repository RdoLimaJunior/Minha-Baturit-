import React, { useState } from 'react';
import { View, OpiniaoConsulta, StatusConsultaPublica } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Spinner from '../ui/Spinner';
import { useConsultaPublicaById } from '../../hooks/useMockData';
import { MOCK_USER_PROFILES } from '../../constants';
import { useToast } from '../ui/Toast';
import { timeSince } from '../../utils/helpers';

interface ConsultaPublicaDetailProps {
  consultaId: string;
  navigateTo: (view: View) => void;
}

const ConsultaPublicaDetail: React.FC<ConsultaPublicaDetailProps> = ({ consultaId, navigateTo }) => {
  const { data: consulta, loading } = useConsultaPublicaById(consultaId);
  const { addToast } = useToast();
  const [opinioes, setOpinioes] = useState<OpiniaoConsulta[]>([]);
  const [newOpinion, setNewOpinion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  React.useEffect(() => {
      if (consulta) {
          setOpinioes(consulta.opinioes);
      }
  }, [consulta]);

  const handleSubmitOpinion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpinion.trim()) {
      addToast('Sua opinião não pode estar vazia.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
        const currentUser = MOCK_USER_PROFILES[0];
        const opinionToAdd: OpiniaoConsulta = {
            id: `op${Date.now()}`,
            author: { uid: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
            text: newOpinion,
            date: new Date().toISOString(),
        };
        setOpinioes(prev => [opinionToAdd, ...prev]);
        setNewOpinion('');
        setIsSubmitting(false);
        addToast('Sua opinião foi enviada com sucesso!', 'success');
    }, 1000);
  };

  if (loading) return <Spinner />;
  if (!consulta) return <Card><p>Consulta pública não encontrada.</p></Card>;

  const endDate = new Date(consulta.endDate);
  const now = new Date();
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isAberta = consulta.status === StatusConsultaPublica.ABERTA && now < endDate;

  return (
    <div className="space-y-4">
      <Button onClick={() => navigateTo('CONSULTAS_PUBLICAS_LIST')} variant="ghost" iconLeft="arrow_back">
        Todas as Consultas
      </Button>

      <Card className="!p-0 overflow-hidden">
        <img src={consulta.imageUrl} alt={consulta.title} className="w-full h-56 object-cover bg-slate-200 dark:bg-slate-700" />
        <div className="p-4">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{consulta.title}</h1>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                <p><strong>Período de participação:</strong> {new Date(consulta.startDate).toLocaleDateString('pt-BR')} a {endDate.toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">{consulta.description}</p>
            </div>
        </div>
      </Card>
      
      {consulta.documentos && consulta.documentos.length > 0 && (
          <Card>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">Documentos e Anexos</h2>
              <div className="space-y-2">
                  {consulta.documentos.map(doc => (
                      <a href={doc.url} key={doc.nome} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                          <Icon name={doc.icon} className="text-2xl text-indigo-700 dark:text-indigo-400" />
                          <span className="ml-3 font-medium text-sm text-slate-800 dark:text-slate-200">{doc.nome}</span>
                          <Icon name="download" className="ml-auto text-xl text-slate-500 dark:text-slate-400" />
                      </a>
                  ))}
              </div>
          </Card>
      )}

      {isAberta ? (
        <Card>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Deixe sua Opinião</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">A consulta encerra em {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}.</p>
            <form onSubmit={handleSubmitOpinion} className="space-y-3">
                 <textarea
                    value={newOpinion}
                    onChange={(e) => setNewOpinion(e.target.value)}
                    placeholder="Escreva sua sugestão, crítica ou apoio ao projeto..."
                    className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    rows={4}
                    disabled={isSubmitting}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Enviar Opinião'}
                </Button>
            </form>
        </Card>
      ) : (
        <Card className="text-center">
            <Icon name="lock_clock" className="text-4xl text-slate-400 dark:text-slate-500 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-200 mt-2">Período de participação encerrado.</p>
        </Card>
      )}

       <Card>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Opiniões da Comunidade ({opinioes.length})</h2>
        <div className="space-y-4">
            {opinioes.map(op => (
                <div key={op.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <img src={op.author.avatar} alt={op.author.name} className="w-9 h-9 rounded-full"/>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{op.author.name}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">{timeSince(op.date)}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{op.text}</p>
                    </div>
                </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default ConsultaPublicaDetail;