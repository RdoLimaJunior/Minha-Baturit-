import React from 'react';
import { Noticia } from '../../types';
import Card from '../ui/Card';
import Icon from '../ui/Icon';

interface NoticiaCardProps {
  noticia: Noticia;
  onClick: () => void;
}

const NoticiaCard: React.FC<NoticiaCardProps> = ({ noticia, onClick }) => {
  return (
    <Card onClick={onClick} className="flex space-x-4">
        <img 
            src={noticia.imageUrl}
            alt={noticia.title}
            className="w-24 h-24 object-cover rounded-lg bg-slate-200"
            loading="lazy"
        />
        <div className="flex-1">
            <h3 className="font-bold text-slate-800 line-clamp-2">{noticia.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{new Date(noticia.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</p>
             <div className="flex items-center space-x-4 text-xs text-slate-600 mt-2">
                <div className="flex items-center space-x-1">
                    <Icon name='favorite_border' className="text-sm" />
                    <span>{noticia.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <Icon name='chat_bubble_outline' className="text-sm" />
                    <span>{noticia.comments.length}</span>
                </div>
            </div>
        </div>
    </Card>
  );
};

export default NoticiaCard;