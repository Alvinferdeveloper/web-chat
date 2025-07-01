import { useState } from 'react';
import { Message } from 'ai/react';

interface ConversationData {
    url: string;
    summary: string;
    context: string;
    messages: Message[];
}

/**
 * Custom hook to handle the logic of saving a conversation.
 * @returns An object with the saving state and a function to trigger the save.
 */
export function useConversationSaver() {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveConversation = async (conversationData: ConversationData): Promise<any | null> => {
        const { url, summary, context, messages } = conversationData;

        if (messages.length === 0 || isSaving || isSaved) return;

        setIsSaving(true);
        setError(null);
        try {
            const filteredMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant');

            if (filteredMessages.length === 0) {
                return;
            }

            const payload = {
                url,
                summary,
                context,
                title: filteredMessages[0]?.content.substring(0, 50) || 'Nueva Conversación',
                messages: filteredMessages.map((m: Message) => ({ role: m.role, content: m.content })),
            };

            const response = await fetch('/api/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'No se pudo guardar la conversación');
            }

            const newConversation = await response.json();

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
            return newConversation;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido';
            console.error(errorMessage);
            setError(errorMessage);
            return null;
        } finally {
            setIsSaving(false);
        }
    };

    return { isSaving, isSaved, error, saveConversation };
}
