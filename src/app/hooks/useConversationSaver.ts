import { Message } from 'ai/react';
import { Conversation } from '@/app/types/types';

interface ConversationData {
    conversationId: string;
    newMessages: Omit<Message, 'id'>[];
}

/**
 * Custom hook to handle updating a conversation.
 * @returns An object with a function to trigger the update.
 */
export function useConversationSaver() {
    const updateConversation = async (conversationData: ConversationData): Promise<Conversation | null> => {
        const { conversationId, newMessages } = conversationData;
        try {
            const filteredMessages = newMessages.filter(m => m.role === 'user' || m.role === 'assistant');
            if (filteredMessages.length === 0) {
                return null;
            }
            const payload = {
                conversationId,
                newMessages: filteredMessages.map((m: Omit<Message, 'id'>) => ({ role: m.role, content: m.content })),
            };
            const response = await fetch('/api/conversations', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save conversation');
            }

            const savedConversation = await response.json();
            return savedConversation;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            console.error(errorMessage);
            return null;
        }
    };

    return { updateConversation };
}
