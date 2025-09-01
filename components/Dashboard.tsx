import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from './ui/Icon';
import Card from './ui/Card';
import Button from './ui/Button';
import { UserProfile, UserRole, View } from '../types';
import { useToast } from './ui/Toast';
import { useChat } from '../../hooks/useChat';
import ChatMessageComponent from './dashboard/ChatMessage';

const TypingIndicator = () => (
  <div className="flex items-end animate-fade-slide-in">
    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-3">
        <Icon name="flutter_dash" className="text-indigo-700 !text-xl" />
    </div>
    <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-slate-200 text-slate-800 rounded-bl-lg">
        <div className="flex items-center space-x-1.5">
            <span className="typing-dot"></span>
            <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
            <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
        </div>
    </div>
  </div>
);

const WeatherWidget = () => {
    // Mock data for Baturité weather
    const weather = {
        temperature: 28,
        condition: 'Ensolarado',
        icon: 'wb_sunny'
    };

    return (
        <div className="flex items-center space-x-2 text-slate-700">
            <Icon name={weather.icon} className="text-3xl text-amber-500" />
            <div className="text-right">
                <p className="font-bold text-xl">{weather.temperature}°C</p>
                <p className="text-xs text-slate-500">{weather.condition}</p>
            </div>
        </div>
    );
};


// --- SVG Icons for Social Media ---
const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.902 4.902 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122s-.013 3.056-.06 4.122c-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.556.556-1.112.9-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06s-3.056-.013-4.122-.06c-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12s.013-3.056.06-4.122c.05-1.065.217-1.79.465-2.428a4.883 4.883 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 2c-2.67 0-2.987.01-4.043.058-1.002.048-1.595.212-2.076.385a2.89 2.89 0 00-1.15 1.15c-.173.48-.337 1.073-.385 2.076-.048 1.056-.058 1.373-.058 4.043s.01 2.987.058 4.043c.048 1.002.212 1.595.385 2.076.173.481.417.86.748 1.15a2.895 2.895 0 001.15.748c.48.173 1.073.337 2.076.385 1.056.048 1.373.058 4.043.058s2.987-.01 4.043-.058c1.002-.048 1.595-.212 2.076-.385a2.89 2.89 0 001.15-1.15.938.938 0 00.218-.385c.173-.48.337-1.073.385-2.076.048-1.056.058-1.373.058-4.043s-.01-2.987-.058-4.043c-.048-1.002-.212-1.595-.385-2.076a2.89 2.89 0 00-1.15-1.15c-.481-.173-1.073-.337-2.076-.385C14.987 4.01 14.67 4 12 4zm0 4.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.5a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zM16.5 6.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" />
  </svg>
);

const YouTubeIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.267,4,12,4,12,4S5.733,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.733,2,12,2,12s0,4.267,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.733,20,12,20,12,20s6.267,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.267,22,12,22,12S22,7.733,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/>
    </svg>
);

const XIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.04 2C6.5 2 2.01 6.5 2.01 12c0 1.8.48 3.47 1.34 4.94L2 22l5.25-1.38c1.4.78 3.02 1.23 4.75 1.23h.01c5.52 0 10-4.48 10-10s-4.48-10-10-10zM17.5 14.3c-.28-.14-1.64-.81-1.9- .91s-.45-.14-.64.14s-.72.91-.88 1.1s-.33.19-.61.07c-1.12-.49-2.12-1.2-2.92-2.04s-1.2-1.9-1.34-2.22s-.02-.35.12-.47c.12-.13.28-.33.42-.49s.19-.28.28-.47s.05-.35-.02-.52c-.08-.17-.72-1.72-.98-2.36s-.51-.53-.7-.54h-.6c-.22 0-.47.07-.66.31s-.72.7-.72 1.73s.74 2.01.83 2.15s1.45 2.22 3.51 3.1c.52.23.93.37 1.25.47s.57.17.82.1c.3-.07.96-.39 1.1-.77s.14-.7.1-.77s-.14-.12-.28-.26z"/>
    </svg>
);

const TikTokIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.38 1.92-3.54 2.99-5.85 2.86-2.43-.14-4.63-1.5-5.9-3.45-1.45-2.18-1.7-4.96-1.7-7.66-.01-2.93.01-5.85-.02-8.75-.02-1.02.24-2.08.82-2.99 1.38-2.16 3.94-3.4 6.52-3.11.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01-1.19-.01-2.38-.01-3.57z" />
    </svg>
);

