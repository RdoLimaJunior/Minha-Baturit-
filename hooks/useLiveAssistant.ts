
import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from '@google/genai';
import { UserProfile, Agendamento } from '../types';
import { convertFloat32ToInt16, base64ToArrayBuffer, decodeAudioData, arrayBufferToBase64 } from '../utils/audioUtils';
import { viewToPath } from '../utils/navigation';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';

const toolsDef: FunctionDeclaration[] = [
    {
        name: 'navigate_to_view',
        description: 'Navega o usuário para uma tela específica do aplicativo.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                view: { 
                    type: Type.STRING, 
                    description: "A tela de destino. Valores: 'PROTOCOLOS_LIST', 'PROTOCOLO_FORM', 'NOTICIAS_LIST', 'MAPA_SERVICOS', 'TURISMO_DASHBOARD', 'CONTATOS_LIST', 'AGENDAMENTOS_LIST', 'SEARCH', 'PARTICIPACAO_FEED'" 
                },
                params: {
                    type: Type.OBJECT,
                    description: "Parâmetros opcionais (IDs, categorias).",
                    nullable: true,
                }
            },
            required: ['view']
        }
    },
    {
        name: 'open_website',
        description: 'Abre um site externo no navegador.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                url: { type: Type.STRING, description: 'A URL completa para abrir.' }
            },
            required: ['url']
        }
    }
];

