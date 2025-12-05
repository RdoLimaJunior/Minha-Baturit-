
import { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, Type, Schema } from '@google/genai';
import { ChatMessage, ChatAction, UserProfile, Agendamento } from '../types';

// Definindo o schema corretamente com a interface do SDK
const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        responseText: {
            type: Type.STRING,
            description: 'A resposta em texto para o usuário, curta, calorosa e com sotaque local sutil.',
        },
        structuredContent: {
            type: Type.OBJECT,
            nullable: true,
            description: 'Dados estruturados para exibição.',
            properties: {
                address: { type: Type.STRING, description: 'Endereço completo.' },
                phone: { type: Type.STRING, description: 'Telefone de contato.' },
                openingHours: { type: Type.STRING, description: 'Horário de funcionamento.' },
                documents: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                },
            },
        },
        actions: {
            type: Type.ARRAY,
            nullable: true,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING },
                    buttonText: { type: Type.STRING },
                    payload: {
                        type: Type.OBJECT,
                        properties: {
                            view: { type: Type.STRING, nullable: true },
                            params: { 
                                type: Type.OBJECT, 
                                nullable: true,
                                properties: {
                                    protocoloId: { type: Type.STRING, nullable: true },
                                    noticiaId: { type: Type.STRING, nullable: true },
                                    predioId: { type: Type.STRING, nullable: true },
                                    turismoId: { type: Type.STRING, nullable: true },
                                    categoria: { type: Type.STRING, nullable: true },
                                    titulo: { type: Type.STRING, nullable: true },
                                    servicoId: { type: Type.STRING, nullable: true },
                                    publicacaoId: { type: Type.STRING, nullable: true },
                                    consultaId: { type: Type.STRING, nullable: true },
                                }
                            },
                            url: { type: Type.STRING, nullable: true },
                            phoneNumber: { type: Type.STRING, nullable: true },
                        },
                    },
                },
            },
        },
    },
};

const baseSystemInstruction = `Você é o **Uirapuru**, o assistente virtual oficial e orgulhoso de **Baturité, Ceará**. 
Sua personalidade é acolhedora, prestativa e levemente informal, como um bom cearense.
Use expressões locais sutis ocasionalmente (ex: "meu consagrado", "pense num lugar bonito", "arriégua, que coisa boa"), mas mantenha o profissionalismo.

**SEUS OBJETIVOS:**
1.  Ajudar o cidadão a navegar pelos serviços da prefeitura e descobrir o turismo local.
2.  Interpretar imagens enviadas (ex: identificar buracos em ruas, reconhecer pontos turísticos como o Mosteiro dos Jesuítas).

**REGRAS DE INTERAÇÃO:**
1.  **SEMPRE** responda em JSON seguindo o schema.
2.  No campo 'responseText', seja breve. Ninguém gosta de ler textoão no celular.
3.  Se o usuário disser "Oi" ou "Tudo bem?", responda com algo caloroso: "Opa! Tudo em paz? Sou o Uirapuru. No que posso ajudar Baturité a ficar melhor hoje?"
4.  **AÇÕES:** Se você sugerir algo que o app pode fazer (abrir protocolo, ver mapa), **OBRIGATORIAMENTE** inclua o botão na lista 'actions'.

**SOBRE IMAGENS:**
Se o usuário enviar uma imagem:
1.  Analise o que há na imagem.
2.  Se parecer um problema urbano (buraco, lixo, lâmpada queimada), sugira a abertura de um protocolo imediatamente. Ação: NAVIGATE -> PROTOCOLO_FORM.
3.  Se parecer um ponto turístico, identifique-o e ofereça informações históricas ou navegação. Ação: NAVIGATE -> TURISMO_DETAIL.
`;

export const useChat = (userProfile: UserProfile, agendamentos: Agendamento[]) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

        const upcomingAgendamentos = agendamentos
            .filter(a => a.status === 'Agendado' && new Date(a.dataHora) > new Date())
            .map(({ servicoNome, dataHora, status }) => ({ servicoNome, dataHora, status }));

        const userContext = `
**DADOS DO CIDADÃO:**
- Nome: ${userProfile.name}
- Perfil: ${userProfile.role}
- Agenda Futura: ${JSON.stringify(upcomingAgendamentos)}
`;

        const dynamicSystemInstruction = `${userContext}\n\n${baseSystemInstruction}`;
        
        const chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: dynamicSystemInstruction,
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            },
        });

        setChat(chatInstance);
    }, [userProfile, JSON.stringify(agendamentos)]);

    useEffect(() => {
        if (chat) {
            const upcomingAgendamentos = agendamentos
                .filter(a => a.status === 'Agendado' && new Date(a.dataHora) > new Date())
                .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());

            let greetingText = `Opa, ${userProfile.name}! Tudo tranquilo? Como posso te ajudar hoje?`;

            if (upcomingAgendamentos.length > 0) {
                const nextAgendamento = upcomingAgendamentos[0];
                const data = new Date(nextAgendamento.dataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
                greetingText = `Olá, ${userProfile.name}! Lembrei que você tem "${nextAgendamento.servicoNome}" dia ${data}. Precisa de mais alguma coisa?`;
            }

            const initialMessage: ChatMessage = {
                id: `model-initial-${Date.now()}`,
                role: 'model',
                content: greetingText,
                timestamp: new Date().toISOString(),
            };

            setMessages([initialMessage]);
            setIsLoading(false);
        }
    }, [chat, userProfile.name, JSON.stringify(agendamentos)]);
  
    const sendMessage = useCallback(async (message: string, imageBase64?: string) => {
      if ((!message.trim() && !imageBase64) || isLoading || !chat) return;
  
      const userMessage: ChatMessage = { 
          id: `user-${Date.now()}`, 
          role: 'user', 
          content: message, 
          timestamp: new Date().toISOString(),
          // Store image temporarily in structuredContent for UI display if needed, 
          // though typically we'd just show a "Image uploaded" indicator.
          structuredContent: imageBase64 ? { address: 'Imagem enviada' } : undefined 
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
  
      try {
          let response;
          if (imageBase64) {
              // Extract base64 data correctly (remove data:image/png;base64, prefix if present)
              const base64Data = imageBase64.split(',')[1] || imageBase64;
              
              response = await chat.sendMessage({
                  parts: [
                      { text: message || "Analise esta imagem." },
                      { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
                  ]
              });
          } else {
              response = await chat.sendMessage({ text: message });
          }
          
          let jsonText = response.text.trim();
          if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
          }
          
          const modelMessage: ChatMessage = {
              id: `model-${Date.now()}`,
              role: 'model',
              content: 'Desculpe, deu um nó na minha cabeça.',
              timestamp: new Date().toISOString(),
          };

          try {
              const parsed = JSON.parse(jsonText);
              modelMessage.content = parsed.responseText || 'Não consegui entender.';
              if (parsed.actions) modelMessage.actions = parsed.actions;
              if (parsed.structuredContent) modelMessage.structuredContent = parsed.structuredContent;
          } catch (e) {
              console.error("Erro JSON:", e);
              modelMessage.content = jsonText || 'Tente novamente.';
          }
  
          setMessages(prev => [...prev, modelMessage]);
  
      } catch (error) {
          console.error("Erro API:", error);
          const fallbackMessage: ChatMessage = {
            id: `model-error-${Date.now()}`,
            role: 'model',
            content: 'Eita! Tive um problema de conexão. Tenta de novo mais tarde?',
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, fallbackMessage]);
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
