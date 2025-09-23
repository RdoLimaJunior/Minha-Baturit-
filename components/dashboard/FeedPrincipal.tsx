import React from 'react';
import { useNoticias, usePublicacoes } from '../../hooks/useMockData';
import { View } from '../../types';
import NoticiaCard from './NoticiaCard';
import PublicacaoCard from '../participacao/PublicacaoCard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

interface FeedPrincipalProps {
  navigateTo: (view: View, params?: any) => void;
}

const SkeletonCard: React.FC = () => (
    <Card className="!p-0 animate-pulse">
        <div className="w-full h-40 bg-slate-200"></div>
        <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-5 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded w-full"></div>
            <div className="h-3 bg-slate-200 rounded w-5/6"></div>
        </div>
    </Card>
);

const FeedPrincipal: React.FC<FeedPrincipalProps> = ({ navigateTo }) => {
  const { data: noticias, loading: loadingNoticias } = useNoticias();
  const { data: publicacoes, loading: loadingPublicacoes } = usePublicacoes();

  const loading = loadingNoticias || loadingPublicacoes;

  // Pegar as 2 notícias mais recentes
  const ultimasNoticias = noticias
    ? [...noticias].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 2)
    : [];
  
  // Pegar a publicação mais recente
  const ultimaPublicacao = publicacoes
    ? [...publicacoes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 1)
    : [];

  return (
    <div className="space-y-6">
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800">Feed Principal</h2>
            </div>

            {loading ? (
                <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : (
                <div className="space-y-4">
                    {ultimaPublicacao.length > 0 && (
                        <div>
                             <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center"><Icon name="campaign" className="mr-2" /> Participação Recente</h3>
                            {ultimaPublicacao.map(pub => (
                                <PublicacaoCard 
                                    key={pub.id} 
                                    publicacao={pub}
                                    onClick={() => navigateTo('PARTICIPACAO_DETAIL', { publicacaoId: pub.id })}
                                />
                            ))}
                             <Button variant="secondary" onClick={() => navigateTo('PARTICIPACAO_FEED')} className="w-full mt-3">Ver todas as publicações</Button>
                        </div>
                    )}

                    {ultimasNoticias.length > 0 && (
                         <div>
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center"><Icon name="feed" className="mr-2" /> Últimas Notícias</h3>
                            <div className="space-y-4">
                                {ultimasNoticias.map(noticia => (
                                    <NoticiaCard 
                                        key={noticia.id} 
                                        noticia={noticia} 
                                        onClick={() => navigateTo('NOTICIA_DETAIL', { noticiaId: noticia.id })}
                                    />
                                ))}
                            </div>
                            <Button variant="secondary" onClick={() => navigateTo('NOTICIAS_LIST')} className="w-full mt-3">Ver todas as notícias</Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default FeedPrincipal;
