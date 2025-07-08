'use client'
import { useEffect, useState } from 'react';
import UrlProcessor from "./urlProcessor";
import ChatArea from "./chatArea";
import AddSourceForm from './addSourceForm';
import useGetWebContext from "../../hooks/useGetWebContext";
import { Conversation } from '@/app/types/types';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { Message } from "ai/react"

interface Props {
    initialConversation: Conversation | null;
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
    syncHistoryMessages: (messages: Message[]) => void;
}

export default function LlmProcessing({ initialConversation, toggleSidebar, isSidebarOpen, syncHistoryMessages }: Props) {
    const { data: session } = useSession();
    const { url, getWebSummary, error, isProcessing, summary, context, setWebContext, clearContext, updateConversationContext } = useGetWebContext();
    const [conversationId, setConversationId] = useState<string | null>(null);

    useEffect(() => {
        if (initialConversation) {
            setWebContext(initialConversation.url, initialConversation.summary, initialConversation.context);
            setConversationId(initialConversation.id);
        } else {
            clearContext();
            setConversationId(null);
        }
    }, [initialConversation]);

    // New useEffect to handle initial conversation saving
    useEffect(() => {
        const saveInitialConversation = async () => {
            if (context && !conversationId && session?.user?.id) {
                const toastId = toast.loading('Saving new conversation...');
                try {
                    const newConversationData: Omit<Conversation, 'id' | 'created_at' | 'messages'> = {
                        user_id: session.user.id,
                        url: url,
                        summary: summary,
                        context: context,
                        title: summary.substring(0, 50) || 'New Web Chat', // Use summary as title
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
                    toast.success('Conversation saved!', { id: toastId });
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                    toast.error(errorMessage, { id: toastId });
                    console.error('Error saving initial conversation:', err);
                }
            }
        };
        saveInitialConversation();
    }, [context, conversationId, session?.user?.id]);

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
            updateConversationContext(json.context)
            toast.success('Source added successfully! The context has been updated.', { id: toastId });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            toast.error(errorMessage, { id: toastId });
        }
    };

    return (
        <div className="relative h-full flex flex-col">
            {!isSidebarOpen && (
                <Button
                    onClick={toggleSidebar}
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 left-4 z-50 text-white bg-gray-800 hover:bg-gray-700"
                >
                    <PanelLeftOpen className="h-6 w-6" />
                </Button>
            )}
            <UrlProcessor
                url={url}
                getWebSummary={getWebSummary}
                error={error}
                isProcessing={isProcessing}
                summary={summary}
            />


            {/* Show the chat area and add source form only if there is context */}
            {context && conversationId && (
                <>
                    <ChatArea
                        context={context}
                        initialMessages={initialConversation?.messages}
                        conversationId={conversationId}
                        syncHistoryMessages={syncHistoryMessages}
                    />
                    <AddSourceForm onAddSource={handleAddSource} />
                </>
            )}
        </div>
    )
}