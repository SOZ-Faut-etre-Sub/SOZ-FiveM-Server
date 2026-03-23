// =============================================================================
// src/nui/components/Phone/apps/ia-legal/pages/IaLegalChat.tsx
// Interface de chat de l'app IA Legal
// =============================================================================

import React, { useEffect, useRef, useState } from 'react';

import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { ChatMessage, useIaLegal } from '../hooks/useIaLegal';

export const IaLegalChat: React.FC = () => {
    const { messages, loading, askQuestion, clearMessages } = useIaLegal();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll vers le bas à chaque nouveau message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSubmit = () => {
        if (!input.trim() || loading) return;
        askQuestion(input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <>
            <AppTitle title="IA Legal" />
            <AppContent scrollable={false}>
                <div className="flex flex-col h-full">
                    {/* Zone de messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto px-1 py-2 space-y-3 scrollbar scrollbar-w-[3px] scrollbar-thumb-white/40 scrollbar-thumb-rounded-full"
                    >
                        {/* Message de bienvenue */}
                        {messages.length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-3">
                                <div className="text-3xl">&#9878;</div>
                                <p className="text-sm font-semibold text-gray-300">
                                    Assistant Juridique
                                </p>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Posez vos questions sur les lois, amendes, peines et
                                    règlements en vigueur à San Andreas.
                                </p>
                            </div>
                        )}

                        {/* Messages */}
                        {messages.map((msg, index) => (
                            <MessageBubble key={index} message={msg} />
                        ))}

                        {/* Indicateur de chargement */}
                        {loading && (
                            <div className="flex items-start gap-2 px-1">
                                <div className="bg-white/10 rounded-2xl rounded-tl-sm px-3 py-2">
                                    <div className="flex items-center gap-1">
                                        <span
                                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: '0ms' }}
                                        />
                                        <span
                                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: '150ms' }}
                                        />
                                        <span
                                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: '300ms' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Barre de saisie */}
                    <div className="flex items-center gap-2 pt-2 pb-1 px-1">
                        {/* Bouton clear */}
                        {messages.length > 0 && (
                            <button
                                className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 text-gray-400 text-xs flex items-center justify-center"
                                onClick={clearMessages}
                                title="Effacer la conversation"
                            >
                                &#10005;
                            </button>
                        )}

                        {/* Input */}
                        <div className="flex-1 flex items-center bg-white/10 rounded-2xl px-3 py-2">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Posez votre question..."
                                disabled={loading}
                                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                                maxLength={500}
                                data-phone-input="true"
                            />
                        </div>

                        {/* Bouton envoyer */}
                        <button
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                input.trim() && !loading
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/10 text-gray-600'
                            }`}
                            onClick={handleSubmit}
                            disabled={!input.trim() || loading}
                        >
                            &#9650;
                        </button>
                    </div>
                </div>
            </AppContent>
        </>
    );
};

// ---------------------------------------------------------------------------
// Composant bulle de message
// ---------------------------------------------------------------------------
const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    const isError = message.role === 'error';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-1`}>
            <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    isUser
                        ? 'bg-blue-500 text-white rounded-tr-sm'
                        : isError
                        ? 'bg-red-500/20 text-red-300 rounded-tl-sm border border-red-500/30'
                        : 'bg-white/10 text-gray-200 rounded-tl-sm'
                }`}
            >
                {message.content}
            </div>
        </div>
    );
};
