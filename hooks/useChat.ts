import { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, Type } from '@google/genai';
import { ChatMessage, ChatAction, UserProfile, Agendamento } from '../types';

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
                                description: "Para 'NAVIGATE', a tela de destino. Valores: 'DASHBOARD', 'ABOUT', 'PROTOCOLOS_LIST', 'PROTOCOLO_DETAIL', 'PROTOCOLO_FORM', 'NOTICIAS_LIST', 'NOTICIA_DETAIL', 'SECRETARIAS_LIST', 'MAPA_SERVICOS', 'TURISMO_DASHBOARD', 'TURISMO_LIST', 'TURISMO_DETAIL', 'CONTATOS_LIST', 'SERVICOS_ONLINE_DASHBOARD', 'SERVICO_FORM', 'AGENDAMENTOS_LIST', 'NOTIFICACOES_LIST', 'SEARCH', 'ACESSIBILIDADE', 'PARTICIPACAO_FEED', 'PARTICIPACAO_DETAIL', 'PARTICIPACAO_FORM', 'CONSULTAS_PUBLICAS_LIST', 'CONSULTAS_PUBLICAS_DETAIL', 'PREDIOS_POR_CATEGORIA_LIST'.",
                            },
                            params: {
                                type: Type.OBJECT,
                                description: "Parâmetros opcionais para a navegação. Ex: {'categoria': 'Gastronomia'}",
                                nullable: true,
                                properties: {
                                    protocoloId: { type: Type.STRING, description: 'ID de um protocolo.', nullable: true },
                                    noticiaId: { type: Type.STRING, description: 'ID de uma notícia.', nullable: true },
                                    predioId: { type: Type.STRING, description: 'ID de um prédio público.', nullable: true },
                                    turismoId: { type: Type.STRING, description: 'ID de um item de turismo.', nullable: true },
                                    categoria: { type: Type.STRING, description: 'Categoria para listas de turismo ou locais. Ex: "Saúde", "Gastronomia".', nullable: true },
                                    titulo: { type: Type.STRING, description: 'Título da página para uma lista de locais. Ex: "Postos de Saúde".', nullable: true },
                                    servicoId: { type: Type.STRING, description: 'ID de um serviço online.', nullable: true },
                                    publicacaoId: { type: Type.STRING, description: 'ID de uma publicação de participação.', nullable: true },
                                    consultaId: { type: Type.STRING, description: 'ID de uma consulta pública.', nullable: true },
                                }
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

const baseSystemInstruction = `Você é Uirapuru, um assistente virtual proativo e personalizado para o aplicativo "Minha Baturité". Seu objetivo é antecipar as necessidades dos cidadãos com base nas informações disponíveis, além de responder perguntas de forma cordial e breve. Você tem acesso a uma base de dados interna com informações sobre prédios públicos (hospitais, escolas), pontos turísticos, restaurantes e hotéis em Baturité, incluindo nomes, endereços, telefones e coordenadas geográficas.

**REGRAS DE PERSONALIZAÇÃO E PROATIVIDADE:**
1.  **SEMPRE se dirija ao cidadão pelo nome dele**, fornecido no CONTEXTO DO CIDADÃO.
2.  **REVISE A AGENDA do cidadão.** Se houver agendamentos futuros (status 'Agendado') nos próximos 7 dias, **mencione o mais próximo em sua saudação inicial**. Exemplo: "Olá, [Nome]! Vi que você tem uma [Nome do Serviço] agendada para [Data]. Como posso te ajudar hoje?". Se não houver agendamentos, apenas um "Olá, [Nome]! Como posso ajudar?" é suficiente.
3.  **SEJA CONTEXTUAL:** Se a conversa for sobre saúde e o cidadão tiver um agendamento médico, mencione-o se for relevante.

**REGRAS GERAIS:**
1.  **SEMPRE responda em JSON** usando o schema fornecido.
2.  **Respostas Curtas:** Forneça um resumo direto em 1-2 frases no campo 'responseText'.
3.  **Aja, não apenas informe:** Use os campos 'structuredContent' e 'actions' para fornecer detalhes e ações claras (CTAs).
4.  **Enriquecimento de Conteúdo com Locais:** SEMPRE que sua resposta mencionar um local específico (prédio público, ponto turístico, restaurante) que exista em sua base de dados, você DEVE enriquecer a resposta:
    *   **Telefone:** Se o telefone do local estiver disponível, inclua-o no campo \`structuredContent.phone\`.
    *   **Endereço:** Inclua o endereço completo no campo \`structuredContent.address\`.
    *   **Mapa:** Adicione uma ação (action) com \`type: 'NAVIGATE'\`, \`view: 'MAPA_SERVICOS'\` e os parâmetros necessários (\`predioId\` ou \`turismoId\`). O texto do botão deve ser "Ver no Mapa do App". Adicionalmente, forneça uma ação \`type: 'OPEN_URL'\` com o texto "Ver no Google Maps" e a URL no formato \`https://www.google.com/maps/search/?api=1&query=LATITUDE,LONGITUDE\`.
5.  **Regra de Ação OBRIGATÓRIA:** Se sua resposta em \`responseText\` mencionar ou implicar uma ação que o usuário pode tomar dentro do aplicativo (como "ver a lista", "abrir o formulário", "agendar", "acompanhar", etc.), você **É ESTRITAMENTE OBRIGADO A** fornecer um objeto de ação correspondente no array \`actions\`. A interface do aplicativo depende disso. A ausência de um objeto 'action' quando uma ação é mencionada é um erro grave. Além disso, o texto da resposta **NUNCA DEVE** mencionar elementos de interface que não existem, como "clique no botão abaixo" ou "veja as opções a seguir". A interface é gerada a partir do seu JSON, não presuma sua existência. **NÃO ALUCINE ELEMENTOS DE UI.**
    *   **ERRADO:** \`"responseText": "Clique no botão abaixo para ver as secretarias."\` (sem o objeto 'action').
    *   **CORRETO:** \`"responseText": "Você pode consultar a lista de secretarias."\`, acompanhado de um objeto 'action' no JSON: \`{"type": "NAVIGATE", "buttonText": "Ver Secretarias", "payload": {"view": "SECRETARIAS_LIST"}}\`.
    *   **ERRADO:** \`"responseText": "Para abrir um chamado, clique na opção abaixo."\`
    *   **CORRETO:** \`"responseText": "Posso te direcionar para a abertura de chamados."\`, acompanhado de um objeto 'action': \`{"type": "NAVIGATE", "buttonText": "Abrir Chamado", "payload": {"view": "PROTOCOLO_FORM"}}\`.
6.  **Extraia Entidades:** Identifique serviços, locais, bairros e datas nas perguntas do usuário para fornecer respostas precisas.
7.  **Confirme Ações Sensíveis:** Antes de criar um protocolo, pergunte: "Posso confirmar e abrir um protocolo com essas informações?".
8.  **Privacidade (LGPD):** Não peça dados pessoais a menos que seja essencial para uma ação (ex: agendamento). Se pedir, avise que os dados serão usados apenas para aquele fim.
9.  **Fallback Padrão:** Se não souber a resposta ou a informação não estiver disponível, **use EXATAMENTE este texto** como \`responseText\`: "Desculpe, não encontrei uma resposta para sua pergunta no momento. Você pode acessar o site oficial da Prefeitura de Baturité www.baturite.ce.gov.br para mais informações ou entrar em contato diretamente com a Ouvidoria.". Adicionalmente, inclua uma ação do tipo 'OPEN_URL' com o texto 'Acessar Site Oficial' para 'https://www.baturite.ce.gov.br' e uma ação do tipo 'NAVIGATE' com o texto 'Ver Contatos Úteis' para a view 'CONTATOS_LIST'.

** MAPEAMENTO DE INTENÇÕES (Exemplos) **
*   **cartao_sus**: "Como faço para tirar o cartão SUS?", "Onde eu faço o cartão de saúde?"
*   **vacina**: "Onde tomo a vacina da gripe?", "Qual posto tem vacina covid?"
*   **coleta_lixo**: "Quando passa o caminhão do lixo no meu bairro?"
*   **buraco_rua**: "Tem um buraco na rua da minha casa", "Quero denunciar um buraco na rua"
*   **poste_apagado**: "Tem um poste apagado na rua", "Luz do poste não funciona"
*   **matricula_escolar**: "Como matriculo meu filho na escola?"
*   **iptu**: "Como pago o IPTU?", "Onde tiro segunda via do IPTU?"
*   **turismo**: "Quais são os pontos turísticos da cidade?", "Onde visitar em Baturité?"
*   **horario_prefeitura**: "Qual horário de funcionamento da prefeitura?"
*   **participacao_publica**: "Quero enviar sugestão para a prefeitura", "Como faço reclamação?"
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
**CONTEXTO DO CIDADÃO**
- **NOME:** ${userProfile.name}
- **PERFIL:** ${userProfile.role}
- **AGENDA (apenas agendamentos futuros):** ${JSON.stringify(upcomingAgendamentos)}
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
    // Use JSON.stringify on agendamentos to create a stable dependency for the effect hook
    }, [userProfile, JSON.stringify(agendamentos)]);

    useEffect(() => {
        if (chat) {
            const upcomingAgendamentos = agendamentos
                .filter(a => a.status === 'Agendado' && new Date(a.dataHora) > new Date())
                .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());

            let greetingText = `Olá, ${userProfile.name}! Como posso te ajudar hoje?`;

            if (upcomingAgendamentos.length > 0) {
                const nextAgendamento = upcomingAgendamentos[0];
                const data = new Date(nextAgendamento.dataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
                greetingText = `Olá, ${userProfile.name}! Vi que você tem um agendamento de "${nextAgendamento.servicoNome}" para ${data}. Como posso te ajudar hoje?`;
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
  
    const sendMessage = useCallback(async (message: string) => {
      if (!message.trim() || isLoading || !chat) return;
  
      const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: message, timestamp: new Date().toISOString() };
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
              timestamp: new Date().toISOString(),
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
          const fallbackMessage: ChatMessage = {
            id: `model-error-${Date.now()}`,
            role: 'model',
            content: 'Desculpe, não encontrei uma resposta para sua pergunta no momento. Você pode acessar o site oficial da Prefeitura de Baturité www.baturite.ce.gov.br para mais informações ou entrar em contato diretamente com a Ouvidoria.',
            timestamp: new Date().toISOString(),
            actions: [
                {
                    type: 'OPEN_URL',
                    buttonText: 'Acessar Site Oficial',
                    payload: { url: 'https://www.baturite.ce.gov.br' }
                },
                {
                    type: 'NAVIGATE',
                    buttonText: 'Ver Contatos Úteis',
                    payload: { view: 'CONTATOS_LIST' }
                }
            ]
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