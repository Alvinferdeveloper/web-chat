
import { useState, useEffect, useCallback } from 'react';
import { Conversation } from '@/app/types/types';
import { Message } from 'ai/react';

export function useConversations() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/conversations', {
                    cache: "force-cache"
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

    return { conversations, isLoading, error, syncHistoryMessages, setConversations };
}
