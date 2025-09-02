import React from 'react';
import { ChatMessage, View } from '../../types';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface ChatMessageProps {
    message: ChatMessage;
    isLastMessage: boolean;
    isLoading: boolean;
    onActionClick: (view: View, params?: any) => void;
    onFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
    onCopy: (text: string) => void;
}

const UirapuruAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0 mr-3">
      <Icon name="flutter_dash" className="text-indigo-700 dark:text-indigo-400 !text-xl" />
    </div>
);

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message, isLastMessage, isLoading, onActionClick, onFeedback, onCopy }) => {
    const showActions = message.role === 'model' && message.content && !(isLoading && isLastMessage);
    const showNavAction = message.role === 'model' && message.action && !(isLoading && isLastMessage);

    if (message.role === 'user') {
        return (
            <div className="flex flex-col items-end animate-fade-slide-in">
                <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-indigo-700 text-white rounded-br-lg">
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2 h-8">
                    {(!isLastMessage || !isLoading) && (
                        <Icon name="check" className="text-base text-slate-400 dark:text-slate-500" />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start animate-fade-slide-in">
            <div className="flex items-end">
                <UirapuruAvatar />
                <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg">
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2 mt-2 h-8 pl-11">
                {showNavAction && (
                    <Button
                        onClick={() => onActionClick(message.action!.view, message.action!.params)}
                        iconRight="east"
                        size="sm"
                        variant='secondary'
                        className="!font-semibold !bg-indigo-100 dark:!bg-indigo-900/50 !text-indigo-800 dark:!text-indigo-300 hover:!bg-indigo-200 dark:hover:!bg-indigo-900"
                    >
                        {message.action!.buttonText}
                    </Button>
                )}
                {showActions && (
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => onFeedback(message.id, 'like')}
                            title="Gostei"
                            className={`p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors ${message.feedback === 'like' ? '!text-green-600 !bg-green-100 dark:!bg-green-900/50' : ''}`}
                        >
                            <Icon name="thumb_up" className="text-lg" />
                        </button>
                        <button
                            onClick={() => onFeedback(message.id, 'dislike')}
                            title="Não Gostei"
                            className={`p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors ${message.feedback === 'dislike' ? '!text-red-600 !bg-red-100 dark:!bg-red-900/50' : ''}`}
                        >
                            <Icon name="thumb_down" className="text-lg" />
                        </button>
                        <button
                            onClick={() => onCopy(message.content)}
                            title="Copiar"
                            className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        >
                            <Icon name="content_copy" className="text-lg" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessageComponent;