export const useLiveAssistant = (userProfile: UserProfile, agendamentos: Agendamento[]) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0); 
    const [error, setError] = useState<string | null>(null);
    
    const navigate = useNavigate();
    const { addToast } = useToast();

    // Audio Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const audioQueueRef = useRef<AudioBuffer[]>([]);
    const isPlayingRef = useRef(false);
    
    // State Refs for Callbacks (to avoid stale closures)
    const isMutedRef = useRef(false);
    const activeSessionRef = useRef(false); // Track if we conceptually want the session open
    
    // API Refs
    const sessionRef = useRef<any>(null); 

    useEffect(() => {
        isMutedRef.current = isMuted;
    }, [isMuted]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);

    const disconnect = useCallback(() => {
        activeSessionRef.current = false;
        
        if (sessionRef.current) {
            sessionRef.current = null;
        }

        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        setIsConnected(false);
        setIsSpeaking(false);
        setVolume(0);
        setIsMuted(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (activeSessionRef.current) {
                disconnect();
            }
        };
    }, [disconnect]);

    const playNextBuffer = useCallback(() => {
        if (audioQueueRef.current.length === 0 || !audioContextRef.current) {
            isPlayingRef.current = false;
            setIsSpeaking(false);
            return;
        }

        isPlayingRef.current = true;
        setIsSpeaking(true);
        const buffer = audioQueueRef.current.shift()!;
        
        try {
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);

            const currentTime = audioContextRef.current.currentTime;
            const startTime = Math.max(currentTime, nextStartTimeRef.current);
            
            source.start(startTime);
            nextStartTimeRef.current = startTime + buffer.duration;

            source.onended = () => {
                playNextBuffer();
            };
        } catch (e) {
            console.error("Error playing audio buffer", e);
            isPlayingRef.current = false;
        }
    }, []);

    const connect = useCallback(async () => {
        if (activeSessionRef.current) return; // Prevent double connection
        activeSessionRef.current = true;

        try {
            setError(null);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = audioContextRef.current.currentTime;

            const inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const upcomingAgendamentos = agendamentos
                .filter(a => a.status === 'Agendado' && new Date(a.dataHora) > new Date())
                .map(({ servicoNome, dataHora }) => ({ servicoNome, dataHora }));

            // Instrução de sistema mais rica e com personalidade
            const systemInstruction = `
            Você é o **Uirapuru**, o assistente de voz oficial de **Baturité, Ceará**.
            Fale como um guia local amigo, orgulhoso da cidade.
            
            **PERSONALIDADE:**
            - Use um tom caloroso, acolhedor e levemente coloquial.
            - Pode usar interjeições suaves como "Opa", "Veja só", "Tranquilo".
            - Seja conciso. Respostas de voz longas são cansativas.
            
            **CONTEXTO DO USUÁRIO:**
            - Nome: ${userProfile.name}
            ${upcomingAgendamentos.length > 0 ? `- Lembrete Importante: O usuário tem ${upcomingAgendamentos[0].servicoNome} dia ${new Date(upcomingAgendamentos[0].dataHora).toLocaleDateString()}. Mencione isso se for relevante.` : ''}

            **CAPACIDADES:**
            - Você pode navegar pelo app usando a ferramenta 'navigate_to_view'.
            - Se o usuário pedir para "abrir um chamado" ou "reclamar", navegue para PROTOCOLO_FORM.
            - Se pedir notícias, navegue para NOTICIAS_LIST.
            - Se pedir turismo, navegue para TURISMO_DASHBOARD.
            
            Comece a conversa de forma amigável, saudando o usuário pelo nome.
            `;

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction: systemInstruction,
                    tools: [{ functionDeclarations: toolsDef }],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                    },
                },
                callbacks: {
                    onopen: () => {
                        if (!activeSessionRef.current) return;
                        console.log('Live Session Connected');
                        setIsConnected(true);
                        
                        sourceRef.current = inputContext.createMediaStreamSource(stream);
                        processorRef.current = inputContext.createScriptProcessor(4096, 1, 1);
                        
                        processorRef.current.onaudioprocess = (e) => {
                            // CRITICAL TOKEN SAVING: If muted, do not process or send audio.
                            if (isMutedRef.current) {
                                setVolume(0);
                                return;
                            }

                            if (!activeSessionRef.current) return;

                            const inputData = e.inputBuffer.getChannelData(0);
                            
                            let sum = 0;
                            for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
                            setVolume(Math.sqrt(sum / inputData.length));

                            const pcmData = convertFloat32ToInt16(inputData);
                            const base64Data = arrayBufferToBase64(pcmData.buffer);

                            sessionPromise.then(session => {
                                if (activeSessionRef.current) {
                                    session.sendRealtimeInput({
                                        media: {
                                            mimeType: 'audio/pcm;rate=16000',
                                            data: base64Data
                                        }
                                    });
                                }
                            });
                        };

                        sourceRef.current.connect(processorRef.current);
                        processorRef.current.connect(inputContext.destination);
                    },
                    onmessage: async (msg: LiveServerMessage) => {
                        if (!activeSessionRef.current) return;

                        const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (audioData && audioContextRef.current) {
                            const buffer = base64ToArrayBuffer(audioData);
                            const audioBuffer = await decodeAudioData(audioContextRef.current, buffer);
                            audioQueueRef.current.push(audioBuffer);
                            if (!isPlayingRef.current) {
                                playNextBuffer();
                            }
                        }

                        if (msg.serverContent?.interrupted) {
                            audioQueueRef.current = [];
                            isPlayingRef.current = false;
                            setIsSpeaking(false);
                        }

                        if (msg.toolCall) {
                            for (const call of msg.toolCall.functionCalls) {
                                console.log('Tool Call:', call.name, call.args);
                                let result = { status: 'success' };
                                
                                try {
                                    if (call.name === 'navigate_to_view') {
                                        const view = (call.args as any).view;
                                        const params = (call.args as any).params;
                                        const path = viewToPath(view, params);
                                        navigate(path);
                                        addToast(`Indo para ${view}...`, 'info');
                                    } else if (call.name === 'open_website') {
                                        const url = (call.args as any).url;
                                        window.open(url, '_blank');
                                    }
                                } catch (e) {
                                    result = { status: 'error', message: String(e) } as any;
                                }

                                sessionPromise.then(session => {
                                    if (activeSessionRef.current) {
                                        session.sendToolResponse({
                                            functionResponses: [
                                                {
                                                    id: call.id,
                                                    name: call.name,
                                                    response: { result }
                                                }
                                            ]
                                        });
                                    }
                                });
                            }
                        }
                    },
                    onclose: () => {
                        console.log('Live Session Closed');
                        disconnect();
                    },
                    onerror: (err) => {
                        console.error('Live Session Error', err);
                        // Only set error if we meant to be active
                        if (activeSessionRef.current) {
                            setError('Erro na conexão de voz.');
                            disconnect();
                        }
                    }
                }
            });

            sessionRef.current = await sessionPromise;

        } catch (e) {
            console.error(e);
            setError('Não foi possível iniciar o modo de voz.');
            setIsConnected(false);
            activeSessionRef.current = false;
        }
    }, [userProfile, agendamentos, disconnect, navigate, addToast]);

    return {
        connect,
        disconnect,
        isConnected,
        isSpeaking,
        isMuted,
        toggleMute,
        volume,
        error
    };
};
