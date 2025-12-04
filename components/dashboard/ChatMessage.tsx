
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage, View, ChatAction } from '../../types';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { viewToPath } from '../../utils/navigation';

interface ChatMessageProps {
    message: ChatMessage;
    isLastMessage: boolean;
    isLoading: boolean;
    onFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
    onCopy: (text: string) => void;
}

const UirapuruAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
      <Icon name="flutter_dash" className="text-slate-700 !text-xl" />
    </div>
);

const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
      <Icon name="person" className="text-slate-500 !text-xl" />
    </div>
);

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message, isLastMessage, isLoading, onFeedback, onCopy }) => {
    const navigate = useNavigate();
    // Show feedback actions if it's a model's message, has content, and it's NOT the last message while the next one is loading.
    const showFeedbackActions = message.role === 'model' && message.content && (!isLoading || !isLastMessage);

    const handleActionClick = (action: ChatAction) => {
        switch (action.type) {
            case 'NAVIGATE':
                if (action.payload.view) {
                    const path = viewToPath(action.payload.view, action.payload.params);
                    navigate(path);
                }
                break;
            case 'OPEN_URL':
                if (action.payload.url) {
                    window.open(action.payload.url, '_blank');
                }
                break;
            case 'CALL':
                if (action.payload.phoneNumber) {
                    window.location.href = `tel:${action.payload.phoneNumber}`;
                }
                break;
            default:
                console.warn('Unknown action type:', action.type);
        }
    };

    if (message.role === 'user') {
        return (
             <div className="flex justify-end items-start gap-4 animate-fade-slide-in">
                <div className="flex flex-col items-end">
                    <p className="font-semibold text-slate-800 pt-1.5">Você</p>
                    <div className="mt-1 bg-slate-800 text-white p-3 rounded-2xl rounded-br-lg max-w-prose">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                </div>
                <UserAvatar />
            </div>
        );
    }

    return (
        <div className="flex items-start gap-4 animate-fade-slide-in">
            <UirapuruAvatar />
            <div className="flex-grow w-full min-w-0">
                <p className="font-semibold text-slate-800 pt-1.5">Assistente Uirapuru</p>
                <div className="mt-2 space-y-4">
                    {message.content && (
                         <div className="bg-slate-100 p-3 rounded-2xl rounded-bl-lg max-w-prose inline-block">
                            <p className="whitespace-pre-wrap text-slate-700">{message.content}</p>
                        </div>
                    )}

                    {message.structuredContent && (
                        <div className="p-4 border border-slate-200 rounded-lg space-y-3 text-sm max-w-prose">
                            {message.structuredContent.address && (
                                <div className="flex items-start">
                                    <Icon name="location_on" className="text-base mr-3 mt-0.5 text-slate-500 flex-shrink-0" />
                                    <span>{message.structuredContent.address}</span>
                                </div>
                            )}
                            {message.structuredContent.phone && (
                                <div className="flex items-start">
                                    <Icon name="phone" className="text-base mr-3 mt-0.5 text-slate-500 flex-shrink-0" />
                                    <span>{message.structuredContent.phone}</span>
                                </div>
                            )}
                            {message.structuredContent.openingHours && (
                                <div className="flex items-start">
                                    <Icon name="schedule" className="text-base mr-3 mt-0.5 text-slate-500 flex-shrink-0" />
                                    <span>{message.structuredContent.openingHours}</span>
                                </div>
                            )}
                            {message.structuredContent.documents && message.structuredContent.documents.length > 0 && (
                                <div className="flex items-start">
                                    <Icon name="description" className="text-base mr-3 mt-0.5 text-slate-500 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-slate-700">Documentos:</span>
                                        <ul className="list-disc list-inside text-slate-600">
                                            {message.structuredContent.documents.map((doc, i) => <li key={i}>{doc}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                     {message.actions && message.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 max-w-prose">
                            {message.actions.map((action, index) => (
                                <Button
                                    key={index}
                                    onClick={() => handleActionClick(action)}
                                    size="sm"
                                    variant='secondary'
                                    className="!font-semibold !bg-white !border !border-slate-200 hover:!bg-slate-100"
                                >
                                    {action.buttonText}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
                 {showFeedbackActions && (
                    <div className="mt-3 flex items-center space-x-1">
                        <button
                            onClick={() => onFeedback(message.id, 'like')}
                            title="Gostei"
                            className={`p-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors ${message.feedback === 'like' ? '!bg-emerald-100 !text-emerald-600' : ''}`}
                        >
                            <Icon name="thumb_up" className="text-base" />
                        </button>
                        <button
                            onClick={() => onFeedback(message.id, 'dislike')}
                            title="Não gostei"
                            className={`p-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors ${message.feedback === 'dislike' ? '!bg-rose-100 !text-rose-600' : ''}`}
                        >
                            <Icon name="thumb_down" className="text-base" />
                        </button>
                        <button
                            onClick={() => onCopy(message.content)}
                            title="Copiar"
                            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <Icon name="content_copy" className="text-base" />
                        </button>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default ChatMessageComponent;
      