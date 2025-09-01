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
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
            />
            <div>
              <h4 className="font-bold text-slate-800">Prefeitura de Baturité</h4>
              <p className="text-xs text-slate-500">{new Date(noticia.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
                 <button onClick={handleLike} className="flex items-center space-x-1 text-slate-600 hover:text-red-500 transition-colors">
                    <Icon name={isLiked ? 'favorite' : 'favorite_border'} className={`text-3xl ${isLiked ? 'text-red-500' : ''}`} />
                 </button>
                 <button onClick={onNavigate} className="flex items-center space-x-1 text-slate-600 hover:text-indigo-700 transition-colors">
                    <Icon name="chat_bubble_outline" className="text-3xl" />
                 </button>
                 <button onClick={handleShare} className="flex items-center space-x-1 text-slate-600 hover:text-indigo-700 transition-colors">
                    <Icon name="share" className="text-3xl" />
                 </button>
              </div>
              <p className="font-semibold text-sm text-slate-700 mt-3">{likeCount.toLocaleString('pt-BR')} curtidas</p>
              <p className="text-sm text-slate-800 mt-2">
                <span className="font-bold">Prefeitura de Baturité</span> {noticia.summary}
              </p>
              {noticia.comments.length > 0 && (
                <button onClick={onNavigate} className="text-sm text-slate-500 mt-2 font-semibold">
                    Ver todos os {noticia.comments.length} comentários
                </button>
              )}
          </div>
        </Card>
    );
};

const NoticiasList: React.FC<NoticiasListProps> = ({ navigateTo }) => {
  const { data: noticias, loading } = useNoticias();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('MAIS_DASHBOARD')} variant="ghost" size="icon">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800">Últimas Notícias</h2>
      </div>

      {loading ? (
        <Spinner />
      ) : noticias && noticias.length > 0 ? (
        <div className="space-y-6">
            {noticias.map(noticia => (
              <NoticiaItem key={noticia.id} noticia={noticia} onNavigate={() => navigateTo('NOTICIA_DETAIL', { noticiaId: noticia.id })} />
            ))}
        </div>
      ) : (
        <Card className="text-center">
          <p className="text-slate-600">Nenhuma notícia encontrada no momento.</p>
        </Card>
      )}
    </div>
  );
};

export default NoticiasList;