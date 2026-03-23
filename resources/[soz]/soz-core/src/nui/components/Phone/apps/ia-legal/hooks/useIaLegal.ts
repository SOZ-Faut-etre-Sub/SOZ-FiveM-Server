// =============================================================================
// src/nui/components/Phone/apps/ia-legal/hooks/useIaLegal.ts
// Hook custom pour l'app IA Legal
// =============================================================================

import { useCallback, useState } from 'react';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { IaLegalRequest, IaLegalResponse } from '../../../../../../shared/ia-legal/ia-legal.types';
import { fetchNui } from '../../../../../fetch';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'error';
    content: string;
}

export function useIaLegal() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const askQuestion = useCallback(async (question: string) => {
        if (!question.trim() || loading) {
            return;
        }

        // Ajouter le message utilisateur
        const userMessage: ChatMessage = { role: 'user', content: question.trim() };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await fetchNui<IaLegalRequest, IaLegalResponse>(
                NuiEvent.PhoneAppIaLegalAskQuestion,
                { question: question.trim() }
            );

            if (response?.success) {
                setMessages(prev => [
                    ...prev,
                    { role: 'assistant', content: response.answer },
                ]);
            } else {
                setMessages(prev => [
                    ...prev,
                    {
                        role: 'error',
                        content: response?.error ?? 'Service indisponible.',
                    },
                ]);
            }
        } catch (err) {
            console.error('[IA Legal] Erreur :', err);
            setMessages(prev => [
                ...prev,
                { role: 'error', content: 'Erreur de communication.' },
            ]);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return { messages, loading, askQuestion, clearMessages };
}
