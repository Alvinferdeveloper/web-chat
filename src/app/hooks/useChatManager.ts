
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Conversation } from '@/app/types/types';

export function useChatManager(initialConversation: Conversation | null, context: string | null, urls: string[], summary: string, setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>) {
    const { data: session } = useSession();
    const [conversationId, setConversationId] = useState<string | null>(initialConversation?.id || null);

    useEffect(() => {
        const saveInitialConversation = async () => {
            if (context && !conversationId && session?.user?.id) {
                const toastId = toast.loading('Saving new conversation...');
                try {
                    const newConversationData: Omit<Conversation, 'id' | 'created_at' | 'messages'> = {
                        user_id: session.user.id,
                        url: urls,
                        summary: summary,
                        context: context,
                        title: summary.substring(0, 50) || 'New Web Chat',
                    };

                    const response = await fetch('/api/conversations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newConversationData),
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.error || 'Failed to save initial conversation.');
                    }

                    const savedConversation: Conversation = await response.json();
                    setConversationId(savedConversation.id);
                    setConversations(prev => [savedConversation, ...prev]);
                    toast.success('Conversation saved!', { id: toastId });
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                    toast.error(errorMessage, { id: toastId });
                    console.error('Error saving initial conversation:', err);
                }
            }
        };
        saveInitialConversation();
    }, [context, conversationId, session?.user?.id, urls, summary, setConversations]);

    const handleAddSource = async (sourceUrl: string) => {
        if (!conversationId) {
            toast.error("No active conversation to add a source to.");
            return;
        }
        const toastId = toast.loading('Adding new source...');
        try {
            const response = await fetch('/api/conversations/add-source', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId, url: sourceUrl }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add source.');
            }
            const json = await response.json();
            toast.success('Source added successfully! The context has been updated.', { id: toastId });
            return json.context;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            toast.error(errorMessage, { id: toastId });
        }
    };

    return { conversationId, handleAddSource };
}
