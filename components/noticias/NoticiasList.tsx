import React, { useState } from 'react';
import { useNoticias } from '../../hooks/useMockData';
import { Noticia, View } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import LazyImage from '../ui/LazyImage';

interface NoticiasListProps {
  navigateTo: (view: View, params?: { noticiaId?: string }) => void;
}

const NoticiaSkeletonItem: React.FC = () => (
    <Card className="!p-0 overflow-hidden">
        <div className="animate-pulse">
            <div className="p-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                </div>
            </div>
            <div className="w-full h-96 bg-slate-200 dark:bg-slate-700"></div>
            <div className="p-4 space-y-3">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700"></div>
                    <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700"></div>
                    <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/5"></div>
                <div className="space-y-2">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    </Card>
);

const NoticiaItem: React.FC<{ noticia: Noticia, onNavigate: () => void }> = ({ noticia, onNavigate }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(noticia.likes);
    const [isImageLoading, setIsImageLoading] = useState(true); // State to control the spinner
    const { addToast } = useToast();

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation when clicking the like button
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: noticia.title,
                    text: noticia.summary,
                    url: noticia.link,
                });
            } catch (error) {
                // Don't show an error if the user cancels the share dialog
                if (error instanceof Error && error.name === 'AbortError') {
                    console.log('Share cancelled by user.');
                } else {
                    console.error('Error sharing', error);
                    addToast('Não foi possível compartilhar a notícia.', 'error');
                }
            }
        } else {
            // Fallback for browsers that do not support the Web Share API
            try {
                await navigator.clipboard.writeText(noticia.link);
                addToast('Link da notícia copiado para a área de transferência!', 'info');
            } catch (err) {
                console.error('Failed to copy link: ', err);
                addToast('Não foi possível copiar o link.', 'error');
            }
        }
    };
    
    return (
        <Card 
          onClick={onNavigate}
          className="!p-0 overflow-visible" // overflow-visible for potential comment previews in future
        >
          <div className="p-4 flex items-center space-x-3">
            <img 
              src="https://www.baturite.ce.gov.br/imagens/logo-prefeitura-de-baturite.png" 
              alt="Logo Prefeitura" 
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
            />
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">Prefeitura de Baturité</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(noticia.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <LazyImage 
            src={noticia.imageUrl} 
            alt={noticia.title} 
            className="w-full h-96 object-cover"
            isLoading={isImageLoading}
            onLoad={() => setIsImageLoading(false)}
          />
          <div className="p-4">
              <div className="flex items-center space-x-4">
                 <button onClick={handleLike} className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-500 transition-colors">
                    <Icon name={isLiked ? 'favorite' : 'favorite_border'} className={`text-3xl ${isLiked ? 'text-red-500' : ''}`} />
                 </button>
                 <button onClick={onNavigate} className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors">
                    <Icon name="chat_bubble_outline" className="text-3xl" />
                 </button>
                 <button onClick={handleShare} className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors">
                    <Icon name="share" className="text-3xl" />
                 </button>
              </div>
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-200 mt-3">{likeCount.toLocaleString('pt-BR')} curtidas</p>
              <p className="text-sm text-slate-800 dark:text-slate-100 mt-2">
                <span className="font-bold">Prefeitura de Baturité</span> {noticia.summary}
              </p>
              {noticia.comments.length > 0 && (
                <button onClick={onNavigate} className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                    Ver todos os {noticia.comments.length} comentários
                </button>
              )}
          </div>
        </Card>
    );
};

const NoticiasList: React.FC<NoticiasListProps> = ({ navigateTo }) => {
  const { data: noticias, loading } = useNoticias();

  if (loading) {
      return (
          <div className="space-y-4">
              <div className="flex items-center space-x-2 animate-pulse">
                  <Button variant="ghost" size="icon" className="!bg-slate-200 dark:!bg-slate-700" disabled><Icon name="arrow_back" className="text-transparent" /></Button>
                  <div className="h-8 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
              </div>
              <div className="space-y-6 pt-2">
                  {[...Array(2)].map((_, i) => <NoticiaSkeletonItem key={i} />)}
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('MAIS_DASHBOARD')} variant="ghost" size="icon">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Últimas Notícias</h2>
      </div>

      {noticias && noticias.length > 0 ? (
        <div className="space-y-6">
            {noticias.map(noticia => (
              <NoticiaItem key={noticia.id} noticia={noticia} onNavigate={() => navigateTo('NOTICIA_DETAIL', { noticiaId: noticia.id })} />
            ))}
        </div>
      ) : (
        <Card className="text-center">
          <p className="text-slate-600 dark:text-slate-300">Nenhuma notícia encontrada no momento.</p>
        </Card>
      )}
    </div>
  );
};

export default NoticiasList;