interface DashboardProps {
  navigateTo: (view: View, params?: any) => void;
  userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ navigateTo, userProfile }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const { messages, isLoading, sendMessage, handleFeedback } = useChat(userProfile);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { addToast } = useToast();

  const suggestedQuestions = [
    "Como abro um protocolo?",
    "Qual o telefone do hospital?",
    "Onde posso almoçar em Baturité?",
    "Quais os pontos turísticos?",
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.parentElement?.scrollTo({
            top: messagesEndRef.current.parentElement.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    setInput('');
    await sendMessage(message);
  }, [sendMessage]);

  useEffect(() => {
    if (!recognitionRef.current) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognitionRef.current = recognition;
      } else {
        console.warn("Speech Recognition not supported by this browser.");
      }
    }
  }, []);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      addToast(`Erro no reconhecimento de voz: ${event.error}`, 'error');
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSendMessage(transcript);
    };
  }, [addToast, handleSendMessage]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };
  
  const handleToggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
        addToast('Reconhecimento de voz não é suportado neste navegador.', 'info');
        return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      setInput(''); 
      recognition.start();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast('Resposta copiada!', 'success');
    }).catch(err => {
      console.error("Failed to copy:", err);
      addToast('Erro ao copiar texto.', 'error');
    });
  };

  if (userProfile.role === UserRole.GESTOR) {
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold text-slate-800">Painel do Gestor</h2>
            <p className="text-slate-600">Bem-vindo, {userProfile.name}. Funcionalidades de gestão em breve.</p>
        </div>
    );
  }
  
  return (
    <div>
       <style>{`
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1.0); }
        }
        .typing-dot {
            width: 8px;
            height: 8px;
            background-color: #475569;
            border-radius: 50%;
            display: inline-block;
            animation: bounce 1.4s infinite ease-in-out both;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        @keyframes fade-slide-in {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-slide-in {
            animation: fade-slide-in 0.3s ease-out forwards;
        }
      `}</style>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Olá, {userProfile.name}!</h1>
            <p className="text-slate-600">Bem-vindo(a) ao Minha Baturité.</p>
          </div>
          <WeatherWidget />
        </div>

        <Card className="!p-0 flex flex-col h-[65vh] max-h-[700px]">
          <div className="flex-shrink-0 p-3 bg-white border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-700 text-sm">Assistente Uirapuru</h3>
          </div>
          <div className="flex-grow p-4 space-y-4 overflow-y-auto" role="log" aria-live="polite">
              {messages.map((msg, index) => (
                <ChatMessageComponent
                    key={msg.id}
                    message={msg}
                    isLastMessage={index === messages.length - 1}
                    isLoading={isLoading}
                    onActionClick={navigateTo}
                    onFeedback={handleFeedback}
                    onCopy={handleCopy}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
          </div>
          <div className="flex-shrink-0 p-3 bg-white border-t border-slate-200">
              {messages.length <= 1 && !isLoading && (
                  <div className="mb-3">
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {suggestedQuestions.map((q, i) => (
                          <button
                              key={i}
                              onClick={() => handleSendMessage(q)}
                              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium whitespace-nowrap hover:bg-slate-200 transition-colors"
                          >
                          {q}
                          </button>
                      ))}
                      </div>
                </div>
              )}
              <form onSubmit={handleSend} className="flex items-center space-x-2">
              <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Ouvindo..." : "Pergunte ao assistente..."}
                  className="w-full p-3 border border-slate-300 rounded-full focus:ring-indigo-600 focus:border-indigo-600 text-sm"
                  disabled={isLoading || isListening}
                  aria-label="Caixa de texto para perguntas ao assistente virtual"
              />
              {input.trim() ? (
                  <Button type="submit" size="icon" disabled={isLoading} aria-label="Enviar mensagem">
                      <Icon name="send" />
                  </Button>
              ) : (
                  <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={handleToggleListening}
                      disabled={isLoading}
                      className={isListening ? '!text-red-500' : ''}
                      aria-label={isListening ? "Parar de ouvir" : "Falar com assistente"}
                  >
                      <Icon name="mic" />
                  </Button>
              )}
              </form>
          </div>
        </Card>
      </div>
      
      <div className="text-center bg-slate-200 py-8">
        <img 
            src="https://www.baturite.ce.gov.br/imagens/logo.png?time=1756738907" 
            alt="Logo Prefeitura de Baturité" 
            className="mx-auto h-16 sm:h-20 mb-4"
        />
        <h3 className="font-semibold text-slate-700 mb-3">Siga nas redes sociais</h3>
        <div className="flex justify-center flex-wrap gap-4">
            <a href="https://www.facebook.com/Governo-Municipal-de-Baturit%C3%A9-104660501581546" target="_blank" rel="noopener noreferrer" title="Facebook" className="text-slate-500 hover:text-blue-600 transition-colors">
                <FacebookIcon />
            </a>
            <a href="https://www.instagram.com/prefeitura.baturite/" target="_blank" rel="noopener noreferrer" title="Instagram" className="text-slate-500 hover:text-pink-500 transition-colors">
                <InstagramIcon />
            </a>
            <a href="https://www.youtube.com/channel/UCyuBX70YG6fs4aN-cwKfECA" target="_blank" rel="noopener noreferrer" title="YouTube" className="text-slate-500 hover:text-red-600 transition-colors">
                <YouTubeIcon />
            </a>
            <a href="https://x.com/prefbaturite" target="_blank" rel="noopener noreferrer" title="X (Twitter)" className="text-slate-500 hover:text-black transition-colors">
                <XIcon />
            </a>
            <a href="https://wa.me/5585912345678" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="text-slate-500 hover:text-green-500 transition-colors">
                <WhatsAppIcon />
            </a>
            <a href="https://tiktok.com/@prefeiturabaturite" target="_blank" rel="noopener noreferrer" title="TikTok" className="text-slate-500 hover:text-black transition-colors">
                <TikTokIcon />
            </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
