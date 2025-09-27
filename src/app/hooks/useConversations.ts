
import { useState, useEffect, useCallback } from 'react';
import { Conversation } from '@/app/types/types';
import { Message } from 'ai/react';
import toast from 'react-hot-toast';

export function useConversations() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/conversations', {
                    cache: "no-store"
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }
                const data = await response.json();
                setConversations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, []);

    const syncHistoryMessages = useCallback((conversationId: string, messages: Message[]) => {
        setConversations(prevData =>
            prevData.map(conversation =>
                conversation.id === conversationId
                    ? {
                        ...conversation,
                        messages: [...(conversation.messages || []), ...messages]
                    }
                    : conversation
            )
        );
    }, []);

    const deleteConversation = useCallback(async (conversationId: string) => {
        const toastId = toast.loading('Deleting conversation...');
        try {
            const response = await fetch(`/api/conversations/${conversationId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete conversation.');
            }

            setConversations(prev => prev.filter(conv => conv.id !== conversationId));
            toast.success('Conversation deleted!', { id: toastId });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            toast.error(errorMessage, { id: toastId });
            console.error('Error deleting conversation:', err);
        }
    }, []);

    return { conversations, isLoading, error, syncHistoryMessages, deleteConversation, setConversations };
}
