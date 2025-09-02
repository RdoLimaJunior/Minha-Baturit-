import { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, Type } from '@google/genai';
import { ChatMessage, ChatAction, UserProfile } from '../types';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
      responseText: {
        type: Type.STRING,
        description: 'A resposta em texto para o usuário.',
      },
      action: {
        type: Type.OBJECT,
        description: 'Uma ação de navegação opcional para o usuário.',
        nullable: true,
        properties: {
          buttonText: {
            type: Type.STRING,
            description: 'O texto para o botão de ação.',
          },
          view: {
            type: Type.STRING,
            description: "A tela para a qual navegar. Valores possíveis: 'PROTOCOLO_FORM', 'PROTOCOLOS_LIST', 'NOTICIAS_LIST', 'MAPA_SERVICOS', 'SECRETARIAS_LIST', 'TURISMO_DASHBOARD', 'CONTATOS_LIST', 'SERVICOS_ONLINE_DASHBOARD', 'AGENDAMENTOS_LIST', 'TURISMO_LIST'.",
          },
          params: {
            type: Type.OBJECT,
            description: 'Parâmetros opcionais para a navegação.',
            nullable: true,
            properties: {
                turismoCategoria: {
                    type: Type.STRING,
                    description: "Para a view 'TURISMO_LIST', especifique a categoria. Valores: 'Gastronomia', 'Lazer e Entretenimento', 'Hospedagem', 'Pontos Turísticos'."
                }
            }
          },
        },
      },
    },
};

const systemInstruction = `Você é Uirapuru, um assistente virtual para o aplicativo Minha Baturité. Seja amigável e prestativo.
**Instruções de Resposta:**
Sempre responda no formato JSON usando o schema fornecido. O JSON deve ter uma chave "responseText".
Quando for relevante, inclua uma chave "action" para ajudar o usuário a navegar no aplicativo.

**Ações Disponíveis (para a chave "view"):**
'PROTOCOLO_FORM', 'PROTOCOLOS_LIST', 'NOTICIAS_LIST', 'MAPA_SERVICOS', 'SECRETARIAS_LIST', 'TURISMO_DASHBOARD', 'CONTATOS_LIST', 'SERVICOS_ONLINE_DASHBOARD', 'AGENDAMENTOS_LIST', 'TURISMO_LIST'.

**Parâmetros de Ação:**
- Para 'TURISMO_LIST', você PODE usar o parâmetro "turismoCategoria" com os valores: 'Gastronomia', 'Lazer e Entretenimento', 'Hospedagem', 'Pontos Turísticos'.

**Exemplos:**
- Usuário: "quero fazer uma reclamação" -> Resposta: {"responseText": "Claro, vou te direcionar para a tela de abertura de protocolos.", "action": {"buttonText": "Abrir formulário", "view": "PROTOCOLO_FORM"}}
- Usuário: "onde posso comer?" -> Resposta: {"responseText": "Baturité tem ótimas opções! Explore na seção de turismo.", "action": {"buttonText": "Ver Gastronomia", "view": "TURISMO_LIST", "params": {"turismoCategoria": "Gastronomia"}}}
- Usuário: "oi" -> Resposta: {"responseText": "Olá! Sou o Uirapuru. Como posso te ajudar?"}`;


export const useChat = (userProfile: UserProfile) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const chatInstance = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
      setChat(chatInstance);
      
      const initialMessageContent = `Olá, ${userProfile.name}! Eu sou o Uirapuru, o assistente virtual do Minha Baturité. Como posso te ajudar hoje?`;
      const initialMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: initialMessageContent,
      };
  
      setMessages([initialMessage]);
    }, [userProfile.name]);
  
    const sendMessage = useCallback(async (message: string) => {
      if (!message.trim() || isLoading || !chat) return;
  
      const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: message };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
  
      try {
          const response = await chat.sendMessage({ message });
          
          let finalContent = 'Desculpe, não consegui processar a resposta.';
          let action: ChatAction | undefined = undefined;
  
          let jsonText = response.text.trim();
          
          // FIX: The model sometimes wraps the JSON in markdown. This removes it.
          if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
          }

          try {
              const parsed = JSON.parse(jsonText);
              if (parsed.responseText) {
                  finalContent = parsed.responseText;
                  if (parsed.action && parsed.action.view && parsed.action.buttonText) {
                      action = parsed.action;
                  }
              }
          } catch (e) {
              console.error("Falha ao analisar a resposta JSON do Gemini:", e);
              finalContent = jsonText || 'Não recebi uma resposta válida. Tente novamente.';
          }
  
          const modelMessage: ChatMessage = {
              id: `model-${Date.now()}`,
              role: 'model',
              content: finalContent,
              action: action,
          };
          setMessages(prev => [...prev, modelMessage]);
  
      } catch (error) {
          console.error("Erro ao enviar mensagem:", error);
          setMessages(prev => {
              return [...prev, { id: `model-${Date.now()}`, role: 'model', content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.' }];
          });
      } finally {
          setIsLoading(false);
      }
    }, [chat, isLoading]);

    const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
        setMessages(prevMessages =>
          prevMessages.map(msg => {
            if (msg.id === messageId) {
              return { ...msg, feedback: msg.feedback === feedback ? null : feedback };
            }
            return msg;
          })
        );
    };

    return { messages, isLoading, sendMessage, handleFeedback };
};