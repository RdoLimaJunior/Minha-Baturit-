import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, UserRole, View } from '../types';
import { useToast } from './ui/Toast';
import { useChat } from '../../hooks/useChat';
import ChatMessageComponent from './dashboard/ChatMessage';
import WeatherWidget from './dashboard/WeatherWidget';
import DynamicGreeting from './dashboard/DynamicGreeting';
import AcoesRapidas from './dashboard/AcoesRapidas';
import FeedPrincipal from './dashboard/FeedPrincipal';
import Icon from './ui/Icon';
import Button from './ui/Button';
import { viewToPath } from '../../utils/navigation';

const TypingIndicator = () => (
    <div className="flex items-start gap-4 animate-fade-slide-in">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
            <Icon name="flutter_dash" className="text-slate-700 !text-xl" />
        </div>
        <div className="pt-1.5 w-full">
             <p className="font-semibold text-slate-800">Assistente Uirapuru</p>
            <div className="mt-2 inline-block px-4 py-3 rounded-2xl bg-slate-100 text-slate-800 rounded-bl-lg">
                <div className="flex items-center space-x-1.5">
                    <span className="typing-dot"></span>
                    <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
                    <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
                </div>
            </div>
        </div>
    </div>
);

interface DashboardProps {
  userProfile: UserProfile;
}

const suggestionPools = {
    turismo: [
      "Quais os melhores restaurantes?",
      "Onde posso me hospedar?",
      "Qual o horário do bondinho?",
      "Me fale sobre o Mosteiro dos Jesuítas."
    ],
    saude: [
      "Onde fica o posto de saúde mais próximo?",
      "Como agendar uma consulta?",
      "Qual o telefone do hospital?",
      "Onde estão vacinando contra a gripe?"
    ],
    protocolo: [
      "Como acompanhar meu protocolo?",
      "Quero abrir um chamado para buraco na rua.",
      "Como registrar uma sugestão de melhoria?",
      "Qual o contato da secretaria de obras?"
    ],
    geral: [
      "Ver as últimas notícias",
      "Quais os telefones de emergência?",
      "Ver o mapa de serviços da cidade",
      "Me fale sobre a história de Baturité",
      "Como funciona a coleta de lixo?",
      "Ver a lista de secretarias."
    ]
};

type SuggestionTopic = keyof typeof suggestionPools;

const getContextFromMessage = (messageContent: string): SuggestionTopic => {
  const lowerCaseContent = messageContent.toLowerCase();
  if (/\b(turismo|turístico|ponto|restaurante|hotel|pousada|passeio|viajar)\b/.test(lowerCaseContent)) {
    return 'turismo';
  }
  if (/\b(saúde|hospital|posto|médico|consulta|vacina|sus|remédio)\b/.test(lowerCaseContent)) {
    return 'saude';
  }
  if (/\b(protocolo|chamado|rua|buraco|poste|iluminação|serviço|agendar)\b/.test(lowerCaseContent)) {
    return 'protocolo';
  }
  return 'geral';
};

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [dynamicSuggestedQuestions, setDynamicSuggestedQuestions] = useState<string[]>([]);
  const [chatVisible, setChatVisible] = useState(false);
  
  const { messages, isLoading, sendMessage, handleFeedback } = useChat(userProfile);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const lastModelMessage = messages.filter(m => m.role === 'model').pop();
    const context = lastModelMessage ? getContextFromMessage(lastModelMessage.content) : 'geral';

    const contextualQuestions = suggestionPools[context] || [];
    const generalQuestions = suggestionPools.geral;

    const shuffledContext = [...contextualQuestions].sort(() => 0.5 - Math.random());
    const shuffledGeneral = [...generalQuestions].sort(() => 0.5 - Math.random());
    
    const suggestions = new Set<string>();
    shuffledContext.slice(0, 2).forEach(q => suggestions.add(q));
    
    let i = 0;
    while (suggestions.size < 4 && i < shuffledGeneral.length) {
        suggestions.add(shuffledGeneral[i]);
        i++;
    }
    
    setDynamicSuggestedQuestions(Array.from(suggestions));
  }, [messages]);


  useEffect(() => {
    if (chatVisible) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, chatVisible]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    setInput('');
    if (!chatVisible) setChatVisible(true);
    await sendMessage(message);
  }, [sendMessage, chatVisible]);

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

  const navigateTo = (view: View, params?: any) => {
    const path = viewToPath(view, params);
    navigate(path);
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
    <div className="flex flex-col h-full">
       <style>{`
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
        .typing-dot { width: 8px; height: 8px; background-color: #94a3b8; border-radius: 50%; display: inline-block; animation: bounce 1.4s infinite ease-in-out both; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-slide-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-slide-in { animation: fade-slide-in 0.3s ease-out forwards; }
      `}</style>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="container mx-auto px-4 pt-6 space-y-8">
            <div className="flex justify-between items-start">
              <DynamicGreeting userName={userProfile.name} />
              <WeatherWidget />
            </div>

            <AcoesRapidas />

            {chatVisible && (
                 <div className="space-y-8" role="log" aria-live="polite">
                    {messages.slice(1).map((msg, index) => (
                        <ChatMessageComponent
                            key={msg.id}
                            message={msg}
                            isLastMessage={index === messages.length - 2}
                            isLoading={isLoading}
                            onFeedback={handleFeedback}
                            onCopy={handleCopy}
                        />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            )}
            
            {!chatVisible && <FeedPrincipal navigateTo={navigateTo} />}

        </div>
      </div>
      
      <div className="flex-shrink-0 bg-slate-50/80 backdrop-blur-sm border-t border-gray-200">
        <div className="container mx-auto px-4 pt-2 pb-4">
          {!isLoading && (
              <div className="mb-3">
                  <div className="flex flex-wrap justify-center gap-2">
                  {dynamicSuggestedQuestions.map((q, i) => (
                      <button
                          key={i}
                          onClick={() => handleSendMessage(q)}
                          className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-100 hover:border-slate-300 transition-colors"
                      >
                      {q}
                      </button>
                  ))}
                  </div>
            </div>
          )}
          <form onSubmit={handleSend} className="w-full">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-slate-500">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? "Ouvindo..." : "Pergunte ao assistente..."}
                    className="bg-transparent focus:ring-0 border-0 w-full text-slate-800 placeholder-slate-400"
                    disabled={isLoading || isListening}
                    aria-label="Caixa de texto para perguntas ao assistente virtual"
                    onFocus={() => setChatVisible(true)}
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
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;