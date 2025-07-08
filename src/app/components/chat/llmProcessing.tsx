'use client'
import { useEffect } from 'react';
import UrlProcessor from "./urlProcessor";
import ChatArea from "./chatArea";
import AddSourceForm from './addSourceForm';
import useGetWebContext from "../../hooks/useGetWebContext";
import { Conversation } from '@/app/types/types';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen } from 'lucide-react';
import { useChatManager } from '@/app/hooks/useChatManager';
import { Message } from "ai/react"

interface Props {
    initialConversation: Conversation | null;
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
    syncHistoryMessages: (messages: Message[]) => void;
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

export default function LlmProcessing({ initialConversation, toggleSidebar, isSidebarOpen, syncHistoryMessages, setConversations }: Props) {
    const { url, getWebSummary, error, isProcessing, summary, context, setWebContext, clearContext, updateConversationContext } = useGetWebContext();
    const { conversationId, handleAddSource } = useChatManager(initialConversation, context, url, summary, setConversations);

    useEffect(() => {
        if (initialConversation) {
            setWebContext(initialConversation.url, initialConversation.summary, initialConversation.context);
        } else {
            clearContext();
        }
    }, [initialConversation]);

    const onAddSource = async (sourceUrl: string) => {
        const newContext = await handleAddSource(sourceUrl);
        if (newContext) {
            updateConversationContext(newContext);
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

            {context && conversationId && (
                <>
                    <ChatArea
                        context={context}
                        initialMessages={initialConversation?.messages}
                        conversationId={conversationId}
                        syncHistoryMessages={syncHistoryMessages}
                    />
                    <AddSourceForm onAddSource={onAddSource} />
                </>
            )}
        </div>
    )
}
