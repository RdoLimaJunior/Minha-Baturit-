import { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, Type } from '@google/genai';
import { ChatMessage, ChatAction, UserProfile } from '../types';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        responseText: {
            type: Type.STRING,
            description: 'A resposta em texto para o usuário, curta e direta.',
        },
        structuredContent: {
            type: Type.OBJECT,
            nullable: true,
            description: 'Dados estruturados para exibição, como endereço, telefone, horários ou documentos necessários.',
            properties: {
                address: { type: Type.STRING, description: 'Endereço completo de um local relevante.' },
                phone: { type: Type.STRING, description: 'Telefone de contato.' },
                openingHours: { type: Type.STRING, description: 'Horário de funcionamento.' },
                documents: {
                    type: Type.ARRAY,
                    description: 'Lista de documentos necessários para um serviço.',
                    items: { type: Type.STRING },
                },
            },
        },
        actions: {
            type: Type.ARRAY,
            nullable: true,
            description: 'Uma lista de ações (botões) que o usuário pode tomar.',
            items: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        description: "O tipo da ação. Valores possíveis: 'NAVIGATE' (para navegar no app), 'OPEN_URL' (para abrir um link externo, como um mapa), 'CALL' (para iniciar uma ligação).",
                    },
                    buttonText: {
                        type: Type.STRING,
                        description: 'O texto que aparecerá no botão de ação.',
                    },
                    payload: {
                        type: Type.OBJECT,
                        description: 'Os dados necessários para executar a ação.',
                        properties: {
                            view: {
                                type: Type.STRING,
                                description: "Para 'NAVIGATE', a tela de destino. Valores: 'PROTOCOLO_FORM', 'PROTOCOLOS_LIST', 'NOTICIAS_LIST', 'MAPA_SERVICOS', 'SECRETARIAS_LIST', 'TURISMO_DASHBOARD', 'CONTATOS_LIST', 'SERVICOS_ONLINE_DASHBOARD', 'AGENDAMENTOS_LIST', 'TURISMO_LIST'.",
                            },
                            params: {
                                type: Type.OBJECT,
                                description: "Parâmetros opcionais para a navegação. Ex: {'turismoCategoria': 'Gastronomia'}",
                                nullable: true,
                            },
                            url: {
                                type: Type.STRING,
                                description: "Para 'OPEN_URL', o link a ser aberto. Para mapas, use 'https://www.google.com/maps/search/?api=1&query=LAT,LNG'.",
                            },
                            phoneNumber: {
                                type: Type.STRING,
                                description: "Para 'CALL', o número de telefone a ser discado.",
                            },
                        },
                    },
                },
            },
        },
    },
};

