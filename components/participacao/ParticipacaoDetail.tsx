
import React, { useState } from 'react';
import { usePublicacaoById } from '../../hooks/useMockData';
import { View, StatusPublicacao, HistoricoPublicacao, TipoPublicacao, ComentarioPublicacao } from '../../types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import { MOCK_USER_PROFILES } from '../../constants';
import { timeSince } from '../../utils/helpers';

interface ParticipacaoDetailProps {
  publicacaoId: string;
  navigateTo: (view: View) => void;
}

const getStatusStyle = (status: StatusPublicacao) => {
    switch (status) {
        case StatusPublicacao.ABERTO: return { icon: 'record_voice_over', color: 'text-blue-500' };
        case StatusPublicacao.EM_ANALISE: return { icon: 'manage_search', color: 'text-yellow-500' };
        case StatusPublicacao.ENCAMINHADO: return { icon: 'send', color: 'text-purple-500' };
        case StatusPublicacao.CONCLUIDO: return { icon: 'check_circle', color: 'text-green-500' };
        case StatusPublicacao.REJEITADO: return { icon: 'gpp_bad', color: 'text-red-500' };
        default: return { icon: 'article', color: 'text-slate-500' };
    }
};

const getTypeStyle = (tipo: TipoPublicacao) => {
    switch (tipo) {
        case TipoPublicacao.PROBLEMA: return { icon: 'report_problem', color: 'text-red-500' };
        case TipoPublicacao.IDEIA: return { icon: 'lightbulb', color: 'text-yellow-500' };
        case TipoPublicacao.ELOGIO: return { icon: 'thumb_up', color: 'text-green-500' };
        case TipoPublicacao.EVENTO: return { icon: 'event', color: 'text-blue-500' };
        default: return { icon: 'forum', color: 'text-slate-500' };
    }
};

const TimelineItem: React.FC<{ item: HistoricoPublicacao, isLast: boolean }> = ({ item, isLast }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
        <li className="relative pb-8">
            {!isLast && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-700" aria-hidden="true"></span>}
            <div className="relative flex items-start space-x-3">
                <div className="h-8 w-8 bg-white dark:bg-slate-800 rounded-full ring-4 ring-white dark:ring-slate-800 flex items-center justify-center">
                    <Icon name={statusStyle.icon} className={`text-2xl ${statusStyle.color}`} />
                </div>
                <div className="min-w-0 flex-1 py-1.5">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        Status alterado para <span className={`font-semibold ${statusStyle.color}`}>{item.status}</span>
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(item.data).toLocaleString('pt-BR')}
                    </div>
                    {item.observacao && <p className="text-sm mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-700 dark:text-slate-200">{item.observacao}</p>}
                </div>
            </div>
        </li>
    );
};


const ParticipacaoDetail: React.FC<ParticipacaoDetailProps> = ({ publicacaoId, navigateTo }) => {
  const { data: publicacao, loading } = usePublicacaoById(publicacaoId);
  const [isSupported, setIsSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<ComentarioPublicacao[]>([]);
  const { addToast } = useToast();

  React.useEffect(() => {
    if (publicacao) {
      setSupportCount(publicacao.counts.supports);
      setComments(publicacao.comments);
    }
  }, [publicacao]);

  const handleSupport = () => {
    setIsSupported(!isSupported);
    setSupportCount(prev => isSupported ? prev - 1 : prev + 1);
    addToast(isSupported ? 'Apoio removido' : 'Obrigado por apoiar!', 'success');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
        const currentUser = MOCK_USER_PROFILES[0];
        const commentToAdd: ComentarioPublicacao = {
            id: `cpub${Date.now()}`,
            author: { uid: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
            text: newComment,
            date: new Date().toISOString(),
            isOfficialReply: false,
        };
        setComments(prev => [...prev, commentToAdd]);
        setNewComment('');
        addToast('Comentário adicionado!', 'success');
    }
  };

  if (loading) return <Spinner />;
  if (!publicacao) return <Card><p>Publicação não encontrada.</p></Card>;

  const typeStyle = getTypeStyle(publicacao.tipo);

  return (
    <div className="space-y-4">
      <Button onClick={() => navigateTo('PARTICIPACAO_FEED')} variant="ghost" iconLeft="arrow_back">Voltar para o Feed</Button>
      
      <Card className="!p-0 overflow-hidden">
        {publicacao.fotos && publicacao.fotos.length > 0 && (
            <div className="grid grid-cols-2 gap-1 bg-slate-200 dark:bg-slate-700">
                {publicacao.fotos.map((foto, index) => (
                    <img key={index} src={foto} alt={`Foto ${index+1}`} className="w-full h-48 object-cover" />
                ))}
            </div>
        )}
        <div className="p-4">
            <div className="flex items-center space-x-3">
                <img src={publicacao.author.avatar} alt="Avatar do autor" className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{publicacao.author.isAnonymous ? 'Anônimo' : publicacao.author.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{timeSince(publicacao.createdAt)}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                           <Icon name="location_on" className="!text-xs" />
                           <span>{publicacao.bairro}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                    <Icon name={typeStyle.icon} className={`text-xl ${typeStyle.color}`} />
                    <span className={`font-bold text-sm ${typeStyle.color}`}>{publicacao.tipo}</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{publicacao.title}</h1>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed my-4">{publicacao.descricao}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-around gap-2">
                <Button onClick={handleSupport} variant={isSupported ? 'primary' : 'secondary'} iconLeft="thumb_up" className="w-full sm:w-auto flex-1">
                    {isSupported ? 'Apoiado' : 'Apoiar'} ({supportCount})
                </Button>
                <Button variant="secondary" iconLeft="bookmark_add" className="w-full sm:w-auto flex-1">Seguir</Button>
                <Button variant="secondary" iconLeft="share" className="w-full sm:w-auto flex-1">Compartilhar</Button>
            </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Histórico</h2>
        <ul>
            {[...publicacao.historico].reverse().map((item, index, arr) => (
                <TimelineItem key={index} item={item} isLast={index === arr.length - 1} />
            ))}
        </ul>
      </Card>
        
      <Card>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Comentários ({comments.length})</h2>
        <div className="space-y-4">
            {comments.map(comment => (
                <div key={comment.id} className={`flex items-start space-x-3 p-3 rounded-lg ${comment.isOfficialReply ? 'bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500' : ''}`}>
                    <img src={comment.author.avatar} alt={comment.author.name} className="w-9 h-9 rounded-full"/>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{comment.author.name}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">{timeSince(comment.date)}</span>
                        </div>
                         {comment.isOfficialReply && (
                            <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mt-0.5">RESPOSTA OFICIAL</div>
                         )}
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{comment.text}</p>
                    </div>
                </div>
            ))}
        </div>
        <form onSubmit={handleAddComment} className="mt-6 flex items-start space-x-2">
            <img src={MOCK_USER_PROFILES[0].avatar} alt="Seu avatar" className="w-9 h-9 rounded-full"/>
            <div className="flex-1">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Adicione um comentário..."
                    className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    rows={2}
                />
                <Button type="submit" size="sm" disabled={!newComment.trim()} className="mt-2">
                    Comentar
                </Button>
            </div>
        </form>
      </Card>
    </div>
  );
};

export default ParticipacaoDetail;
