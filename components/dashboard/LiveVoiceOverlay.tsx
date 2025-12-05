
import React, { useState, useEffect } from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface LiveVoiceOverlayProps {
    isConnected: boolean;
    isSpeaking: boolean; // AI is speaking
    isMuted: boolean;
    toggleMute: () => void;
    volume: number; // User mic volume (0-1)
    onHangup: () => void;
}

const SUGGESTIONS = [
    "Quais os pontos turísticos?",
    "Quero abrir uma reclamação.",
    "Onde fica o hospital?",
    "Me conte uma curiosidade sobre a cidade.",
    "Quais as notícias de hoje?"
];

const LiveVoiceOverlay: React.FC<LiveVoiceOverlayProps> = ({ 
    isConnected, 
    isSpeaking, 
    isMuted,
    toggleMute,
    volume, 
    onHangup 
}) => {
    const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
    const [durationSeconds, setDurationSeconds] = useState(0);

    // Rotate suggestions
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSuggestionIndex(prev => (prev + 1) % SUGGESTIONS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Call Duration Timer
    useEffect(() => {
        let timer: any;
        if (isConnected) {
            timer = setInterval(() => {
                setDurationSeconds(prev => prev + 1);
            }, 1000);
        } else {
            setDurationSeconds(0);
        }
        return () => clearInterval(timer);
    }, [isConnected]);

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        return `${mins}:${s < 10 ? '0' : ''}${s}`;
    };

    const getVisualState = () => {
        if (isSpeaking) return 'speaking';
        if (!isMuted && volume > 0.05) return 'listening';
        return 'idle';
    };

    const visualState = getVisualState();

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-between p-6 animate-fade-in backdrop-blur-md">
            {/* Header: Status Indicator & Timer */}
            <div className="w-full flex justify-between items-center bg-white/5 p-2 rounded-full backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 px-2">
                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isConnected ? 'bg-red-500/20' : 'bg-slate-700'}`}>
                        {isConnected ? (
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                        ) : (
                            <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white text-xs font-semibold tracking-wide uppercase">
                            {isConnected ? 'Ao Vivo' : 'Conectando'}
                        </span>
                        <span className="text-white/60 text-xs font-mono">
                            {formatTime(durationSeconds)}
                        </span>
                    </div>
                </div>
                <button onClick={onHangup} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                    <Icon name="keyboard_arrow_down" />
                </button>
            </div>

            {/* Main Visualizer */}
            <div className="flex flex-col items-center justify-center flex-1 w-full relative">
                
                {/* Status Text Overlay */}
                <div className="absolute top-10 left-0 right-0 text-center z-10 pointer-events-none">
                     <p className="text-white font-semibold text-2xl transition-all duration-300 drop-shadow-md">
                        {visualState === 'speaking' && "Uirapuru falando..."}
                        {visualState === 'listening' && "Ouvindo você..."}
                        {visualState === 'idle' && isMuted && "Microfone mudo"}
                        {visualState === 'idle' && !isMuted && isConnected && "Estou ouvindo..."}
                        {!isConnected && "Iniciando conexão..."}
                    </p>
                </div>

                <div className="relative flex items-center justify-center h-72 w-72">
                    {/* Core Circle */}
                    <div className={`
                        w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_50px_rgba(99,102,241,0.6)] z-10 flex items-center justify-center
                        transition-all duration-300 relative border-4 border-white/10
                        ${visualState === 'listening' ? 'scale-110 shadow-[0_0_80px_rgba(99,102,241,0.9)]' : 'scale-100'}
                        ${isMuted ? 'grayscale opacity-70' : ''}
                    `}>
                        {isMuted ? (
                             <Icon name="mic_off" className="text-white text-5xl drop-shadow-lg" />
                        ) : (
                             <Icon name="flutter_dash" className="text-white text-6xl drop-shadow-lg" />
                        )}
                        
                        {/* Connecting Spinner */}
                        {!isConnected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                                <Icon name="sync" className="text-white animate-spin text-3xl" />
                            </div>
                        )}
                    </div>

                    {/* Speaking Waves */}
                    {visualState === 'speaking' && (
                        <>
                            <div className="absolute inset-0 rounded-full border-[3px] border-indigo-400/40 animate-[ping_2s_infinite]"></div>
                            <div className="absolute inset-0 rounded-full border-[3px] border-purple-400/30 animate-[ping_2s_infinite_0.6s]"></div>
                            <div className="absolute inset-0 rounded-full border-[3px] border-sky-400/20 animate-[ping_2s_infinite_1.2s]"></div>
                        </>
                    )}

                    {/* Listening Volume Visualization */}
                    {visualState === 'listening' && (
                        <div 
                            className="absolute bg-white/10 rounded-full transition-all duration-75 border border-white/5"
                            style={{ 
                                width: `${160 + (volume * 400)}px`, 
                                height: `${160 + (volume * 400)}px` 
                            }}
                        ></div>
                    )}
                    
                    {/* Idle Pulse */}
                    {visualState === 'idle' && isConnected && !isMuted && (
                         <div className="absolute inset-[-20px] rounded-full border border-white/10 animate-pulse"></div>
                    )}
                </div>

                {/* Suggestion Box */}
                {visualState === 'idle' && isConnected && (
                    <div className="mt-8 animate-fade-in-up px-6 py-3 bg-white/10 rounded-xl max-w-sm text-center border border-white/5 backdrop-blur-sm">
                        <p className="text-white/60 text-xs mb-1 uppercase tracking-wider">Sugestão</p>
                        <p className="text-indigo-100 text-lg font-medium leading-tight">
                            "{SUGGESTIONS[currentSuggestionIndex]}"
                        </p>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="w-full max-w-md grid grid-cols-5 gap-4 items-center mb-6">
                
                {/* Mute Button (Economize Tokens) */}
                <div className="col-span-2">
                    <Button 
                        onClick={toggleMute}
                        className={`w-full !py-4 !rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base transition-all duration-200 border
                            ${isMuted 
                                ? '!bg-amber-500 hover:!bg-amber-600 !text-white !border-amber-400' 
                                : '!bg-white/10 hover:!bg-white/20 !text-white !border-white/20'
                            }`}
                    >
                        <Icon name={isMuted ? "mic_off" : "mic"} />
                        {isMuted ? "Mudo" : "Pausar"}
                    </Button>
                    {isMuted && (
                        <p className="text-amber-400 text-[10px] text-center mt-1">Economizando dados</p>
                    )}
                </div>

                {/* Hangup Button (Main) */}
                <div className="col-span-3">
                    <Button 
                        onClick={onHangup} 
                        className="w-full !bg-red-600 hover:!bg-red-700 !text-white !border-red-500 !py-4 !rounded-2xl shadow-lg flex items-center justify-center gap-2 text-lg font-bold group transition-all duration-200"
                    >
                        <Icon name="call_end" className="group-hover:scale-110 transition-transform" />
                        Encerrar
                    </Button>
                </div>
            </div>
            
            <style>{`
                @keyframes ping {
                    75%, 100% { transform: scale(1.8); opacity: 0; }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default LiveVoiceOverlay;