const systemInstruction = `Você é Uirapuru, um assistente virtual pragmático, cordial e breve para o aplicativo "Minha Baturité". Seu objetivo é ajudar os cidadãos com informações e ações diretas.

**REGRAS GERAIS:**
1.  **SEMPRE responda em JSON** usando o schema fornecido.
2.  **Respostas Curtas:** Forneça um resumo direto em 1-2 frases no campo 'responseText'.
3.  **Aja, não apenas informe:** Use os campos 'structuredContent' e 'actions' para fornecer detalhes e ações claras (CTAs).
4.  **Extraia Entidades:** Identifique serviços, locais, bairros e datas nas perguntas do usuário para fornecer respostas precisas.
5.  **Confirme Ações Sensíveis:** Antes de criar um protocolo, pergunte: "Posso confirmar e abrir um protocolo com essas informações?".
6.  **Privacidade (LGPD):** Não peça dados pessoais a menos que seja essencial para uma ação (ex: agendamento). Se pedir, avise que os dados serão usados apenas para aquele fim.
7.  **Fallback:** Se não souber a resposta, seja honesto. Ofereça abrir um chamado para a secretaria responsável ou buscar nos contatos úteis. Ex: "Não encontrei essa informação. Deseja que eu abra um protocolo para a secretaria responsável?".

**ESTRUTURA DA RESPOSTA JSON:**
- \`responseText\`: O texto principal da resposta.
- \`structuredContent\`: (Opcional) Detalhes organizados.
  - \`address\`: Endereço do local.
  - \`phone\`: Telefone de contato.
  - \`openingHours\`: Horário de funcionamento.
  - \`documents\`: Array de documentos necessários.
- \`actions\`: (Opcional) Array de botões de ação.
  - \`type\`: 'NAVIGATE', 'OPEN_URL', 'CALL'.
  - \`buttonText\`: Texto do botão (ex: "Ver no Mapa", "Ligar", "Agendar").
  - \`payload\`: Dados para a ação.
    - \`url\`: Para 'OPEN_URL' (use 'https://www.google.com/maps/search/?api=1&query=LAT,LNG' para mapas).
    - \`phoneNumber\`: Para 'CALL'.
    - \`view\`: Para 'NAVIGATE' (telas do app).

**INTENÇÕES COMUNS & EXEMPLOS DE RESPOSTAS:**

*   **SAÚDE (Cartão SUS, Vacina, Consulta):**
    *   Usuário: "Como tiro meu Cartão SUS?"
    *   Resposta:
        \`\`\`json
        {
          "responseText": "Você pode emitir o Cartão SUS no Posto de Saúde Central.",
          "structuredContent": {
            "address": "Praça da Matriz, S/N, Centro",
            "openingHours": "Seg–Sex 07:00–17:00",
            "documents": ["RG", "CPF", "Comprovante de residência"]
          },
          "actions": [
            {"type": "OPEN_URL", "buttonText": "Ver no Mapa", "payload": {"url": "https://www.google.com/maps/search/?api=1&query=-4.3315,-38.8825"}},
            {"type": "NAVIGATE", "buttonText": "Agendar Atendimento", "payload": {"view": "SERVICOS_ONLINE_DASHBOARD"}}
          ]
        }
        \`\`\`

*   **LIMPEZA URBANA (Coleta de Lixo):**
    *   Usuário: "Quando passa o lixo no Centro?"
    *   Resposta:
        \`\`\`json
        {
          "responseText": "No bairro Centro, a coleta de lixo domiciliar ocorre às terças, quintas e sábados, a partir das 7h.",
          "actions": [
            {"type": "NAVIGATE", "buttonText": "Registrar Falha na Coleta", "payload": {"view": "PROTOCOLO_FORM"}}
          ]
        }
        \`\`\`

*   **INFRAESTRUTURA (Buraco na via, Poste sem luz):**
    *   Usuário: "tem um buraco na minha rua"
    *   Resposta:
        \`\`\`json
        {
          "responseText": "Entendido. Para reportar um buraco, o ideal é abrir um protocolo de 'Reclamação'. Posso te direcionar para o formulário.",
          "actions": [
            {"type": "NAVIGATE", "buttonText": "Abrir Protocolo", "payload": {"view": "PROTOCOLO_FORM"}}
          ]
        }
        \`\`\`

*   **DOCUMENTOS E TRIBUTOS (IPTU):**
    *   Usuário: "onde pago iptu"
    *   Resposta:
        \`\`\`json
        {
          "responseText": "Você pode emitir a 2ª via e pagar seu IPTU na seção de 'Serviços Online'.",
          "actions": [
            {"type": "NAVIGATE", "buttonText": "Serviços Online", "payload": {"view": "SERVICOS_ONLINE_DASHBOARD"}}
          ]
        }
        \`\`\`

*   **TURISMO E CULTURA:**
    *   Usuário: "o que fazer em baturité"
    *   Resposta:
        \`\`\`json
        {
          "responseText": "Baturité tem vários encantos! Recomendo começar explorando nossos pontos turísticos e a gastronomia local.",
          "actions": [
            {"type": "NAVIGATE", "buttonText": "Ver Pontos Turísticos", "payload": {"view": "TURISMO_DASHBOARD"}}
          ]
        }
        \`\`\`

*   **CONTATOS ÚTEIS:**
    *   Usuário: "qual o telefone do hospital?"
    *   Resposta:
        \`\`\`json
        {
          "responseText": "O telefone do Hospital e Maternidade é (85) 3347-0354.",
          "structuredContent": {
            "phone": "(85) 3347-0354"
          },
          "actions": [
            {"type": "CALL", "buttonText": "Ligar Agora", "payload": {"phoneNumber": "8533470354"}}
          ]
        }
        \`\`\`
`;


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
          
          let jsonText = response.text.trim();
          
          if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
          }
          
          const modelMessage: ChatMessage = {
              id: `model-${Date.now()}`,
              role: 'model',
              content: 'Desculpe, não consegui processar a resposta.',
          };

          try {
              const parsed = JSON.parse(jsonText);
              modelMessage.content = parsed.responseText || 'Não consegui entender a resposta.';
              if (parsed.actions) {
                  modelMessage.actions = parsed.actions;
              }
              if (parsed.structuredContent) {
                  modelMessage.structuredContent = parsed.structuredContent;
              }
          } catch (e) {
              console.error("Falha ao analisar a resposta JSON do Gemini:", e);
              modelMessage.content = jsonText || 'Não recebi uma resposta válida. Tente novamente.';
          }
  
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