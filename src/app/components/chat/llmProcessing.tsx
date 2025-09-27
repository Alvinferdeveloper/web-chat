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
import UrlListModal from './urlListModal';

interface Props {
    initialConversation: Conversation | null;
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
    syncHistoryMessages: (messages: Message[]) => void;
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

export default function LlmProcessing({ initialConversation, toggleSidebar, isSidebarOpen, syncHistoryMessages, setConversations }: Props) {
    const { urls, getWebSummary, addUrl, removeUrl, error, isProcessing, summary, context, setWebContext, clearContext, updateConversationContext } = useGetWebContext();
    const { conversationId, handleAddSource } = useChatManager(initialConversation, context, urls, summary, setConversations);
    
    useEffect(() => {
        if (initialConversation) {
            const initialUrls = initialConversation.url ? initialConversation.url.split(',') : [];
            setWebContext(initialUrls, initialConversation.summary, initialConversation.context);
        } else {
            clearContext();
        }
    }, [initialConversation]);

    const onAddSource = async (sourceUrl: string) => {
        const newContext = await handleAddSource(sourceUrl);
        if (newContext) {
            updateConversationContext(newContext);
            addUrl(sourceUrl);
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
            <div className="flex justify-end p-2">
                {urls.length > 0 && <UrlListModal urls={urls} onRemoveUrl={removeUrl} />}
            </div>
            <UrlProcessor
                url={urls.length > 0 ? urls[0] : ''}
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
